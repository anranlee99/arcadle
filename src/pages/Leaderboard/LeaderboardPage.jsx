import { useState, useEffect, useRef } from "react";

import * as LeaderboardAPI from "../../utilities/leaderboard-api"
import Header from "../../components/Header/Header"
export default function LeaderboardPage(){
    const [userComponents, setUserComponents] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(function(){
        (async function(){
            const users = await LeaderboardAPI.getAll()
            const userCards = users.map(user=>(
                <h3 key={user._id}>{user.name}</h3>
            ))
            setUserComponents(userCards)
            setLoading(false)
        })();
    },[])
    
    return (
        <>
            <Header title={'Leaderboard'}/>
            <div className="main"  style={{gridArea:'main'}}>
                {loading && userComponents.length ? 'Loading...' : userComponents}    

            </div>
        </>
    );
}