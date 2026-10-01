import { useEffect, useState } from "react";

export default function HostLobby() {
    const [myUsername, setMyUsername] = useState('')
    const [myRole, setMyRole] = useState('host')
    const [joinCode, setJoinCode] = useState('1234')
    const [GuestUsername, setGuestUsername] = useState('GUEST')
    const [guestRole, setGuestRole] = useState('none')
    let timer;
    const refreshMsec = 3000

    // Called every few seconds to fetch data from the server/database

    useEffect(() => { refresh() }, [])

    async function refresh() {
        clearTimeout(timer)
        console.log('Refreshing')

        const response = await (await fetch('/refresh')).json()
        console.log(response)
        setGuestRole(response.other_role)

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
    else if (guestRole === 'waiting') {
        return (
            <main>
                <h1>{GuestUsername} Joined!</h1>
                <h2>Select your player role. {GuestUsername} will be assigned the other role.</h2>
                <button>Analog</button>
                <button>Digital</button>
            </main>
        )
    }
}