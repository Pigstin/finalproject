import cookieSession from "cookie-session";
import express from "express";
import ViteExpress from "vite-express";

const app = express();

let mock_data = {
  game_id: 1738,
  host_user: 'none',
  host_role: 'none',
  guest_user: 'none',
  guest_role: 'none'
}

app.use(cookieSession({
  name: "session",
  keys: ["USE_A_BETTER_KEY_THAN_THIS_DAWG"],
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
  //TODO: Set this client's session cookies to have username and game_id
  mock_data.host_user = req.body.username
  mock_data.host_role = 'host'
  req.session.username = req.body.username
  req.session.role = 'host'
  req.session.game_id = mock_data.game_id

  console.log(mock_data)
  console.log(req.session)
  res.redirect('/host')
})

app.use("/lobby/join", express.urlencoded(), (req, res) => {
  //TODO: Actually modify database object
  //TODO: Set client's session cookies to have username and game_id
  console.log(req.body)
  mock_data.guest_user = req.body.username
  mock_data.guest_role = 'waiting'
  req.session.username = req.body.username
  req.session.role = 'waiting'
  req.session.game_id = mock_data.game_id

  console.log(mock_data)
  console.log(req.session)
  res.redirect('/guest')
})

app.get('/refresh', (req, res, next) => {
  // TODO : Actually have this send over correct game/user data
  // Get requesting client's role in session cookies (req.session.role)
  // If role = host, other_role = database.guest_role
  // Elif role = guest, other_role = database.host_role

  let mockResponse = { other_role: 'none' }

  if (req.session.role === 'host')
    mockResponse.other_role = mock_data.guest_role
  else if (req.session.role === 'waiting')
    mockResponse.other_role = mock_data.host_role

  res.setHeader('OK', 200)
  res.end(JSON.stringify(mockResponse))
})

app.use('/clear', (req, res) => {
  req.session = null
  mock_data = {
    game_id: 1738,
    host_user: 'none',
    host_role: 'none',
    guest_user: 'none',
    guest_role: 'none'
  }
  res.redirect('/')
})

app.use(express.static('public'))

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
