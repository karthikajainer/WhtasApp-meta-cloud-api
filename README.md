# WhatsApp Chat & Conversation System

A Node.js + Express + MongoDB backend for managing WhatsApp conversations, sending text and template messages through Meta Cloud API, and handling webhook events with JWT-authenticated roles.

## Features

- User registration and JWT login
- Admin and user roles
- WhatsApp text message sending
- WhatsApp template message sending
- Incoming webhook handling for messages and statuses
- MongoDB storage for users, conversations, and messages
- Conversation listing and message history endpoints

## Quick start

1. Copy `.env.example` to `.env` and update values.
2. Start MongoDB locally or provide a remote MongoDB URI.
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

5. Use the API under `/api` with a JWT token in the `Authorization` header as `Bearer <token>`.

## Environment variables

- `PORT` - Server port (default `5000`)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret used for JWT signing
- `WHATSAPP_ACCESS_TOKEN` - Meta Graph API access token
- `WHATSAPP_PHONE_NUMBER_ID` - WhatsApp business phone number ID
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` - Token used to verify webhook subscription

## Example endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/conversations`
- `POST /api/whatsapp/send-text`
- `POST /api/whatsapp/send-template`
- `GET /api/whatsapp/webhook`
- `POST /api/whatsapp/webhook`

## Notes

This project is intended as a backend starter for a WhatsApp conversation system. For production use, add request validation, role-based business logic, rate limiting, and robust webhook verification.
