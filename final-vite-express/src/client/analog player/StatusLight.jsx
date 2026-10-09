import { useState } from "react";
import styles from "./StatusLight.module.css"
import buttonSprite from "./assets/Dial.svg"
console.log(buttonSprite)

const API_LINK = import.meta.env.API_LINK

export default function StatusLightSwitch({ color, setColor }) {

    let ledStyle = (color === 'red') ? {
        backgroundColor: 'red',
        boxShadow: 'red 0px 0px 10px'
    } : (color === 'blue') ? {
        backgroundColor: 'blue',
        boxShadow: 'blue 0px 0px 10px'
    } : (color === 'green') ? {
        backgroundColor: 'lime',
        boxShadow: 'lime 0px 0px 10px'
    } : {
        backgroundColor: 'gray',
        boxShadow: 'none'
    }

    return (
        <article className={styles.statusLight}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <div className={styles.led} style={ledStyle}></div>
                <button className={styles.resetButton} onClick={() => colorChosen('none')}>Reset</button>
            </div>
            <button><img src={buttonSprite} onClick={() => colorChosen('red')} /></button>
            <button><img src={buttonSprite} onClick={() => colorChosen('green')} /></button>
            <button><img src={buttonSprite} onClick={() => colorChosen('blue')} /></button>
        </article>
    )

    function colorChosen(color) {
        setColor(color)
        fetch(`${API_LINK}/analog/color`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color: color })
        })
    }
}