import { useState } from "react";
import { redirect } from "react-router"

export default function SetupPage() {
    const [myRole, setMyRole] = useState('none')
    const [myUsername, setMyUsername] = useState('')

    function FirstPage() {
        return (
            <div hidden={myRole !== 'none'}>
                <h1>Frequency Freak</h1>
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
            const response = await fetch('lobby/create', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify({
                    username: name,
                }),
            })
            // this does not work
            return redirect("/host")
        }

        return (
            <div hidden={myRole !== 'AlmostHost'} >
                <header>
                    <nav>
                        <button onClick={() => setMyRole('none')}>Back</button>
                    </nav>
                </header>
                <form id="host_form">
                    <input name="username" id="huser" type="text"></input>
                    <output>Enter Username</output>
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
            fetch('lobby/join', {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify({
                    username: name,
                    join_code: code
                }),
            })
            setMyUsername(name)
        }

        return (
            <div hidden={myRole !== 'AlmostGuest'} >
                <header>
                    <nav>
                        <button onClick={() => setMyRole('none')}>Back</button>
                    </nav>
                </header>
                <form method="post">
                    <input name="username" id="guser" type="text"></input>
                    <output>Username</output>

                    <input name="join_code" id="gcode" type="text"></input>
                    <output>Join Code</output>

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