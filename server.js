const webtorrentHealth = require('webtorrent-health')
var express = require('express');
var app = express();
app.use(express.json());
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

app.post('/m/multi', async (req, res) => {


    console.log(req.body)


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