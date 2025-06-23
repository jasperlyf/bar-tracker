import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BarForm from "./components/BarForm";
import VisitTable from "./components/VisitTable";
import TopBars from "./components/TopBars";

function HomePage() {
  return (
    <>
      <BarForm />
      <VisitTable />
      <div className="mt-6">
        <Link
          to="/top100"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🌏 View Top 100 Bars
        </Link>
      </div>
    </>
  );
}

function TopBarsPage() {
  return (
    <>
      <TopBars />
      <div className="mt-6">
        <Link
          to="/"
          className="inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          🔙 Back to Home
        </Link>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold mb-6">🍸 Bar Tracker</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/top100" element={<TopBarsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
