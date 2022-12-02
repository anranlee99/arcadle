import { useState, useEffect, useRef } from "react";

import * as LeaderboardAPI from "../../utilities/leaderboard-api"
import * as UsersAPI from "../../utilities/users-api"
import Header from "../../components/Header/Header"

export default function LeaderboardPage(){
    const [userComponents, setUserComponents] = useState([])
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState({})
    useEffect(function(){
        (async function(){
            const users = await LeaderboardAPI.getAll()
            const userCards = users.map(user=>(
                <h3 key={user._id}>{user.name}</h3>
            ))
            const userProfile = await UsersAPI.getProfile()
            setProfile(userProfile)
            setUserComponents(userCards)
            setLoading(false)
        })();
    },[])
    
    return (
        <>
            <Header title={'Leaderboard'}/>
            <div className="main"  style={{gridArea:'main'}}>
                {loading && userComponents.length ? 'Loading...' : userComponents}    
                <div>
                    Your currency: {profile.currency} 
                    &nbsp; | &nbsp;
                    Your score: {profile.score} 
                </div>
            </div>
        </>
    );
}
