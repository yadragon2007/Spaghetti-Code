import Mars from "./components/Mars";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app">
        <Mars width="100%" height={200} />
        {/* the rest of your page goes here */}
      </div>
    </div>
  );
}