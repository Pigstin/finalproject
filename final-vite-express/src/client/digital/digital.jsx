import './digital.css'

let canvas = undefined
let ctx = undefined

function loadJS() {
    console.log("omg jabascribt")

    //setup for canvas
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    screenWidth = canvas.width
    screenHeight = canvas.height
    ctx.fillStyle = "rgb(0 0 0)"
    ctx.fillRect(0, 0, screenWidth, screenHeight)

    //setup the info screen to display screen 1
    disableAllImages()
    updateInfoScreen()

    prevTime = document.timeline.currentTime
    requestAnimationFrame(draw)
}

//constants
const scanLineSpeed = 0.5 //in Hz
const delayBetweenDots = 80 //in ms
const dotsMaintainedMax = 10 //the amount of most recent dots that won't fade yet
//can be used to position the screen within the canvas. right now, just fills the whole canvas
const screenX = 0
const screenY = 0
let screenWidth = undefined //defined in window.onload once we know canvas width
let screenHeight = undefined //defined in window.onload once we know canvas height
const dotSize = 4
const verticalDivs = 6
const divLineWeight = 2
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
    let deltaTime = timestamp - prevTime //miliseconds that passed since last frame. usually 16.6667ms for 60hz
    prevTime = timestamp //set prevTime so that next deltaTime calculation will be accurate

    //sometimes, the user tabs out. this will result in a massive deltaTime value. which messes things up and is bad. 
    // so if deltaTime is abnormally large, just skip the frame! shouldn't be a problem unless the user has a 10Hz monitor or something.
    if (deltaTime < 100) { //only run the frame if it hasn't been more than 100ms
        scanWidth = (deltaTime / 1000) * scanLineSpeed * screenWidth + 1
        if (scanLineX > screenWidth) {
            scanLineX -= screenWidth
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
        ctx.fillStyle = "rgb(0 0 0 / 5%)";
        ctx.fillRect(screenX, screenY, screenWidth, screenHeight);

        //scan line
        ctx.fillStyle = "rgb(24, 248, 24)";
        if (scanLineX + scanWidth < screenWidth) {
            ctx.fillRect(screenX + scanLineX, screenY, scanWidth, screenHeight);
        } else {
            ctx.fillRect(screenX + scanLineX, screenY, screenWidth-scanLineX, screenHeight);
            ctx.fillRect(screenX, screenY, scanWidth-(screenWidth-scanLineX), screenHeight);
        }

        //div lines
        ctx.fillStyle = "rgb(0 66 141 / 2%)";
        //lines for 90deg, 180deg, 270deg
        ctx.fillRect(screenX + 1/4*screenWidth - divLineWeight/2, screenY, divLineWeight, screenHeight)
        ctx.fillRect(screenX + 2/4*screenWidth - divLineWeight, screenY, divLineWeight*2, screenHeight)
        ctx.fillRect(screenX + 3/4*screenWidth - divLineWeight/2, screenY, divLineWeight, screenHeight)
        //line at y=0
        ctx.fillRect(screenX, screenY + 1/2*screenHeight - divLineWeight, screenWidth, divLineWeight*2)
        //draw lines at y= +/-1, +/-2, etc. as many as there are vertical divs
        for (let i = 1; i < verticalDivs/2; i++) {
            ctx.fillRect(screenX, screenY + 1/2*screenHeight - divLineWeight/2 + i/verticalDivs*screenHeight, screenWidth, divLineWeight)
            ctx.fillRect(screenX, screenY + 1/2*screenHeight - divLineWeight/2 - i/verticalDivs*screenHeight, screenWidth, divLineWeight)
        }

        //add dots
        sinceLastDot += deltaTime
        //check if it's dot time
        if (sinceLastDot > delayBetweenDots) {
            //if it is dot time, make sure to set back sinceLastDot
            sinceLastDot -= delayBetweenDots

            //make a dot
            ctx.fillStyle = "rgb(255 255 255)";
            let dotX = scanLineX - dotSize/2
            let varX = scanLineX * (2*Math.PI)/ screenWidth //input to f(x). ranges from 0 to 2pi
            let FofX = p_A*Math.cos(1*varX + p_a*(Math.PI/180)) //1st harmonic
                    + p_B*Math.cos(2*varX + p_b*(Math.PI/180)) //2nd harmonic
                    + p_C*Math.cos(3*varX + p_c*(Math.PI/180)) //3rd harmonic
            
            let dotY = (-FofX * screenHeight / verticalDivs) + screenHeight/2 - dotSize/2
            //add dot's x and y to list
            dotsMaintained.push({"x": dotX, "y": dotY})
            //cull list if it's over the max
            if (dotsMaintained.length > dotsMaintainedMax) {
                dotsMaintained.splice(0, 1) //delete first item in array. will be the least recent dot added. 
            }
            //display all dots
            for (const dot of dotsMaintained) {
                ctx.fillRect(dot.x + screenX, dot.y + screenY, dotSize, dotSize);
            }
        }

        scanLineX += (deltaTime / 1000) * scanLineSpeed * screenWidth
    }
    requestAnimationFrame(draw)
}

//requests new data every 1900 seconds
//setInterval(requestData, 1900); //TODO re-enable this once everything works nicely together

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
    disableAllImages()
    if (infoScreenIndex === 1) {
        document.getElementById("icon-instructions-1").style.display = "block"
    } else if (infoScreenIndex === 2) {
        document.getElementById("icon-instructions-2").style.display = "block"
    } //TODO: add all other images
}

function disableAllImages() {
    document.getElementById("icon-instructions-1").style.display = "none"
    document.getElementById("icon-instructions-2").style.display = "none"
    //TODO: add all other images
}

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
        describe CWN here TODO`
}


export default function DigitalPage() {
    return (
        <div className="DigitalPage" onLoad={evt => {loadJS()}}>                 
        {/* add onload function */}

            <div className="gameContainer">
                <img src="images/background.png" className="backgroundImage"/>
                <canvas id="canvas">
                    game's supposed to show up here. if you see this text, RUN. IT'S COMING.
                </canvas>
                
                <p className="infoText" id="infoText"></p>
                <img src="images/icon-instructions-1.png" className="infoImage" id="icon-instructions-1"/>
                <img src="images/icon-instructions-2.png" className="infoImage" id="icon-instructions-2"/>
            </div>
        </div>
);
} 