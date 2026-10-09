import { useState } from "react"
import dialSprite from "./assets/Dial.svg"
import './Dial.css'

export function DialInput({ minVal, maxVal, valueModifier, initVal }) {
    const [value, setValue] = useState(initVal)
    const dialRadius = '75px'
    const divRadius = '120px'

    const dialStyle = {
        'transform': `rotate(${lerp(-45, 225, inverseLerp(minVal, maxVal, value))}deg)`,
        height: dialRadius,
        width: dialRadius,
        position: 'absolute',
        top: '20%',
        left: '20%'
    }

    const sliderStyle = {
        height: dialRadius,
        width: dialRadius,
        // position: 'absolute',
        opacity: '0%',
        margin: "25px 25px"
    }

    function lerp(start, end, pct) {
        return start + (end - start) * pct
    }

    function inverseLerp(start, end, val) {
        return (val - start) / (end - start)
    }

    function newValue(event) {
        //console.log(event.target.value)
        let newVal = Number(lerp(minVal, maxVal, (event.target.value / 100)).toFixed(2))
        setValue(newVal)
        valueModifier(newVal)
    }
    return (
        <div style={{ 'width': divRadius, 'height': divRadius, position: 'relative' }}>
            <img src={dialSprite} style={dialStyle}></img>
            {/* TODO : Put this style crap in a CSS file, and make it not so bad */}
            <p className="pct50">{lerp(minVal, maxVal, 0.5)}</p>
            <p className="pct0">{minVal}</p>
            <p className="pct100">{maxVal}</p>
            <p className="pct75">{lerp(minVal, maxVal, 0.75)}</p>
            <p className="pct25">{lerp(minVal, maxVal, 0.25)}</p>
            <input type="range" min={0} max={100} step={5} style={sliderStyle} onChange={newValue}></input>

        </div>
    )
}

export function DialSample() {
    const [val1, setVal1] = useState(0)
    const [val2, setVal2] = useState(0)
    const [val3, setVal3] = useState(0)
    return (
        <div style={{ display: "grid", gap: '50px', gridTemplateColumns: "100px 100px 100px", gridTemplateRows: "100px 100px", placeItems: 'center' }}>
            <DialInput valueModifier={setVal1} minVal={-100} maxVal={100} />
            <DialInput valueModifier={setVal2} minVal={-2} maxVal={2} />
            <DialInput valueModifier={setVal3} minVal={0} maxVal={150} />
            <p>{val1}</p>
            <p>{val2}</p>
            <p>{val3}</p>
        </div>
    )
}