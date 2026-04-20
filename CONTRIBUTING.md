# Contributing to n8n-nodes-tanss

Thank you for considering contributing to this project.
Community contributions are what keep open-source projects growing and improving, and every contribution is highly appreciated.

## Local Development Setup

This project is an n8n community node and must be run from source for local development.

### Prerequisites

- Node.js (v22.20.0 recommended)
- npm

### 1. Clone the repository

You can clone the repository anywhere on your system. It does not need to be inside the n8n directory.

```bash
git clone https://github.com/BuddiesD/n8n-nodes-tanss.git
cd n8n-nodes-tanss
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development mode

Run the node in development mode with live reloading:

```bash
npm run dev
```

This command uses n8n-node dev to build the node, start a local n8n instance, and automatically apply code changes during development.

npm run dev is equivalent to running n8n-node dev directly.

Note: The first startup may time out because n8n is being downloaded and set up.

### Development (Dev Container)

To start n8n with the custom node, run:

```bash
npm run dev
```

## Development Commands

Use these commands during development:

- Start local dev mode: `npm run dev`
- Build the node: `npm run build`
- Run lint checks: `npm run lint`
- Fix lint issues automatically: `npm run lint:fix`
- Check formatting: `npm run format`
- Fix formatting automatically: `npm run format:fix`

## Reporting Bugs

When submitting bug reports, please make sure they are:

- Reproducible: Clearly describe the steps required to reproduce the issue.
- Detailed: Include relevant information such as versions, environment, and setup.
- Unique: Avoid creating duplicate issues by checking existing ones first.
- Focused: Report one bug per issue to keep discussions clear and effective.

## Pull Requests

Please ensure your changes are clear, well-scoped, and consistent with the existing project style.
If possible, verify your changes locally before opening a pull request.
