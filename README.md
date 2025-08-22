
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

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`


