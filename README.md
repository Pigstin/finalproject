## image attributions 

Computer screen: by Harry Munday
Share-alike 4.0 license
https://en.wikipedia.org/wiki/File:256-pix-tbc-ld-analyse.png

Because the computer screen was used in the making of "background.png", 
the file "background.png" within this project is licensable under 
Creative commons Share-Alike 4.0. Read more about the license below:
https://creativecommons.org/licenses/by-sa/4.0/

Thumbsup: by Vincent Le Moign
https://commons.wikimedia.org/wiki/File:375-thumbs-up-1.svg

Cat: by Rosendahl
https://commons.wikimedia.org/wiki/File:Black_and_white_cat.jpg

Confetti: by freepngimg.com
https://freepngimg.com/png/10428-confetti-png-image

Stylized text: by cooltext.com
https://cooltext.com/logo-design-burning
https://cooltext.com/Logo-Design-Dark-Magic

#### Turning in Your Project
Submit a second PR on the final project repo to turn in your app and code. Again, only one pull request per team.

Deploy your app, in the form of a webpage, to Glitch/Heroku/Digital Ocean or some other service; it is critical that the application functions correctly wherever you post it.

The README for your second pull request should contain:

1. A brief description of what you created, and a link to the project itself (two paragraphs of text)
2. Any additional instructions that might be needed to fully use your project (login information etc.)
3. An outline of the technologies you used and how you used them.
4. What challenges you faced in completing the project.
5. What each group member was responsible for designing / developing.
6. A link to your project video.

Think of 1,3, and 4 in particular in a similar vein to the design / tech achievements for A1—A4… make a case for why what you did was challenging and why your implementation deserves a grade of 100%.

## Lost in Transmission

Our project is an asymmetrical puzzle game meant to be played by two players on different machines. The web interface first allows a host player to create a lobby and designate roles ('analog' and 'digital'), and allows a guest player to join an existing lobby using a join code. After both players have their roles, they are sent to their respective views. They are instructed not to communicate outside of in-game means. 

The 'analog' player sees a printer that outputs information sent to them by their teammate, and an interface to send a waveform shape and a colored light to their teammate. The 'digital' player sees a completely different interface, with a display for the analog player's waveform and colored light, and a terminal that allows them to send messages to their partner. The analog player has a grid of buttons with symbols -- their task is to communicate a series of directions to the digital player via their waveforms. The digital player can use these directions to navigate a grid graphic to find a symbol, which they can communicate to their partner. When the analog player successfully guesses the symbol, 3 times, both players are sent to a win screen! 

## Additional Instructions 

The game can be run on a single machine, so long as you have multiple tabs open. 

## Tech Stack 

We use the MERN stack -- MongoDB, Express, React, and NodeJS. All information communicated between players is stored in a MongoDB database. Express is used to manage API calls, while NodeJS directly interfaces with the MongoDB database. The frontend uses React to display responsive updating UI, and the React Router to navigate pages. 

## Challenges 

Even before programming began, we had design questions to navigate. We knew we wanted each player to have a unique view, and we know we wanted players communicating through limited in-game means to be a major part of the design -- we had long conversations over what means of communication each player should have, balancing difficulty, player expression, and technical burden. Ultimately, we decided the character-limited terminal and sending of waveforms finds us an exciting balance. 

Technically, we struggled with making a multi-view application -- we all had difficulties learning React Router. We initially planned on having the digital player's view be built in raw HTML and CSS (not using React), but scrapped this idea due to difficulties with the React Router. React also interfered with Express in some frustrating ways. We weren't able to get GET requests to work at all, and ended up aliasing them all as POST requests. The production and display of waveforms, drawn through canvas, represented a major challenge in design and implementation. 

We also had a nightmarishly difficult time trying to deploy the application, for reasons we don't entiretly understand. Our final solution (spearheaded by Artemis and Brody) was to separate the frontend and backend into differently hosted sites, respectively a static site and a web service. The end result still does not work, due to some error regarding how cookies are being stored. It will work if built from a personal machine just fine (including if built for a production environment). 

## Contributions 

All team members contributed to concept and game design. 

Artemis Calia-Bogan: Styling on lobbies flow, programming support on digital view, testing and routing

Charlotte Dugaw: Database schema design, API programming, support on lobbies flow

Brody Graham: Analog view design, style, and programming, lobbies flow design and programming

Frank Santen: Digital view design, style, and programming 

## [Project Video](https://youtu.be/_U6u9VByDjc)

## Render Links 

[Frontend](https://lost-in-transmission.onrender.com)
[Backend](https://transmission-backend.onrender.com) (idk why you would need this but here it is)
