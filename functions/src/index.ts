/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Twilio } from 'twilio';
import * as logger from 'firebase-functions/logger';
import * as dotenv from 'dotenv';

/**
 * Load environment variables from .env file
 * This allows us to configure the bot without hardcoding sensitive data
 */
dotenv.config();


// Initialize Firebase Admin
admin.initializeApp();

// Initialize Twilio client
const twilioClient = new Twilio(
    process.env.TWILIO_ACCOUNT_SID || '',
    process.env.TWILIO_AUTH_TOKEN || ''
);

// Function to handle incoming WhatsApp messages
export const onMessageReceived = functions.https.onRequest(async (req, res) => {
    try {
        const { Body, From, To } = req.body;
        // Log the incoming message
        logger.info(`Received WhatsApp message: ${Body}`);
        // Send an automatic response
        await twilioClient.messages.create({
            body: `Message received: "${Body}".`,
            from: To,
            to: From
        });

        res.status(200).send('Message processed successfully');
    } catch (error) {
        logger.error('Error processing message:', error);
        res.status(500).send('Error processing message');
    }
});

// Function to send WhatsApp messages
export const sendMessage = functions.https.onRequest(async (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
        res.status(400).json({
            success: false,
            error: 'The request must include "to" and "message" fields'
        });
        return;
    }

    try {
        const response = await twilioClient.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
        });

        res.status(200).json({
            success: true,
            messageId: response.sid
        });
    } catch (error) {
        logger.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            error: 'Error sending message via Twilio'
        });
    }
});

// Function to send files via WhatsApp
export const sendFile = functions.https.onRequest(async (req, res) => {
    const { to, fileUrl } = req.body;

    if (!to || !fileUrl) {
        res.status(400).json({
            success: false,
            error: 'The request must include "to" and "fileUrl" fields'
        });
        return;
    }

    try {
        const response = await twilioClient.messages.create({
            mediaUrl: [fileUrl],
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
        });

        res.status(200).json({
            success: true,
            messageId: response.sid
        });
    } catch (error) {
        logger.error('Error sending file:', error);
        res.status(500).json({
            success: false,
            error: 'Error sending file via Twilio'
        });
    }
});
