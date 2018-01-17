// const readline = require('readline');
var client_id = "NtP97LGBUEjt9T6XVCjR5b";
var client_secret = "IJqvGHmerFsxjux4BrmhQZnhjMF33leU1nDEABDNbCb";
var redirect_uri = "https://c76234b1.ngrok.io/callback" + "?uid=test";

var spawn = require('child_process').spawn
import https = require("https");
import * as express from "express";
import * as bodyParser from "body-parser";
import * as request from "request";
var readline = require("readline");

//1.start to get auth code
var state = "getAuthCode"
var url = "https://notify-bot.line.me/oauth/authorize?client_id=" + client_id + "&response_type=code&redirect_uri=" + redirect_uri + "&scope=notify&state=" + state + "&response_mode=form_post";
console.log(url)
spawn('open', [url]);


let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.post('/callback', function (req, rep) {
    let code = req.body.code;
    let uid =  req.query.uid;
    if ("getAuthCode" === req.body.state) {
        //2.start get auth token
        var formData = {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirect_uri,
            client_id: client_id,
            client_secret: client_secret
        }
        request.post({
            url: "https://notify-bot.line.me/oauth/token",
            formData: formData
        },
            (err, httpResponse, body) => {
                var json = JSON.parse(body);
                const access_token = json.access_token;
                //set uid with access_token

                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                let ansyncQ = () => {
                    rl.question('say words? ', (answer) => {
                        //3.start to notify
                        console.log(answer, access_token)

                        request.post({
                            url: "https://notify-api.line.me/api/notify",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Authorization": "Bearer " + access_token
                            },
                            formData: {
                                message: answer,
                            }
                        },
                            (err, httpResponse, body) => {

                                console.log(body);
                            }
                        )
                        ansyncQ();


                        // rl.close();
                    });
                }
                ansyncQ();


            });
    }
    rep.end("ok")
})
app.listen(3000);
