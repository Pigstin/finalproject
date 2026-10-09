import cookieSession from "cookie-session";
import express from "express";
import ViteExpress from "vite-express";
import { redirect } from "react-router";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express()
app.use(express.json())

app.use(cookieSession({
    name: 'session',
    keys: ['bark', 'woof']
}))

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

async function run() {
    await client.connect()

    let lobbies = await client.db("webware-final").collection("lobbies")
    let games = await client.db("webware-final").collection("games")

    // middleware
    app.use(express.static('public'))

    // logger function 
    // app.use((req, res, next) => {
    //     const current = Temporal.Now.plainTimeISO().toString().substring(0,8);
    //     console.log(`[${current}]: ${req.method} at ${req.originalUrl} from ${req.ip}`);
    //     next()
    // })
    // player connection endpoints 

    // done and tested
    app.post("/lobby/create", async (req, res) => {
        if (lobbies != null) {
            const username = req.body.username
            const new_code = pick_code()
            console.log(new_code)
            const json = {
                host_name: username,
                host_role: "host",
                guest_name: null,
                guest_role: "none",
                join_code: new_code
            }
            try {
                const result = await lobbies.insertOne(json)

                req.session.username = username
                req.session.join_code = new_code
                req.session.role = "host"
                console.log(result);
                res.status(201).json(result);


            }
            catch (error) {
                console.error("error creating lobby");
                console.error(error.message);
                res.status(500).json({ error: error.message });
            }
        }
    })

    // done and tested
    // how??? 
    app.patch("/lobby/join", async (req, res) => {
        if (lobbies != null) {
            const guest_name = req.body.username,
                join_code = parseInt(req.body.join_code)
            try {
                console.log(`guest_name: ${guest_name}, join_code:${join_code}`)
                const result = await lobbies.updateOne(
                    { join_code: { $eq: join_code } },
                    { $set: { guest_name: guest_name, guest_role: "waiting" } }
                )
                req.session.username = guest_name
                req.session.join_code = join_code
                req.session.role = "waiting"
                console.log(result);
                res.status(201).json(result);
            }
            catch (error) {
                console.error("error joining lobby");
                console.error(error.message);
                res.status(500).json({ error: error.message });
            }
        }
    })

    // done and tested
    app.post("/lobby/refresh", async (req, res) => {
        if (lobbies != null) {
            const lobby = await lobbies.findOne({ join_code: { $eq: req.session.join_code } })
            // if user is host...
            // we respond with names and roles.
            const data = {
                host_name: lobby.host_name,
                host_role: lobby.host_role,
                guest_name: lobby.guest_name,
                guest_role: lobby.guest_role,
                join_code: lobby.join_code
            }
            res.json(data)
        }
    })

    // done and tested
    app.patch("/lobby/assign", async (req, res) => {
        if (lobbies != null) {
            const chosen_role = req.body.chosen_role

            if (chosen_role == "analog") {
                console.log("Attempting to switch user cookie role to analog")
                req.session.role = "analog"
                const result = await lobbies.updateOne(
                    { join_code: { $eq: req.session.join_code } },
                    { $set: { host_role: "analog", guest_role: "digital" } }
                )
            }
            else if (chosen_role == "digital") {
                req.session.role = "digital"
                const result = await lobbies.updateOne(
                    { join_code: { $eq: req.session.join_code } },
                    { $set: { host_role: "digital", guest_role: "analog" } }
                )
            }
            else {
                console.log(chosen_role)
            }

            console.log('cookie role: ' + req.session.role)
        }
    })

    // done, not tested 
    app.post("/lobby/start", async (req, res) => {
        if (lobbies != null && games != null) {
            const lobby = await lobbies.findOne({ join_code: { $eq: req.session.join_code } })
            const game = await games.findOne({ game_id: { $eq: req.session.join_code } })
            // if there is no corresponding game we make it! 
            if (game == null) {
                const json = {
                    game_id: req.session.join_code,
                    dials: { A: 0, a: 0, B: 0, b: 0, C: 0, c: 0 },
                    color: "",
                    terminal: "",
                    right_guesses: 0,
                    won: false
                }
                try {
                    const result = await games.insertOne(json)

                    console.log(result);
                    res.status(201).json(result);
                }
                catch (error) {
                    console.error("error creating game");
                    console.error(error.message);
                    res.status(500).json({ error: error.message });
                }
            }
            else {
                console.log('Game already exists');
                res.status(201).send()
            }
            // also, redirects to your current role
            // console.log(`attempting to redirect to /${req.session.role}`)
            // redirect(`/${req.session.role}`)
        }
    })

    // analog player endpoints 

    // done, untested
    app.post("/analog/refresh", async (req, res) => {
        if (games != null) {
            const game = await games.findOne({ game_id: { $eq: req.session.join_code } })
            // the analog player needs the terminal and whether the game's won. 
            const data = {
                terminal: game.terminal,
                won: game.won
            }
            res.json(data)
        }
    })

    // done, tested 
    app.patch("/analog/dials", async (req, res) => {
        if (games != null) {
            const values = req.body.values

            const result = await games.updateOne(
                { game_id: { $eq: req.session.join_code } },
                { $set: { dials: values } }
            )
            console.log(values)
            res.writeHead(201, 'OK')
            res.send()
        }

    })

    // done, tested
    app.patch("/analog/color", async (req, res) => {
        if (games != null) {
            const color = req.body.color

            const result = await games.updateOne(
                { game_id: { $eq: req.session.join_code } },
                { $set: { color: color } }
            )
            res.writeHead(201, 'OK')
            res.send()
        }

    })

    // done but untested 
    app.patch("/analog/score", async (req, res) => {
        if (games != null) {
            const result = await games.updateOne(
                { game_id: { $eq: req.session.join_code } },
                { $inc: { right_guesses: 1 } }
            )

            // See if game won
            const myGame = await games.findOne({ game_id: { $eq: req.session.join_code } })
            if (myGame.right_guesses >= 3) {
                const winResult = await games.updateOne(
                    { game_id: { $eq: req.session.join_code } },
                    { $set: { won: true } }
                )
            }

            res.writeHead(201, 'OK')
            res.send()
        }
    })

    // done but untested 
    app.patch("/analog/wipe", async (req, res) => {
        if (games != null) {
            const result = await games.updateOne(
                { game_id: { $eq: req.session.join_code } },
                { $set: { right_guesses: 0 } }
            )
        }
        res.writeHead(201, 'OK')
        res.send()
    })

    // digital player endpoints

    // done, tested
    app.post("/digital/refresh", async (req, res) => {
        // if games is null this never responds with anything
        if (games != null) {
            const game = await games.findOne({ game_id: { $eq: req.session.join_code } })
            // the digital player needs the dials, the light color, and whether the game is won
            // also needs the terminal to recieve (or send )
            const data = {
                terminal: game.terminal,
                dials: game.dials,
                light: game.color,
                won: game.won
            }
            res.json(data)
        }
    })

    // done and untested 
    // why is this not a put request? 
    app.patch("/digital/terminal", async (req, res) => {
        if (games != null) {
            const terminal = req.body.terminal
            console.log(req.body)

            const result = await games.updateOne(
                { game_id: { $eq: req.session.join_code } },
                { $set: { terminal: terminal } }
            )
        }
    })

    // helper functions 
    // TODO: uniqueness check
    function pick_code() {
        return Math.floor(Math.random() * 9000) + 1000;
    }

}



run()

ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
);
