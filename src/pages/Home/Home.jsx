import Mars from "../../components/Mars/Mars";
import Button from "../../components/Btn/Button";
import "./Home.css";

export default function Home() {
  return (
    <>
      <div className="conainter">
        <div className="hero">
          <Mars
            className="Mars"
            markers={[
              { name: "Opportunity", lat: -1.9462, lon: 354.4734 },
              { name: "Spirit", lat: -14.6, lon: 175.5 },
            ]}
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
