import { useState, useEffect, useRef } from "react"

import { validateGuess } from "../../components/GamesComponents/game-utils/word-utils";
import * as gameStateAPI from '../../utilities/gameState-api';
import * as usersAPI from '../../utilities/users-api';

import WordRow from "../../components/GamesComponents/WordRow/WordRow"
import Keyboard from "../../components/GamesComponents/Keyboard/Keyboard"

import Header from '../../components/Header/Header'

const GUESS_LENGTH = 6;
const GAMETYPE = 'Survivle'
export default function SurvivlePage() {
    
    const [moves, setMoves] = useState([])
    const [wins, setWins] = useState(0)
    const [gameCt, setGameCt] = useState(0)
    const [guess, setGuess, addGuessLetter] = useGuess()
    const [answer, setAnswer] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [victory, setVictory] = useState(false)
    const [showInvalidGuess, setInvalidGuess] = useState(false);
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [savingSurvivle, setSavingSurvivle] = useState(false)
    const [isNewGame, setIsNewGame] = useState(true)
    const [gameIDs, setGameIDs] = useState([])
    const [restarting, setRestarting] = useState(false)
    const [milli, setMilli] = useState(300000);
    const [isActive, setIsActive] = useState(false);
    const [timeIsUp, setTimeIsUp] = useState(false);
    const [coins, setCoins] = useState(0)
    const [paid, setPaid] = useState(false)

    useEffect(function(){

        (async function(){
                if(!timeIsUp){

                    const profile = await usersAPI.getProfile();
                    setCoins(profile.currency) 
                    const gameState = await gameStateAPI.getGameState(GAMETYPE); 
                    setMoves(gameState.record.guesses)
                    setAnswer(gameState.record.answer)
                    setGameOver(gameState.gameOver)
                    setVictory(gameState.victory)
                    if(isNewGame){
                        setGuess('')
                        setGameCt(gameCt + 1)
                        setGameIDs([...gameIDs,gameState._id])
                    }
                }

                setLoading(false)
                if(paid){
                    setIsActive(true)
                }
        })();
    },[isNewGame, paid])
    
    useEffect(function(){
        (async function(){
            if(!loading){
                if(gameOver){
                    await gameStateAPI.saveGame(GAMETYPE,gameOver,moves,victory)
                    setIsNewGame(true)
                } else {
                    setIsNewGame(false)
                }
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
            setMilli(milli - 1000);
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
        if(moves.length){
            checkEndGame()
        }
    },[moves,guess])

    function checkEndGame(){
        if(moves.length === 6 || timeIsUp){
            setMilli(milli - 10000)
            setGameOver(true)   
        } else if(moves[moves.length-1]=== answer){
            setMilli(milli + 30000)
            setWins(wins + 1)
            setGameOver(true)
            setVictory(true)
        }
    }

    useEffect(function(){
        (async function (){
            if(timeIsUp){
                setSavingSurvivle(true)
                checkEndGame();
                await gameStateAPI.saveSurvivle(gameIDs)
                if(wins){
                    const profile = await usersAPI.getProfile()
                    await usersAPI.updateProfile(profile.score + Math.floor((wins/gameCt)*(wins*300)), profile.currency - 1)
                }
                setSavingSurvivle(false)
            }
        })();
    },[timeIsUp])
    function payCoin(){
        setPaid(true)
        setIsActive(true)
    }
    function newGame(){
        setGameIDs([])
        setWins(0)
        setGameCt(0)
        setMilli(300000)
        setTimeIsUp(false)
        setPaid(false)
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
            <div className="flex">
                {
                    milli>0 && !loading && !showInvalidGuess ? 
                    <div
                    className='absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-0 p-6 w-3/4 mx-auto text-black mb-100'>
                    Time Left - {Math.floor((milli/60)/1000)%60}:{(Math.floor(milli/1000)%60).toString().padStart(2,'0')}
                    </div> : ''
                }
                {
                    showInvalidGuess ? 
                    <div
                        className='absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-0 p-6 w-3/4 mx-auto text-black animate-bounce' >
                        invalid guess!
                    </div> : ''
                }
            </div>
            {
                (!paid && coins) ?  (
                <div  className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-1/4 p-6 w-3/4 mx-auto text-black">
                    <div className="flex justify-center">Insert 
                    <svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 14.083c0-2.145-2.232-2.742-3.943-3.546-1.039-.54-.908-1.829.581-1.916.826-.05 1.675.195 2.443.465l.362-1.647c-.907-.276-1.719-.402-2.443-.421v-1.018h-1v1.067c-1.945.267-2.984 1.487-2.984 2.85 0 2.438 2.847 2.81 3.778 3.243 1.27.568 1.035 1.75-.114 2.011-.997.226-2.269-.168-3.225-.54l-.455 1.644c.894.462 1.965.708 3 .727v.998h1v-1.053c1.657-.232 3.002-1.146 3-2.864z"/></svg>
                     to Play</div>
                    <button onClick={payCoin} className='block border rounded border-green-500 bg-green-500 p-2 mt-4 mx-auto shadow'>
                        Insert Coin
                    </button>
                </div>) : '' 
            } 
            {
                (!paid && !coins) ?  (
                <div  className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-1/4 p-6 w-3/4 mx-auto text-black">
                    <div className="flex justify-center">You don't have any  
                    <svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 14.083c0-2.145-2.232-2.742-3.943-3.546-1.039-.54-.908-1.829.581-1.916.826-.05 1.675.195 2.443.465l.362-1.647c-.907-.276-1.719-.402-2.443-.421v-1.018h-1v1.067c-1.945.267-2.984 1.487-2.984 2.85 0 2.438 2.847 2.81 3.778 3.243 1.27.568 1.035 1.75-.114 2.011-.997.226-2.269-.168-3.225-.54l-.455 1.644c.894.462 1.965.708 3 .727v.998h1v-1.053c1.657-.232 3.002-1.146 3-2.864z"/></svg>
                    Go play some wordle!</div>
                    coin_svg. 
                </div>) : '' 
            } 
            {loading || savingSurvivle? 
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
                (timeIsUp && !savingSurvivle) ?  (
                <div  className="absolute bg-white rounded border border-gray-500 text-center left-0 right-0 top-1/4 p-6 w-3/4 mx-auto text-black">
                    {
                        wins ? 
                        <div>
                            You won {wins}/{gameCt} games!<br/>
                            Netting you {Math.floor((wins/gameCt)*(wins*300))} points!
                            The last answer was: {answer}
                        </div>
                        : "Hmm seems like you didn't reall play. That one's on the house."
                    }
                    <button onClick={newGame} className='block border rounded border-green-500 bg-green-500 p-2 mt-4 mx-auto shadow'>
                        New Game
                    </button>
                </div>) : '' 
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