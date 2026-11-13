import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}