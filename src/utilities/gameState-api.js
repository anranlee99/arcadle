import sendRequest from "./send-request";

const BASE_URL = '/api/gameState';

export function getGameState(){
    return sendRequest(`${BASE_URL}/current`)
}


export function saveGame(gameOver, moves, victory){
    return sendRequest(`${BASE_URL}/saveGame`, 'POST', {gameOver, moves, victory})
}