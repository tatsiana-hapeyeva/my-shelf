import "../main.css";
import type { ItemCardData } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

function getPluralForm(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return many;
  if (lastDigit === 1) return one;
  if (lastDigit >= 2 && lastDigit <= 4) return few;
  return many;
}

export function Counter() {
  const [items] = useLocalStorage<ItemCardData[]>("items", []);
  const currentItems = items ?? [];

  const total = currentItems.length;
  const completed = currentItems.filter((item) => item.isRead).length;

  return (
    <ul className="counter__container">
      <li className="counter__item">
        {total} {getPluralForm(total, "книга", "книги", "книг")} в библиотеке
      </li>

      <li className="counter__item">
        {completed} {getPluralForm(completed, "книга", "книги", "книг")}{" "}
        {getPluralForm(completed, "прочитана", "прочитаны", "прочитано")}
      </li>
    </ul>
  );
}
