# Breaking Changes

This document lists all breaking changes organized by version, so you can plan upgrades accordingly.

---

## Version 1.1.0

### Credentials & Auth Overhaul

**Updating from versions 1.1.0 or earlier can break existing workflows until credentials and auth setup are migrated.**

- The legacy credential `TanssApi` is **removed**.
- Authentication is now handled via `Auth Mode` and two credential types:
  - `TANSS User API` (username/password, optional 2FA, auto refresh)
  - `TANSS Generated Token API` (static generated token)
- Existing workflows using old credentials must be **reconfigured** with one of the new credential types.
- The old dedicated Authentication resource/node operations were **removed**.
- If your workflow previously used Authentication operations to obtain tokens manually, switch to normal resource operations with the configured credentials.
- TANSS credentials are now also usable in the normal n8n `HTTP Request` node.

### 2FA (Two-Factor Authentication)

- A new **TANSS Node** was released on **October 27, 2025**.
- **Existing credentials are not compatible** due to the introduction of **2FA (Two-Factor Authentication)**.
- You can install both versions, but **2FA functionality will only be visible after uninstalling** the old package.
  - Old: [n8n-nodes-tanss-api](https://www.npmjs.com/package/n8n-nodes-tanss-api)
  - New: [n8n-nodes-tanss](https://www.npmjs.com/package/n8n-nodes-tanss)

### Migration Steps

1. **Uninstall** the old package (`n8n-nodes-tanss-api`) if you want 2FA support.
2. **Create new credentials** using either `TANSS User API` or `TANSS Generated Token API`.
3. **Update all workflows** that reference the old `TanssApi` credential to use the new credential type.
4. **Remove any Authentication resource operations** from your workflows, authentication is now handled automatically by the credentials.
5. **Test your workflows** to ensure they work with the new credential system.
