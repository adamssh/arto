const fs = require('fs');

const colors = [
  'primary', 'sage', 'beige', 'expense', 'cream', 'primary-dark',
  'pastel-red', 'pastel-orange', 'pastel-green', 'pastel-blue',
  'pastel-purple', 'pastel-pink', 'pastel-teal', 'pastel-peach', 'pastel-lavender'
];
let safelist = [];
colors.forEach(c => {
  safelist.push("'" + "bg-" + c + "'");
  [20, 30, 40, 50, 60, 70, 80, 90].forEach(op => {
    safelist.push("'" + "bg-" + c + "/" + op + "'");
  });
});

let code = fs.readFileSync('tailwind.config.js', 'utf8');
code = code.replace(/safelist: \[\s*[\s\S]*?\s*\],/, "safelist: [\n  " + safelist.join(",\n  ") + "\n],");
fs.writeFileSync('tailwind.config.js', code);
