import { useEffect, useState } from "react";
import { useNavigate } from "react-router"

export default function HostLobby() {
    const [myUsername, setMyUsername] = useState('')
    const [myRole, setMyRole] = useState('host')
    const [joinCode, setJoinCode] = useState('1234')
    const [GuestUsername, setGuestUsername] = useState('GUEST')
    const [guestRole, setGuestRole] = useState('none')
    const navigate = useNavigate()
    let timer;
    const refreshMsec = 3000

    // Called every few seconds to fetch data from the server/database

    useEffect(() => { refresh() }, [])

    async function refresh() {
        clearTimeout(timer)
        // console.log('Refreshing')

        const response = await fetch(`lobby/refresh`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        })
        const json = await response.json()
        console.log(json)
        setMyRole(json.host_role)
        setMyUsername(json.host_name)
        setGuestRole(json.guest_role)
        setGuestUsername(json.guest_name)
        setJoinCode(json.join_code)

        timer = setTimeout(() => { refresh() }, refreshMsec)
    }

    if (guestRole === 'none') {
        return (
            <main>
                <h1>Join Code: {joinCode}</h1>
                <h2>Waiting for Guest to join</h2>
            </main>
        )
    }
    else if (guestRole === 'waiting' && myRole === 'host') {
        return (
            <main>
                <h1>{GuestUsername} Joined!</h1>
                <h2>Select your player role. {GuestUsername} will be assigned the other role.</h2>
                <button onClick={() => { decideRole('analog') }}>Analog</button>
                <button onClick={() => { decideRole('digital') }}>Digital</button>
            </main>
        )
    }
    else if (myRole === 'analog') {
        return (
            <main>
                <h1>You will play as the analog character!</h1>
                <button onClick={startGame}>Start</button>
            </main>
        )
    }
    else if (myRole === 'digital') {
        return (
            <main>
                <h1>You will play as the digital character!</h1>
                <button>Start</button>
            </main>
        )
    }
    async function startGame() {
        const response = await fetch("/lobby/start", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        // navigate to analog/digital depending on my role
        console.log(`attempting to navigate to /${myRole}`)
        navigate(`/${myRole}`)
    }

    async function decideRole(chosen_role) {
        const body = JSON.stringify({ "chosen_role": chosen_role })
        const response = await fetch("/lobby/assign", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body
        })

        if (response.ok)
            console.log('ready to start')
        setMyRole(chosen_role)
    }


}