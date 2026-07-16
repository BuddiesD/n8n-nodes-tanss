# Mails Operations

## Test SMTP Settings

**API Endpoint:** POST /api/v1/mails/test/smtp

Test SMTP email settings by sending a test email.

**Parameters:**

- **Receiver** (required)
- **SMTP Address**
- **SMTP Host**
- **SMTP User**
- **SMTP Password**
- **SMTP Auth**
- **SMTP Encryption Type**
- **SMTP Sender Name**

## Get Mail List

**API Endpoint:** PUT /api/v1/mails

Loads a filtered/paginated list of mails.

**Parameters:**

- **Company ID**
- **Fetch Ticket Infos**
- **Check Permissions**
- **Sort Field** (ID / DATE)
- **Sort Order** (ASC / DESC)

## Get Pending Retries

**API Endpoint:** GET /api/v1/mails/retry

Lists all outgoing mails whose delivery has failed and is queued for retry.

**Parameters:**

- None

## Retry Sending Mail

**API Endpoint:** GET /api/v1/mails/retry/resend/{retryId}

Re-attempts delivery of a previously failed outgoing mail.

**Parameters:**

- **Retry ID** (required)

## Delete Retry Mail

**API Endpoint:** DELETE /api/v1/mails/retry/{retryId}

Removes a pending mail retry so TANSS will no longer try to deliver that outgoing mail.

**Parameters:**

- **Retry ID** (required)

## Get Mail

**API Endpoint:** GET /api/v1/mails/{mailId}

Returns a single mail (subject, body, sender, attachments, status).

**Parameters:**

- **Mail ID** (required)
- **Translate CID** — Rewrites cid: references in HTML body to TANSS attachment URLs

## Delete Mail

**API Endpoint:** DELETE /api/v1/mails/{mailId}

Removes a mail. If `ticketId` is given, the mail is only detached from that ticket.

**Parameters:**

- **Mail ID** (required)
- **Ticket ID** — Optional, detaches from this ticket instead of deleting
