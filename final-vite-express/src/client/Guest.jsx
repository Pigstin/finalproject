import { useEffect, useState } from "react";
import { useNavigate } from "react-router"


export default function GuestLobby() {
    const [myUsername, setMyUsername] = useState('')
    const [myRole, setMyRole] = useState('host')
    const [joinCode, setJoinCode] = useState('1234')
    const [hostUsername, setHostUsername] = useState('GUEST')
    const [hostRole, setHostRole] = useState('none')
    const navigate = useNavigate()
    let timer;
    const refreshMsec = 3000

    // Called every few seconds to fetch data from the server/database

    useEffect(() => {
        refresh()
        document.title = "Waiting for Host - Lost In Transmission"
    }, [])

    async function refresh() {
        clearTimeout(timer)
        console.log('Refreshing')

        const response = await fetch(`/api/lobby/refresh`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
        const json = await response.json()
        console.log(json)
        setMyRole(json.guest_role)
        setMyUsername(json.guest_name)
        setHostRole(json.host_role)
        setHostUsername(json.host_name)
        setJoinCode(json.join_code)

        timer = setTimeout(() => { refresh() }, refreshMsec)
    }

    if (hostRole === 'host') {
        return (
            <main>
                <h1>Waiting for {hostUsername} to decide roles.</h1>
            </main>
        )
    }
    else if (hostRole === 'analog') {
        return (
            <main>
                <h1>You will play as the digital character!</h1>
                <p>
                    Lost In Transmission is a multiplayer game about communicating information. For the best experience, please don't communicate with your partner directly during the game, through text or otherwise. The game will provide you with means to communicate.
                </p>
                <button onClick={startGame}>Start</button>
            </main>
        )
    }
    else if (hostRole === 'digital') {
        return (
            <main>
                <h1>You will play as the analog character!</h1>
                <p>
                    Lost In Transmission is a multiplayer game about communicating information. For the best experience, please don't communicate with your partner directly during the game, through text or otherwise. The game will provide you with means to communicate.
                </p>
                <button onClick={startGame}>Start</button>
            </main>
        )
    }

    async function startGame() {
        const response = await fetch(`/api/lobby/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        // navigate to analog/digital depending on my role
        console.log(`attempting to navigate to /${myRole}`)
        navigate(`/${myRole}`)
    }
}