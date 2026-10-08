import { useState } from "react";
import { DialInput } from "./Dial";
import WaveBox from "./Wavebox";
import StatusLightSwitch from "./StatusLight";
import style from "./Analog.module.css"
import Printer from "./Printer";

export default function AnalogScreen() {
    return (
        <main className={style.mainArea}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <WaveBox />
                <StatusLightSwitch />
            </div>

            <article style={{ backgroundColor: 'beige', height: "650px", width: '440px' }}>
            </article>
            <Printer />
        </main>
    )
}