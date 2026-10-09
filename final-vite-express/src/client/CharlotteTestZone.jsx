import { useState } from "react";

const API_LINK = import.meta.env.API_LINK

function CharlotteTestZone() {
    async function createLobby(event) {
        event.preventDefault()
        const name = document.querySelector("#username").value
        console.log(name)
        const response = await fetch(`${API_LINK}/lobby/create`, {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body : JSON.stringify({
                username: name,
            }),
        });
    }

    return(
        <form> 
                <input type='text' name='username' id='username'/>
                <button onClick={createLobby} id="submit">submit</button>
        </form>
    )
}

export default CharlotteTestZone