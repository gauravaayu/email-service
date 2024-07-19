require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Email to be sent to the user who submitted the form
    const mailOptionsToUser = {
        from: 'your-email@gmail.com', // Your email address
        to: email, // User's email address
        subject: 'Confirmation of Your Contact Form Submission',
        text: `Hi ${name},\n\nThank you for reaching out! We received your message:\n\n"${message}"\n\nWe will get back to you shortly.\n\nBest Regards,\nYour Company`
    };

    // Email to be sent to you (or another recipient)
    const mailOptionsToAdmin = {
        from: email,
        to: 'recipient-email@example.com', // Your email address
        subject: `New Contact Form Submission from ${name}`,
        text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send email to the user
    transporter.sendMail(mailOptionsToUser, (error, info) => {
        if (error) {
            console.log('Error sending confirmation email to user:', error);
            return res.status(500).send('Internal Server Error');
        }

        // Send email to admin
        transporter.sendMail(mailOptionsToAdmin, (error, info) => {
            if (error) {
                console.log('Error sending notification email to admin:', error);
                return res.status(500).send('Internal Server Error');
            }

            console.log('Emails sent:', info.response);
            res.status(200).send('Emails sent');
        });
    });
});
