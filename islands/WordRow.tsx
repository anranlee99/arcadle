import { computeGuess } from "../utils/word-utils.ts";
interface WordRowProps {
    letters: string;
    letterLength: number;
    answer: string;
    currentGuess: boolean;
}
export default function WordRow(prop: WordRowProps){
    const {letters, letterLength, answer, currentGuess} = prop;
    const lettersRemaining = letterLength - letters.length;
    
    const charArr = letters.split('').concat(Array(lettersRemaining).fill('')) 
    let guessStates = computeGuess(letters, answer);
    if(currentGuess){
       guessStates = Array(letterLength).fill('')
    }
    return (
        <div className={`grid grid-cols-${letterLength} gap-4`}>
            {charArr.map((char, idx) => (
            <ChracterBox key={idx} char={char} guessState={guessStates[idx]} />
            ))}
        </div>
    );
}
interface CharacterBoxProps {
    char: string;
    guessState: string;
}
function ChracterBox(prop: CharacterBoxProps){
    const {char, guessState} = prop;
    return(
        <div className={`inline-block border-2 border-gray-500 p-4 uppercase font-extrabold text-2xl text-white text-c before:inline-block before:content-['_'] ${guessState}` }>
        {char}
        </div>
    );
    
}