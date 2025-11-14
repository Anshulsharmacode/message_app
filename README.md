# Next.js Full Stack Anonymous Messaging App

This project is a full-stack anonymous messaging platform built using **Next.js App Router**, **MongoDB**, **NextAuth**, and an **email-based verification system**.
Users can register, verify their account through an email code, log in, receive/send anonymous messages, manage message preferences, and use AI-powered message suggestions.

---

# Features

- Full-stack application using Next.js (App Router)
- Email verification system
- Authentication using NextAuth (Credentials Provider)
- Anonymous message sending system
- AI-generated message suggestions
- Enable or disable message receiving
- Delete messages
- MongoDB database with Mongoose

---

# API Documentation

## 1. Signup

**POST** `/api/signup`

Registers a new user and sends them a verification email.

### Request Body

```json
{
  "email": "abc@gmail.com",
  "username": "abc",
  "password": "12345"
}
```

### Response

```json
{
  "success": true,
  "message": "Verification email sent successfully check your inbox",
  "isAcceptingMessages": true
}
```

---

## 2. Verify Code

**POST** `/api/verify_code`

Verifies the email verification code.

### Request Body

```json
{
  "username": "abc",
  "code": "266960"
}
```

### Response

```json
{
  "success": true,
  "message": "Code verified successfully",
  "isAcceptingMessages": true
}
```

---

## 3. Login (NextAuth)

**POST** `/api/auth/[...nextauth]`

Authenticates a user through NextAuth.

### Example Login Payload

```json
{
  "email": "abc@gmail.com",
  "password": "12345"
}
```

NextAuth handles the session/token automatically after login.

---

## 4. Send Message

**POST** `/api/send_message`

Sends an anonymous message to a user.

### Request Body

```json
{
  "username": "abc",
  "content": "hello"
}
```

### Response

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

---

## 5. Get Messages

**GET** `/api/get_message`

Retrieves all messages for the logged-in user.

### Response

```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "messages": [
    {
      "content": "hello",
      "createdAt": "2025-11-14T18:51:13.229Z",
      "_id": "69177a2159843a695eb6d241"
    }
  ]
}
```

---

## 6. Delete Message

**DELETE** `/api/delete/[id]`

Deletes a user message by its ID.

### Example

```
DELETE /api/delete/69177a2159843a695eb6d241
```

### Response

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## 7. AI Message Suggestions

**POST** `/api/ai`

Generates random conversation/message suggestions using an AI model.

### Response

```json
{
  "result": "What's a song that always puts you in a good mood? || If you could invent something to make life a little easier, what would it be? || What's a small joy or simple pleasure that brightens your day?"
}
```

---

## 8. Accept / Disable Message Receiving

**POST** `/api/accept_message`

Enables or disables the ability to receive messages.

### Request Body

```json
{
  "acceptMessage": "false"
}
```

### Response

```json
{
  "success": true,
  "message": "Messages are now enabled"
}
```

---

# Database

## Local MongoDB URL

```
mongodb://localhost:27017
```

With a database:

```
mongodb://localhost:27017/yourdbname
```

---

# Technology Stack

- Next.js 14+ (App Router)
- NextAuth (Credentials Provider)
- MongoDB with Mongoose
- Nodemailer for email verification
- OpenAI API for AI suggestions
- Tailwind CSS for styling (if used)

---

# Getting Started

### 1. Clone the repository

```
git clone git@github.com:abccode/message_app.git
cd project-folder
```

### 2. Install dependencies

```
npm install
```

### 3. Create `.env.local`

```
MONGODB_URI=mongodb://localhost:27017/yourdbname
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_USER=your-email
EMAIL_PASS=your-app-password
GOOGLE_API_KEY=your-openai-key
```

### 4. Run development server

```
npm run dev
```
