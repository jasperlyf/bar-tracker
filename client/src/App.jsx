import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import VisitPage from "./pages/VisitPage";
import Top100Bars from "./pages/Top100Bars";

function App() {
  return (
    <Router>
      <div className="max-w-7xl mx-auto px-6 py-8 font-serif text-gray-800">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🍸 Bar Tracker</h1>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/visits" className="hover:underline">My Visits</Link>
            <Link to="/top100" className="hover:underline">Top 100 Bars</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visits" element={<VisitPage />} />
          <Route path="/top100" element={<Top100Bars />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
