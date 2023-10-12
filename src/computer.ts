import { Value } from "./components/Square";

type Cell = readonly [Value | undefined, () => void];

export async function play(board: Cell[]) {
    const emptyCells = board.filter(([value]) => value === undefined);

    if (emptyCells.length === 0) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    await new Promise((resolve) => setTimeout(resolve, 600));

    console.log("Computer played", randomIndex);

    emptyCells[randomIndex][1]();
}
