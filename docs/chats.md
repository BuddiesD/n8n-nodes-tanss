# Chats Operations

## Create Chat

**API Endpoint:** POST /api/v1/chats

Creates a new chat in TANSS.

**Parameters:**

- **API Token** (required)
- **ID**
- **Description**
- **Link Type ID**
- **Link ID**
- **Status**
- **Closed By Employee ID**
- **Expected Response Time (Timestamp)**
- **Created By Employee ID**
- **Creation Date (Timestamp)**
- **Messages (JSON Array)**
- **Participants (JSON Array)**
- **Logs (JSON Array)**

## Get Chats

**API Endpoint:** PUT /api/v1/chats

Get a list of chats using filter settings.

**Parameters:**

- **API Token** (required)
- **Employee ID**
- **Only Expected Time Expired**
- **Chat IDs (JSON Array)**
- **Status**
- **Search String**
- **Link Type ID**
- **Link ID**
- **Link IDs (JSON Array)**
- **Creator ID**
- **Show Only Participated Chat**
- **Load Messages**
- **Fill Linked Entities**
- **Minimum Creation Date (Timestamp)**
- **Items Per Page**
- **Page**

## Get Chat

**API Endpoint:** GET /api/v1/chats/{chatId}

Gets a specific chat.

**Parameters:**

- **API Token** (required)
- **Chat ID** (required)
- **With Messages**

## Get Chat Close Requests

**API Endpoint:** GET /api/v1/chats/closeRequests

Gets chat close requests and chats with unread messages.

**Parameters:**

- **API Token** (required)

## Create Chat Message

**API Endpoint:** POST /api/v1/chats/messages

Creates a new chat message.

**Parameters:**

- **API Token** (required)
- **Chat ID**
- **Content**
- **Expected Response (Minutes)**

## Add Participant

**API Endpoint:** POST /api/v1/chats/participants

Adds a participant (employee or department) to a chat.

**Parameters:**

- **API Token** (required)
- **Chat ID**
- **Employee ID**
- **Department ID**

## Delete Participant

**API Endpoint:** DELETE /api/v1/chats/participants

Deletes a participant from a chat.

**Parameters:**

- **API Token** (required)
- **Chat ID**
- **Employee ID**
- **Department ID**

## Close Chat

**API Endpoint:** POST /api/v1/chats/close/{chatId}

Closes a chat.

**Parameters:**

- **API Token** (required)
- **Chat ID** (required)

## Accept/Decline Close Request

**API Endpoint:** PUT /api/v1/chats/close/{chatId}

Accepts or declines a close request.

**Parameters:**

- **API Token** (required)
- **Chat ID** (required)
- **Accept** (required)

## Re-Open Chat

**API Endpoint:** POST /api/v1/chats/reOpen/{chatId}

Re-opens a closed chat.

**Parameters:**

- **API Token** (required)
- **Chat ID** (required)
