# Contributing to LabelChain

Welcome to LabelChain — a decentralized, Solana-powered platform for managing and labeling datasets! We’re thrilled that you’re interested in contributing. Whether you’re a developer, designer, bug reporter, or just excited about our mission, there’s a place for you here.

This guide will walk you through the contribution process.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [1. Reporting Bugs](#1-reporting-bugs)
  - [2. Suggesting Enhancements](#2-suggesting-enhancements)
  - [3. Pull Requests](#3-pull-requests)
- [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Branching Strategy](#branching-strategy)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

Before you start contributing, please review our [Code of Conduct](./CODE_OF_CONDUCT.md). We are committed to fostering an open and welcoming community, and we expect contributors to adhere to our guidelines.

## How Can I Contribute?

### 1. Reporting Bugs

If you encounter a bug or issue while using LabelChain, please report it using the [GitHub Issue Tracker](https://github.com/dev-mayanktiwari/labelchain/issues). When creating an issue, make sure to include:

- A clear and descriptive title.
- A detailed description of the bug, including steps to reproduce it.
- Information about your environment, such as operating system, browser, and version.

### 2. Suggesting Enhancements

If you have ideas for improvements or new features, you can suggest them by opening a new issue in the [GitHub Issue Tracker](https://github.com/dev-mayanktiwari/labelchain/issues). Please provide:

- A clear and concise title.
- A detailed description of your suggestion or enhancement.
- Any relevant information that could help us understand and implement the idea.

### 3. Pull Requests

We welcome contributions in the form of pull requests (PRs). Here's how to contribute code to LabelChain:

1.	Fork the repository.
2.	Create a branch from main.
3.	Make your changes in the new branch.
4.	Ensure your code follows our [Coding Guidelines](#coding-guidelines).
5.	Test your changes.
6.	Write clear [commit messages](#commit-message-guidelines).
7.	Push your changes and open a PR.
8.	Respond to review comments and revise if needed.

## Setting Up the Development Environment

Follow the instructions in the [README.md](/README.md) to set up your local environment. We support both:
	•	Local setup with pnpm
	•	Containerized setup using docker-compose

Each app in the monorepo has its own .env.example file. See the Environment Setup section for details on configuring environment variables.

## Coding Guidelines

Please follow our coding guidelines and maintain consistent code style to ensure code quality. These guidelines include:

- Indentation and code formatting.
- Naming conventions.
- Comments and documentation.
- Best practices for performance and security.

## Commit Message Guidelines

For clarity and maintainability, we follow specific commit message guidelines:

- Prefix with a suitable category, using lowercase:

  - feat: For adding new features
  - fix: For bug fixes
  - chore: For routine tasks like maintenance or refactoring
  - docs: For documentation changes
  - style: For formatting, linting, or styling changes (no code changes)
  - test: For adding or modifying tests

  Example:

  ```plaintext
  feat: Added task card
  ```

- **Use sentence case** for the commit message. Start with a concise, one-line summary in the present tense (e.g., feat: add login authentication).

- **Avoid formatting errors** by ensuring that the codebase passes all linting, formatting, and validation checks before committing.

- **Provide additional context** if necessary. After the summary line, leave a blank line and add a detailed description on the following lines.

## Branching Strategy

We use a branching strategy to manage code changes:

- main: always production-ready
- feature/*: for new features
- bugfix/*: for fixing bugs
- hotfix/*: urgent patches

Please name your branches descriptively.

## Testing

We maintain a robust testing suite to ensure code quality and stability. If you contribute code, please write tests for your changes and make sure that all tests pass before submitting a pull request.

## Documentation

Documentation is crucial for understanding and maintaining the project. If you update code, please also update relevant documentation, including comments, README.md, and API documentation.

## Community

LabelChain is about building a community and collaborating with passionate contributors. Join our community discussions, ask questions, and share your ideas on our [GitHub Discussions](https://github.com/dev-mayanktiwari/labelchain/discussions).

Thank you for considering contributing to LabelChain. Your help is essential to making this platform better for everyone!