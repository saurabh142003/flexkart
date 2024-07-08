// ****** IGNORE THIS FILE **************** ////////////////////////////


import express from 'express'
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "saurabhmishra142003@gmail.com",
      pass: "bzzebfmiztiguzlk"
    }
  });
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Real Estate',
      link: 'https://your-product-url.com',
    },
  });
export const sendEMail = async (req,res,next)=>{
  
    const { sender, recipient, subject, message } = req.body;
    if(!sender || !recipient || !subject || !message){
        res.status("some details are not provided")
    }
    console.log('Email request:', JSON.stringify(req.body, null, 2));
    const email = {
        body: {
          name: recipient,
          intro: message,
          outro: 'Looking forward to hearing from you.'
        }
      };
    const emailBody = mailGenerator.generate(email)  

    const mailOptions = {
      from: sender,
      to: recipient,
      subject: subject,
      html: emailBody
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(info)
      res.status(200).json({ success: true, message: 'Email sent successfully', info: info.response });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json('Failed to send email');
    }

}