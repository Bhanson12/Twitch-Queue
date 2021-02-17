require('dotenv').config();
const express = require('express');
// express app
const app = express();
const queueRoutes = require('./routes/queue');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ComfyJS = require('comfy.js');

// view engine
app.set('views', './views');
app.set('view engine', 'ejs');

// static files
app.use(express.static('public'));

// ComfyJS
ComfyJS.Init( "bray_lay" );

let userCount = 0;
io.on('connection', socket => {
	console.log('New WS Connection...');

    userCount++;
    io.emit('userCount', {userCount: userCount});

	// sends twitch chat msg to client
	ComfyJS.onChat = ( user, message, flags, self, extra ) => {
		socket.emit('msg', {user: user, message: message, color: extra.userColor});
	}

	// sends twitch chat video link to client
	ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
		if(command === "q") {
		  console.log(message);
			if (queueRoutes.isYoutubeURL(message)) {
				queueRoutes.updateQueueYTube(user, message, (data) => {
					socket.emit('vid', data);
				});
			}
	
			if (queueRoutes.isTwitchClipURL(message)) {
				queueRoutes.updateQueueTwitch(user, message, (data) => {
					socket.emit('vid', data);
				});
			}
		}
	}

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userCount', {userCount: userCount});
        console.log('disconnected');
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/queue', queueRoutes.router);

// 404 page
app.use((req, res) => {
	res.render('404');
});

// listen for requests
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}...`));