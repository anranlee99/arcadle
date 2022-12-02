const fs = require('fs');

// Returns the path to the word list which is separated by `\n`
const wordListPath = require('word-list');

const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
const words = wordArray.filter(word => word.length === i);
//=> […, 'abmhos', 'abnegate', …]
// console.log(wordArray.length)
for(let i = 6; i<30; i++){
    
    
    console.log(`length${i}: `, fives.length)

}