import { JSX } from "solid-js/h/jsx-runtime";

export type Value = "X" | "O";

const buttonStyle: JSX.CSSProperties = {
  "min-width": "80px",
  "aspect-ratio": "1",

  display: "flex",
  "justify-content": "center",
  "align-items": "center",
  "text-align": "center",
};

interface SquareProps {
  value: [() => Value | undefined, () => void];
}

export default function Square({ value: [value, nextMove] }: SquareProps) {
  return (
    <button style={buttonStyle} class="square" onClick={nextMove}>
      {value()}
    </button>
  );
}
