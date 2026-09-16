import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Placeholder() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold">Expense Tracker</h1>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Placeholder />} />
      </Routes>
    </Router>
  );
}
