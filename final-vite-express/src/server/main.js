import cookieSession from "cookie-session";
import express from "express";
import ViteExpress from "vite-express";
import {MongoClient, ObjectId} from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express()
app.use(express.json())

app.use(cookieSession({
  name: 'session',
  keys: ['bark', 'woof']
}))

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
// check for sanity
console.log( 'uri:', uri )
const client = new MongoClient( uri )

async function run() {
    await client.connect()

    let lobbies = await client.db("webware-final").collection("lobbies")
    let games = await client.db("webware-final").collection("games")

    app.use(express.static('public'))

    // player connection endpoints 

    // done and tested
    app.post("/lobby/create", async (req, res) => {
        if(lobbies != null) {
            const username = req.body.username
            const json = {
                host_name: username,
                host_role: "host",
                guest_name: null,
                guest_role: "none",
                join_code: 1234
            }
        try {
            const result = await lobbies.insertOne(json)

            req.session.username = username
            req.session.join_code = 1234 
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

    // done but untested
    app.patch("/lobby/join", async (req, res) => { 
        if(lobbies != null) {
            const guest_name = req.body.username, 
                join_code = req.body.join_code
            try {
                const result = await lobbies.updateOne(
                    { join_code: {$eq: join_code} },
                    { $set:{ guest_name: guest_name}, $set:{guest_role: "waiting"}}
                )
                req.session.username = guest_name
                req.session.join_code = join_code
                req.session.role = "host"
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

    // not done 
    app.get("/lobby/refresh", async (req, res) => {
        if(lobbies != null) {
            const lobby = await lobbies.findOne({join_code: {$eq: req.session.join_code}})
            // if user is host... 
            if(req.session.role == "host") {
                const other_role = lobby.guest_role;
                // if they have no buddy... 
                if(other_role == "none") {
                    // respond with other_role
                }
                // if they have a guest...
                else if(other_role == "waiting") {
                    // respond with other_role
                }
            }
            // if user is guest... 
            if(req.session.role == "waiting") {
                // if their host has not chosen...
                if(other_role == "host") {
                    // respond with other_role
                }
                // if they host has chosen one way or the other...
                else if(other_role == "digital") {
                    req.session.role = "analog"
                    // respond with other_role 
                }
                else if(other_role == "analog") {
                    req.session.role == "digital"
                    // respond with other_role
                }
            }
        }
    })



// analog player endpoints 

// digital player endpoints

}



run()

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
