import cookieSession from "cookie-session";
import express from "express";
import ViteExpress from "vite-express";

import {GameData, User, Role} from "./classes.mjs"

const app = express();

let mock_data = new GameData()

app.use(cookieSession({
  name: "session",
  keys: ["USE_A_BETTER_KEY_THAN_THIS_DAWG"], //TODO : Use an actually good set of keys
  maxAge: 1000 * 60 * 60 //1 hour
}))

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

app.use("/test", (req, res) => {
  res.redirect('other')
})

app.use("/teststatic", (req, res) => {
  res.redirect('second.html')
})

app.use("/lobby/create", express.urlencoded(), (req, res) => {
  //TODO: Actually create a database object
  console.log(req.body)
  console.log(mock_data)
  
  mock_data.host.user = req.body.username
  mock_data.host.role = Role.HOST

  req.session = mock_data.host.getData()

  console.log(mock_data)
  console.log(req.session)
  res.redirect('/host')
})

app.use("/lobby/join", express.urlencoded(), (req, res) => {
  //TODO: Actually modify database object
  console.log(req.body)

  mock_data.guest.user = req.body.username
  mock_data.guest.role = Role.WAITING

  req.session = mock_data.guest.getData()

  console.log(mock_data)
  console.log(req.session)
  res.redirect('/guest')
})

app.use("/lobby/assign", express.json(), (req, res, next) => {
  console.log(req.body)
  mock_data.host_role = req.body.chosen_role
  mock_data.guest_role = (req.body.chosen_role === Role.ANALOG ? Role.DIGITAL : Role.ANALOG)

  console.log(mock_data)

  res.setHeader('OK', 200)
  res.send()

})

app.get('/refresh', (req, res, next) => {
  // TODO : Actually have this send over correct game/user data
  // Get requesting client's role in session cookies (req.session.role)
  // If role = host, other_role = database.guest_role
  // Elif role = guest, other_role = database.host_role

  let mockResponse = {
    my_user: 'none',
    my_role: 'none',
    other_user: 'none',
    other_role: 'none'
  }

  if (req.session.username === mock_data.host_user) {
    mockResponse.my_user = req.session.username
    mockResponse.my_role = mock_data.host.role
    mockResponse.other_role = mock_data.guest.role
    mockResponse.other_user = mock_data.guest.user
  }
  else if (req.session.username === mock_data.guest_user) {
    mockResponse.my_user = req.session.username
    mockResponse.my_role = mock_data.guest.role
    mockResponse.other_role = mock_data.host.role
    mockResponse.other_user = mock_data.host.user
    // NOTE: Guest's role is NOT UPDATED IN COOKIE before the game would start...
  }

  res.setHeader('OK', 200)
  res.end(JSON.stringify(mockResponse))
})

app.use('/clear', (req, res) => {
  req.session = null
  mock_data = new GameData()
  res.redirect('/')
})

app.use(express.static('public'))

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
