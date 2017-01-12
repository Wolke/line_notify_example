// const readline = require('readline');
var client_id = "LQjhJidFp5eZbbqd839g0K";
var client_secret = "nxerjFKIQlqNqib9rkT6aS7LrhOhBMqRQ5JQBSVEMkW";
var redirect_uri = "https://0b8a5c25.ngrok.io/callback";
var auth_code = "";

var spawn = require('child_process').spawn
import * as builder from "botbuilder";
import https = require("https");
import express = require("express");
import bodyParser = require('body-parser');
import request = require("request");
var readline = require("readline");

//1.start to get auth code
var state = "getAuthCode"
var url = "https://notify-bot.line.me/oauth/authorize?client_id=" + client_id + "&response_type=code&redirect_uri=" + redirect_uri + "&scope=notify&state=" + state + "&response_mode=form_post";
spawn('open', [url]);


let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.post('/callback', function (req, rep) {
    let code = req.body.code;
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

                let access_token = json.access_token;

                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl.question('say words? ', (answer) => {
                    //3.start to notify
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

                    rl.close();
                });

            });
    }
    rep.end("ok")
})
app.listen(3000);


//1.get code


//2.get access tokken
// var formData = {
//     grant_type : "authorization_code",
//     code : "Nghijm8sJVSWvOJM2okYeZ",
//     redirect_uri : "https://0b8a5c25.ngrok.io/callback",
//     client_id : "LQjhJidFp5eZbbqd839g0K",
//     client_secret : "nxerjFKIQlqNqib9rkT6aS7LrhOhBMqRQ5JQBSVEMkW"
// }
// request.post({
//     url:"https://notify-bot.line.me/oauth/token",
//     formData  : formData
// },

// (err, httpResponse, body)=>{
//     // console.log(err);

//     // console.log(httpResponse);

//     console.log(body);

// });
//3.
// request.post({
//     url:"https://notify-api.line.me/api/notify",
//     headers : {
// "Content-Type":"application/x-www-form-urlencoded",
//     "Authorization" : "Bearer iKpUPQH8Be0UzdOdyGQiDl590yhaOMPqqW5AMWnSCh7"
//     },
//     formData: {
//             message :"Hello 中文呢?",

//         }
//     },

// (err, httpResponse, body)=>{

//     console.log(body);

// }


//3.
