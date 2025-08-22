
# easyrice_test

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Inspection Form Application

A React TypeScript application with a form for creating inspections. Built with Vite, React Hook Form, Zod validation, and Tailwind CSS.

## Features

### Inspection Form
- **Required Fields:**
  - Name: Text input for inspection name
  - Standard: Dropdown populated from `/standard` API endpoint (currently using mock data from `standards.json`)

- **Optional Fields:**
  - Note: Multi-line text input
  - Price: Number input (0-100,000 with 2 decimal places)
  - Sampling Points: Multi-select checkboxes (Front End, Back End, Other)
  - Date/Time of Sampling: Date and time picker (DD/MM/YYYY HH:mm:ss format)
  - File Upload: JSON file upload for raw inspection data

### History Management
- **History Table:** Displays all inspection history with columns for Create Date-Time, Inspection ID, Name, Standard, and Note
- **Search Functionality:** Search by Inspection ID containing specific characters
- **Multiple Selection:** Select multiple history records for bulk operations
- **Delete Function:** Delete selected history records with confirmation
- **View Results:** Click on any history record to view the inspection result details

#### History API Endpoints (Mock Implementation)
- `GET /history` - Fetch all history records
- `GET /history/{id}` - Fetch specific history record by ID
- `GET /history?search={term}` - Search history by Inspection ID
- `DELETE /history` - Delete multiple history records

*Note: Currently using mock data. In production, these will be actual API endpoints.*

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Hook Form** for form management
- **Zod** for validation
- **Tailwind CSS** for styling
- **React DatePicker** for date/time selection
- **Axios** for API calls

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd inspection-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── InspectionForm.tsx    # Main form component
│   ├── ResultView.tsx        # Inspection result display
│   ├── EditResult.tsx        # Edit inspection result
│   ├── History.tsx           # History table and management
│   └── index.ts              # Component exports
├── services/
│   ├── standardService.ts    # API service for standards
│   ├── inspectionService.ts  # Inspection calculation service
│   └── historyService.ts     # History API service
├── types/
│   └── index.ts              # TypeScript type definitions
├── App.tsx                   # Main app component
└── main.tsx                  # App entry point
```

## Form Validation

- **Name**: Required field
- **Standard**: Required field
- **Price**: Must be between 0-100,000 with max 2 decimal places
- **File Upload**: Only accepts JSON files

## API Integration

Currently uses mock data from `public/standards.json`. In production, update the `standardService.ts` to point to your actual API endpoint:

```typescript
// Change this in standardService.ts
const response = await axios.get('/api/standards'); // Your actual API endpoint
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Future Enhancements

- Connect to actual backend API
- Add loading states and error handling
- Implement file validation and processing
- Add unit tests
- Add more sophisticated styling and animations

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
