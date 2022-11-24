const WordBank = require('./wordBank.json')

function getRandomWord() {
    const randomIndex = Math.floor(Math.random()*WordBank.length);
    return WordBank[randomIndex]
}


// const LetterState = {
//     Miss:'bg-[#333334]',
//     Present:'bg-[#A8953F]',
//     Match:'bg-[#568049]',
// }

// function computeGuess(guess, answer){
    
//     const result = [];
//     const guessArr = guess.split('');
//     const answerArr = answer.split('');
//     const answerLetterCount = {};

//     //naive match the matches, and get the count of each answer letter
//     for(let i=0; i<guess.length; i++){

//         answerLetterCount[answerArr[i]] = answerLetterCount[answerArr[i]] ? answerLetterCount[answerArr[i]] + 1 : 1;

//         if(guessArr[i]===answerArr[i]){
        
//             result.push(LetterState.Match);
//             answerLetterCount[guessArr[i]]--;

//         } else if (answerArr.includes(guessArr[i])){

//             result.push(LetterState.Present);

//         } else {

//             result.push(LetterState.Miss)

//         }
//     }

//     //if the answer is aabbc and you guess aaabc, the third a should be a miss and not present
//     result.forEach((current, i)=>{
//         if(current===LetterState.Present && answerLetterCount[guessArr[i]]){
//             answerLetterCount[guessArr[i]]--
//         } else if(current===LetterState.Present){
//             result[i] = LetterState.Miss
//         }
//     })
//     return result;
// }

module.exports = {
    getRandomWord,
    // LetterState,
    // computeGuess
}