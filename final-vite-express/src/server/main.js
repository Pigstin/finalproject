import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

app.use("/test", (req, res) => {
  res.redirect('other')
})

app.use("/teststatic", (req, res) => {
  res.redirect('second.html')
})

app.use("/lobby/create", (req, res) => {
  //TODO: Actually create a database object
  //TODO: Set this client's session cookies to have username and game_id
  res.redirect('/host')
})

app.use("/lobby/join", (req, res) => {
  //TODO: Actually modify database object
  //TODO: Set client's session cookies to have username and game_id
  res.redirect('/guest')
})

app.get('/refresh', (req, res, next) => {
  // TODO : Actually have this send over correct game/user data
  // Get requesting client's role in session cookies (req.session.role)
  // If role = host, other_role = database.guest_role
  // Elif role = guest, other_role = database.host_role

  // For now this just sends over that the other player has the "waiting" role
  let mockResponse = { other_role: "waiting" }
  res.setHeader('OK', 200)
  res.end(JSON.stringify(mockResponse))
})

app.use(express.static('public'))

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
