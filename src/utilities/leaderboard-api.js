import sendRequest from "./send-request";

const BASE_URL = '/api/leaderboard';

export function getAll(){
    return sendRequest(`${BASE_URL}/`)
}