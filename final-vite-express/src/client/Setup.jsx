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

        const hostForm = document.querySelector("#host_form")

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

        async function guestSubmit(event) {
            event.preventDefault()
            const name = await document.querySelector("#guest_username").value
            console.log(name)
            fetch('lobby/join', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify({
                    username: name,
                }),
            })
            setMyUsername(name)
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
        return (
            <div hidden={myRole !== 'AlmostGuest'} >
                <header>
                    <nav>
                        <button onClick={() => setMyRole('none')}>Back</button>
                    </nav>
                </header>
                <form action={'lobby/join'} method="post">
                    <input name="username" type="text"></input>
                    <output>Username</output>

                    <input name="join_code" type="text"></input>
                    <output>Join Code</output>

                    <button type="submit" >Start Game!</button>
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