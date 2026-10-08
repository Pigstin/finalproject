import { useEffect, useState } from "react";

export default function GuestLobby() {
    const [myUsername, setMyUsername] = useState('')
    const [myRole, setMyRole] = useState('host')
    const [joinCode, setJoinCode] = useState('1234')
    const [hostUsername, setHostUsername] = useState('GUEST')
    const [hostRole, setHostRole] = useState('none')
    let timer;
    const refreshMsec = 3000

    // Called every few seconds to fetch data from the server/database

    useEffect(() => { refresh() }, [])

    async function refresh() {
        clearTimeout(timer)
        console.log('Refreshing')

        const response = await (await fetch('/lobby/refresh')).json()
        console.log(response)
        setHostRole(response.other_role)
        setHostUsername(response.other_user)

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
                <button>Start</button>
            </main>
        )
    }
    else if (hostRole === 'digital') {
        return (
            <main>
                <h1>You will play as the analog character!</h1>
                <button>Start</button>
            </main>
        )
    }
    // TODO: Handle if the other role is 'analog' or 'digital'
}