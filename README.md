# Twitch-Queue
Queues twitch clips and YouTube videos from chat using !q <link>

ComfyJS (https://github.com/instafluff/ComfyJS) is used to pull commands and messages from twitch chat. Chat can add videos to the queue by typing !q <link>. ComfyJs is also used to get twitch chat messages so the can be displayed on the website.

The backend was developed using Nodejs express and socket.io. On the backend ComfyJS listens for messages from twitch chat. Once a message is recieved the message is sent to the frontend using socket.io.
