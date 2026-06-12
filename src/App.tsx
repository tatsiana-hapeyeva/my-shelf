import { Routes, Route, Navigate } from "react-router-dom";
import { Hero } from "./pages/hero";
import { Library } from "./pages/library";
import { Finished } from "./pages/finished";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/library" element={<Library />} />
      <Route path="/finished" element={<Finished />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
