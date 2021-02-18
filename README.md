# Twitch-Queue
Queues Twitch clips and YouTube videos from chat using !q <link>

ComfyJS (https://github.com/instafluff/ComfyJS) is used to pull commands and messages from Twitch chat. Chat can add videos to the queue by typing !q <link>. ComfyJs is also used to get Twitch chat messages so the can be displayed on the website.

The backend was developed using Nodejs express and socket.io. On the backend ComfyJS listens for a message in twitch chat. Once a message is received it is sent to the frontend using socket.io.

Using the YouTube data API I am able to get the title of the YouTube video. I also use the Twitch API to get the thumbnail and title of the Twitch clip.
