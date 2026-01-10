# care-consulting

[![CI](https://github.com/YOUR_ORG/care-consulting/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/care-consulting/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/YOUR_ORG/care-consulting/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_ORG/care-consulting)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A modern, full-featured Nx monorepo with Angular frontend, NestJS backend, and optimal developer experience.

## 🚀 Features

### Frontend & UI

- **Angular 18+** with standalone components and signals
- **PWA** support for offline functionality
- **Storybook** with DX addons (a11y, interactions, dark mode)
- **Compodoc** for automatic documentation generation
- **MSW** for API mocking in tests and Storybook
- **Bundle Analyzer** for optimizing bundle sizes

### Backend & API

- **NestJS** backend with production-ready features
- **Swagger/OpenAPI** auto-generated API documentation at `/api/docs`
- **OpenAPI Client Generator** for type-safe frontend API services
- **Prisma ORM** with PostgreSQL for database management
- **Authentication** scaffold with JWT, bcrypt, and Passport
- **Environment Validation** with Zod for runtime safety
- **Health check** endpoint at `/api/health`
- **Rate limiting** and throttling
- **Security headers** with Helmet
- **Request validation** with class-validator
- **CORS** and compression enabled
- **Sentry** integration for error tracking

### Testing & Quality

- **Vitest** for lightning-fast unit testing
- **Cypress** for E2E and component testing
- **MSW** for reliable API mocking
- **Code coverage** tracking with Codecov
- **Accessibility testing** with pa11y-ci and axe-core
- **Lighthouse CI** for performance monitoring

### Developer Experience

- **Commitizen + Commitlint** for consistent commit messages
- **Semantic Release** for automated versioning and changelogs
- **Renovate Bot** for automated dependency updates
- **Husky + lint-staged** for pre-commit checks
- **ESLint + Prettier** for code quality
- **TypeScript strict mode** for type safety
- **Path aliases** for clean imports
- **ADR** (Architecture Decision Records) for documenting decisions
- **Dev Containers** for consistent development environments

### DevOps & Infrastructure

- **Docker** support with docker-compose
- **GitHub Actions CI/CD** with matrix testing, auto-merge, and security scanning
- **GitHub Templates** for issues and PRs
- **CODEOWNERS** for code review automation
- **GitHub CLI integration** (optional) - automatically creates remote repo and pushes code
- **Nx caching** for faster builds
- **VSCode integration** with tasks, launch configs, and recommended extensions

## 📁 Project Structure

```
care-consulting/
├── apps/
│   ├── frontend/          # Angular standalone app
│   ├── frontend-e2e/      # Cypress E2E tests
│   └── backend/           # NestJS API
├── libs/
│   ├── ui/                # Shared Angular components
│   └── shared/
│       ├── utilities/     # Common utility functions
│       ├── types/         # Shared TypeScript types
│       └── data-access/   # API client and services
├── .github/workflows/     # CI/CD pipelines
├── .husky/                # Git hooks
└── .vscode/               # VSCode settings
```

## 🛠️ Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp apps/backend/.env.example apps/backend/.env.development
   ```

## 🏃 Development

### Run both frontend and backend concurrently:

```bash
npm run dev:all
```

### Run individually:

```bash
npm run dev:frontend  # Frontend at http://localhost:4200
npm run dev:backend   # Backend at http://localhost:3000
```

### Using Docker:

```bash
docker-compose up
```

## 📚 Storybook

### Run Storybook for UI component development:

```bash
npm run storybook
```

Access Storybook at http://localhost:4400

Storybook includes DX-enhancing addons:

- **Accessibility (a11y)**: Test components for accessibility issues
- **Interactions**: Test component interactions and user flows
- **Dark Mode**: Toggle between light and dark themes
- **Links**: Navigate between stories

### Build Storybook for deployment:

```bash
npm run build-storybook
```

## 🧪 Testing

### Run all tests:

```bash
npm test
```

### Run tests in watch mode:

```bash
npm run test:watch
```

### Run tests with UI:

```bash
npm run test:ui
```

### Run E2E tests:

```bash
npm run e2e
```

### Run tests with coverage:

```bash
npm run test:coverage
```

## 🔍 Code Quality

### Lint all projects:

```bash
npm run lint
```

### Fix linting issues:

```bash
npm run lint:fix
```

### Format code:

```bash
npm run format
```

### Check formatting:

```bash
npm run format:check
```

## 📝 Commits & Releases

### Create a commit with Commitizen:

```bash
npm run commit
```

This opens an interactive prompt to create properly formatted conventional commits.

### Create a release:

```bash
npm run release
```

Semantic Release automatically:

- Determines the next version number
- Generates a changelog
- Creates a GitHub release
- Publishes packages (if configured)

## 📚 Documentation

### Generate Angular documentation with Compodoc:

```bash
npm run docs        # Build docs
npm run docs:serve  # Build and serve docs
```

### View Swagger API documentation:

Navigate to `http://localhost:3000/api/docs` when backend is running.

### View Component Testing:

```bash
npm run component-test  # Run Cypress component tests
```

## 🏗️ Building

### Build all projects:

```bash
npm run build:all
```

### Build specific project:

```bash
npx nx build frontend
npx nx build backend
```

## 📊 Nx Commands

### View project graph:

```bash
npm run graph
```

### Run affected commands:

```bash
npm run affected:test   # Test only affected projects
npm run affected:build  # Build only affected projects
npm run affected:lint   # Lint only affected projects
```

## 🎯 Common Tasks

### Add a new library:

```bash
npx nx g @nx/js:library libs/my-library --unitTestRunner=vitest
```

### Add a new Angular component to UI library:

```bash
npx nx g @nx/angular:component my-component --project=ui --export
```

### Add a new NestJS resource:

```bash
npx nx g @nx/nest:resource my-resource --project=backend
```

## 🐙 GitHub Setup

If you didn't create a GitHub repository during installation, you can do so now:

### With GitHub CLI (recommended):

```bash
gh repo create care-consulting --source=. --public --push
```

### Manually:

1. Create a new repository on GitHub
2. Add it as a remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/care-consulting.git
   git push -u origin main
   ```

### Configure GitHub Secrets

For full CI/CD functionality, add these secrets in your repository settings:

- `CODECOV_TOKEN` - From [codecov.io](https://codecov.io)
- `SNYK_TOKEN` - From [snyk.io](https://snyk.io)
- `SENTRY_AUTH_TOKEN` - From [sentry.io](https://sentry.io)
- `LHCI_GITHUB_APP_TOKEN` - Optional, for Lighthouse CI

### Enable Renovate Bot

1. Install the [Renovate GitHub App](https://github.com/apps/renovate)
2. Grant access to your repository
3. Renovate will automatically create PRs for dependency updates

## 🚢 Deployment

### Production build:

```bash
npx nx build frontend --configuration=production
npx nx build backend --configuration=production
```

### Docker build:

```bash
docker build -t care-consulting-backend .
docker run -p 3000:3000 care-consulting-backend
```

## 📚 Documentation

- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.dev)
- [NestJS Documentation](https://nestjs.com)
- [Vitest Documentation](https://vitest.dev)
- [Cypress Documentation](https://cypress.io)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📝 License

MIT

---

Built with ❤️ using Nx, Angular, and NestJS
