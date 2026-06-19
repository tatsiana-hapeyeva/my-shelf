import { useState } from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import SearchForm from "./SearchForm";

type HeaderProps = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const MOBILE_WIDTH = "900px";

export function Header({ searchValue, setSearchValue }: HeaderProps) {
  const [mobileSection, setMobileSection] = useState<"menu" | "search" | null>(
    null,
  );

  const links = [
    { to: "/", label: "Главная" },
    { to: "/library", label: "Библиотека" },
    { to: "/finished", label: "Прочитанное" },
  ];

  const navLinks = links.map((link) => (
    <Box component="li" key={link.to}>
      <Link className="header__link" to={link.to}>
        {link.label}
      </Link>
    </Box>
  ));

  const toggleMobileSection = (section: "menu" | "search") => {
    setMobileSection((prev) => (prev === section ? null : section));
  };

  return (
    <Box component="header" className="header__container">
      <Box
        component="nav"
        className="header__menu"
        sx={{
          flex: "1 1 auto",
          minWidth: 0,
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
          {navLinks}
        </Box>
      </Box>

      <Box
        sx={{
          flex: "1 1 40%",
          minWidth: 0,
          [`@media (max-width:${MOBILE_WIDTH})`]: {
            display: "none",
          },
        }}
      >
        <SearchForm searchValue={searchValue} setSearchValue={setSearchValue} />
      </Box>

      <Box
        sx={{
          display: "none",
          width: "100%",
          [`@media (max-width:${MOBILE_WIDTH})`]: {
            display: "block",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <IconButton
            onClick={() => toggleMobileSection("menu")}
            sx={{ color: "var(--color-text)" }}
          >
            {mobileSection === "menu" ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          <IconButton
            onClick={() => toggleMobileSection("search")}
            sx={{ color: "var(--color-text)" }}
          >
            {mobileSection === "search" ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        </Box>

        <Box
          component="ul"
          sx={{
            display: mobileSection === "menu" ? "flex" : "none",
            flexDirection: "column",
            gap: "16px",
            listStyle: "none",
            margin: 0,
            padding: "16px 0 0 0",
          }}
        >
          {navLinks}
        </Box>

        <Box
          sx={{
            display: mobileSection === "search" ? "block" : "none",
            width: "100%",
          }}
        >
          <SearchForm
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </Box>
      </Box>
    </Box>
  );
}
