import { useState } from "react";

export default function Printer() {
    const [messages, setMessages] = useState([{ key: 0, msg: 'woaow' }, { key: 1, msg: 'holy moly' }])
    const [key, setKey] = useState(0)

    const listItems = messages.map((message) => {
        let bruh = <li key={message.key}>{message.msg}</li>
        return bruh
    }
    )

    return (
        <article style={{ color: 'black', backgroundColor: 'beige', height: "650px", width: '440px' }}>
            <ul style={{ textWrap: 'wrap', height: "100%", verticalAlign: "bottom" }}>
                {listItems.reverse()}
            </ul>
        </article>
    )
}