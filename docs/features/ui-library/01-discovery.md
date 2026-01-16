# Feature Discovery: UI Library

## Date

2026-01-15

## Initial Idea

Create a dedicated UI library within the Nx workspace to standardize the look and feel of the education platform and other applications.

## Problem Statement

The current UI components (buttons, cards, inputs) are scattered or duplicated. We need a consistent design system to ensure visual coherence and speed up development.

## Target Users

- Developers working on the frontend apps (Landing Page, Education Platform).
- Designers (ensuring implementation matches design).

## Success Criteria

- A standalone library `libs/ui-kit` exists.
- Core components (Button, Card, Input, Modal) are implemented.
- Storybook is set up to showcase these components.
- Components are used in the Education Platform.

## Related Existing Features

- `libs/ui` (existing library? need to check).
- `libs/education` (uses UI components).
- `libs/landing` (uses UI components).

## Initial Questions/Concerns

1.  **Tech Stack:** Tailwind CSS vs SCSS vs Angular Material?
    - _Note:_ The landing page uses SCSS variables. We should probably stick to SCSS or adopt Tailwind if desired.
    - _Decision:_ Let's stick to SCSS + CSS Variables for consistency with existing code, unless we want to migrate.
2.  **Scope:** How many components? Start with Button, Card, Input, Typography.
3.  **Storybook:** Is it already set up? Yes, `libs/ui` has `.storybook`.
    - _Wait:_ Does `libs/ui` already exist? I need to check.
