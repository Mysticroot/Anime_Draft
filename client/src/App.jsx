import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BattlePage from "./pages/BattlePage";
import AllCharacters from "./pages/AllCharacters";
import Header from "./common/Header";
import Footer from "./common/Footer";
import SignIn from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";
import { AuthProvider } from "./Auth/AuthContext";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/allCards" element={<AllCharacters />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}
