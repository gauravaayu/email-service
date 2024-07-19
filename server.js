require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const nodemailer = require('nodemailer');

// Export the serverless function
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptionsToUser = {
        from: `${process.env.EMAIL_USER}`, // Replace with your email address
        to: email, // The user's email address
        subject: 'Confirmation of Your Contact Form Submission',
        text: `Hi ${name},\n\nThank you for reaching out! We received your message:\n\n"${message}"\n\nWe will get back to you shortly.\n\nBest Regards,\nYour Company`,
    };

    const mailOptionsToAdmin = {
        from: email, // The user's email address
        to: `${process.env.EMAIL_USER}`, // Replace with your email address
        subject: `New Contact Form Submission from ${name}`,
        text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptionsToUser);
        await transporter.sendMail(mailOptionsToAdmin);
        return res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

