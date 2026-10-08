import './digital.css'

let oscCanvas = undefined
let oscCtx = undefined

//this function is running 3 times!!! that is bad!!!
//implementing a hacky stop to that
let ranBefore = false
function loadJS() {
    if (ranBefore === false) {
        ranBefore = true
        console.log("omg jabascribt")

        //setup for oscilloscope canvas
        oscCanvas = document.getElementById("oscCanvas");
        oscCtx = oscCanvas.getContext("2d");
        oscCtx.fillStyle = "rgb(0 0 0)"
        oscCtx.fillRect(0, 0, oscCanvas.width, oscCanvas.height)

        //setup the info screen to display screen 1
        disableAllInfoImages()
        updateInfoScreen()

        prevTime = document.timeline.currentTime
        requestAnimationFrame(draw)
    }
}

//globals that the function uses & changes
let prevTime = undefined
let scanWidth = undefined
let scanLineX = 0
let sinceLastDot = 0 //in ms
let dotsMaintained = []
//waveform parameters to Acos(1x+a) + Bcos(2x+b) + Ccos(3x+c)
//angles here in degrees. get converted to radians later. 
let p_A = 1
let p_a = 0
let p_B = 0
let p_b = 0
let p_C = 0
let p_c = 0
//these values are updated whenever refresh data is obtained. 
//p_X values are set equal to these every 2 seconds. set to defaults here to start off
let refreshVals = {"A": 1, "a": 0, "B": 0, "b": 0, "C": 0, "c": 0, "light": "red"}

function draw(timestamp) {
    //constants
    const scanLineSpeed = 0.5 //in Hz
    const delayBetweenDots = 80 //in ms
    const dotsMaintainedMax = 10 //the amount of most recent dots that won't fade yet
    const dotSize = 4
    const verticalDivs = 6
    const divLineWeight = 2

    let deltaTime = timestamp - prevTime //miliseconds that passed since last frame. usually 16.6667ms for 60hz
    prevTime = timestamp //set prevTime so that next deltaTime calculation will be accurate

    //sometimes, the user tabs out. this will result in a massive deltaTime value. which messes things up and is bad. 
    // so if deltaTime is abnormally large, just skip the frame! shouldn't be a problem unless the user has a 10Hz monitor or something.
    if (deltaTime < 100) { //only run the frame if it hasn't been more than 100ms
        scanWidth = (deltaTime / 1000) * scanLineSpeed * oscCanvas.width + 1
        if (scanLineX > oscCanvas.width) {
            scanLineX -= oscCanvas.width
            //update for (potentially) new parameters
            p_A = refreshVals["A"]
            p_a = refreshVals["a"]
            p_B = refreshVals["B"]
            p_b = refreshVals["b"]
            p_C = refreshVals["C"]
            p_c = refreshVals["c"]
            //TODO light here
        }

        //fade previous data
        oscCtx.fillStyle = "rgb(0 0 0 / 5%)";
        oscCtx.fillRect(0, 0, oscCanvas.width, oscCanvas.height);

        //scan line
        oscCtx.fillStyle = "rgb(24, 248, 24)";
        if (scanLineX + scanWidth < oscCanvas.width) {
            oscCtx.fillRect(scanLineX, 0, scanWidth, oscCanvas.height);
        } else {
            oscCtx.fillRect(scanLineX, 0, oscCanvas.width-scanLineX, oscCanvas.height);
            oscCtx.fillRect(0, 0, scanWidth-(oscCanvas.width-scanLineX), oscCanvas.height);
        }

        //div lines
        oscCtx.fillStyle = "rgb(0 66 141 / 2%)";
        //lines for 90deg, 180deg, 270deg
        oscCtx.fillRect(1/4*oscCanvas.width - divLineWeight/2, 0, divLineWeight, oscCanvas.height)
        oscCtx.fillRect(2/4*oscCanvas.width - divLineWeight, 0, divLineWeight*2, oscCanvas.height)
        oscCtx.fillRect(3/4*oscCanvas.width - divLineWeight/2, 0, divLineWeight, oscCanvas.height)
        //line at y=0
        oscCtx.fillRect(0, 1/2*oscCanvas.height - divLineWeight, oscCanvas.width, divLineWeight*2)
        //draw lines at y= +/-1, +/-2, etc. as many as there are vertical divs
        for (let i = 1; i < verticalDivs/2; i++) {
            oscCtx.fillRect(0, 1/2*oscCanvas.height - divLineWeight/2 + i/verticalDivs*oscCanvas.height, oscCanvas.width, divLineWeight)
            oscCtx.fillRect(0, 1/2*oscCanvas.height - divLineWeight/2 - i/verticalDivs*oscCanvas.height, oscCanvas.width, divLineWeight)
        }

        //add dots
        sinceLastDot += deltaTime
        //check if it's dot time
        if (sinceLastDot > delayBetweenDots) {
            //if it is dot time, make sure to set back sinceLastDot
            sinceLastDot -= delayBetweenDots

            //make a dot
            oscCtx.fillStyle = "rgb(255 255 255)";
            let dotX = scanLineX - dotSize/2
            let varX = scanLineX * (2*Math.PI)/ oscCanvas.width //input to f(x). ranges from 0 to 2pi
            let FofX = p_A*Math.cos(1*varX + p_a*(Math.PI/180)) //1st harmonic
                    + p_B*Math.cos(2*varX + p_b*(Math.PI/180)) //2nd harmonic
                    + p_C*Math.cos(3*varX + p_c*(Math.PI/180)) //3rd harmonic
            
            let dotY = (-FofX * oscCanvas.height / verticalDivs) + oscCanvas.height/2 - dotSize/2
            //add dot's x and y to list
            dotsMaintained.push({"x": dotX, "y": dotY})
            //cull list if it's over the max
            if (dotsMaintained.length > dotsMaintainedMax) {
                dotsMaintained.splice(0, 1) //delete first item in array. will be the least recent dot added. 
            }
            //display all dots
            for (const dot of dotsMaintained) {
                oscCtx.fillRect(dot.x, dot.y, dotSize, dotSize);
            }
        }

        scanLineX += (deltaTime / 1000) * scanLineSpeed * oscCanvas.width
    }
    requestAnimationFrame(draw)
}

