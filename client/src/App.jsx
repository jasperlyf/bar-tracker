import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import VisitPage from "./pages/VisitPage";
import MyList from "./pages/MyList";
import Top100Bars from "./pages/Top100Bars";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-800 font-sans">
        <header className="px-6 py-4 border-b shadow-sm flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">🍸 Bar Tracker</h1>
          <nav className="space-x-6 text-gray-700 text-sm font-medium">
            <Link to="/" className="hover:text-black">
              Home
            </Link>
            <Link to="/visits" className="hover:text-black">
              My Visits
            </Link>
            <Link to="/mylist" className="hover:text-black">
              My List
            </Link>{" "}
            <Link to="/top100" className="hover:text-black">
              Top 100 Bars
            </Link>
          </nav>
        </header>

        <main className="px-6 py-10 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visits" element={<VisitPage />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="/top100" element={<Top100Bars />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
