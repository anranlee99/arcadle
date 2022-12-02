import sendRequest from "./send-request";

const BASE_URL = '/api/gameState';

export function getGameState(gameType, wordLength=5){
    if(wordLength===5){

        return sendRequest(`${BASE_URL}/current?gameType=${gameType}`, 'GET')
    } else {
        return sendRequest(`${BASE_URL}/current?gameType=${gameType}&wordLength=${wordLength}`, 'GET')
    }
}


export function saveSurvivle(gameIDs){
    return sendRequest(`${BASE_URL}/survivle/save`, 'POST', {gameRecord:gameIDs})
}

export function saveGame(gameType, gameOver, moves, victory){
    return sendRequest(`${BASE_URL}/saveGame`, 'POST', {gameType, gameOver, moves, victory})
}