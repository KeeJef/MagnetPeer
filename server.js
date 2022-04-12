const webtorrentHealth = require('webtorrent-health')
var express = require('express');
const magnet = require('magnet-uri')
var cors = require('cors')
var app = express();
var path = require('path');
app.use(express.json());
app.use(cors())

var public = path.join(__dirname, '.');
var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

trackerlist = ["udp://tracker.opentrackr.org:1337/announce", "udp://9.rarbg.com:2810/announce", "udp://tracker.openbittorrent.com:6969/announce", "udp://opentracker.i2p.rocks:6969/announce", "https://opentracker.i2p.rocks:443/announce", "udp://open.stealth.si:80/announce", "udp://www.torrent.eu.org:451/announce", "udp://tracker.torrent.eu.org:451/announce", "udp://exodus.desync.com:6969/announce", "udp://ipv4.tracker.harry.lu:80/announce", "udp://tracker.tiny-vps.com:6969/announce", "udp://tracker4.itzmx.com:2710/announce", "udp://tracker.dler.org:6969/announce", "udp://explodie.org:6969/announce", "udp://tracker.moeking.me:6969/announce", "udp://tracker.skyts.net:6969/announce", "udp://tracker.lelux.fi:6969/announce", "udp://tracker.babico.name.tr:8000/announce", "udp://tracker.altrosky.nl:6969/announce","udp://tracker.coppersurfer.tk:6969/announce","http://p4p.arenabg.com:1337/announce", "udp://9.rarbg.me:2780/announce", "udp://9.rarbg.to:2730/announce", "udp://9.rarbg.to:2710/announce"]



// Get Request for single b64 encoded magnet
app.get('/m/single', async (req, res) => {
    if (req.query.magnet) {
        if (base64regex.test(req.query.magnet)) {

            //Replace the pleb trackers with the most popular trackers

            decodedMagnet = decodeb64(req.query.magnet)
            torrentprom = await checkTorrentPromise(decodedMagnet)

            var response = new Object()
            response.magnetLink = decodedMagnet
            response.seeds = torrentprom.seeds
            response.leechers = torrentprom.peers

            magnetName = magnet.decode(decodedMagnet)
            console.log("User requested resolution of " + magnetName.dn)
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
app.get('/m/', function (req, res) {
    res.sendFile(path.join(public, 'magnetLandingPage.html'));
});

//Resolves an array of plain magnet links sent in a http POST, returns an array of JSON objects with seeds, leechers and the magnet
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
                    response.leechers = torrentprom.peers

                    responseArray.push(response)

                }
            }

        } catch (error) {
            res.end("Malformed Magnet array or more than 10 magnets");
            return
        }

        console.log("Magnet array resolved of length " + req.body.magnetArray.length)
        res.send(JSON.stringify(responseArray));

    }
    else {
        res.end("No request body");
    }

})

//Gets promise from webtorrenthealth with information about seeds and peers
function checkTorrentPromise(magnetURL) {

    try {

        magnetParsed = magnet.decode(magnetURL)

        if (magnetParsed.tr) {

            data = webtorrentHealth(magnetURL)
        } else {
            //if we cant read trackers extract torrent info and match with default trackers
            var newMagnet = magnet.encode({
                xt: [magnetParsed.xt],
                dn: [magnetParsed.dn],
                tr: trackerlist
            })

            data = webtorrentHealth(newMagnet)
        }
    } catch (error) {
        console.log(error + " Error retrieving peers")
    }

    return data

}

function decodeb64(data) {
    data = Buffer.from(data, 'base64').toString('ascii');
    return data
}
var server = app.listen(22887, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})