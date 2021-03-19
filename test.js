// const { spawn } = require('child_process');
// //const { exec } = require('child_process');

// // exec("dir", (error, stdout, stderr) => {
// //     if (error) {
// //         console.log(`error: ${error.message}`);
// //         return;
// //     }
// //     if (stderr) {
// //         console.log(`stderr: ${stderr}`);
// //         return;
// //     }
// //     console.log(`stdout: ${stdout}`);
// // });

// //const ls = spawn("ls", ["-la"]);
// const ls = spawn("dir");

// ls.stdout.on("data", data => {
//     console.log(`stdout: ${data}`);
// });

// ls.stderr.on("data", data => {
//     console.log(`stderr: ${data}`);
// });

// ls.on('error', (error) => {
//     console.log(`error: ${error.message}`);
// });

// ls.on("close", code => {
//     console.log(`child process exited with code ${code}`);
// });


var speakeasy = require('speakeasy');

// var secret = speakeasy.generateSecret({length: 20});
// console.log(secret.base32);
const user_key = 'KZCVUNKSGMXHEY3BNMYDYSJTF5IWC2JF';

var QRCode = require('qrcode');
var email = 't.masco';
const secret = speakeasy.generateSecret({
    length: 10,
    name: email,
    issuer: 'TamilanAuth v0.1'
});
var url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: email,
    issuer: 'TamilanAuth v0.1',
    encoding: 'base32'
});
// QRCode.toDataURL(url, (err, dataURL) => {
//     commons.userObject.tfa = {
//         secret: '',
//         tempSecret: secret.base32,
//         dataURL,
//         tfaURL: url
//     };
//     return res.json({
//         message: 'TFA Auth needs to be verified',
//         tempSecret: secret.base32,
//         dataURL,
//         tfaURL: secret.otpauth_url
//     });
// });

//secret.otpauth_url
QRCode.toString(url, {type:'terminal'}, function(err, image_data) {
  console.log(image_data); // A data URI for the QR code image
});