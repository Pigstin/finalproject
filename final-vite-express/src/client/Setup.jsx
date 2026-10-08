import styles from "./index.module.css"
import { useState } from "react";

export default function SetupPage() {
    const [myRole, setMyRole] = useState('none')
    const [myUsername, setMyUsername] = useState('')

    function FirstPage() {
        return (
            <div className={styles.setupMenus} hidden={myRole !== 'none'}>
                <h1>Frequency Freak</h1>
                <button onClick={() => setMyRole('AlmostHost')}>Host Game</button>
                <button onClick={() => setMyRole('AlmostGuest')}>Join Game</button>
            </div>
        )
    }

    function HostUsernameEntry() {

        // This probably won't get used
        async function createGame(event) {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            console.log(formData.get('username'))
            setMyUsername(formData.get('username'))
            //TODO : Call the server to create a game document
            //Assuming Creating game is successful
        }

        return (
            <div hidden={myRole !== 'AlmostHost'} >
                <header>
                    <nav>
                        <button onClick={() => setMyRole('none')}>Back</button>
                    </nav>
                </header>
                <form action={'lobby/create'} method="post">
                    <input name="username" type="text"></input>
                    <output>Enter Username</output>
                    <button type="submit" >Start Game!</button>
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