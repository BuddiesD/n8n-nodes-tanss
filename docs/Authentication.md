# Authentication

The TANSS node no longer exposes an `Authentication` resource operation.

Authentication is handled exclusively via credentials and `Auth Mode`:

- `User Login (Auto Refresh)`
  - Uses credential type `TANSS User API`
  - Required fields: `Base URL`, `Username`, `Password`
  - Optional: `2FA Secret`
  - Internally handles token lifecycle and refresh

- `Generated Token`
  - Uses credential type `TANSS Generated Token API`
  - Required fields: `Base URL`, `Generated API Token`
  - Uses static generated token scopes

## TANSS token model

A TANSS login response provides:

- `apiToken` (apiKey): token used for API requests
- `refreshToken` (refresh): token used to request a new token pair

According to TANSS API docs:

- `apiToken` expires after about 4 hours
- `refreshToken` is valid for about 5 days
- Requests authenticate via `apiToken` HTTP header
