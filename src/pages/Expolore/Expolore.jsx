import Mars from "../../components/Mars/Mars";
import Button from "../../components/Btn/Button";
import Carousel from "../../components/Carousel/Carousel";

const rovers = [
  {
    id: "opportunity",
    name: "Opportunity",
    Model: "models/opportunity.glb",
  },
  { id: "spirit", name: "Spirit", Model: "models/opportunity.glb" },
];
export default function Expolore() {
  return (
    <>
      <div className="conainter-css">
        <div className="hero">
          <Mars
            className="Mars"
            markers={[
              { name: "Opportunity", lat: -1.9462, lon: 354.4734 },
              { name: "Spirit", lat: -14.6, lon: 175.5 },
            ]}
          />
        </div>
        <Carousel items={rovers} />
      </div>
    </>
  );
}
