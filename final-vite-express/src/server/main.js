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

let collection = null


app.use(express.static('public'))

// player connection endpoints 

app.post("/lobby/create", async (req, res) => {
      const {
        username
    } = props.req.body;

    try {
        const newLobby = await prisma.announcements.create({
            data: {

            }
        })

        //adds job to announced_for table
        if (job_id) {
            await prisma.announced_for.createMany({
                data: {
                    announcement_id: newAnnouncement.id,
                    job_id: job_id,
                }
            })
        }

        console.log(newAnnouncement);
        props.res.status(201).json(newAnnouncement);
    }
    catch (error: any) {
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
