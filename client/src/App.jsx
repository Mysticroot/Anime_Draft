import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BattlePage from "./pages/BattlePage";
import AllCharacters from "./pages/AllCharacters";
import Header from "./common/Header"
import Footer from "./common/Footer";

export default function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/allCards" element={<AllCharacters />} />
      </Routes>
      <Footer/>
    </Router>
  );
}