//requests new data every 1900 seconds
// setInterval(requestData, 1900); //TODO re-enable once endpoints exist properly

async function requestData() {

    const response = await fetch( '/refresh/digital', {
        method:'GET'
    })

    refreshVals = await response.json()
    //expects a JSON object like this:
    //{"A": 1, "a": 0, "B": 0, "b": 0, "C": 0, "c": 0, "light": "red"}
    //"light" can be "red", "green", "blue", or "off"
}

//detect key presses
addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        infoScreenIndex -= 1
        //prevent underflow before index 1
        if (infoScreenIndex < 1) {
            infoScreenIndex = 1
        }
        updateInfoScreen()
    } else if (event.key === "ArrowRight") {
        infoScreenIndex += 1
        //prevent overflow past index 15
        if (infoScreenIndex > 15) {
            infoScreenIndex = 15
        }
        updateInfoScreen()
    }
})

let infoScreenIndex = 1
function updateInfoScreen() {
    infoText = document.getElementById("infoText");
    infoText.innerText = infoScreenData[infoScreenIndex]
    disableAllInfoImages()
    if (infoScreenIndex === 1) {
        document.getElementById("icon-instructions-1").style.display = "block"
    } else if (infoScreenIndex === 2) {
        document.getElementById("icon-instructions-2").style.display = "block"
    } else if (infoScreenIndex === 15) {
        document.getElementById("icon-appendix-a").style.display = "block"
    } else {
        //time to render a function onto the canvas
        document.getElementById("infoCanvas").style.display = "block"
        let waveNumber = infoScreenIndex - 2
        drawInfoWave(waveNumber)
        if (infoScreenIndex === 3) {document.getElementById("vector-n").style.display = "block"}
        else if (infoScreenIndex === 4) {document.getElementById("vector-e").style.display = "block"}
        else if (infoScreenIndex === 5) {document.getElementById("vector-s").style.display = "block"}
        else if (infoScreenIndex === 6) {document.getElementById("vector-w").style.display = "block"}
        else if (infoScreenIndex === 7) {document.getElementById("vector-nne").style.display = "block"}
        else if (infoScreenIndex === 8) {document.getElementById("vector-ene").style.display = "block"}
        else if (infoScreenIndex === 9) {document.getElementById("vector-ese").style.display = "block"}
        else if (infoScreenIndex === 10) {document.getElementById("vector-sse").style.display = "block"}
        else if (infoScreenIndex === 11) {document.getElementById("vector-ssw").style.display = "block"}
        else if (infoScreenIndex === 12) {document.getElementById("vector-wsw").style.display = "block"}
        else if (infoScreenIndex === 13) {document.getElementById("vector-wnw").style.display = "block"}
        else if (infoScreenIndex === 14) {document.getElementById("vector-nnw").style.display = "block"}
    }
}

