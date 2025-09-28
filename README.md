# Game-Time Leaderboard

A modern, interactive leaderboard application built with Next.js, TypeScript, and Tailwind CSS. Track scores across multiple games and players with a sleek, game-inspired design.

## Features

- **Real-time Leaderboard**: Dynamic ranking system with automatic score calculations
- **Player Management**: Add and remove players with edit mode functionality
- **Game Management**: Create and manage multiple games
- **Score Tracking**: Update scores in real-time with immediate leaderboard updates
- **Activity Feed**: Track all changes with timestamped activity history
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Futuristic UI**: Game-inspired design with Vanta.js 3D background effects

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: JSON file-based storage
- **3D Effects**: Vanta.js with Three.js
- **Animations**: Framer Motion & AOS

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Create the project:**
   ```bash
   npx create-next-app@latest game-leaderboard --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   cd game-leaderboard
   ```

2. **Install dependencies:**
   ```bash
   npm install lucide-react framer-motion aos date-fns clsx tailwind-merge vanta three
   npm install -D @types/aos @types/three
   ```

3. **Copy all the provided files** to their respective locations in the project structure.

4. **Create the data directory:**
   ```bash
   mkdir -p src/data
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── players/         # Player CRUD operations
│   │   ├── games/           # Game CRUD operations
│   │   ├── scores/          # Score management
│   │   └── activities/      # Activity feed
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   └── [sections]       # Feature-specific components
│   ├── lib/                 # Utilities and types
│   ├── data/                # JSON database
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
```

## Key Features Explained

### Edit Mode
Toggle edit mode to:
- Add/remove players and games
- Update scores directly in the table
- Access management controls

### JSON Database
- File-based storage for simplicity
- Automatic data persistence
- Easy backup and restore

### Real-time Updates
- Immediate UI updates after changes
- Activity tracking for all actions
- Automatic leaderboard recalculation

### Responsive Design
- Mobile-first approach
- Adaptive table layout
- Touch-friendly controls

## API Endpoints

- `GET/POST/DELETE /api/players` - Player management
- `GET/POST/DELETE /api/games` - Game management
- `PUT /api/scores` - Score updates
- `GET /api/activities` - Activity history

## Customization

### Styling
Modify `tailwind.config.js` and `globals.css` for custom themes and colors.

### Database
Replace the JSON file system with a real database by updating the `DatabaseManager` class.

### Components
All components are modular and can be easily customized or extended.

## Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel
```

### Other Platforms
```bash
npm run build
npm start
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please check the documentation or create an issue in the repository.
