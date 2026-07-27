# n8n-nodes-tanss

> [!WARNING]
> **Before upgrading, check [BREAKING_CHANGES.md](BREAKING_CHANGES.md) for migration details.**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![CodeFactor](https://www.codefactor.io/repository/github/buddiesd/n8n-nodes-tanss/badge)](https://www.codefactor.io/repository/github/buddiesd/n8n-nodes-tanss)

<div align="center">
<img src="./docs/images/n8n_tanss.png" width="70%">
</div>
<br>
This is an n8n community node. It lets you use the TANSS API in your n8n workflows.<br>
TANSS is a professional ticket and service management system for handling support tickets, customer communication, and internal processes.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Contents

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Resources](#resources)
- [ToDo list](docs/todo.md)
- [Changelog](CHANGELOG.md)
- [Breaking Changes](BREAKING_CHANGES.md)
- [Disclaimer](#disclaimer)
- [Contributing](#contributing)

## Installation

### For installation in n8n

Follow the official [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

---

### For Local Development

This project is an **n8n community node** and must be run from source for local development.

#### Prerequisites

- Node.js (v22.20.0 recommended)
- npm

#### 1. Clone the repository

You can clone the repository anywhere on your system — it does **not** need to be inside the n8n directory.
```bash
git clone https://github.com/BuddiesD/n8n-nodes-tanss.git
cd n8n-nodes-tanss
```
#### 2. Install dependencies
```bash
npm install
```
#### 3. Start development mode

Run the node in development mode with live reloading:

```bash
npm run dev
```
This command uses `n8n-node dev` to build the node, start a local n8n instance, and automatically apply code changes during development.

`npm run dev` is equivalent to running `n8n-node dev` directly.

### Development (Dev Container)
To start **n8n** with the custom node, run: `npm run dev`

Note: The first startup may time out because n8n is being downloaded and set up.

## Operations

The following operations are supported by this node and are documented in the **[ToDo list](docs/todo.md)** and the **TANSS API documentation**.

**Operations currently implemented** in the node are marked as **Done** or **Testing** in the [ToDo list](docs/todo.md).
A complete overview of all available operations can be found in the TANSS API documentation.

- [ToDo list](docs/todo.md)
- [Tanss API documentation](https://api-doc.tanss.de/)

## Credentials

Authentication is now fully credential-based and also works with n8n `HTTP Request` using TANSS credentials.

Use the node parameter `Auth Mode` and select one credential type:

- `User Login (Auto Refresh)`
  - Credential: `TANSS User API`
  - Fields: `Base URL`, `Username`, `Password`, optional `2FA Secret`
  - Automatically refreshes tokens using `refreshToken` when possible

- `Generated Token`
  - Credential: `TANSS Generated Token API`
  - Fields: `Base URL`, `Generated API Token`
  - Uses static generated token scopes (no refresh)

## Compatibility

Compatible with n8n@1.60.0 or later<br>
Tested with TANSS API. Version: 10.15.0

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Tanss API documentation](https://api-doc.tanss.de/)

## To-Do / Progress

A detailed breakdown of all implemented and pending API endpoints is available in the **[ToDo list](docs/todo.md)**.

**Quick stats:**

| Metric | Value |
| :--- | :--- |
| **Implemented** | **208** |
| **ToDo** | **363** |
| **Planned (Implemented + ToDo)** | **571** |
| **Not Planned** | **286** |
| **Completion** | **36%** |
| **Total API Endpoints** | **857** | 


## Disclaimer

**This is an unofficial, community-maintained project** it is **not** affiliated with, endorsed by, or sponsored by TANSS or its parent company.

- **Trademarks:** "TANSS" and all related names, logos, and product identifiers are trademarks of their respective owners. Their use here is purely descriptive and does not imply any official relationship.
- **Access requirement:** Using this node requires a valid TANSS installation with appropriate API permissions. The authors are not responsible for providing or facilitating access to any TANSS system.
- **No warranty:** This software is provided **as-is**, without any express or implied warranties. The authors make no guarantees regarding:
  - Correctness or completeness of the API integration
  - Compatibility with specific TANSS versions
- **Liability:** In no event shall the authors be held liable for any damages arising from the use of this software, including but not limited to data loss, service interruptions, or business disruptions.

## Contributing

Thank you for considering contributing to this project! Community contributions are what keep open-source projects growing and improving, and every contribution is highly appreciated.

When submitting bug reports, please make sure they are:

- **Reproducible** – clearly describe the steps required to reproduce the issue.
- **Detailed** – include relevant information such as versions, environment, and setup.
- **Unique** – avoid creating duplicate issues by checking existing ones first.
- **Focused** – report one bug per issue to keep discussions clear and effective.

