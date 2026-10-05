import { useState, useMemo } from "react";
import './WaveBox.css'
import { DialInput } from "./Dial";
import { LineChart, Line, YAxis, XAxis } from 'recharts'

export default function WaveBox() {
    const [aAmp, set_aAmp] = useState(1)
    const [aPhase, set_aPhase] = useState(0)

    function degToRad(deg) {
        return deg * (Math.PI / 180)
    }

    /**
     * 
     * @param {Number} x Point to plot in DEGREES
     * @returns 
     */
    const waveFunc = (x) => aAmp * Math.cos(degToRad(x) + degToRad(aPhase))

    let tempData = [
        { x: 0, y: 10 },
        { x: 2, y: 5 },
        { x: 4, y: 7 },
        { x: 6, y: 50 }
    ]

    function plotWave() {
        let points = []

        for (let x = 0; x <= 360; x += 10) {
            points.push({ x: x, y: waveFunc(x) })
        }

        return points
    }

    const chartData = plotWave()

    return (
        <article>
            <div style={{ background: 'black' }}>
                <LineChart data={chartData} style={{ width: "100%", height: "100%" }}>
                    <YAxis domain={[-2, 2]} />
                    {/* <XAxis domain={[0, 360]} /> */}
                    <Line animationBegin={false} type="monotone" dataKey='y' />
                </LineChart>
            </div>
            <div className="dial-container">
                <DialInput valueModifier={set_aAmp} minVal={-2} maxVal={2} />
                <DialInput valueModifier={set_aPhase} minVal={-180} maxVal={180} />
                <DialInput />
                <DialInput />
                <DialInput />
                <DialInput />
            </div>
            <button onClick={() => {
                console.log(waveFunc(0))
                console.log(wavefunc(90))
                console.log(waveFunc(180))
                console.log(waveFunc(360))
                console.log(waveFunc(76))
            }}>Test</button>
        </article>
    )
}