import './App.css'
import TicTacToe from './components/TicTacToe';

function App() {
  return (
    <main>
      <h1>Tic-Tac-Toe</h1>

      <TicTacToe computer={true} />
    </main>
  );
}

export default App
