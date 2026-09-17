import { initDB } from './db';
import { supabase } from '../lib/supabaseClient';

export const syncLocalDataToCloud = async (userId) => {
  if (!userId) return false;

  const db = await initDB();

  // Read all data from IndexedDB
  const categories = await db.getAll('categories');
  const transactions = await db.getAll('transactions');
  const budgets = await db.getAll('budgets');
  const profiles = await db.getAll('profiles');

  let syncSuccessful = true;

  try {
    // 1. Sync Profile (if guest updated their name)
    const localProfile = profiles.length > 0 ? profiles[0] : null;
    if (localProfile && localProfile.full_name && localProfile.full_name !== 'Guest') {
      await supabase
        .from('profiles')
        .update({ full_name: localProfile.full_name, currency: localProfile.currency || 'IDR' })
        .eq('id', userId);
    }

    // 2. Sync Categories
    if (categories.length > 0) {
      const categoriesToInsert = categories.map(cat => ({
        id: cat.id,
        user_id: userId,
        name: cat.name,
        type: cat.type,
        color: cat.color,
        created_at: cat.created_at || new Date().toISOString()
      }));

      // Upsert to handle conflicts if somehow they exist
      const { error } = await supabase.from('categories').upsert(categoriesToInsert, { onConflict: 'id' });
      if (error) {
        console.error('Sync categories error:', error);
        syncSuccessful = false;
      }
    }

    // 3. Sync Transactions
    if (transactions.length > 0) {
      const txsToInsert = transactions.map(tx => ({
        id: tx.id,
        user_id: userId,
        category_id: tx.category_id,
        amount: tx.amount,
        type: tx.type,
        description: tx.description,
        transaction_date: tx.transaction_date,
        created_at: tx.created_at || new Date().toISOString()
      }));

      const { error } = await supabase.from('transactions').upsert(txsToInsert, { onConflict: 'id' });
      if (error) {
        console.error('Sync transactions error:', error);
        syncSuccessful = false;
      }
    }

    // 4. Sync Budgets
    if (budgets.length > 0) {
      const budgetsToInsert = budgets.map(b => ({
        id: b.id,
        user_id: userId,
        category_id: b.category_id,
        amount: b.amount,
        month: b.month,
        year: b.year,
        created_at: b.created_at || new Date().toISOString()
      }));

      const { error } = await supabase.from('budgets').upsert(budgetsToInsert, { onConflict: 'id' });
      if (error) {
        console.error('Sync budgets error:', error);
        syncSuccessful = false;
      }
    }

    // If everything successful, clear IndexedDB so local edits now use cloud
    if (syncSuccessful) {
      await db.clear('categories');
      await db.clear('transactions');
      await db.clear('budgets');
      await db.clear('profiles');
    }

    return syncSuccessful;

  } catch (err) {
    console.error('Sync failed with exception:', err);
    return false;
  }
};

