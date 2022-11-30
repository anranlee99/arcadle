import { useEffect, useRef } from "react";

import * as LeaderboardAPI from "../../utilities/leaderboard-api"
export default function LeaderboardPage(){
    const allUsers = useRef({})
    const userComponents = useRef({});

    useEffect(function(){
        (async function(){
            allUsers.current = await LeaderboardAPI.getAll()
            console.log(allUsers.current)  
            userComponents.current = allUsers.current.map(user=>(
                <h3 key={user._id}>{user.name}</h3>
            ))  
        })();
    },[])
    
    return (
        <>
            <h1>This is the Leaderboard</h1>
            {userComponents.current}
            
        </>
    );
}