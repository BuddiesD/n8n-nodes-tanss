# Ticket Content Operations

## Get Ticket Documents

Retrieve all documents attached to a ticket.

**Parameters:**

- **Ticket ID** (required)

## Get Ticket Document

Generate a one-time download URL for a specific ticket document.

**Parameters:**

- **Ticket ID** (required)
- **Document ID** (required)

## Get Ticket Images

Retrieve all images (screenshots) attached to a ticket.

**Parameters:**

- **Ticket ID** (required)

## Get Ticket Image

Generate a one-time download URL for a specific ticket image.

**Parameters:**

- **Ticket ID** (required)
- **Image ID** (required)

## Upload Document / Image

Upload a document or image to a ticket using `multipart/form-data`.

**Parameters:**

- **Ticket ID** (required)
- **Binary Property Name**
- **Descriptions**
