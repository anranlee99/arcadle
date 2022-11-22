import { getRandomWord } from "./game-utils/word-utils";
export default function WordRow({letters, letterLength}){
    const lettersRemaining = letterLength - letters.length;
    const charArr = letters.split('').concat(Array(lettersRemaining).fill('')) 
    console.log(getRandomWord())
    return (
        <div className="grid grid-cols-5 gap-4 my-2">
            {charArr.map((char, idx) => (
            <ChracterBox key={idx} char={char} />
            ))}
        </div>
    );
}


function ChracterBox({char}){
    return(
        <div className="inline-block border-2 border-gray-500 p-4 uppercase font-bold text-2xl text-c">
        {char}
    </div>
    );
    
}