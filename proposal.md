# Untitled Asynchrounous Puzzle Game

## By Artemis Calia-Bogan, Charlotte Dugaw, Brody Graham, Frank Santen

Our team is making an asymmetrical escape-room-style puzzle game. Players have the ability to create and connect to a game instance with one other player, where each of them will have to work together on different screens (and using different UIs) in order to both escape. Once in-game, the players are encouraged to not communicate at all aside from through in-game means, which are limited.

Player O1's user interface is made using exclusively HTML and CSS, and it imitates a terminal. The player is able to type messages which the other player can read directly. Player 2's user interface is made using React and is more tactile, with reactive buttons and other inputs. Both players have information the other needs to solve puzzles and escape, and if they win, they win as a duo! The goal is for a full game to take 10-30 minutes.

Information that is shared between players, along with information reflecting progress through the game, is stored in a MongoDB database containing all game instances. Both players are only communicating directly with this database -- they aren't connected to one another directly. 

---

A list of key technologies used in this project would be as follows:

- React
- MongoDB
- ExpressJS
