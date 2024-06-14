import { computeGuess } from "../game-utils/word-utils";

export default function WordRow({letters, letterLength, answer, currentGuess}){

    const lettersRemaining = letterLength - letters.length;
    
    const charArr = letters.split('').concat(Array(lettersRemaining).fill('')) 
    let guessStates = computeGuess(letters, answer);
    if(currentGuess){
       guessStates = Array(letterLength).fill('')
    }
    // const guessStates = gameState.current.computeGuess();
    return (
        <div className={`grid grid-cols-${letterLength} gap-4`}>
            {charArr.map((char, idx) => (
            <ChracterBox key={idx} char={char} guessState={guessStates[idx]} />
            ))}
        </div>
    );
}

function ChracterBox({char, guessState}){
    return(
        <div className={`inline-block border-2 border-gray-500 p-4 uppercase font-extrabold text-2xl text-white text-c before:inline-block before:content-['_'] ${guessState}` }>
        {char}
        </div>
    );
    
}