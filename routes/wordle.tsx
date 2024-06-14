import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import WordRow from "../islands/WordRow.tsx";
import Header from "../components/Header.tsx";
const GAMETYPE = "Wordle";
const GUESS_LENGTH = 5;
export default function Home() {
  const count = useSignal(3);
  const moves = useSignal([]);
  const guess = useSignal("");
  const answer = useSignal("apple");
  const showInvalidGuess = useSignal(false);
  const loading = useSignal(false);
  let rows: string[] = moves.value.length < 6 ? moves.value.concat(guess.value) : moves.value;
  rows = rows.concat(Array(GUESS_LENGTH - rows.length).fill(""));
  console.log(rows);
  return (
    <>
      <Header title={GAMETYPE} />
      <div className="mx-auto w-96 relative " style={{ gridArea: "main" }}>
        {showInvalidGuess
          ? (
            <div className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-0 p-6 w-3/4 mx-auto text-black animate-bounce">
              invalid guess!
            </div>
          )
          : ""}
        {loading
          ? (
            <div className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-0 p-6 w-3/4 mx-auto text-black animate-bounce">
              Loading...
            </div>
          )
          : ""}

        <main className="grid grid-rows-6 gap-4 my-4 ">
          {rows.map((row: string, idx: number) => (
            console.log(row),
            <WordRow
              key={idx}
              letters={row}
              letterLength={5}
              answer={answer.value}
              currentGuess={idx === moves.length}
            />
          ))}
        </main>
        {
          /* {<Keyboard addGuessLetter={addGuessLetter} moves={moves} answer={answer}/> }
            {
                gameOver && (
                <div  className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-1/4 p-6 w-3/4 mx-auto text-black">
                    {victory ?
                        'You win! 1 coin and 100 points have been added to your account!' :
                        <div>
                            Better Luck Next Time. &nbsp;The answer was {answer}
                        </div>
                    }
                    <button onClick={newGame} className='block border rounded border-green-500 bg-green-500 p-2 mt-4 mx-auto shadow'>
                        New Game
                    </button>
                </div>)
            }  */
        }
      </div>
      <div class="px-4 py-8 mx-auto bg-[#86efac]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <p class="my-4">
            Wordle
          </p>
        </div>
      </div>
    </>
  );
}
