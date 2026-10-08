import { useState } from "react";
import printerSprite from "./assets/Printer.png"
console.log(printerSprite)

export default function Printer() {
    const [messages, setMessages] = useState([{ key: 0, msg: 'woaow' }, { key: 1, msg: 'holy moly' }, { key: 1, msg: 'holy moly' }, { key: 1, msg: 'holy moly' }, { key: 1, msg: 'holy moly' }, { key: 1, msg: 'holy moly' }, { key: 1, msg: 'holy moly' }, { key: 1, msg: 'holy moly' }, { key: 2, msg: 'BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH BRUH ' }])
    const [key, setKey] = useState(0)

    const listItems = messages.map((message) => {
        let bruh = <li key={message.key}>{message.msg}</li>
        return bruh
    }
    )

    return (
        <article style={{ backgroundImage: `url(${printerSprite})`, backgroundSize: 'cover', width: '340px', height: '650px' }}>
            <ul style={{ margin: "85px 20px", textWrap: 'wrap', height: "73%", color: 'black', borderLeft: "dotted black 10px", borderRight: "dotted black 10px", overflow: "scroll", fontFamily: "consolas, monospace" }}>
                {listItems.reverse()}
            </ul>
        </article>
    )
}