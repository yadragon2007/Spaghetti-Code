import Mars from "../../components/Mars/Mars";
import Button from "../../components/Btn/Button";
import "./Home.css";

export default function Home() {
  return (
    <>
      <div className="conainter-css">
        <div className="hero">
          <Mars
            className="Mars"
          />

          <div className="hero-text">
            <h1>Spaghetti Code</h1>
            <p>The Twin Rovers</p>
          </div>
        </div>

        <Button>Start</Button>
      </div>
    </>
  );
}
