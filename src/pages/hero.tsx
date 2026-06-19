import { Link } from "react-router";
import Box from "@mui/material/Box";
import { Header } from "../components/Header";
import { Counter } from "../components/Counter";
import Button from "../components/Button";

export function Hero() {
  return (
    <>
      <Header />
      <main>
        <Counter />

        <Box
          component="nav"
          className="hero-buttons__container"
          sx={{
            [`@media (max-width:900px)`]: {
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "flex-start",
            },
          }}
        >
          <Link className="hero-buttons__link" to="/library">
            <Button>В библиотеку</Button>
          </Link>

          <Link className="hero-buttons__link" to="/finished">
            <Button>К прочитанному</Button>
          </Link>
        </Box>
      </main>
    </>
  );
}
