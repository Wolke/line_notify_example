"use strict";
// const readline = require('readline');
var client_id = "LQjhJidFp5eZbbqd839g0K";
var client_secret = "nxerjFKIQlqNqib9rkT6aS7LrhOhBMqRQ5JQBSVEMkW";
var redirect_uri = "https://0b8a5c25.ngrok.io/callback";
var auth_code = "";
var spawn = require('child_process').spawn;
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var readline = require("readline");
var state = "getAuthCode";
var url = "https://notify-bot.line.me/oauth/authorize?client_id=" + client_id + "&response_type=code&redirect_uri=" + redirect_uri + "&scope=notify&state=" + state + "&response_mode=form_post";
spawn('open', [url]);
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.get("/", function (req, res) {
    res.end("home");
});
app.post('/callback', function (req, rep) {
    console.log("code"); //you will get your data in this as object.
    console.log(req.body.code); //you will get your data in this as object.
    var code = req.body.code;
    console.log(req.body.state); //you will get your data in this as object.
    if ("getAuthCode" === req.body.state) {
        var formData = {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirect_uri,
            client_id: client_id,
            client_secret: client_secret
        };
        request.post({
            url: "https://notify-bot.line.me/oauth/token",
            formData: formData
        }, function (err, httpResponse, body) {
            console.log("body");
            console.log(body);
            var json = JSON.parse(body);
            var access_token = json.access_token;
            console.log(access_token);
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('say words? ', function (answer) {
                // TODO: Log the answer in a database
                console.log("Thank you for your valuable feedback: " + answer);
                request.post({
                    url: "https://notify-api.line.me/api/notify",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Bearer " + access_token
                    },
                    formData: {
                        message: answer,
                    }
                }, function (err, httpResponse, body) {
                    console.log(body);
                });
                rl.close();
            });
        });
    }
    rep.end("ok");
});
app.listen(3000);
//1.get code
//https://notify-bot.line.me/oauth/authorize?client_id=LQjhJidFp5eZbbqd839g0K&response_type=code&redirect_uri=https://0b8a5c25.ngrok.io/callback&scope=notify&state=good&response_mode=form_post
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
