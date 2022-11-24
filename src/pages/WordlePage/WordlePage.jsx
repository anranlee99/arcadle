import WordRow from "../../components/GamesComponents/WordRow/WordRow"
import { useState, useEffect } from "react"
import * as gameStateAPI from '../../utilities/gameState-api';
const GUESS_LENGTH = 6;

export default function WordlePage() {
    const [moves, setMoves] = useState([])
    const [guess, setGuess] = useState('')

    useEffect(function(){
        ( async function(){
            console.log('use effect running')
            const gameState = await gameStateAPI.getGameState()
            console.log(gameState)
        })();
    },[]);



    function addGuess(evt){
        evt.preventDefault();
        setMoves([...moves, guess])
        setGuess('')
        console.log(moves)
    }

    const rows = moves.concat(Array(GUESS_LENGTH-moves.length).fill(''))
    return (
        <div className="mx-auto w-96">
            <header className="border-b border-gray-500 pb-2 my-2">
                <h1 className="text-4xl text-center ">Wordle</h1>
            </header>
            <main className='grid grid-rows-6 gap-4 my-4'>
                {rows.map((row, idx)=>(<WordRow key={idx} letters={row} letterLength={5} />))}
                

            </main>
            <form onSubmit={addGuess} className=''>
                <input type="text" className=' p-2 bg-blue-500 border-2 border-gray-500' 
                value={guess} maxLength={5}
                onChange={e => setGuess(e.target.value)} />
            </form>
        </div>
    )
}

