# Todo System Frontend

A React-based frontend application for the Todo System, featuring user authentication and todo management.

## Features

- **User Authentication**: Register and login functionality with JWT tokens
- **Todo Management**: Full CRUD operations for personal todos
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error handling and user feedback
- **Form Validation**: Client-side validation for all forms

## Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Axios** for HTTP requests
- **Context API** for state management
- **CSS3** for styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend services running (User Service on port 3001, Todo Service on port 3002)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Environment Variables

The following environment variables can be configured:

- `REACT_APP_USER_SERVICE_URL`: User service URL (default: http://localhost:3001)
- `REACT_APP_TODO_SERVICE_URL`: Todo service URL (default: http://localhost:3002)

## API Integration

The frontend integrates with two backend services:

### User Service (Port 3001)
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Todo Service (Port 3002)
- `GET /api/todos` - Fetch user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

All todo endpoints require JWT authentication via Authorization header.

## Project Structure

```
src/
├── components/          # Reusable components
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── AuthPage.tsx
│   ├── AuthPage.css
│   ├── TodoPage.tsx
│   └── TodoPage.css
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component
├── App.css             # Global styles
└── index.tsx           # App entry point
```

## Features in Detail

### Authentication
- JWT token storage in localStorage
- Automatic token expiration handling
- Protected route redirection
- User session persistence

### Todo Management
- Create todos with title and optional description
- Mark todos as complete/incomplete
- Edit existing todos
- Delete todos with confirmation
- Real-time updates

### User Experience
- Loading states for all operations
- Success/error message display
- Form validation with helpful error messages
- Responsive design for mobile devices
- Smooth animations and transitions

## Docker Support

The application includes Docker configuration for containerized deployment:

```bash
# Build the Docker image
docker build -t todo-frontend .

# Run the container
docker run -p 3000:3000 todo-frontend
```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style

The project uses TypeScript for type safety and follows React best practices:
- Functional components with hooks
- TypeScript interfaces for all data structures
- Proper error handling and loading states
- Accessibility considerations

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend services are running and configured for CORS
2. **Authentication Issues**: Check JWT token validity and backend service availability
3. **Build Errors**: Verify all dependencies are installed and TypeScript types are correct

### Development Tips

- Use browser developer tools to inspect network requests
- Check the console for error messages
- Verify environment variables are set correctly
- Test on different screen sizes for responsive design
