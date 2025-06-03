<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/calcom/cal.com">
   <img src="https://github.com/dev-mayanktiwari/labelnet/blob/main/public/banner.png?raw=true" alt="Logo">
  </a>

  <h3 align="center">LabelChain (a Solana based Data Labelling Platform)</h3>

  <p align="center">
    An open source decentralized data labelling platform.
    <br />
    <br />
    <a href="https://github.com/dev-mayanktiwari/labelnet/discussions">Discussions</a>
    ·
    <a href="https://labelnet-admin-client.vercel.app">Admin Website</a>
    ·
    <a href="labelnet-user-client.vercel.app
">Worker Website   ·</a>
    <a href="https://github.com/dev-mayanktiwari/labelnet/issues">Issues</a>
  
  </p>
</p>

<br>


## About the Project

LabelChain is a decentralized data labeling and opinion-taking platform built on Solana blockchain. It enables users to create tasks (e.g., “Which thumbnail is best?”), reward participants who answer these tasks, and distribute payments transparently using Solana. The platform integrates Cloudinary for image uploads and leverages REST APIs with a robust CI/CD pipeline for deployment.

## Overview

LabelChain is a platform where content creators or businesses can post opinion-based tasks to get crowd-sourced feedback. For example, a YouTuber can post a question with multiple thumbnails and ask users to vote for the best one. The task creator deposits funds which are then distributed among users who participate. The entire payment process is powered by the Solana blockchain for transparency and decentralization.

## Feautres

- Create and publish opinion-taking tasks with multiple options
- Users can answer tasks and earn rewards
- Payments distributed automatically on Solana blockchain
- Image upload and management via Cloudinary
- Admin dashboard to manage tasks and payments
- REST API backend with robust security and authentication
- Automated CI/CD pipeline for continuous deployment

## How It Works?

1.	**Admin Creates Task:** Admin uploads images (e.g., thumbnails), sets a question, and deposits a reward amount.
2.	**Task Published:** The task is available for users to view and participate.
3.	**Users Answer:** Users select their preferred option(s).
4.	**Reward Distribution:** Rewards are distributed automatically from the deposited funds based on participation.
5.	**Payments on Solana:** All payments flow through Solana blockchain wallets ensuring transparency.

## Tech Stack