//finds everything with the "info" class and makes it disappear
function disableAllInfoImages() {
    const allInfoElements = document.getElementsByClassName("info")
    for (const infoElement of allInfoElements) {
        infoElement.style.display = "none"
    }
}

//ovewrites the infoCanvas element to display a waveform
function drawInfoWave(waveNumber) {
    const infoCanvas = document.getElementById("infoCanvas")
    const infoCtx = infoCanvas.getContext("2d")

    const divLineWeight = 2
    const dotSize = 2
    const verticalDivs = 6
    const waveParams = waveData[waveNumber]

    //cover previous data
    infoCtx.fillStyle = "rgb(0 0 0)";
    infoCtx.fillRect(0, 0, infoCanvas.width, infoCanvas.height);

    //div lines
    infoCtx.fillStyle = "rgb(0 66 141)";
    //lines for 90deg, 180deg, 270deg
    infoCtx.fillRect(1/4*infoCanvas.width - divLineWeight/2, 0, divLineWeight, infoCanvas.height)
    infoCtx.fillRect(2/4*infoCanvas.width - divLineWeight, 0, divLineWeight*2, infoCanvas.height)
    infoCtx.fillRect(3/4*infoCanvas.width - divLineWeight/2, 0, divLineWeight, infoCanvas.height)
    //line at y=0
    infoCtx.fillRect(0, 1/2*infoCanvas.height - divLineWeight, infoCanvas.width, divLineWeight*2)
    //draw lines at y= +/-1, +/-2, etc. as many as there are vertical divs
    for (let i = 1; i < verticalDivs/2; i++) {
        infoCtx.fillRect(0, 1/2*infoCanvas.height - divLineWeight/2 + i/verticalDivs*infoCanvas.height, infoCanvas.width, divLineWeight)
        infoCtx.fillRect(0, 1/2*infoCanvas.height - divLineWeight/2 - i/verticalDivs*infoCanvas.height, infoCanvas.width, divLineWeight)
    }

    //add enough dots to look like a smooth wave
    infoCtx.fillStyle = "rgb(255 255 255)";
    for (let varX = 0; varX < 2*Math.PI; varX += 0.01) {
        
        let FofX = waveParams["A"]*Math.cos(1*varX + waveParams["a"]*(Math.PI/180)) //1st harmonic
                + waveParams["B"]*Math.cos(2*varX + waveParams["b"]*(Math.PI/180)) //2nd harmonic
                + waveParams["C"]*Math.cos(3*varX + waveParams["c"]*(Math.PI/180)) //3rd harmonic
        
        let dotX = (varX * infoCanvas.width / (2*Math.PI)) - dotSize/2
        let dotY = (-FofX * infoCanvas.height / verticalDivs) + infoCanvas.height/2 - dotSize/2
        infoCtx.fillRect(dotX, dotY, dotSize, dotSize);
    }
}

