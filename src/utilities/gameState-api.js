import sendRequest from "./send-request";

const BASE_URL = '/api/gameState';

export function getGameState(){
    return sendRequest(`${BASE_URL}/current`)
}

export function addGuess(guess){
    if(guess){
        console.log('in add guess api', {guess})
        return sendRequest(`${BASE_URL}/addGuess/${guess}`, 'POST')
    }
    else {
        console.log('no guess')
    }
}

export function newGame(){
    return sendRequest(`${BASE_URL}/new`, 'POST')
}