const webtorrentHealth = require('webtorrent-health')
var express = require('express');
var app = express();
var path = require('path');
app.use(express.json());

var public = path.join(__dirname, '.');
var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;


// Get Request for single b64 encoded magnet
app.get('/m/single', async (req, res) => {
    if (req.query.magnet) {
        if (base64regex.test(req.query.magnet)) {

            decodedMagnet = decodeb64(req.query.magnet)
            torrentprom = await checkTorrentPromise(decodedMagnet)

            var response = new Object()
            response.magnetLink = decodedMagnet
            response.seeds = torrentprom.seeds
            response.leachers = torrentprom.peers

            res.end(JSON.stringify(response));

        }
        else {
            res.end("Magnet not B64 encoded");
        }

    }
    else {
        res.end("No magnet provided");
    }

})

//html page for magnets
app.get('/m/', function(req, res) {
    res.sendFile(path.join(public, 'magnetLandingPage.html'));
});

//Resolves an array of plain magnet links sent in a http POST, returns an array of JSON objects with seeds, leachers and the magnet
app.use('/m/multi', async (req, res) => {

    var responseArray = []

    if (req.body) {

        try {

            if (req.body.magnetArray.length <= 10) {

                for (let index = 0; index < req.body.magnetArray.length; index++) {

                    var magnet = req.body.magnetArray[index];
                    torrentprom = await checkTorrentPromise(magnet)

                    var response = new Object()
                    response.magnetLink = magnet
                    response.seeds = torrentprom.seeds
                    response.leachers = torrentprom.peers

                    responseArray.push(response)

                }
            }

        } catch (error) {
            res.end("Malformed Magnet array or more than 10 magnets");
            return
        }
        res.send(JSON.stringify(responseArray));

    }
    else {
        res.end("No request body");
    }

})

//Gets promise from webtorrenthealth with information about seeds and peers
function checkTorrentPromise(magnetURL) {
    return webtorrentHealth(magnetURL)
}

function decodeb64(data) {
    data = Buffer.from(data, 'base64').toString('ascii');
    return data
}
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})