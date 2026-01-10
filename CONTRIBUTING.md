# Contributing

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. Fork the repository
2. Clone your fork: \`git clone https://github.com/YOUR_USERNAME/REPO_NAME.git\`
3. Install dependencies: \`npm install\`
4. Create a feature branch: \`git checkout -b feat/my-feature\`

## Making Changes

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Use the interactive commit tool:

\`\`\`bash
npm run commit
\`\`\`

This will guide you through creating a properly formatted commit message.

### Code Quality

Before committing, make sure:

- Tests pass: \`npm test\`
- Linting passes: \`npm run lint\`
- Code is formatted: \`npm run format\`

Pre-commit hooks will automatically check these, but it's good to run them manually first.

### Testing

- Write unit tests for new features
- Update existing tests when changing functionality
- Ensure E2E tests pass for UI changes
- Maintain or improve code coverage

## Pull Requests

1. Push your changes to your fork
2. Create a pull request to the main repository
3. Fill out the pull request template
4. Wait for review and address any feedback

### PR Requirements

- All tests must pass
- Code coverage should not decrease
- Code must be linted and formatted
- Commit messages must follow conventional commits format
- Description clearly explains the changes

## Code Review Process

1. Automated checks run on every PR
2. At least one maintainer review is required
3. All conversations must be resolved
4. CI must pass before merging

## Questions?

Feel free to open an issue for any questions or concerns.
