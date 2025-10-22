# Deployment Guide

## Quick Deploy Commands

### Docker Deployment
```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Or use docker-compose
npm run docker:compose
```

### Manual Deployment
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
cd apps/web && npm start
```

## Environment Variables

Create `.env.production` in `apps/web/`:
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_BASE_URL=your_domain
```

## Platform Deployment

### Vercel
```bash
npx vercel --prod
```

### Railway/Render
- Connect your GitHub repo
- Set build command: `npm run build`
- Set start command: `cd apps/web && npm start`

The app will be available at http://localhost:3000