import { Link } from "react-router";
import { Header } from "../components/header";
import { Counter } from "../components/counter";
import Button from "../components/button";

export function Hero() {
  return (
    <>
      <Header />
      <Counter />

      <div className="hero-buttons__container">
        <Link className="hero-buttons__link" to="/library">
          <Button>В библиотеку</Button>
        </Link>

        <Link className="hero-buttons__link" to="/finished">
          <Button>К прочитанному</Button>
        </Link>
      </div>
    </>
  );
}