const waveData = {
    1: {A: 0, a: 0, B: 0, b: 0, C: 0, c: 0}, //flatline
    2: {A: 1, a: 0, B: 0, b: 0, C: 0, c: 0}, //1hz simple
    3: {A: 0, a: 0, B: 1, b: 0, C: 0, c: 0}, //2hz simple
    4: {A: 0, a: 0, B: 0, b: 0, C: 1, c: 0}, //3hz simple
    5: {A: 1, a: 0, B: 1, b: -90, C: 0, c: 0}, //wobbly
    6: {A: 2, a: -180, B: 0.5, b: 180, C: 0, c: 0}, //plateau
    7: {A: 1, a: 0, B: 0, b: 0, C: 1, c: 180}, //central-W
    8: {A: 1, a: 90, B: 0, b: 0, C: 0.5, c: -90}, //valley-mountain
    9: {A: 0, a: 0, B: 1, b: 0, C: 1, c: 0}, //central-M 
    10: {A: 0, a: 0, B: 1.5, b: 0, C: 0.5, c: -180}, //bird 
    11: {A: 0.5, a: 0, B: 0.5, b: 0, C: 1, c: 0}, //double-W 
    12: {A: 2, a: 90, B: 1, b: 90, C: 0.5, c: 90}, //sawtooth 
}

//160 x 160 images
const infoScreenData = {
    1: `INSTRUCTIONS [1]\n
        This document is for the OPERATOR's\n
        eyes only. Your assistant is viewing\n
        a sequence of WAVEFORMS. They will\n
        transmit these waveforms to you for\n
        you to decode. You can communicate\n
        with your assistant by typing them\n
        messages through the terminal.\n
        View further instructions with [→].`, 
    2: `INSTRUCTIONS [2]\n
        The waveforms represent directions.\n
        From the map's origin, follow these\n
        directions. You will land on a SYMBOL.\n
        You must communicate this symbol to\n
        your assistant for them to use.\n
        The operation will conclude once\n
        three correct symbols are found.\n
        View waveform meanings with [→].`, 
    3: `WAVE DESIGNATION: 'Flatline' [1]\n
        DIRECTION: North\n
        VECTOR REPRESENTATION: (0, +1)\n
        CWN: 1(0∠0), 2(0∠0), 3(0∠0)
        `, 
    4: `WAVE DESIGNATION: '1Hz Simple' [2]\n
        DIRECTION: East\n
        VECTOR REPRESENTATION: (+1, 0)\n
        CWN: 1(1∠0), 2(0∠0), 3(0∠0)
        `, 
    5: `WAVE DESIGNATION: '2Hz Simple' [3]\n
        DIRECTION: South\n
        VECTOR REPRESENTATION: (0, -1)\n
        CWN: 1(0∠0), 2(1∠0), 3(0∠0)
        `, 
    6: `WAVE DESIGNATION: '3Hz Simple' [4]\n
        DIRECTION: West\n
        VECTOR REPRESENTATION: (-1, 0)\n
        CWN: 1(0∠0), 2(0∠0), 3(1∠0)
        `,  
    7: `WAVE DESIGNATION: 'Wobbly' [5]\n
        DIRECTION: North by Northeast\n
        VECTOR REPRESENTATION: (+1, +2)\n
        CWN: 1(1∠0), 2(1∠-90), 3(0∠0)
        `, 
    8: `WAVE DESIGNATION: 'Plateau' [6]\n
        DIRECTION: East by Northeast\n
        VECTOR REPRESENTATION: (+2, +1)\n
        CWN: 1(2∠-180), 2(0.5∠180), 3(0∠0)
        `, 
    9: `WAVE DESIGNATION: 'Central-W' [7]\n
        DIRECTION: East by Southeast\n
        VECTOR REPRESENTATION: (+2, -1)\n
        CWN: 1(1∠0), 2(0∠0), 3(1∠180)
        `, 
    10:`WAVE DESIGNATION: 'Valley-Mountain' [8]\n
        DIRECTION: South by Southeast\n
        VECTOR REPRESENTATION: (+1, -2)\n
        CWN: 1(1∠90), 2(0∠0), 3(0.5∠-90)
        `, 
    11:`WAVE DESIGNATION: 'Central-M' [9]\n
        DIRECTION: South by Southwest\n
        VECTOR REPRESENTATION: (-1, -2)\n
        CWN: 1(0∠0), 2(1∠0), 3(1∠0)
        `, 
    12:`WAVE DESIGNATION: 'Bird' [10]\n
        DIRECTION: West by Southwest\n
        VECTOR REPRESENTATION: (-2, -1)\n
        CWN: 1(0∠0), 2(1.5∠0), 3(0.5∠-180)
        `, 
    13:`WAVE DESIGNATION: 'Double-W' [11]\n
        DIRECTION: West by Northwest\n
        VECTOR REPRESENTATION: (-2, +1)\n
        CWN: 1(0.5∠0), 2(0.5∠0), 3(1∠0)
        `, 
    14:`WAVE DESIGNATION: 'Sawtooth' [12]\n
        DIRECTION: North by Northwest\n
        VECTOR REPRESENTATION: (-1, +2)\n
        CWN: 1(2∠90), 2(1∠90), 3(0.5∠90)
        `, 
    15:`APPENDIX [A]\n
        CWN (Compact Waveform Notation)\n
        describes a waveform based on its\n
        components. All waveforms you will\n
        encounter match the following pattern:\n
        A*cos(1x+a) +B*cos(2x+b) +C*cos(3x+c)\n
        consisting of 1Hz, 2Hz, and 3Hz parts.\n
        These can be described in Compact \n
        Waveform Notation using less space:\n
        1(A∠a), 2(B∠b), 3(C∠c)
        `
}

