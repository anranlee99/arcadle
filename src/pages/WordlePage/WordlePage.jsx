import { useState, useEffect, useRef } from "react"
import * as gameStateAPI from '../../utilities/gameState-api';
import WordRow from "../../components/GamesComponents/WordRow/WordRow"
import Keyboard from "../../components/GamesComponents/game-utils/Keyboard"
const GUESS_LENGTH = 6;

export default function WordlePage() {
    const [moves, setMoves] = useState([])
    // const [guess, setGuess] = useState('')
    const [guess, setGuess,addGuessLetter] = useGuess()
    const [answer, setAnswer] = useState('')
    const gameStateRef = useRef({});

    useEffect(function(){
        ( async function(){
            gameStateRef.current = await gameStateAPI.getGameState()
            setMoves(gameStateRef.current.record.guesses)
            setAnswer(gameStateRef.current.record.answer)
            
        })();
    },[]);



    async function addGuess(word){
        console.log('line26',{word})
        await gameStateAPI.addGuess(word)
        gameStateRef.current = await gameStateAPI.getGameState()
        console.log(gameStateRef.current)
        setMoves([...moves, guess])
        setGuess('')
        window.location.reload(false);
    }

    function useGuess(){
        const [guess, setGuess] = useState('');
        const previousGuess = usePrevious(guess)
        const WORD_LENGTH=5
        const addGuessLetter = (letter: string) => {
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
        return [guess, setGuess];
    }

    async function newGame(){
        await gameStateAPI.newGame();
        window.location.reload(false);
    }

    let rows = moves.concat(guess)
    const currentGuess = rows.length
    rows = rows.concat(Array(GUESS_LENGTH-rows.length).fill(''))

    return (
        <div className="mx-auto w-96 relative">
            <header className="border-b border-gray-500 pb-2 my-2">
                <h1 className="text-4xl text-center ">Wordle</h1>
            </header>
            <main className='grid grid-rows-6 gap-4 my-4'>
                {rows.map((row, idx)=>(<WordRow key={idx} letters={row} letterLength={5} answer={answer} currentGuess={currentGuess-1===moves.length}/>))}
                

            </main>
            <Keyboard />
            {/* <form onSubmit={addGuess} className=''>
                <input type="text" disabled={gameStateRef.current.gameOver}  className=' p-2 bg-blue-500 border-2 border-gray-500' 
                value={guess} maxLength={5}
                onChange={e => setGuess(e.target.value)} />
            </form> */}
            {
                gameStateRef.current.gameOver && (
                <div role='modal' className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-1/4 p-6 w-3/4 mx-auto">
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