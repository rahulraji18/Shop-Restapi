const nodeMailer = require('nodemailer');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async(options) => {

const msg = {
  from: process.env.EMAIL, 
  to: options.email, 
  subject: options.subject,
  text: options.message,
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
await sgMail.send(msg)

};

module.exports = sendEmail;