export default function DigitalPage() {
    return (
        <div className="DigitalPage" onLoad={evt => {loadJS()}}>                 
        {/* add onload function */}

            <div className="gameContainer">
                <img src="images/background.png" className="backgroundImage"/>
                <canvas id="oscCanvas">
                    game's supposed to show up here. if you see this text, RUN. IT'S COMING.
                </canvas>
                
                <p className="infoText" id="infoText"></p>
                <img src="images/icon-instructions-1.png" className="infoImage info" id="icon-instructions-1"/>
                <img src="images/icon-instructions-2.png" className="infoImage info" id="icon-instructions-2"/>
                <canvas className="infoImage info" id="infoCanvas"/>
                <img src="images/icon-appendix-a.png" className="infoImage info" id="icon-appendix-a"/>
                <img src="images/vector-n.png" className="infoVector info" id="vector-n"/>
                <img src="images/vector-e.png" className="infoVector info" id="vector-e"/>
                <img src="images/vector-s.png" className="infoVector info" id="vector-s"/>
                <img src="images/vector-w.png" className="infoVector info" id="vector-w"/>
                <img src="images/vector-nne.png" className="infoVector info" id="vector-nne"/>
                <img src="images/vector-ene.png" className="infoVector info" id="vector-ene"/>
                <img src="images/vector-ese.png" className="infoVector info" id="vector-ese"/>
                <img src="images/vector-sse.png" className="infoVector info" id="vector-sse"/>
                <img src="images/vector-ssw.png" className="infoVector info" id="vector-ssw"/>
                <img src="images/vector-wsw.png" className="infoVector info" id="vector-wsw"/>
                <img src="images/vector-wnw.png" className="infoVector info" id="vector-wnw"/>
                <img src="images/vector-nnw.png" className="infoVector info" id="vector-nnw"/>
            </div>
        </div>
);
} 