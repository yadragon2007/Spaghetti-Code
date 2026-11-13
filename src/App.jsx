import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Expolore from "./pages/Expolore/Expolore";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore/" element={<Expolore />} />
          {/* <Route path="/explore/:rover" element={<Explore />} /> */}
        </Routes>
      </div>
    </div>
  );
}
