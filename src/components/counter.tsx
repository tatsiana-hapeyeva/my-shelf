import "../main.css";

export function Counter() {
  return (
    <ul className="counter__container">
      <li className="counter__item">X книг в библиотеке</li>
      <li className="counter__item">Y художественных прочитано</li>
      <li className="counter__item">Z нон-фикшн изучено</li>
    </ul>
  );
}
