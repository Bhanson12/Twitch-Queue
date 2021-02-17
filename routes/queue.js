const express = require('express');
const router = express.Router();
const request = require('request');
const ComfyJS = require('comfy.js');

const getToken = (url, callback) => {
    const options = {
        url: process.env.TOKEN_URL,
        json: true,
        body: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "client_credentials"
        }
    };

    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log('Status: ' + res.statusCode);
        console.log(body);

        callback(res);
    });
};

let accTok = '';
getToken(process.env.TOKEN_URL, (res) => {
    accTok = res.body.access_token;
    return accTok;
});

const vids = [];

const updateQueueYTube = (user, message, _callback) => {
    const vidId = getVideoId(message);
    getYoutubeVidData(vidId, (data) => {
        const vid = {id: vids.length + 1, user: user, link: message, title: data, thumbnail: "https://img.youtube.com/vi/" + vidId + "/hqdefault.jpg"};
        vids.push(vid);
        _callback(vid);
    });
}

const updateQueueTwitch = (user, message, _callback) => {
    const vidId = getVideoId(message);
    getTwitchClipData(vidId, accTok, (data) => {
        const vid = {id: vids.length + 1, user: user, link: message, title: data.title, thumbnail: data.thumbnail_url};  
        vids.push(vid);
        _callback(vid);
    });
}

const getVideoId = (url) => {
    if (isYoutubeURL(url)) {
        var regEx = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regEx);
        return (match&&match[7].length==11)? match[7] : false;
    }

    if (isTwitchClipURL(url)) {
        var regEx = /(?:https:\/\/)?(twitch.tv)\/\S+\/(clip)\/(\S+)/i;
        var result = url.match(regEx);
        return result[3];
    }
}

const isYoutubeURL = (url) => {
    var regEx = /(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/.test(url);
    return regEx;
}

const isTwitchClipURL = (url) => {
    var regEx = /(twitch.tv)\/\w+\/(clip)\/\w+/.test(url);
    return regEx;
}

const getYoutubeVidData = (id, _callback) => {
    const vidOptions = {
        url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + id + '&key=' + process.env.YOUTUBE_API_KEY,
        method: 'GET'
    };

    request.get(vidOptions, (err, res, body) => {
        if (err) {
            console.log(err);
        }
        console.log('Status: ' + res.statusCode);
        const data = JSON.parse(body);
        _callback(data.items[0].snippet.title);
    });
}

const getTwitchClipData = (url, accessToken, _callback) => {
    console.log(url);
    const clipOptions = {
        url: process.env.CLIP_URL + url,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Client-ID': process.env.CLIENT_ID
        }
    };

    request.get(clipOptions, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log('Status: ' + res.statusCode);
        const data = JSON.parse(body);
        _callback(data.data[0]);
    });
};

router.get('/api', async (req, res) => {
    res.send({vids: vids});
});

router.delete('/api/:id', (req, res) => {
    const vid = vids.find(v => v.id === parseInt(req.params.id));
    if (!vid) {return res.status(404).send('vid not found')}

    const index = vids.indexOf(vid);
    vids.splice(index, 1);

    res.send({vids: vids});
});

module.exports = {router, updateQueueYTube, updateQueueTwitch, isYoutubeURL, isTwitchClipURL};