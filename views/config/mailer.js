const { options } = require('joi');
const nodemailer = require('nodemailer');
require("dotenv").config();

const sendMail=async(email,otp)=>{
    
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
    subject: 'Reset password',
    
    html:`<p>Please check the ${otp}, It is valid for few minutes</p>`
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error Occurs');
    } else {
        console.log('Email sent successfully',data);
    }
});
}

module.exports=sendMail