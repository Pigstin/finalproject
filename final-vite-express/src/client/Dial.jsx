import { useState } from "react"

export function DialInput({ valueModifier }) {
    const [value, setValue] = useState(0)

    const dialStyle = {
        'transform': `rotate(${value}deg)`,
        height: '160px',
        width: '160px',
        position: 'absolute'
    }

    const sliderStyle = {
        height: '160px',
        width: '160px',
        // position: 'absolute',
        opacity: '0%'
    }

    function newValue(event) {
        //console.log(event.target.value)
        setValue(event.target.value)
        valueModifier(event.target.value)
    }
    return (
        <div style={{ 'width': '160px', 'height': '160px' }}>
            <img src="src/client/assets/Dial.svg" style={dialStyle}></img>
            <input type="range" min={0} max={180} style={sliderStyle} onChange={newValue}></input>
        </div>
    )
}

export function DialSample() {
    const [val1, setVal1] = useState(0)
    const [val2, setVal2] = useState(0)
    const [val3, setVal3] = useState(0)
    return (
        <div style={{ display: "grid", gap: '20px', gridTemplateColumns: "160px 160px 160px", gridTemplateRows: "160px 160px" }}>
            <DialInput valueModifier={setVal1} />
            <DialInput valueModifier={setVal2} />
            <DialInput valueModifier={setVal3} />
            <p>{val1}</p>
            <p>{val2}</p>
            <p>{val3}</p>
        </div>
    )
}