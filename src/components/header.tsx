import { Link } from "react-router";
import Box from "@mui/material/Box";

export function Header() {
  return (
    <Box component="header" className="header__container">
      <Box component="nav" className="header__menu">
        <Link className="header__link" to="/">
          Главная
        </Link>
        <Link className="header__link" to="/library">
          Библиотека
        </Link>
        <Link className="header__link" to="/finished">
          Прочитанное
        </Link>
      </Box>
    </Box>
  );
}
