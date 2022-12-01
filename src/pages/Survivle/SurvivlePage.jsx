import { useState, useEffect, useRef } from "react"

import { validateGuess } from "../../components/GamesComponents/game-utils/word-utils";
import * as gameStateAPI from '../../utilities/gameState-api';
import WordRow from "../../components/GamesComponents/WordRow/WordRow"
import Keyboard from "../../components/GamesComponents/Keyboard/Keyboard"

import Header from '../../components/Header/Header'
const GUESS_LENGTH = 6;
const GAMETYPE = 'Survivle'
export default function SurvivlePage() {
    
    const [moves, setMoves] = useState([])
    const [wins, setWins] = useState(0)
    const [losses, setLosses] = useState(0)
    const [guess, setGuess, addGuessLetter] = useGuess()
    const [answer, setAnswer] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [victory, setVictory] = useState(false)
    const [showInvalidGuess, setInvalidGuess] = useState(false);
    const [loading, setLoading] = useState(true)
    const [isNewGame, setIsNewGame] = useState(false)
    // const [restarting, setRestarting] = useState(false)
    const [milli, setMilli] = useState(30000);
    const [isActive, setIsActive] = useState(false);
    const [timeIsUp, setTimeIsUp] = useState(false)
    useEffect(function(){

        (async function(){
                const gameState = await gameStateAPI.getGameState(GAMETYPE); 
                setMoves(gameState.record.guesses)
                setAnswer(gameState.record.answer)
                setGameOver(gameState.gameOver)
                setVictory(gameState.victory)
                setGuess('')
                setMilli(30000)
                setTimeIsUp(false)
                setLoading(false)
                setIsActive(true)
        })();
    },[isNewGame])

    useEffect(function(){
        (async function(){
            if(!loading){

                await gameStateAPI.saveGame(GAMETYPE,gameOver,moves,victory)
                
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

    useEffect(() => {
        let interval = null;
        if (isActive) {
          interval = setInterval(() => {
            setMilli(milli => milli - 1000);
          }, 1000);
        } else if (!isActive && milli !== 0) {
          clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, milli]);

    useEffect(()=>{
        if(milli <= 0){
            setIsActive(false)
            setTimeIsUp(true)
        }  
    },[milli])
    

    useEffect(function(){
        checkEndGame()
    },[moves,guess,timeIsUp])

    function checkEndGame(){
        if(moves.length === 6 || timeIsUp){
            setGameOver(true)
            setMilli(milli - 10000)
        } else if(moves[moves.length-1]=== answer){
            setGameOver(true)
            setVictory(true)
            setMilli(milli + 30000)
        } 
    }
    function newGame(){
        //use something else here for a new survivle game
        setIsNewGame(true)
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
    function addGuess(word){
        
        if(validateGuess(word)){
            setMoves([...moves, word])
        } else {
            setInvalidGuess(true)
        }
        setGuess('')
    }
    
    let rows = moves.length<6 ? moves.concat(guess) : moves;
    rows = rows.concat(Array(GUESS_LENGTH-rows.length).fill(''))

    return (
        <>
        <Header title={'Survivle'}/>
        
        <div className="mx-auto w-96 relative pt-100" style={{gridArea:'main', paddingTop:'100px'}}>
            <div className="flex">{
                milli>0 && !loading && !showInvalidGuess ? 
                <div
                className='absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-0 p-6 w-3/4 mx-auto text-black mb-100'>
                Time Left - {Math.floor((milli/60)/1000)%60}:{(Math.floor(milli/1000)%60).toString().padStart(2,'0')}
                &nbsp; | &nbsp;
                guessState: {guess}
                &nbsp; | &nbsp;
                movesState: {moves}
                </div> : ''
            }
            {
                showInvalidGuess ? 
                <div
                    className='absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-0 p-6 w-3/4 mx-auto text-black animate-bounce' >
                    invalid guess!
                </div> : ''
            }</div>
            {loading ? 
            <div
                className='absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-0 p-6 w-3/4 mx-auto text-black animate-bounce'>
                    Loading...
            </div> : ''}
            
            <main className='grid grid-rows-6 gap-4 ' >
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
                timeIsUp && (
                <div  className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-1/4 p-6 w-3/4 mx-auto text-black">
                    {'sometext here'}
                    <button onClick={newGame} className='block border rounded border-green-500 bg-green-500 p-2 mt-4 mx-auto shadow'>
                        New Game
                    </button>
                </div>)
            } 
        </div>
        </>
    )
}

function usePrevious (value){
    const ref = useRef();

    useEffect(()=>{
        ref.current = value;
    },[value])

    return ref.current;
}