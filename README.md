<strong>This API allows you to fetch the Seed and Leacher count for a magnet link. <br><br>

If you want to resolve a single magnet link call </strong> <br><br>

https://cryptocommit.org/m/single <br><br>

<strong> with a base 64 encoded magnet link, for example </strong><br><br>

https://cryptocommit.org/m/single?magnet=bWFnbmV0Oj94dD11cm46YnRpaDpRUlNQSVo2N1ZJMkxXMjI0NkYzRjdLTFZFMkJMWTNSUiZkbj1naW1wLTIuMTAuMzAtc2V0dXAuZXhlJnhsPTI1NzI1OTAzMiZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLm9wZW50cmFja3Iub3JnJTNBMTMzNyUyRmFubm91bmNl <br><br>

<strong>This will return a JSON object like </strong> <br><br>

{magnetLink: 'magnet:?xt=urn:btih:QRSPIZ67VI2LW2246F3F7KL…2Ftracker.opentrackr.org%3A1337%2Fannounce', seeds: 1939, leachers: 17} <br><br>

<strong> if you want to resolve multiple magnet links, call </strong><br><br>

https://cryptocommit.org/m/multi <br><br>

<strong>in a post request it will accept an array of up to 10 raw magnets (not base 64 encoded) like </strong> <br><br>

['magnet:?xt=urn:btih:QRSPIZ67VI2LW2246F3F7KLVE2BLY3RR&dn=gimp-2.10.30-setup.exe&xl=257259032&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce', 'magnet:?xt=urn:btih:QRSPIZ67VI2LW2246F3F7KLVE2BLY3RR&dn=gimp-2.10.30-setup.exe&xl=257259032&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce'] <br><br>

<strong> it will return a Json object like </strong><br><br>

[{"magnetLink":"magnet:?xt=urn:btih:e8e....hant.org%3A12710","seeds":325,"leachers":18},{"magnetLink":"magnet:?xt=urn:btih:ef232....%1A2421450","seeds":344,"leachers":28}] <br><br>
