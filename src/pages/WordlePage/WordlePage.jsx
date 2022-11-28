import { useState, useEffect, useRef } from "react"
import "./WordlePage.css"
import { validateGuess } from "../../components/GamesComponents/game-utils/word-utils";
import * as gameStateAPI from '../../utilities/gameState-api';
import WordRow from "../../components/GamesComponents/WordRow/WordRow"
import Keyboard from "../../components/GamesComponents/Keyboard/Keyboard"
const GUESS_LENGTH = 6;

export default function WordlePage() {
    const [moves, setMoves] = useState([])
    // const [guess, setGuess] = useState('')
    const [guess, setGuess, addGuessLetter] = useGuess()
    const [answer, setAnswer] = useState('')
    const gameStateRef = useRef({});

    const [showInvalidGuess, setInvalidGuess] = useState(false);

    useEffect(() => {
      let id: NodeJS.Timeout;
      if (showInvalidGuess) {
        id = setTimeout(() => setInvalidGuess(false), 10000);
      }
  
      return () => clearTimeout(id);
    }, [showInvalidGuess]);

    useEffect(function(){
        ( async function(){
            gameStateRef.current = await gameStateAPI.getGameState()
            setMoves(gameStateRef.current.record.guesses)
            setAnswer(gameStateRef.current.record.answer)
            console.log(gameStateRef.current)
        })();
    },[]);



    async function addGuess(word){

        if(validateGuess(word)){
            await gameStateAPI.addGuess(word)
            
            console.log(gameStateRef.current)
            setMoves([...moves, guess])
            gameStateRef.current = await gameStateAPI.getGameState()
        } else {
            setInvalidGuess(true)
        }
        
        setGuess('')
        window.location.reload(false);
    }

    function useGuess(){
        const [guess, setGuess] = useState('');
        const previousGuess = usePrevious(guess)
        const WORD_LENGTH=5
        const addGuessLetter = (letter) => {
            setGuess((curGuess) => {
            const newGuess =
                letter.length === 1 && curGuess.length !== WORD_LENGTH
                ? curGuess + letter
                : curGuess;
        
            switch (letter) {
                case 'Backspace':
                    return newGuess.slice(0, -1);
                case 'Enter':
                    if (newGuess.length === WORD_LENGTH) {
                        return '';
                    }
                    break;
                default:
                    break;
            }
            
            if (newGuess.length === WORD_LENGTH) {
                return newGuess;
            }
        
            return newGuess;
            });
        };
    
        const onKeyDown = (e = KeyboardEvent) => {
            let letter = e.key;
            const alpha = /^[a-z]/
            if(letter.match(alpha)||letter==='Backspace'||letter==='Enter'){
                
                addGuessLetter(letter);
            }
        };
    
        useEffect(() => {
            document.addEventListener('keydown', onKeyDown);
            return () => {
            document.removeEventListener('keydown', onKeyDown);
            };
        }, []);
        useEffect(()=>{
            if(guess.length===0 && previousGuess?.length===WORD_LENGTH){
                addGuess(previousGuess)
            }
        }, [guess])
        return [guess, setGuess, addGuessLetter];
    }

    async function newGame(){
        await gameStateAPI.newGame();
        window.location.reload(false);
    }
    let rows = moves.length<6 ? moves.concat(guess) : moves;
    rows = rows.concat(Array(GUESS_LENGTH-rows.length).fill(''))

    return (
        <div className="mx-auto w-96 relative">
            {
            showInvalidGuess ? 
            <div
                className='absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-0 p-6 w-3/4 mx-auto text-black animate-bounce'>
                invalid guess!
            </div> : ''
            }
            <header className="border-b border-gray-500 pb-2 my-2">
                <h1 className="page-title">Wordle</h1>
            </header>
            <main className='grid grid-rows-6 gap-4 my-4'>
                {rows.map((row, idx)=>(
                    <WordRow 
                        key={idx} 
                        letters={row} 
                        letterLength={5} 
                        answer={answer} 
                        currentGuess={idx===moves.length}

                    />
                ))}
                

            </main>
            <Keyboard addGuessLetter={addGuessLetter}/>
            {
                gameStateRef.current.gameOver && (
                <div  className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-1/4 p-6 w-3/4 mx-auto text-black">
                    {gameStateRef.current.victory ? 'You win!' : 'Better Luck Next Time'}
                    <button onClick={newGame} className='block border rounded border-green-500 bg-green-500 p-2 mt-4 mx-auto shadow'>
                        New Game
                    </button>
                </div>)
            }
        </div>
    )
}

function usePrevious (value){
    const ref = useRef();

    useEffect(()=>{
        ref.current = value;
    },[value])

    return ref.current;
}