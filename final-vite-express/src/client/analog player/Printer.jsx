import { useState } from "react";
import printerSprite from "./assets/Printer.png"
console.log(printerSprite)

export default function Printer({ message }) {
    // const [messages, setMessages] = useState(["Oh", "no", "bro"])
    // const [key, setKey] = useState(0)

    // const listItems = messages.map((message) => {
    //     let bruh = <li key={1}>{message.msg}</li>
    //     return bruh
    // }
    // )

    return (
        <article style={{ backgroundImage: `url(${printerSprite})`, backgroundSize: 'cover', width: '340px', height: '650px' }}>
            <ul style={{ margin: "85px 20px", textAlign: 'left', textWrap: 'wrap', height: "73%", color: 'black', borderLeft: "dotted black 10px", borderRight: "dotted black 10px", overflow: "scroll", fontFamily: "consolas, monospace" }}>
                {message}
            </ul>
        </article>
    )
}