- **Backend:** [Node.js](https://nodejs.org/en) & [Express](https://expressjs.com/) 
- **Frontend:** [Next.js](https://nextjs.org/) 
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Blockchain:** [Solana](https://solana.com/)
- **Image Storage:** [Cloudinary](https://cloudinary.com/)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) + [Ansible](https://docs.ansible.co)
- **Containerization:** [Docker](https://www.docker.com/)

## Architecture
![LabelChain Architecture](https://github.com/dev-mayanktiwari/labelnet/blob/main/public/architecture.png?raw=true)


## Getting Started

To get a local copy up and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run Cal.com.

- Node.js (Version: >=18.x)
- PostgreSQL (Version: >=13.x)
- PNPM _(recommended)_


## Development

### Setup

1. Clone the repo into a public GitHub repository (or fork https://github.com/dev-mayanktiwari/labelnet/fork). 

   ```sh
   git clone https://github.com/dev-mayanktiwari/labelnet
   ```

   > If you are on Windows, run the following command on `gitbash` with admin privileges: <br> > `git clone -c core.symlinks=true https://github.com/dev-mayanktiwari/labelnet` <br>
   

2. Go to the project folder

   ```sh
   cd labelnet
   ```

3. Install packages with pnpm

   ```sh
   pnpm install
   ```

4. You need to configure environment files for each app (server, admin-client, user-client). Checkout environment configuration here.

5. Setup Node
   If your Node version does not meet the project's requirements as instructed by the docs, "nvm" (Node Version Manager) allows using Node at the version required by the project:

   ```sh
   nvm use
   ```

   You first might need to install the specific version and then use it:

   ```sh
   nvm install && nvm use
   ```

   You can install nvm from [here](https://github.com/nvm-sh/nvm).

#### Quick start with `docker-compose up`

> - **Requires Docker and Docker Compose to be installed**
> - Will start a local Postgres instance.
> - Some environment variables also needed to be configured. You can found the guide here.
> - Go to the root of the project and run:

```sh
docker-compose up
```

### Environment Setup

To run LabelChain, you need to configure environment variables for each app. There are **two ways** to run the project:

- **Local Development** (`pnpm turbo dev`)
- **Docker / Docker Compose** (production-style setup)

Each app (`server`, `admin-client`, and `user-client`) contains a `.env.example` file. You can start by copying these and editing the values.

```sh
cd apps/
cp server/.env.example server/.env
cp admin-client/.env.example admin-client/.env
cp user-client/.env.example user-client/.env
```

#### 1. Local Development

Manually fill in the .env files with the following:

For ```server/.env```

| Variable         | Description                                                                |
|--------------------------|--------------------------------------------------------------------------------------|
|   NODE_ENV               |   development                                                                        |
|   PORT                   |    6969                                                                         |
|   DATABASE_URL           |   Your local PostgreSQL URL |
|   JWT_SECRET             |   Random secret for auth, e.g. supersecret123                                        |
|   CLOUDINARY_API_SECRET  |   Cloudinary API secret for server-side uploads                                      |
|   SOLANA_RPC_URL         |   Solana RPC endpoint, e.g. https://api.devnet.solana.com                            |
|   ADMIN_PUBLIC_KEY       |   Your Solana public key                                                             |
|   ADMIN_PRIVATE_KEY      |   Solana private key (⚠️ keep secure)                                                 |
|   SAFE_COOKIE            |   false for local dev                                                                |
   

   > - You can get started with cloudinary [here](https://cloudinary.com/).
   > - If the default RPC URL is not working, you can also [rent](https://www.helius.dev/) a RPC server.

   <br>

For ```admin-client/.env```

|                Variable              |        Description       |
|:------------------------------------|------------------------|
|   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  |   Cloudinary cloud name  |
|   NEXT_PUBLIC_CLOUDINARY_API_KEY     |   Cloudinary API key     |
|   NEXT_PUBLIC_SOLANA_RPC_URL         |   Solana RPC endpoint    |
|   NEXT_PUBLIC_ADMIN_WALLET           |   Admin public key       |
|   NEXT_PUBLIC_API_URL                |   http://localhost:6969  |


<br>

For ```user-client/.env```
|                Variable              |        Description       |
|:------------------------------------|------------------------|
|   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  |   Cloudinary cloud name  |
|   NEXT_PUBLIC_CLOUDINARY_API_KEY     |   Cloudinary API key     |
|   NEXT_PUBLIC_SOLANA_RPC_URL         |   Solana RPC endpoint    |
|   NEXT_PUBLIC_API_URL                |   http://localhost:6969  |


<br>

#### 2. Docker Compose Setup

When using Docker Compose, some values (like ```DATABASE_URL``` or ```NEXT_PUBLIC_API_URL```) are injected directly via the docker-compose.yml file. So you can leave them blank or set placeholders in your .env files where Docker provides them.

For ```apps/server/.env```

```env
NODE_ENV=production
PORT=6969

# Leave blank — set by docker-compose
DATABASE_URL=

JWT_SECRET=your_docker_secret
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SOLANA_RPC_URL=https://api.devnet.solana.com
ADMIN_PUBLIC_KEY=your_admin_public_key
ADMIN_PRIVATE_KEY=your_admin_private_key
SAFE_COOKIE=true
```
<br>

For ```apps/admin-client/.env```

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_ADMIN_WALLET=your_admin_wallet

# NEXT_PUBLIC_API_URL is overridden via `docker-compose.yml`
NEXT_PUBLIC_API_URL=
```
<br>

For ```apps/user-client/.env```

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# NEXT_PUBLIC_API_URL is overridden via `docker-compose.yml`
NEXT_PUBLIC_API_URL=
```

## Future Plans

- [ ] Add real-time task updates and admin notifications using WebSockets.
- [ ] Adding category types of different tasks (open-ended, ranking, annotations).
- [ ] Analytics dashboard for task insights and user engagement.
- [ ] Monetization via platform fees or premium features.


## Contributing

Please see our [contributing guide](/CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.

## Contact ME

Want to say Hii?
Feel free to [email](mailto:devmayanktiwari@gmail.com) me, or reach out via [X](https://x.com/devmayanktiwari) or [Linkedin](https://www.linkedin.com/in/devmayanktiwari/). 
