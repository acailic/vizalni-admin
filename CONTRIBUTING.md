# Contributing to Визуелни Административни Подаци Србије

First off, thank you for considering contributing to this project! It's people like you that make this platform a great tool for visualizing Serbian administrative data.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Translation Guidelines](#translation-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to opendata@ite.gov.rs.

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm, yarn, or pnpm
- Git
- A GitHub account
- Basic knowledge of TypeScript, React, and Next.js

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork locally**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vizuelni-admin-srbije.git
   cd vizuelni-admin-srbije
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your local configuration.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
vizuelni-admin-srbije/
├── src/
│   ├── app/                    # Next.js 14 App Router pages
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── datasets/      # Dataset pages
│   │   │   ├── organizations/ # Organization pages
│   │   │   └── layout.tsx     # Locale layout
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── layouts/          # Layout components
│   │   ├── visualizations/   # Data visualization components
│   │   └── shared/           # Shared/reusable components
│   ├── lib/                   # Core libraries and utilities
│   │   ├── api/              # API client and services
│   │   ├── i18n/             # Internationalization config
│   │   └── utils/            # Utility functions
│   ├── types/                 # TypeScript type definitions
│   ├── hooks/                 # Custom React hooks
│   └── styles/               # Global styles
├── public/                    # Static assets
│   ├── locales/              # Translation JSON files
│   │   ├── sr-Cyrl/         # Serbian Cyrillic
│   │   ├── sr-Latn/         # Serbian Latin
│   │   └── en/              # English
│   └── images/               # Image assets
└── docs/                      # Documentation
```

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types for all props, state, and API responses
- Avoid using `any` type - use `unknown` if type is truly unknown
- Use interfaces for object shapes, types for unions/primitives

### React

- Use functional components with hooks
- Follow the [React Hooks rules](https://reactjs.org/docs/hooks-rules.html)
- Keep components small and focused (single responsibility)
- Use meaningful component and prop names

### Code Style

We use ESLint and Prettier to maintain consistent code style:

```bash
# Lint your code
npm run lint

# Format your code
npm run format
```

### Best Practices

1. **Component Organization**
   ```typescript
   // 1. Imports
   import { useState } from 'react'
   import { Button } from '@/components/ui/button'
   
   // 2. Types
   interface MyComponentProps {
     title: string
     onAction: () => void
   }
   
   // 3. Component
   export function MyComponent({ title, onAction }: MyComponentProps) {
     // 3a. State
     const [isOpen, setIsOpen] = useState(false)
     
     // 3b. Effects
     useEffect(() => {
       // effect logic
     }, [])
     
     // 3c. Handlers
     const handleClick = () => {
       setIsOpen(!isOpen)
       onAction()
     }
     
     // 3d. Render
     return (
       <div>
         <h1>{title}</h1>
         <Button onClick={handleClick}>Toggle</Button>
       </div>
     )
   }
   ```

2. **API Calls**
   - Use the centralized API client from `@/lib/api`
   - Implement proper error handling
   - Use React Query for data fetching and caching

3. **Styling**
   - Use Tailwind CSS utility classes
   - Follow mobile-first responsive design
   - Use CSS variables for theme colors

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools
- `i18n`: Internationalization/translation updates

### Examples

```bash
feat(datasets): add search filters for datasets page
fix(api): resolve CORS issue with data.gov.rs API
docs(readme): update installation instructions
i18n: add Serbian Latin translations for datasets page
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Link any related issues

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages follow Conventional Commits
- [ ] PR description is clear and comprehensive
- [ ] Screenshots added for UI changes
- [ ] Translations added for new text content

## Translation Guidelines

This project supports three languages:
- Serbian Cyrillic (`sr-Cyrl`) - Default
- Serbian Latin (`sr-Latn`)
- English (`en`)

### Adding Translations

1. **Translation files** are located in `public/locales/[locale]/`

2. **File structure**:
   ```json
   {
     "common": {
       "button": {
         "submit": "Поднеси",
         "cancel": "Откажи"
       }
     },
     "datasets": {
       "title": "Скупови података",
       "search": "Претрага..."
     }
   }
   ```

3. **Using translations in components**:
   ```typescript
   import { useTranslations } from 'next-intl'
   
   export function MyComponent() {
     const t = useTranslations('datasets')
     
     return <h1>{t('title')}</h1>
   }
   ```

4. **When adding new features**:
   - Add translations for all three languages
   - Use meaningful translation keys
   - Keep translations organized by feature/module

### Translation Quality

- Use proper Serbian grammar and spelling
- Maintain consistency across all three languages
- Test UI with all languages to ensure proper display
- Use formal tone appropriate for government data portal

## Questions or Need Help?

- Create an issue with the `question` label
- Email us at opendata@ite.gov.rs
- Check existing documentation in `/docs`

## Recognition

Contributors will be recognized in our README and release notes. Thank you for helping make Serbian administrative data more accessible and visual!

---

**Happy coding! 🚀**
