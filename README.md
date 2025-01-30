# Firebase WhatsApp Integration

This project implements a Firebase Functions application that integrates with WhatsApp messaging using Twilio. It provides functionality to send and receive WhatsApp messages programmatically.

## Features

- HTTP endpoint for receiving WhatsApp messages
- HTTP endpoint for sending WhatsApp messages
- Automatic response handling
- TypeScript implementation
- Environment variables configuration
- Comprehensive error handling and logging

## Prerequisites

- Node.js (v22 or higher)
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Twilio account with WhatsApp capabilities
- Firebase project set up

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd functions
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `functions` directory with the following variables:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=your_whatsapp_number
   ```

3. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

4. **Configure Twilio Webhook**
   - Go to your Twilio Console
   - Navigate to WhatsApp settings
   - Set the webhook URL to your Firebase function URL: `https://YOUR_FIREBASE_PROJECT.cloudfunctions.net/onMessageReceived`
   - Make sure to configure it to handle POST requests

## Usage

### Receiving Messages

The `onMessageReceived` endpoint handles incoming WhatsApp messages. When a message is received:
1. The message content is extracted from `req.body` (`Body`, `From`, `To`)
2. The message is logged using Firebase Functions logger
3. An automatic response is sent back to the sender using the original `To` as `from` and `From` as `to`
4. A 200 status code is returned with 'Message processed successfully' on success

### Sending Messages

To send a message, make a POST request to the `sendMessage` endpoint:

```bash
curl -X POST https://YOUR_FIREBASE_PROJECT.cloudfunctions.net/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "message": "Hello from Firebase!"
  }'
```

The request body must include:
- `to`: The recipient's phone number
- `message`: The message text to send

Response format:
```json
{
  "success": true,
  "messageId": "SM123..." // Twilio message SID
}
```

## Error Handling

The application includes comprehensive error handling:
- Input validation for required fields (`to` and `message`)
- Twilio API error handling with proper error logging
- HTTP status codes:
  - 200: Successful message processing
  - 400: Missing required fields
  - 500: Twilio API errors or internal server errors
- Error logging using Firebase Functions logger

## Development

To run locally:
1. Install dependencies: `npm install`
2. Create and configure your `.env` file with all required variables
3. Start Firebase emulators: `npm run serve`
4. Use Firebase Functions shell for testing: `npm run shell`

## Environment Variables

The following environment variables are required in your `.env` file:
- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
- `TWILIO_WHATSAPP_NUMBER`: Your Twilio WhatsApp-enabled phone number (used as the sender's number)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 