<!--
Sync Impact Report
==================
Version change: 0.0.0 → 1.0.0
Bump rationale: MAJOR - Initial constitution establishment with all core principles

Modified principles: N/A (initial creation)

Added sections:
- Coding Standards (Principle I)
- Commit & PR Rules (Principle II)
- Testing (Principle III)
- Security (Principle IV)
- Architecture Principles (Principle V)
- Development Workflow (Section 2)
- Governance (Section 3)

Removed sections: N/A (initial creation)

Templates requiring updates:
- .specify/templates/plan-template.md: ✅ No changes needed (Constitution Check section is generic)
- .specify/templates/spec-template.md: ✅ No changes needed (requirements section aligns with principles)
- .specify/templates/tasks-template.md: ✅ No changes needed (test-first pattern supported)

Follow-up TODOs: None
-->

# Hackathon Todo App Constitution

## Core Principles

### I. Coding Standards

All code MUST adhere to language-specific style guidelines and strict type safety requirements:

- **Python**: MUST be PEP8 compliant. Use linters (flake8, black) to enforce.
- **TypeScript**: MUST use strict mode with `"strict": true` in tsconfig.json. No implicit `any` types allowed.
- **Tailwind CSS**: MUST use utility classes exclusively. No inline CSS styles permitted.

**Rationale**: Consistent code style reduces cognitive load during code review and enables automated quality checks.

### II. Commit & PR Rules

All version control operations MUST follow these rules:

- Commit messages MUST be meaningful and describe the change's purpose (not just "fix" or "update").
- Pull requests MUST pass all automated tests before merge approval.
- PRs SHOULD include a brief description of changes and testing performed.

**Rationale**: Clear commit history enables efficient debugging and knowledge transfer; passing tests prevent regressions.

### III. Testing

Testing is mandatory at all layers of the application:

- **Backend**: Unit tests MUST exist for all API endpoints. Use pytest for Python backend.
- **Frontend**: Component rendering tests AND API integration tests MUST be implemented.
- Test coverage SHOULD be maintained at a reasonable level for critical paths.

**Rationale**: Tests provide confidence in deployments and serve as living documentation of expected behavior.

### IV. Security

Security MUST be enforced at every layer:

- **Authentication**: JWT tokens MUST be required for all API endpoints (except health checks and public routes).
- **Secrets Management**: No secrets, tokens, or credentials in code. All sensitive values MUST use `.env` files and environment variables.
- **User Isolation**: Users MUST only access their own data. Backend MUST enforce ownership checks on all data operations.
- **Input Validation**: All user input MUST be validated and sanitized.

**Rationale**: Security vulnerabilities can compromise user data and trust; defense-in-depth is mandatory.

### V. Architecture Principles

Development MUST follow these architectural guidelines:

- **Smallest Viable Change**: Each feature/fix MUST be the minimal diff required. No unrelated refactoring.
- **RESTful APIs**: All endpoints MUST use proper HTTP methods and return appropriate status codes (200, 201, 400, 401, 404, 500).
- **Spec-Driven**: Implementation MUST follow specifications in `/specs/`. No ad-hoc feature additions.

**Rationale**: Small changes reduce risk; REST conventions ensure predictable API behavior; specs provide alignment.

## Development Workflow

All development MUST follow this workflow:

1. **Read Spec First**: Before implementing, read the relevant specification in `/specs/features/`.
2. **Backend First**: Implement API endpoints before frontend integration.
3. **Test as You Go**: Write tests alongside implementation, not after.
4. **PR Review**: All changes require review before merging to main branch.

**Environment Setup**:
- Backend: `cd backend && uvicorn main:app --reload --port 8000`
- Frontend: `cd frontend && npm run dev`

## Governance

This constitution establishes the authoritative rules for the Hackathon Todo App project:

- **Supremacy**: This constitution supersedes all other development practices. Conflicts MUST be resolved in favor of constitution principles.
- **Amendments**: Changes to this constitution require documentation of rationale and versioning update.
- **Compliance**: All PRs and code reviews MUST verify compliance with these principles.
- **Exceptions**: Any deviation from these principles MUST be documented with justification in the PR description.

**Version**: 1.0.0 | **Ratified**: 2025-12-11 | **Last Amended**: 2025-12-11
