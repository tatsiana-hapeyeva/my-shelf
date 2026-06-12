import { useState } from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const MOBILE_WIDTH = "900px";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Главная" },
    { to: "/library", label: "Библиотека" },
    { to: "/finished", label: "Прочитанное" },
  ];

  return (
    <Box component="header" className="header__container">
      <Box
        component="nav"
        className="header__menu"
        sx={{
          position: "relative",
        }}
      >
        <Box
          component="ul"
          sx={{
            display: "flex",
            gap: "16px",
            listStyle: "none",
            margin: 0,
            padding: 0,
            [`@media (max-width:${MOBILE_WIDTH})`]: {
              display: "none",
            },
          }}
        >
          {links.map((link) => (
            <Box component="li" key={link.to}>
              <Link className="header__link" to={link.to}>
                {link.label}
              </Link>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "none",
            [`@media (max-width:${MOBILE_WIDTH})`]: {
              display: "block",
            },
          }}
        >
          <IconButton
            onClick={() => setIsMenuOpen(true)}
            sx={{
              display: isMenuOpen ? "none" : "inline-flex",
              color: "var(--color-text)",
            }}
          >
            <MenuIcon />
          </IconButton>

          <IconButton
            onClick={() => setIsMenuOpen(false)}
            sx={{
              display: isMenuOpen ? "inline-flex" : "none",
              color: "var(--color-text)",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="ul"
            sx={{
              display: isMenuOpen ? "flex" : "none",
              flexDirection: "column",
              gap: "16px",
              listStyle: "none",
              margin: 0,
              padding: "16px 0 0 0",
            }}
          >
            {links.map((link) => (
              <Box component="li" key={link.to}>
                <Link className="header__link" to={link.to}>
                  {link.label}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
