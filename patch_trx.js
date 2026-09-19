const fs = require('fs');
let code = fs.readFileSync('src/components/transactions/TransactionForm.jsx', 'utf8');

// Update imports
code = code.replace(
  "import { useCategories } from '../../hooks/useCategories';",
  "import { useCategories } from '../../hooks/useCategories';\nimport { usePaymentMethods } from '../../hooks/usePaymentMethods';"
);

// Update schema
code = code.replace(
  "categoryId: z.string().min(1, 'Kategori wajib dipilih'),",
  "categoryId: z.string().min(1, 'Kategori wajib dipilih'),\n  paymentMethodId: z.string().optional(),"
);

// Update props
code = code.replace(
  "export default function TransactionForm({ initialData, onSuccess, onCancel, onOpenCategoryManage }) {",
  "export default function TransactionForm({ initialData, onSuccess, onCancel, onOpenCategoryManage, onOpenPaymentMethodManage }) {"
);

// Add hooks
code = code.replace(
  "const updateMutation = useUpdateTransaction();",
  "const updateMutation = useUpdateTransaction();\n  const { data: paymentMethods = [] } = usePaymentMethods();\n  const [isPMOpen, setIsPMOpen] = useState(false);\n  const pmDropdownRef = useRef(null);"
);

// Update defaults
code = code.replace(
  "categoryId: initialData?.category_id || '',",
  "categoryId: initialData?.category_id || '',\n      paymentMethodId: initialData?.payment_method_id || '',"
);

// Update payload
code = code.replace(
  "category_id: data.categoryId,",
  "category_id: data.categoryId,\n        payment_method_id: data.paymentMethodId || null,"
);

// Click outside for PM
code = code.replace(
  "if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {",
  "if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {\n        setIsCategoryOpen(false);\n      }\n      if (pmDropdownRef.current && !pmDropdownRef.current.contains(event.target)) {\n        setIsPMOpen(false);\n      }"
);
code = code.replace(
  "setIsCategoryOpen(false);\n      }",
  "" // Handled above
);

fs.writeFileSync('src/components/transactions/TransactionForm.jsx', code);
