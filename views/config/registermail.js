const { options } = require('joi');
const nodemailer = require('nodemailer');
require("dotenv").config();
const RegiserMail=async(email,name,appname)=>{
    
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});
 
let mailDetails = {
    from: process.env.EMAIL,
    to: email,
    subject: 'loging Registerd successfully ',
    html:`<p>Thanks You Registering with us ${name},Welcome to ${appname}</p>`
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error Occurs');
    } else {
        console.log('Email Registerd successfully',data);
    }
});
}

module.exports=RegiserMail