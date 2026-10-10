import { useState } from "react";
import styles from "./StatusLight.module.css"
import buttonSprite from "./assets/Dial.svg"
console.log(buttonSprite)

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
            <button><div style={{ backgroundColor: 'red', border: 'solid 4px rgb(172, 0, 0)' }} onClick={() => colorChosen('red')}></div></button>
            <button><div style={{ backgroundColor: 'lime', border: 'solid 4px rgb(0, 172, 0)' }} onClick={() => colorChosen('green')}></div></button>
            <button><div style={{ backgroundColor: 'blue', border: 'solid 4px rgb(0, 0, 172)' }} onClick={() => colorChosen('blue')}></div></button>
        </article>
    )

    function colorChosen(color) {
        setColor(color)
        fetch(`${import.meta.env.VITE_API_LINK}/analog/color`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color: color })
        })
    }
}