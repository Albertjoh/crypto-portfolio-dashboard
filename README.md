# Crypto Portfolio Dashboard

A modern, secure cryptocurrency portfolio tracking application built with Next.js 14, featuring WebAuthn authentication, real-time analytics, and beautiful data visualizations.

## Features

- 📊 **Real-time Portfolio Tracking** - Monitor your cryptocurrency holdings with live price updates
- 📈 **Advanced Analytics** - Visualize your portfolio performance with Chart.js and Recharts
- 🔐 **WebAuthn Security** - Passwordless authentication using biometrics (fingerprint, Face ID)
- 💾 **PostgreSQL Database** - Robust data storage with Prisma ORM
- 🎨 **Modern UI** - Beautiful, responsive design with TailwindCSS and Inter font
- ⚡ **Next.js 14 App Router** - Latest Next.js features with server components

## Tech Stack

- **Framework:** Next.js 14.2.15 (App Router)
- **Language:** TypeScript
- **Authentication:** SimpleWebAuthn (browser & server)
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** TailwindCSS with Inter font
- **Charts:** Chart.js, react-chartjs-2, Recharts
- **Linting:** ESLint with Next.js config

## Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud-hosted)
- **Git** for version control

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Albertjoh/crypto-portfolio-dashboard.git
cd crypto-portfolio-dashboard
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crypto_portfolio?schema=public"

# WebAuthn
RP_NAME="Crypto Portfolio Dashboard"
RP_ID="localhost"
RP_ORIGIN="http://localhost:3000"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Session Secret (generate with: openssl rand -base64 32)
SESSION_SECRET="your-secret-key-here"
```

### 4. Set up the database

Run Prisma migrations to create the database schema:

```bash
npm run prisma:generate
npm run prisma:migrate
# or
yarn prisma:generate
yarn prisma:migrate
```

### 5. Start the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code linting
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:push` - Push schema changes to the database

## Project Structure

```
crypto-portfolio-dashboard/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Inter font
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── prisma/                # Database schema and migrations
│   └── schema.prisma      # Prisma schema with User, Credential, Portfolio, Holding models
├── public/                # Static assets
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules (Next.js template)
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # TailwindCSS configuration with Inter font
└── tsconfig.json         # TypeScript configuration
```

## Database Schema

The application uses the following database models:

- **User** - User account information
- **Credential** - WebAuthn credentials for authentication
- **Portfolio** - User's crypto portfolios
- **Holding** - Individual cryptocurrency holdings within portfolios

## Development

### Running Prisma Studio

To visually explore and edit your database:

```bash
npm run prisma:studio
# or
yarn prisma:studio
```

### Linting

To check for code quality issues:

```bash
npm run lint
# or
yarn lint
```

## Production Build

To create an optimized production build:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Deployment

The application can be deployed to various platforms:

- **Vercel** (recommended for Next.js)
- **Railway** (for database + application)
- **Render**
- **AWS / GCP / Azure**

Make sure to:
1. Set up your production database (PostgreSQL)
2. Configure all environment variables
3. Run database migrations: `npx prisma migrate deploy`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

Built with ❤️ using Next.js 14, TypeScript, Prisma, and TailwindCSS
