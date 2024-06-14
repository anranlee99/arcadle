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
            
            users.forEach(async function(user){
               const p = await UsersAPI.getProfile(user._id)
               user.score = p.score
            //    console.log(p.score, user)
            })
            users.sort(function(a,b){
                return b.score-a.score
            })
            const userProfile = await UsersAPI.getProfile()
            setProfile(userProfile)
            setUserComponents(users)
            setLoading(false)
        })();
    },[])
    const userCards = userComponents.map((user,idx)=>(
                <tr key={idx}>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-white">
                        {idx+1}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                        {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                        {user.score}
                    </td>
                </tr>
            ))
    return (
        <>
            <Header title={'Leaderboard'}/>
            <div className="main"  style={{gridArea:'main'}}>
                <div className="flex flex-col ">
                    <div className="overflow-x-auto">
                        <div className="p-1.5 w-full inline-block align-middle">
                            <div className="overflow-hidden border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-none">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-bold text-center text-white uppercase "
                                            >
                                                #
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-bold text-center text-white uppercase "
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-bold text-center text-white uppercase "
                                            >
                                                Score
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {loading && userComponents.length ? 'Loading...' : userCards}  
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                <div className="flex justify-center"> 
                    <svg className='mx-2' fill='white'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 14.083c0-2.145-2.232-2.742-3.943-3.546-1.039-.54-.908-1.829.581-1.916.826-.05 1.675.195 2.443.465l.362-1.647c-.907-.276-1.719-.402-2.443-.421v-1.018h-1v1.067c-1.945.267-2.984 1.487-2.984 2.85 0 2.438 2.847 2.81 3.778 3.243 1.27.568 1.035 1.75-.114 2.011-.997.226-2.269-.168-3.225-.54l-.455 1.644c.894.462 1.965.708 3 .727v.998h1v-1.053c1.657-.232 3.002-1.146 3-2.864z"/></svg>
                     x{profile.currency}&nbsp; | &nbsp;
                    Your score: {profile.score} </div>
                    
                    
                </div>
            </div>
        </>
    );
}
