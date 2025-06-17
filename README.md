# Profession Lookup App

A React application with autocomplete functionality that searches for professions using a lookup API. The app features real-time search with debouncing, keyboard navigation, and a modern UI.

## Features

- **Real-time Search**: Search professions as you type with debounced API calls
- **Keyboard Navigation**: Use arrow keys to navigate dropdown, Enter to select, Escape to close
- **Modern UI**: Beautiful gradient background with glassmorphism effects
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful error handling with user-friendly messages
- **Click Outside**: Dropdown closes when clicking outside the search area

## Project Structure

```
profession-lookup-app/
├── server.js              # Node.js Express server
├── package.json           # Server dependencies
├── client/
│   ├── package.json       # React app dependencies
│   ├── public/
│   │   └── index.html     # HTML template
│   └── src/
│       ├── index.js       # React entry point
│       ├── index.css      # Global styles
│       ├── App.js         # Main App component
│       ├── App.css        # App styles
│       └── components/
│           ├── ProfessionSearch.js   # Search component
│           └── ProfessionSearch.css  # Search component styles
└── README.md
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install server dependencies:**

   ```bash
   npm install
   ```

2. **Install client dependencies:**

   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Build the React app:**

   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3001`

## Development Mode

For development with hot reloading:

1. **Start the Node.js server:**

   ```bash
   npm run dev
   ```

2. **In a separate terminal, start the React development server:**
   ```bash
   cd client
   npm start
   ```

This will start the React app on `http://localhost:3000` and the API server on `http://localhost:3001`.

## API Integration

The app proxies requests to the profession lookup API through the Node.js server to handle CORS issues. The server endpoint `/api/professions` forwards requests to:

```
lookup-service.us-east-1.staging.shaadi.internal/lookup/v1/data
```

### API Request Format

The original API expects a GET request with JSON data:

```javascript
{
  "data": {
    "search_term": "s",
    "type": "professions"
  }
}
```

## Components

### ProfessionSearch

The main search component that handles:

- User input with debouncing (300ms delay)
- API calls to fetch profession data
- Dropdown display with keyboard navigation
- Selection handling
- Error states and loading indicators

### Key Features

- **Debouncing**: Prevents excessive API calls while typing
- **Keyboard Navigation**: Arrow keys, Enter, and Escape support
- **Click Outside**: Closes dropdown when clicking elsewhere
- **Visual Feedback**: Loading spinner and error messages
- **Responsive**: Works on all screen sizes

## Styling

The app uses modern CSS features including:

- CSS Grid and Flexbox for layout
- CSS Custom Properties for theming
- Backdrop-filter for glassmorphism effects
- CSS animations and transitions
- Responsive design with media queries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
