import { For, Show, createSignal } from "solid-js";
import Square, { Value } from "./Square";
import { JSX } from "solid-js/h/jsx-runtime";
import { effect } from "solid-js/web";
import { play } from "../computer";

interface TicTacToeProps {
  size?: number;
  game?: (Value | undefined)[];
  computer?: Value | boolean;
}

function hasWinner(
  game: (Value | undefined)[],
  size?: number,
  turn?: number
): Value | false {
  size ??= Math.sqrt(game.length);

  if (turn && turn < size * 2 - 1) return false;

  row: for (let i = 0; i < size; i++) {
    const first = game[i * size];

    if (first === undefined) continue;

    for (let j = 0; j < size; j++) {
      if (game[i * size + j] !== first) continue row;
    }

    return first;
  }

  column: for (let i = 0; i < size; i++) {
    const first = game[i];

    if (first === undefined) continue;

    for (let j = 0; j < size; j++) {
      if (game[j * size + i] !== first) continue column;
    }

    return first;
  }

  diagonal: {
    const first = game[0];

    if (first === undefined) break diagonal;

    for (let i = 0; i < size; i++) {
      if (game[i * size + i] !== first) break diagonal;
    }

    return first;
  }

  diagonal: {
    const first = game[size - 1];

    if (first === undefined) break diagonal;

    for (let i = 0; i < size; i++) {
      if (game[i * size + size - 1 - i] !== first) break diagonal;
    }

    return first;
  }

  return false;
}

export default function TicTacToe(props: TicTacToeProps) {
  const size = props.size ?? 3;
  const computer = props.computer === true ? "O" : props.computer;

  const gameStyle: JSX.CSSProperties = {
    display: "grid",
    "grid-template-columns": `repeat(${size}, 1fr)`,
    "grid-template-rows": `repeat(${size}, 1fr)`,
  };

  const [turnNumber, setTurnNumber] = createSignal(0);
  const [winner, setWinner] = createSignal<Value | undefined>(undefined);

  const [gameState, setGameState] = createSignal<(Value | undefined)[]>(
    Array(size ** 2).fill(undefined), { equals: false }
  );

  const movePile: (() => void)[] = [];

  function hasWon() {
    return hasWinner(gameState(), size, turnNumber());
  }

  function setStateIn(value: Value | undefined, i: number) {
    const game = gameState();
    game[i] = value;

    setGameState(game);
  }

  async function addMove(index: number, value?: Value | undefined) {
    if (turnNumber() >= size ** 2) return;
    if (winner()) return;
    if (gameState()[index]) return;

    const undo = () => setStateIn(undefined, index);
    setStateIn(value ?? currentTurn(), index);

    movePile.push(undo);
    setTurnNumber(turnNumber() + 1);
    setWinner(hasWon() || undefined);

    if (winner()) return;

    if (computer && currentTurn() === computer) {
      console.log("Computer's turn");

      const board = gameState().map((v, i) => [v, () => addMove(i)] as const);
      await play(board);
    }
  }

  function undoMove() {
    let undo = movePile.pop();

    if (undo) {
      undo();
      setTurnNumber(turnNumber() - 1);
      setWinner(hasWon() || undefined);
    }
    
    if (computer && currentTurn() === computer) {
      undo = movePile.pop();

      if (undo) {
        undo();
        setTurnNumber(turnNumber() - 1);
        setWinner(hasWon() || undefined);
      }
    }
  }

  function currentTurn(): Value {
    return turnNumber() & 1 ? "O" : "X";
  }

  if (props.game) {
    props.game.forEach((game, i) => {
      if (game) {
        setGameState((gameState) =>
          gameState.map((v, j) => (i === j ? game : v))
        );

        addMove(i, game);
      }
    });
  }

  effect(() => {
    console.log(gameState());
    console.log(`Winner: ${winner()}`);
  });

  return (
    <>
      <h3>Current turn: {currentTurn()}</h3>
      <h3>Turn number: {turnNumber()}</h3>

      <Show when={winner()}>
        <h3>Winner: {winner()}</h3>
      </Show>

      <div style={gameStyle}>
        <For each={Array.from(Array(size ** 2).keys())}>
          {(i) => {
            const value = () => gameState()[i];
            const setValue = () => currentTurn() !== computer && addMove(i);

            return <Square value={[value, setValue]} />;
          }}
        </For>
      </div>
      <button onClick={undoMove}>Undo</button>
    </>
  );
}
