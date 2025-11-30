# Customer Support Chatbot - Frontend

A modern, real-time customer support chat interface built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - UI component library
- **Socket.IO Client** - Real-time WebSocket communication
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Routing
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Features

- ✅ Real-time customer chat widget
- ✅ Admin dashboard for managing conversations
- ✅ Live typing indicators
- ✅ Message history
- ✅ Session management
- ✅ Responsive design
- ✅ Admin authentication (login/signup)
- ✅ Beautiful UI with animations

## Project Structure

```
src/
├── components/
│   ├── chat/              # Chat widget components
│   │   ├── ChatWidget.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   └── TypingIndicator.tsx
│   ├── admin/             # Admin dashboard components
│   │   ├── SessionList.tsx
│   │   └── ChatView.tsx
│   └── ui/                # Reusable UI components (Shadcn)
├── pages/
│   ├── Index.tsx          # Landing page with chat widget
│   ├── AdminLogin.tsx     # Admin authentication
│   └── AdminDashboard.tsx # Admin conversation management
├── services/
│   ├── api.ts             # REST API calls
│   └── socket.ts          # Socket.IO connection
├── store/
│   ├── authStore.ts       # Authentication state
│   ├── chatStore.ts       # Chat state
│   └── adminStore.ts      # Admin dashboard state
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── main.tsx              # App entry point
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see README_BACKEND.md)

## Installation

### 1. Clone the repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure backend connection

The application is configured to connect to `http://localhost:3001` for the backend API and WebSocket.

If your backend runs on a different URL, update these files:

**src/services/api.ts**:
```typescript
const API_URL = 'http://your-backend-url:3001/api';
```

**src/services/socket.ts**:
```typescript
const SOCKET_URL = 'http://your-backend-url:3001';
```

## Running the Application

### Development mode

```bash
npm run dev
```

The app will start on `http://localhost:5173` (or another port if 5173 is in use)

### Production build

```bash
npm run build
npm run preview
```

## Application Routes

### Public Routes

- `/` - Landing page with customer chat widget
- `/admin/login` - Admin authentication page

### Protected Routes

- `/admin/dashboard` - Admin dashboard (requires authentication)

## User Guides

### For Customers

1. Visit the landing page at `/`
2. Click the chat widget button (bottom-right corner)
3. Start chatting with support
4. Messages are sent in real-time
5. See when admin is typing

### For Admins

1. Visit `/admin/login`
2. Sign up for a new admin account or login
3. View all active chat sessions in the dashboard
4. Click on a session to see the conversation
5. Reply to customers in real-time
6. See when customers are typing
7. Sessions are updated live as new messages arrive

## Key Features Explained

### Chat Widget

- Floating button on customer pages
- Opens a chat window when clicked
- Automatically creates a session
- Real-time message delivery
- Typing indicators

### Admin Dashboard

- View all conversations (active and closed)
- Real-time session updates
- Filter by status
- Statistics overview
- Multi-session management
- Live notifications

### Real-time Communication

- WebSocket connection via Socket.IO
- Instant message delivery
- Typing indicators
- Session status updates
- Automatic reconnection

## State Management

The app uses Zustand for state management:

### authStore
- Admin authentication state
- JWT token management
- Login/logout functions

### chatStore
- Current chat session
- Message history
- Typing indicators
- User-side chat state

### adminStore
- Selected session
- All sessions list
- Admin dashboard state

## Styling

The project uses Tailwind CSS with a custom design system:

- Custom color palette in `tailwind.config.ts`
- CSS variables in `src/index.css`
- Shadcn/ui components for consistency
- Dark mode support
- Responsive design

## API Integration

### REST API (Axios)

```typescript
import { authAPI, sessionAPI, messageAPI } from '@/services/api';

// Authentication
await authAPI.login(email, password);
await authAPI.register(email, password, fullName);

// Sessions
await sessionAPI.getAll();
await sessionAPI.create(userId, userName, userEmail);

// Messages
await messageAPI.getBySession(sessionId);
await messageAPI.create(sessionId, senderType, content);
```

### WebSocket (Socket.IO)

```typescript
import { socketService } from '@/services/socket';

// Connect
socketService.connect();

// Join session
socketService.joinSession(sessionId);

// Send message
socketService.sendMessage(sessionId, 'user', 'Hello!');

// Listen to events
socketService.onNewMessage((message) => {
  console.log('New message:', message);
});
```

## Environment Variables

This project uses Vite environment variables:

Create a `.env` file if needed:

```env
# Not required if backend is on localhost:3001
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

## Building for Production

### Build the app

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview production build

```bash
npm run preview
```

### Deploy

The `dist/` folder can be deployed to:
- **Vercel** - Zero configuration
- **Netlify** - Simple deployment
- **AWS S3 + CloudFront** - Scalable hosting
- **DigitalOcean App Platform** - Easy deployment
- **GitHub Pages** - Free hosting

#### Vercel Deployment

```bash
npm install -g vercel
vercel --prod
```

#### Netlify Deployment

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Troubleshooting

### Cannot connect to backend

1. Ensure backend server is running on `http://localhost:3001`
2. Check CORS settings in backend
3. Verify API_URL and SOCKET_URL in service files

### WebSocket connection issues

1. Check if Socket.IO is running on backend
2. Verify firewall settings
3. Check browser console for errors

### Authentication issues

1. Clear localStorage: `localStorage.clear()`
2. Ensure JWT_SECRET matches backend
3. Check token expiration

### Build errors

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Update dependencies: `npm update`

## Development Tips

### Adding new components

```bash
# Add a new Shadcn component
npx shadcn-ui@latest add [component-name]
```

### Code structure

- Keep components small and focused
- Use TypeScript interfaces for props
- Extract reusable logic into custom hooks
- Use Zustand for global state only

### Performance

- Use React.memo for expensive components
- Implement virtualization for long lists
- Lazy load routes with React.lazy()
- Optimize images and assets

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Ensure backend is running on `http://localhost:3001`
- [ ] Start dev server: `npm run dev`
- [ ] Create admin account at `/admin/login`
- [ ] Test chat widget on landing page
- [ ] Verify real-time messaging works
- [ ] Check admin dashboard functionality

## Backend Setup

For backend setup instructions using Node.js, Express, PostgreSQL, and Prisma/Sequelize, see **README_BACKEND.md**

## License

MIT
