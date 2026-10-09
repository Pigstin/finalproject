import { useState, useEffect } from "react";
import { useNavigate } from "react-router"

const API_LINK = import.meta.env.API_LINK

export default function SetupPage() {
    const [myRole, setMyRole] = useState('none')
    const [myUsername, setMyUsername] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Lost In Transmission"
    }, [])

    function FirstPage() {
        return (
            <div hidden={myRole !== 'none'}>
                <h1>Lost In Transmission</h1>
                <button onClick={() => setMyRole('AlmostHost')}>Host Game</button>
                <button onClick={() => setMyRole('AlmostGuest')}>Join Game</button>
            </div>
        )
    }

    function HostUsernameEntry() {

        async function hostSubmit(event) {
            event.preventDefault()
            const name = document.querySelector("#huser").value
            console.log(name)
            const response = await fetch(`${API_LINK}/lobby/create`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: name,
                }),
            })
            navigate("/host")
        }

        return (
            <div hidden={myRole !== 'AlmostHost'} >
                <header>
                    <nav>
                        <button onClick={() => setMyRole('none')}>Back</button>
                    </nav>
                </header>
                <form id="host_form">
                    <output>Enter Username</output>
                    <input name="username" id="huser" type="text"></input>
                    <br></br>
                    <button onClick={hostSubmit} id="submit" >Start Game!</button>
                </form>
            </div>
        )
    }

    function GuestUsernameEntry() {
        async function guestSubmit(event) {
            event.preventDefault()
            const name = await document.querySelector("#guser").value,
                code = await document.querySelector("#gcode").value
            fetch(`${API_LINK}/lobby/join`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: name,
                    join_code: code
                }),
            })
            setMyUsername(name)
            navigate("/guest")
        }

        return (
            <div hidden={myRole !== 'AlmostGuest'} >
                <header>
                    <nav>
                        <button onClick={() => setMyRole('none')}>Back</button>
                    </nav>
                </header>
                <form method="post">
                    <output>Username</output>
                    <input name="username" id="guser" type="text"></input>
                    <br></br>
                    <output>Join Code</output>
                    <input name="join_code" id="gcode" type="text"></input>
                    <br></br>
                    <button onClick={guestSubmit} type="submit" >Start Game!</button>
                </form>
            </div>
        )
    }

    return (
        <main>
            <p>{myUsername}</p>
            <FirstPage />
            <HostUsernameEntry />
            <GuestUsernameEntry />
        </main>
    )
}