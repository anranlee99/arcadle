import { useState, useEffect, useRef } from "react"
import "./WordlePage.css"
import { validateGuess } from "../../components/GamesComponents/game-utils/word-utils";
import * as gameStateAPI from '../../utilities/gameState-api';
import WordRow from "../../components/GamesComponents/WordRow/WordRow"
import Keyboard from "../../components/GamesComponents/Keyboard/Keyboard"
const GUESS_LENGTH = 6;

export default function WordlePage() {
    // const [moves, setMoves] = useState((async function(){
    //     return await gameStateAPI.getGameState()
    // }();))
    const [moves, setMoves] = useState([])
    const [guess, setGuess, addGuessLetter] = useGuess()
    const [answer, setAnswer] = useState('gourd')
    const [gameOver, setGameOver] = useState(false)
    const [victory, setVictory] = useState(false)
    const [showInvalidGuess, setInvalidGuess] = useState(false);
    const [loading, setLoading] = useState(true)
    const [isNewGame, setIsNewGame] = useState(false)
    const [useEffectCt, setUseEffectCt] = useState(0)
    useEffect(function(){
        (async function(){
            
                setUseEffectCt(useEffectCt+1)
                const gameState = await gameStateAPI.getGameState(); 
                setMoves(gameState.record.guesses)
                setAnswer(gameState.record.answer)
                setGameOver(gameState.gameOver)
                setVictory(gameState.victory)
                setIsNewGame(false)
                setLoading(false)
        })();
    },[isNewGame])
    useEffect(function(){
        (async function(){
            if(!loading){
                await gameStateAPI.saveGame(gameOver,moves,victory)

            }            
        })();
    },[loading,gameOver, moves, victory])

    useEffect(() => {
      let id: NodeJS.Timeout;
      if (showInvalidGuess) {
        id = setTimeout(() => setInvalidGuess(false), 1500);
      }
  
      return () => clearTimeout(id);
    }, [showInvalidGuess]);

    useEffect(function(){
        checkEndGame()
    },[moves,guess])

    function addGuess(word){

        if(validateGuess(word)){
            setMoves([...moves, word])
        } else {
            setInvalidGuess(true)
        }
        setGuess('')
    }
    function checkEndGame(){
        if(moves.length === 6){
            setGameOver(true)
        } else if(moves[moves.length-1]=== answer){
            setGameOver(true)
            setVictory(true)
        }
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

    function newGame(){
        setGuess('')
        setIsNewGame(true)
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
            {loading ? 
            <div
                className='absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-0 p-6 w-3/4 mx-auto text-black animate-bounce'>
                    Loading...
            </div> : ''}
            <header className="border-b border-gray-500 pb-2 my-2">
                <h1 className="page-title">Wordle {useEffectCt}</h1>
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
            {<Keyboard addGuessLetter={addGuessLetter} moves={moves} answer={answer}/> }
            {
                gameOver && (
                <div  className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-1/4 p-6 w-3/4 mx-auto text-black">
                    {victory ? 'You win!' : 'Better Luck Next Time'}
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