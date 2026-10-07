import './digital.css'

let canvas = undefined
let ctx = undefined

function loadJS() {
    console.log("omg jabascribt")

    //setup htmlFor canvas
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    screenWidth = canvas.width
    screenHeight = canvas.height
    ctx.fillStyle = "rgb(0 0 0)"
    ctx.fillRect(0, 0, screenWidth, screenHeight)

    //setup htmlFor inputs
    inputA = document.getElementById("A")
    inputa = document.getElementById("a")
    inputB = document.getElementById("B")
    inputb = document.getElementById("b")
    inputC = document.getElementById("C")
    inputc = document.getElementById("c")
    //update htmlFor (potentially) new parameters
    p_A = inputA.defaultValue
    p_a = inputa.defaultValue
    p_B = inputB.defaultValue
    p_b = inputb.defaultValue
    p_C = inputC.defaultValue
    p_c = inputc.defaultValue

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
//slider inputs that will give function parameters
let inputA = undefined
let inputa = undefined
let inputB = undefined
let inputb = undefined
let inputC = undefined
let inputc = undefined

function draw(timestamp) {
    let deltaTime = timestamp - prevTime //miliseconds that passed since last frame. usually 16.6667ms htmlFor 60hz
    prevTime = timestamp //set prevTime so that next deltaTime calculation will be accurate

    //sometimes, the user tabs out. this will result in a massive deltaTime defaultValue. which messes things up and is bad. 
    // so if deltaTime is abnormally large, just skip the frame! shouldn't be a problem unless the user has a 10Hz monitor or something.
    if (deltaTime < 100) { //only run the frame if it hasn't been more than 100ms
        scanWidth = (deltaTime / 1000) * scanLineSpeed * screenWidth + 1
        if (scanLineX > screenWidth) {
            scanLineX -= screenWidth
            //update htmlFor (potentially) new parameters
            p_A = inputA.defaultValue
            p_a = inputa.defaultValue
            p_B = inputB.defaultValue
            p_b = inputb.defaultValue
            p_C = inputC.defaultValue
            p_c = inputc.defaultValue
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
        //lines htmlFor 90deg, 180deg, 270deg
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


export default function DigitalPage() {
    return (
        <div className="DigitalPage" onLoad={evt => {loadJS()}}>                 
        {/* add onload function */}

        <div className="gameContainer">
            <img src="images/background.png" className="backgroundImage"/>
            <canvas id="canvas">
                game's supposed to show up here. if you see this text, RUN. IT'S COMING.
            </canvas>
        </div>



        <p>A*cos(1x + a) + B*cos(2x + b) + C*cos(3x + c)</p>
        <p>Waveform settings:</p>
        <div>
            <input type="range" id="A" name="A" min="0" max="2" defaultValue="1" step="0.01"/>
            <label htmlFor="A">A (1Hz amplitude)</label>
            <input type="range" id="a" name="a" min="-180" max="180" defaultValue="0" step="1"/>
            <label htmlFor="a">a (1Hz phase)</label>
        </div>
        <div>
            <input type="range" id="B" name="B" min="0" max="2" defaultValue="0" step="0.01"/>
            <label htmlFor="B">B (2Hz amplitude)</label>
            <input type="range" id="b" name="b" min="-180" max="180" defaultValue="0" step="1"/>
            <label htmlFor="b">b (2Hz phase)</label>
        </div>
        <div>
            <input type="range" id="C" name="C" min="0" max="2" defaultValue="0" step="0.01"/>
            <label htmlFor="C">C (3Hz amplitude)</label>
            <input type="range" id="c" name="c" min="-180" max="180" defaultValue="0" step="1"/>
            <label htmlFor="c">c (3Hz phase)</label>    
        </div>
        </div>
);
} 