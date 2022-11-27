import { computeGuess } from "../game-utils/word-utils";

export default function WordRow({letters, letterLength, answer, currentGuess}){
    console.log({letters})
    const lettersRemaining = letterLength - letters.length;
    console.log(currentGuess)
    const charArr = letters.split('').concat(Array(lettersRemaining).fill('')) 
    let guessStates = computeGuess(letters, answer);
    // if(currentGuess){
    //    guessStates = ''
    // }
    // const guessStates = gameState.current.computeGuess();
    return (
        <div className="grid grid-cols-5 gap-4">
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