import "../main.css";
import type { ItemCardData } from "../types";

function getPluralForm(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return many;
  if (lastOne === 1) return one;
  if (lastOne >= 2 && lastOne <= 4) return few;
  return many;
}

type CounterProps = {
  items: ItemCardData[];
};

export function Counter({ items }: CounterProps) {
  const total = items.length;
  const completed = items.filter((item) => item.isRead).length;

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
