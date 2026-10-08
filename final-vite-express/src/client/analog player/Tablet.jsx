import { useEffect } from "react";
import tabletSprite from "./assets/Tablet.png"
import styles from "./Tablet.module.css"
import ButtonSprite from "./assets/Dial.png"
import Symbol1 from "./assets/Tablet Buttons/symbol1.svg"
import Symbol2 from "./assets/Tablet Buttons/symbol2.svg"
import Symbol3 from "./assets/Tablet Buttons/symbol3.svg"
import Symbol4 from "./assets/Tablet Buttons/symbol4.svg"
import Symbol5 from "./assets/Tablet Buttons/symbol5.svg"
import Symbol6 from "./assets/Tablet Buttons/symbol6.svg"
import Symbol7 from "./assets/Tablet Buttons/symbol7.svg"
import Symbol8 from "./assets/Tablet Buttons/symbol8.svg"
import Symbol9 from "./assets/Tablet Buttons/symbol9.svg"
import Symbol10 from "./assets/Tablet Buttons/symbol10.svg"
import Symbol11 from "./assets/Tablet Buttons/symbol11.svg"
import Symbol12 from "./assets/Tablet Buttons/symbol12.svg"
import Symbol13 from "./assets/Tablet Buttons/symbol13.svg"
import Symbol14 from "./assets/Tablet Buttons/symbol14.svg"
import Symbol15 from "./assets/Tablet Buttons/symbol15.svg"
import Symbol16 from "./assets/Tablet Buttons/symbol16.svg"
import Symbol17 from "./assets/Tablet Buttons/symbol17.svg"
import Symbol18 from "./assets/Tablet Buttons/symbol18.svg"
import Symbol19 from "./assets/Tablet Buttons/symbol19.svg"
import Symbol20 from "./assets/Tablet Buttons/symbol20.svg"

export default function StoneTablet() {

    return <article className={styles.stoneTablet} style={{ backgroundImage: `url(${tabletSprite})` }}>
        <div style={{ margin: '40px 50px', height: '550px', width: '330px' }}>
            <div className={styles.waveOrder} >
                <WaveCanvas waveType={'sawtooth'} />
                <WaveCanvas waveType={'simple_2hz'} />
                <WaveCanvas waveType={'double_w'} />
                <WaveCanvas waveType={'plateau'} />
            </div>
            <div style={{ height: '20px' }}></div>
            <div className={styles.allButtons}>
                <TabletButton src={Symbol1} />
                <TabletButton src={Symbol2} />
                <TabletButton src={Symbol3} />
                <TabletButton src={Symbol4} />
                <TabletButton src={Symbol5} />
                <TabletButton src={Symbol6} />
                <TabletButton src={Symbol7} />
                <TabletButton src={Symbol8} />
                <TabletButton src={Symbol9} />
                <TabletButton src={Symbol10} />
                <TabletButton src={Symbol11} />
                <TabletButton src={Symbol12} />
                <TabletButton src={Symbol13} />
                <TabletButton src={Symbol14} />
                <TabletButton src={Symbol15} />
                <TabletButton src={Symbol16} />
                <TabletButton src={Symbol17} />
                <TabletButton src={Symbol18} />
                <TabletButton src={Symbol19} />
                <TabletButton src={Symbol20} />
            </div>
        </div>
    </article >

    function TabletButton({ src }) {

        const style = {
            width: '75px',
            height: '75px'
        }

        // TODO: Make some example symbol images, create styling for buttons, give them onClick function
        return (
            <img className={styles.tabButton} src={src} ></img >
        )
    }

    function WaveCanvas({ waveType }) {
        const waveData = {
            flatline: { A: 0, a: 0, B: 0, b: 0, C: 0, c: 0 }, //flatline
            simple_1hz: { A: 1, a: 0, B: 0, b: 0, C: 0, c: 0 }, //1hz simple
            simple_2hz: { A: 0, a: 0, B: 1, b: 0, C: 0, c: 0 }, //2hz simple
            simple_3hz: { A: 0, a: 0, B: 0, b: 0, C: 1, c: 0 }, //3hz simple
            wobbly: { A: 1, a: 0, B: 1, b: -90, C: 0, c: 0 }, //wobbly
            plateau: { A: 2, a: -180, B: 0.5, b: 180, C: 0, c: 0 }, //plateau
            central_w: { A: 1, a: 0, B: 0, b: 0, C: 1, c: 180 }, //central-W
            valley_mountain: { A: 1, a: 90, B: 0, b: 0, C: 0.5, c: -90 }, //valley-mountain
            central_m: { A: 0, a: 0, B: 1, b: 0, C: 1, c: 0 }, //central-M 
            bird: { A: 0, a: 0, B: 1.5, b: 0, C: 0.5, c: -180 }, //bird 
            double_w: { A: 0.5, a: 0, B: 0.5, b: 0, C: 1, c: 0 }, //double-W 
            sawtooth: { A: 2, a: 90, B: 1, b: 90, C: 0.5, c: 90 }, //sawtooth 
        }

        function drawInfoWave(waveNumber) {
            const infoCanvas = document.getElementById(waveNumber)
            const infoCtx = infoCanvas.getContext("2d")

            const dotSize = 2
            const verticalDivs = 6
            const waveParams = waveData[waveNumber]

            //cover previous data
            infoCtx.fillStyle = "rgb(128 128 128)";
            infoCtx.fillRect(0, 0, infoCanvas.width, infoCanvas.height);

            //add enough dots to look like a smooth wave
            infoCtx.fillStyle = "#0de618";
            for (let varX = 0; varX < 2 * Math.PI; varX += 0.01) {

                let FofX = waveParams["A"] * Math.cos(1 * varX + waveParams["a"] * (Math.PI / 180)) //1st harmonic
                    + waveParams["B"] * Math.cos(2 * varX + waveParams["b"] * (Math.PI / 180)) //2nd harmonic
                    + waveParams["C"] * Math.cos(3 * varX + waveParams["c"] * (Math.PI / 180)) //3rd harmonic

                let dotX = (varX * infoCanvas.width / (2 * Math.PI)) - dotSize / 2
                let dotY = (-FofX * infoCanvas.height / verticalDivs) + infoCanvas.height / 2 - dotSize / 2
                infoCtx.fillRect(dotX, dotY, dotSize, dotSize);
            }
        }

        useEffect(() => { drawInfoWave(waveType) }, [])

        return (
            <canvas id={waveType} style={{ width: '65px', height: '65px' }} />
        )
    }
}

