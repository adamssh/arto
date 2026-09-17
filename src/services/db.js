import { openDB } from 'idb';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'arto_offline_db';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('budgets')) {
        db.createObjectStore('budgets', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('profiles')) {
        db.createObjectStore('profiles', { keyPath: 'id' });
      }
    },
  });
};

const getDefaultCategories = () => {
  const now = new Date().toISOString();
  return [
    { id: uuidv4(), name: 'Makan & Minum', type: 'expense', color: 'pastel-orange:Utensils', created_at: now },
    { id: uuidv4(), name: 'Transportasi', type: 'expense', color: 'pastel-blue:Car', created_at: now },
    { id: uuidv4(), name: 'Hiburan', type: 'expense', color: 'pastel-purple:Gamepad2', created_at: now },
    { id: uuidv4(), name: 'Gaji', type: 'income', color: 'pastel-green:Banknote', created_at: now },
    { id: uuidv4(), name: 'Lainnya', type: 'expense', color: 'sage:ShoppingBag', created_at: now },
  ];
};

export const dbService = {
  // Profiles
  getProfile: async (user) => {
    if (user) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } else {
      const db = await initDB();
      const profiles = await db.getAll('profiles');
      return profiles.length > 0 ? profiles[0] : { full_name: 'Guest', currency: 'IDR' };
    }
  },
  updateProfile: async (user, updates) => {
    if (user) {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select();
      if (error) throw error;
      return data;
    } else {
      const db = await initDB();
      const profiles = await db.getAll('profiles');
      const profile = profiles.length > 0 ? profiles[0] : { id: 'guest' };
      const updated = { ...profile, ...updates };
      await db.put('profiles', updated);
      return [updated];
    }
  },

  // Categories
  getCategories: async (user) => {
    if (user) {
      const { data, error } = await supabase.from('categories').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const db = await initDB();
      let cats = await db.getAll('categories');
      if (cats.length === 0) {
        cats = getDefaultCategories();
        for (const cat of cats) {
          await db.put('categories', cat);
        }
      } else {
        // Patch old categories that don't have icons
        let updated = false;
        cats = cats.map(cat => {
          if (!cat.color.includes(':')) {
            updated = true;
            if (cat.name === 'Makan & Minum') cat.color = 'pastel-orange:Utensils';
            else if (cat.name === 'Transportasi') cat.color = 'pastel-blue:Car';
            else if (cat.name === 'Hiburan') cat.color = 'pastel-purple:Gamepad2';
            else if (cat.name === 'Gaji') cat.color = 'pastel-green:Banknote';
            else cat.color = `${cat.color}:ShoppingBag`;
            db.put('categories', cat);
          }
          return cat;
        });
      }
      return cats.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },
  createCategory: async (user, data) => {
    if (user) {
      const { data: res, error } = await supabase.from('categories').insert([{ ...data, user_id: user.id }]).select();
      if (error) throw error;
      return res;
    } else {
      const db = await initDB();
      const newCat = { ...data, id: uuidv4(), created_at: new Date().toISOString() };
      await db.put('categories', newCat);
      return [newCat];
    }
  },
  updateCategory: async (user, id, updates) => {
    if (user) {
      const { data, error } = await supabase.from('categories').update(updates).eq('id', id).eq('user_id', user.id).select();
      if (error) throw error;
      return data;
    } else {
      const db = await initDB();
      const cat = await db.get('categories', id);
      if (!cat) throw new Error('Category not found');
      const updated = { ...cat, ...updates };
      await db.put('categories', updated);
      return [updated];
    }
  },
  deleteCategory: async (user, id) => {
    if (user) {
      const { error } = await supabase.from('categories').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      return id;
    } else {
      const db = await initDB();
      await db.delete('categories', id);
      return id;
    }
  },

  // Transactions
  getTransactions: async (user) => {
    if (user) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const db = await initDB();
      const txs = await db.getAll('transactions');
      const cats = await db.getAll('categories');
      const mapped = txs.map(tx => ({
        ...tx,
        category: cats.find(c => c.id === tx.category_id) || null
      }));
      return mapped.sort((a, b) => {
        const dateA = new Date(a.transaction_date).getTime();
        const dateB = new Date(b.transaction_date).getTime();
        if (dateA !== dateB) return dateB - dateA;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }
  },
  createTransaction: async (user, data) => {
    if (user) {
      const { data: res, error } = await supabase.from('transactions').insert([{ ...data, user_id: user.id }]).select();
      if (error) throw error;
      return res;
    } else {
      const db = await initDB();
      const newTx = { ...data, id: uuidv4(), created_at: new Date().toISOString() };
      await db.put('transactions', newTx);
      return [newTx];
    }
  },
  updateTransaction: async (user, id, updates) => {
    if (user) {
      const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).eq('user_id', user.id).select();
      if (error) throw error;
      return data;
    } else {
      const db = await initDB();
      const tx = await db.get('transactions', id);
      if (!tx) throw new Error('Transaction not found');
      const updated = { ...tx, ...updates };
      await db.put('transactions', updated);
      return [updated];
    }
  },
  deleteTransaction: async (user, id) => {
    if (user) {
      const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      return id;
    } else {
      const db = await initDB();
      await db.delete('transactions', id);
      return id;
    }
  },

  // Budgets
  getBudgets: async (user, month, year) => {
    if (user) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .eq('month', month)
        .eq('year', year)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const db = await initDB();
      const budgets = await db.getAll('budgets');
      const cats = await db.getAll('categories');
      
      const filtered = budgets.filter(b => b.month === month && b.year === year);
      
      const mapped = filtered.map(b => ({
        ...b,
        category: b.category_id ? (cats.find(c => c.id === b.category_id) || null) : null
      }));
      return mapped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  },
  createBudget: async (user, data) => {
    if (user) {
      // Validation handled in hook
      const { data: res, error } = await supabase.from('budgets').insert([{ ...data, user_id: user.id }]).select();
      if (error) throw error;
      return res;
    } else {
      const db = await initDB();
      const newBudget = { ...data, id: uuidv4(), created_at: new Date().toISOString() };
      await db.put('budgets', newBudget);
      return [newBudget];
    }
  },
  updateBudget: async (user, id, updates) => {
    if (user) {
      const { data, error } = await supabase.from('budgets').update(updates).eq('id', id).eq('user_id', user.id).select();
      if (error) throw error;
      return data;
    } else {
      const db = await initDB();
      const budget = await db.get('budgets', id);
      if (!budget) throw new Error('Budget not found');
      const updated = { ...budget, ...updates };
      await db.put('budgets', updated);
      return [updated];
    }
  },
  deleteBudget: async (user, id) => {
    if (user) {
      const { error } = await supabase.from('budgets').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      return id;
    } else {
      const db = await initDB();
      await db.delete('budgets', id);
      return id;
    }
  },
  
  // Custom queries needed by validation
  checkBudgetExists: async (user, month, year, category_id, exclude_id = null) => {
    if (user) {
      let query = supabase
        .from('budgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', month)
        .eq('year', year);
      if (category_id) query = query.eq('category_id', category_id);
      else query = query.is('category_id', null);
      
      if (exclude_id) query = query.neq('id', exclude_id);
      
      const { data } = await query;
      return data && data.length > 0;
    } else {
      const db = await initDB();
      const budgets = await db.getAll('budgets');
      return budgets.some(b => 
        b.month === month && 
        b.year === year && 
        (category_id ? b.category_id === category_id : !b.category_id) && 
        b.id !== exclude_id
      );
    }
  }
};

