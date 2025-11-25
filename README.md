<h1 align="center">Backoffice</h1>

## Get Started

#### Installation

We use `pnpm` as a package manager: [pnpm](https://pnpm.io/)

```sh
// Install all dependencies
pnpm install
```

#### Commands

```sh
// Run development
pnpm dev

// Run start production build
pnpm serve

```

#### Building

```sh
// Build
pnpm build

```

#### Lint

```sh
pnpm format:check
```

```sh
pnpm format:fix
```

### Testing

```sh
// Unit tests
pnpm test

pnpm test --coverage
```

#### Design system

```sh
// Run storybook (port:6006)

pnpm storybook

// Build storybook
pnpm build-storybook
```

## Conventions and Best Practices

- [Introduction](#introduction)
- [Commits and commit messages](#commits-and-commit-messages)
- [Code Quality](#code-quality)
- [Code Formatting](#code-formatting)
- [Linting](#linting)
- [File System](#file-system)
- [Typescript Semantics](#typescript-semantics)
- [Storybook](#storybook)
- [Unit tests](#unit-tests)
- [Code Reviews](#code-reviews)
- [Never push directly to master](#never-push-directly-to-master)
- [Own the branches](#own-the-branches)
- [Provide descriptive PRs](#provide-descriptive-prs)
- [PRs must not break master](#prs-must-not-break-master)
- [External Libraries](#external-libraries)
- [Tech Debt](#intentional-tech-debt)
- [Release](#Release)
- [Build with docker](#build-with-docker)

### Introduction

This document contains various conventions and best practices that we strive to adhere. While these rules are important,
we still by and large are driven by the common sense. In the future we may end up becoming more strict about following
various coding conventions and policies. For now, we're just going to assume that we have a shared understanding of what
the 'right thing to do' is.

- We want to move fast, but we at the same time we want to reasonably minimize the amount of technical debt we incur
- We believe that broken [Broken windows theory](https://en.wikipedia.org/wiki/Broken_windows_theory) is true for code
  and everything surrounding it. We want to keep everything (code, commit messages, variable names, etc.) nice and tidy.
  This means that small things (typos, extra whitespace, etc.) matter

### Commits and commit messages

- Where applicable commits should be squashed (or broken apart) to make sure that a commit represents a logical unit of
  work that is complete.
- Drive by fixes should be reasonably avoided (they should come in a separate commit)
- Followup fixes within the same PR or a group of commits that are being merged together should be squashed
- Commit messages should be succinct _and_ descriptive
- Commit messages should contain references where applicable (like issue numbers) in addition to the description

#### Conventional Commits

- Commit messages should be stylistically consistent and follow
  [Conventional Commits](https://www.conventionalcommits.org) specification. We have enabled pre-hook which check
  commit, if it suits conventional commit styles.

See examples below:

#### Commit Message Examples

Commit message with description and breaking change footer

If you are working on the main project, you should use the following commit message format:

```text
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

If you are working on the specific project, you should use the following commit message format:

```text
feat: [<PROJECT_NAME>] allow provided config object to extend other configs
```

### Code Quality

#### Code formatting

With an increasing number of people contributing to the project it's important to make sure that the code stays
consistent across the board. Javascript and Typescript give developers a lot of latitude in how they write code. It's
great and we want to leverage that. However at the same time we also do not want to sacrifice the style consistency
across different parts of the project. That is the reason we are using automated code formatting.

- We use [prettier](https://prettier.io).
- Every project should have automatic code formatting set up and integrated with the build and CI systems
- To make it really convenient and seamless we recommended installing `prettier` as your code editor plugin and set up
  in your IDE settings.
- We are running `eslint | prettier` with scripts mentioned above

### Linting

We use `eslint` to keep our source code clean. The eslint configuration is defined in the
[`~/.eslintrc.js`](https://github.com/tokenwin/CasinoPlatform-Frontend/blob/main/.eslintrc.json) file.

Every project has it's own `.eslintrc.js` file, which extends the main configuration. We need to make sure to avoid
overriding the main configuration and also try to change rules per projects.

- We have enabled pre-hook which check commit, if it suits eslint styles.

### File System

Our file system rules are the following:

- **business-logic** folder where we store our application logic
- **ui-kit** we store our design system ('dumb 'components, theme, metrics)
- **common** we store helpers / source code which can be used in both structures

When we are going to introduce new component, required files are the following: e.g `ui-kit/components/Button`

- **styles.ts**
- **styles.ts**
- **Button.test.tsx**
- **Dropdown.stories.tsx**

### Storybook

As it mentioned above we have isolated design system. So we need to create design components separately, that's why we
are using [**storybook**](https://storybook.js.org/docs/react/get-started/introduction) for rendering and testing
visually components.

### Typescript Semantics

Things can be expressed in a different way with Typescript. When in doubt, we prefer the following:

```typescript
Prefer`Type[]`;
instead;
of`Array<Type>`;
```

### Unit tests

For the `Unit tests` we use `Jest` and `React Testing Tool`.

All product components are required to have unit tests except very simple components , for example components rendering
just a props and excluding `ui-kit`-alike libraries.

To see the coverage statistics please run `nx run <PROJECT_NAME>:test --coverage`. We target **80%** coverage across
source code.

Accepted criterion's for the particular component / file _Unit Tests_ are

- **Statements**: 80% - 100%
- **Branches**: 80% - 100%
- **Functions**: 80% - 100%
- **Lines**: 80% - 100%

### Code Reviews

We are working with Trunk Based Development, which means that we are merging to master frequently. This means that we
need to be extra careful with the code that we are merging. We are using GitHub PRs for code reviews.

#### Never push directly to master

All feature work must happen on it's own fork or a branch. No direct commits on the version (eg. `0.1`) or master
branches are allowed.

#### Own the branches

When creating branches on the project you must prefix the branch with your initials and a forward slash. For example,
Ernest Chakhoyan PRs would be prefixed with `ech/...`.

- If it is a feature `ech/feat/[feature-name]`
- If it is bug fix `ech/fix/[bug-name]`
- If it is test `ech/test/[container/component name]`

#### Provide descriptive PRs

In order to merge your changes you must always open a pull request. We have a PR template, please make sure to fill all
the required data inside of it.

#### PRs must not break master

All the tests must pass before the PR can be safely merged. Look for the green check marks (managed through GitHub
Actions) as an indication of all checks passing.

### External Libraries

- Please verify the license of every library before using it.
- It is a good practice to use "as few as possible, but as many as necessary". Consider the "cost" of using a library
  (is it well maintained, is the project active, etc)
- If it's a smaller library with few contributors (and thus has a risk of being abandoned) and you just need a single
  function out of it maybe it's a better idea just to implement the function yourself instead of using the library

### Intentional Tech Debt

- Comment sections with `TODO[techdebt]: ` and a description of the incurred tech debt as well as a high level solution
  to fix the tech debt

### Release

We are using [Conventional Commits](https://www.conventionalcommits.org) specification for commit messages. We have
enabled pre-hook which check commit, if it suits conventional commit styles.

#### Creating a release

```sh
Will be added soon with automatic release
```

### Build with docker

Every project has its own `project.json` where we define it's own commands and configs. To run docker image build, we
need to run:

```sh
will be added soon
```

which will build the project, generate it's own package.json and run the project in the docker image.
