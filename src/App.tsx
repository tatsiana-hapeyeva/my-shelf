import { Routes, Route } from "react-router";
import { Hero } from "./pages/hero";
import { Library } from "./pages/library";
import { Finished } from "./pages/finished";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/library" element={<Library />} />
      <Route path="/finished" element={<Finished />} />
    </Routes>
  );
}
