import { useState } from "react"

export function DialInput({ minVal, maxVal, valueModifier }) {
    const [value, setValue] = useState(0)

    const dialStyle = {
        'transform': `rotate(${lerp(-45, 235, inverseLerp(minVal, maxVal, value))}deg)`,
        height: '100px',
        width: '100px',
        position: 'absolute'
    }

    const sliderStyle = {
        height: '100px',
        width: '100px',
        // position: 'absolute',
        opacity: '0%'
    }

    function lerp(start, end, pct) {
        return start + (end - start) * pct
    }

    function inverseLerp(start, end, val) {
        return (val - start) / (end - start)
    }

    function newValue(event) {
        //console.log(event.target.value)
        let newVal = lerp(minVal, maxVal, (event.target.value / 100))
        setValue(newVal)
        valueModifier(newVal)
    }
    return (
        <div style={{ 'width': '100px', 'height': '100px' }}>
            <img src="src/client/assets/Dial.svg" style={dialStyle}></img>
            <input type="range" min={0} max={100} style={sliderStyle} onChange={newValue}></input>
        </div>
    )
}

export function DialSample() {
    const [val1, setVal1] = useState(0)
    const [val2, setVal2] = useState(0)
    const [val3, setVal3] = useState(0)
    return (
        <div style={{ display: "grid", gap: '7px', gridTemplateColumns: "100px 100px 100px", gridTemplateRows: "100px 100px" }}>
            <DialInput valueModifier={setVal1} />
            <DialInput valueModifier={setVal2} />
            <DialInput valueModifier={setVal3} />
            <p>{val1}</p>
            <p>{val2}</p>
            <p>{val3}</p>
        </div>
    )
}