import { useState, useEffect } from "react";
import WaveBox from "./Wavebox";
import StatusLightSwitch from "./StatusLight";
import style from "./Analog.module.css"
import Printer from "./Printer";
import StoneTablet from "./Tablet";
import winmage from "./assets/AquaAeroWinScreen.png"


export default function AnalogScreen() {
    const [aAmp, set_aAmp] = useState(1)
    const [aPhase, set_aPhase] = useState(0)
    const [bAmp, set_bAmp] = useState(0)
    const [bPhase, set_bPhase] = useState(0)
    const [cAmp, set_cAmp] = useState(0)
    const [cPhase, set_cPhase] = useState(0)

    const [color, setColor] = useState('none')

    const [messages, setMessages] = useState([{ key: 0, msg: " " }])
    const [message, setMessage] = useState("")
    const [mesKey, setMesKey] = useState(0)

    const [won, setWon] = useState(false)

    let refreshTimer;
    const refreshMsec = 3000;
    async function refresh() {
        clearTimeout(refreshTimer)
        const data = await (await fetch(`/api/analog/refresh`, { method: 'GET' })).json()
        console.log(data)

        setMesKey(mesKey + 1)
        setMessage(data.terminal)
        setWon(data.won)

        refreshTimer = setTimeout(() => { refresh() }, refreshMsec)
    }

    useEffect(() => {
        document.title = "Solve the Puzzle - Lost In Transmission"
        refresh()
    }, [])


    if (!won)
        return (
            <main className={style.mainArea}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: 'silver', border: 'outset 4px gray' }}>
                    <WaveBox aAmp={aAmp} bAmp={bAmp} cAmp={cAmp} set_aAmp={set_aAmp} set_bAmp={set_bAmp} set_cAmp={set_cAmp}
                        aPhase={aPhase} bPhase={bPhase} cPhase={cPhase} set_aPhase={set_aPhase} set_bPhase={set_bPhase} set_cPhase={set_cPhase} />
                    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }} >
                        <StatusLightSwitch color={color} setColor={setColor} />
                        <TransmitButton />
                    </div>
                </div>
                <StoneTablet />
                <Printer message={message} />
            </main>
        )
    else return (
        <img src={winmage}></img>
    )

    // Printer will only display latest message because it just will not work otherwise
    function newMessageReceived(latestMessage) {
        // Super janky, but check if the latest message is different from the last message in the array
        if (latestMessage !== messages.at(messages.length - 1).msg) {
            let tempMessages = messages
            tempMessages.push({ key: mesKey, msg: latestMessage })
            setMessages(tempMessages)
            setMesKey(mesKey + 1)
        }
    }

    function TransmitButton() {
        const lightOffStyle = {
            width: '30px',
            height: '30px',
            background: "rgb(145, 145, 145)",
            border: "solid 4px rgb(107, 107, 107)",
            borderRadius: "100%"
        }
        const lightOnStyle = {
            width: '30px',
            height: '30px',
            background: "rgb(255, 250, 205)",
            border: "solid 4px rgb(107, 107, 107)",
            borderRadius: "100%",
            boxShadow: "0px 0px 10px rgb(255, 250, 205)"
        }
        const [lightStyle, setLightStyle] = useState(lightOffStyle)

        function transmitWave() {
            console.log('huh?')
            setLightStyle(lightOnStyle)

            setTimeout(() => { setLightStyle(lightOffStyle) }, 3000)

            //Send over all the needed data
            let data = {
                values: { A: aAmp, a: aPhase, B: bAmp, b: bPhase, C: cAmp, c: cPhase }
            }

            fetch(`/api/analog/dials`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
        }

        return (
            <div style={{ width: '-moz-available', display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: 'space-around' }} >
                <button className={style.transmitButton} onClick={() => { transmitWave() }}></button>
                <p style={{ color: 'black' }}>TRANSMIT</p>
                <div style={lightStyle}></div>
            </div>

        )
    }
}

