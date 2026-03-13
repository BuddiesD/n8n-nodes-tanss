# Authentication Operations

## Login

Login to the TANSS API

A successful login returns two tokens:

- **apiToken (apiKey)** – Used for authenticating API requests.
  - Valid for **4 hours**
  - Required to access protected API resources
- **refreshToken (refresh)** – Used to obtain a new token pair.
  - Valid for **5 days**

**Parameters:**
- No additional parameters

**Responses:**
- **200 OK**: Successful login attempt, returns apiToken and refreshToken
- **403 Forbidden**: Unsuccessful login attempt due to invalid credentials or authentication failure
