# Railway Deployment Guide

## Prerequisites
- A Railway account (sign up at https://railway.app)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect Your Repository
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `production-dashboard-refactored`

### 2. Configure Environment Variables (if needed)
Railway will automatically detect this as a Node.js project. No additional environment variables are required for basic deployment.

### 3. Railway Will Automatically:
- Detect the Dockerfile and use it for building
- Run `yarn install` to install dependencies
- Run `yarn build` to create the production build
- Run `yarn start` to serve the application

### 4. Custom Domain (Optional)
- Go to your project settings in Railway
- Navigate to the "Domains" section
- Add your custom domain if desired

## Project Configuration

This project has been configured with:

- ✅ **Dockerfile**: Optimized for Railway deployment
- ✅ **railway.json**: Railway-specific configuration
- ✅ **Production Build**: Vite configured for production
- ✅ **Port Configuration**: Uses Railway's PORT environment variable
- ✅ **Start Script**: Configured to serve the built application

## Build Information

- **Build Command**: `yarn build`
- **Start Command**: `yarn start`
- **Port**: Uses `process.env.PORT` (Railway provides this automatically)
- **Output Directory**: `dist/`

## Troubleshooting

### If deployment fails:
1. Check the build logs in Railway dashboard
2. Ensure all dependencies are listed in `package.json`
3. Verify the build completes locally with `yarn build`

### If the app doesn't load:
1. Check that the start script is working: `yarn start`
2. Verify the port configuration in `vite.config.js`
3. Check Railway logs for any runtime errors

## Local Testing

To test the production build locally:

```bash
# Build the project
yarn build

# Start the preview server
yarn start
```

The application will be available at `http://localhost:3000`

## Performance Optimizations

The build has been optimized with:
- **Code Splitting**: Separate chunks for vendor, charts, and utilities
- **Asset Optimization**: Minified CSS and JavaScript
- **Compression**: Gzip compression enabled
- **Caching**: Proper cache headers for static assets 