import { useState } from "react";
import { DialInput } from "./Dial";
import WaveBox from "./Wavebox";
import StatusLightSwitch from "./StatusLight";
import style from "./Analog.module.css"
import Printer from "./Printer";
import StoneTablet from "./Tablet";

export default function AnalogScreen() {
    return (
        <main className={style.mainArea}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: 'silver', border: 'outset 4px gray' }}>
                <WaveBox />
                <div style={{ display: "flex", flexDirection: "row", gap: "20px" }} >
                    <StatusLightSwitch />
                    <TransmitButton />
                </div>
            </div>
            <StoneTablet />
            <Printer />
        </main>
    )

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
        }

        return (
            <div style={{ width: '-moz-available', display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: 'space-around' }} >
                <div style={lightStyle}></div>
                <p style={{ color: 'black' }}>TRANSMIT</p>
                <button className={style.transmitButton} onClick={() => { transmitWave() }}>
                </button>
            </div>

        )
    }
}

