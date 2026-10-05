import express from "express";
import ViteExpress from "vite-express";


const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      cookie  = require('cookie-session'),
      app = express()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
// check for sanity
console.log( 'uri:', uri )
const client = new MongoClient( uri )
await client.connect()

let lobbies = await client.db("webware-final").collection("lobbies")
let games = await client.db("webware-final").collection("games")

app.use(express.static('public'))

// player connection endpoints 

app.post("/lobby/create", async (req, res) => {
      const {
        username
    } = props.req.body;

    if(lobbies != null) {
        const json = {
            host_name: username,
            host_role: "host",
            guest_name: null,
            guest_role: null,
            lobby_id: 1,
            join_code: 1234
        }
    }
    try {
        const result = await lobbies.insertOne(json)

        console.log(newLobby);
        props.res.status(201).json(newLobby);
    }
    catch (error) {
        console.error("error creating lobby");
        console.error(error.message);
        props.res.status(500).json({ error: error.message });
    }
})

// analog player endpoints 

// digital player endpoints

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
