import { useState, useMemo } from "react";
import './WaveBox.css'
import { DialInput } from "./Dial";
import { LineChart, Line, YAxis, XAxis, Tooltip } from 'recharts'

export default function WaveBox() {
    const [aAmp, set_aAmp] = useState(1)
    const [aPhase, set_aPhase] = useState(0)
    const [bAmp, set_bAmp] = useState(0)
    const [bPhase, set_bPhase] = useState(0)
    const [cAmp, set_cAmp] = useState(0)
    const [cPhase, set_cPhase] = useState(0)

    function degToRad(deg) {
        return deg * (Math.PI / 180)
    }

    /**
     * 
     * @param {Number} x Point to plot in DEGREES
     * @returns 
     */
    const waveFunc = (x) => (aAmp * Math.cos(degToRad(x) + degToRad(aPhase))) + +
        (bAmp * Math.cos(degToRad(2 * x) + degToRad(bPhase))) +
        (cAmp * Math.cos(degToRad(3 * x) + degToRad(cPhase)))

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

    const waveBoxStyle = {
        background: 'black',
        width: "100%",
        height: "100%",
        border: "4px inset gray",
        boxSizing: "border-box"
    }

    return (
        <article className="wavebox">
            <div style={waveBoxStyle}>
                <LineChart data={chartData} style={{ width: "100%", height: "100%" }}>
                    <YAxis domain={[-2, 2]} hide />
                    <Line dot={false} stroke="#104ef8" strokeWidth={3} isAnimationActive={false} animationBegin={false} type="monotone" dataKey='y' />
                </LineChart>
            </div>
            <div className="dial-container">
                <DialInput initVal={1} minVal={0} maxVal={2} valueModifier={set_aAmp} />
                <DialInput initVal={0} minVal={-180} maxVal={180} valueModifier={set_aPhase} />
                <DialInput initVal={0} minVal={0} maxVal={2} valueModifier={set_bAmp} />
                <DialInput initVal={0} minVal={-180} maxVal={180} valueModifier={set_bPhase} />
                <DialInput initVal={0} minVal={0} maxVal={2} valueModifier={set_cAmp} />
                <DialInput initVal={0} minVal={-180} maxVal={180} valueModifier={set_cPhase} />
            </div>
        </article>
    )
}