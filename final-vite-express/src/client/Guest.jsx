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

        const response = await (await fetch('/refresh')).json()
        console.log(response)
        setHostRole(response.other_role)

        timer = setTimeout(() => { refresh() }, refreshMsec)
    }

    return (
        <main>
            <h1>Waiting for Host</h1>
        </main>
    )
}