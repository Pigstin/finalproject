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
                <button className={styles.resetButton} onClick={() => setColor('none')}>Reset</button>
            </div>
            <button><img src={buttonSprite} onClick={() => setColor('red')} /></button>
            <button><img src={buttonSprite} onClick={() => setColor('green')} /></button>
            <button><img src={buttonSprite} onClick={() => setColor('blue')} /></button>
        </article>
    )
}