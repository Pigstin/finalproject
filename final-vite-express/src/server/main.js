import cookieSession from "cookie-session";
import express from "express";
import ViteExpress from "vite-express";
import {MongoClient, ObjectId} from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express()
app.use(express.json())

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

    app.post("/lobby/create", async (req, res) => {
        console.log(req.body)
        if(lobbies != null) {
            const json = {
                host_name: req.body.username,
                host_role: "host",
                guest_name: null,
                guest_role: null,
                lobby_id: 1,
                join_code: 1234
            }
        try {
            const result = await lobbies.insertOne(json)

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
}

// analog player endpoints 

// digital player endpoints

run()

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
