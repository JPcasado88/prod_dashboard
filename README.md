# Production Dashboard

> **A modern, real-time production analytics dashboard for manufacturing operations**

![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.3.1-green.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.4-cyan.svg)
![Recharts](https://img.shields.io/badge/Recharts-2.15.3-orange.svg)

## 🚀 Overview

The Production Dashboard is a sophisticated React-based web application designed for monitoring and analyzing manufacturing production data. It provides real-time insights into operations, operators, and production metrics through interactive charts and analytics.

**Live Demo**: [View on Railway](https://production-dashboard-refactored.railway.app) *(if deployed)*

## ✨ Key Features

### 📊 **Advanced Data Visualization**
- Interactive bar charts using Recharts library
- Real-time production metrics and KPIs
- Multi-dimensional data analysis (operators, trims, carpet types, colors, sources)

### 📅 **Flexible Time Navigation**
- Daily, weekly, and weekly-per-day views
- Intuitive date navigation controls
- Time-based filtering and aggregation

### 📋 **Dynamic Data Analysis**
- Multiple analysis types: Operators, Trims, Carpet Types, Colors, Sales Channels
- Customizable data grouping and filtering
- Export-ready visualizations

### 📁 **Excel Integration**
- Direct Excel file upload and processing
- Automatic data parsing and validation
- Support for large datasets with optimized performance

### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Clean, professional interface
- Optimized for both desktop and mobile viewing

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - Modern component-based architecture
- **Vite 5.3.1** - Fast build tool and development server
- **TailwindCSS 3.4.4** - Utility-first CSS framework
- **Recharts 2.15.3** - Powerful charting library

### Data Processing
- **XLSX 0.18.5** - Excel file processing
- **Lucide React** - Modern icon system
- React Context API for state management

### DevOps & Deployment
- **Docker** - Containerized deployment
- **Railway** - Cloud hosting platform
- **ESLint** - Code quality and consistency
- **PostCSS + Autoprefixer** - CSS processing

## 📁 Project Structure

```
production-dashboard-refactored/
├── src/
│   ├── components/           # React components
│   │   ├── Header.jsx
│   │   ├── Controls.jsx
│   │   ├── DateNavigator.jsx
│   │   └── MainDisplayArea.jsx
│   ├── context/             # Context providers
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── assets/              # Static assets
├── public/                  # Public assets
├── dist/                    # Production build
├── Dockerfile              # Container configuration
├── railway.json            # Railway deployment config
└── vite.config.js          # Vite configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/production-dashboard-refactored.git
cd production-dashboard-refactored

# Install dependencies
yarn install
# or
npm install

# Start development server
yarn dev
# or
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Building for Production

```bash
# Create production build
yarn build

# Preview production build locally
yarn start
```

## 💡 Usage

1. **Load Data**: Upload an Excel file or use the sample data
2. **Select Analysis Type**: Choose from operators, trims, carpet types, colors, or sales channels
3. **Navigate Time**: Use date controls to view daily or weekly data
4. **Analyze**: Interactive charts show production metrics and trends
5. **Export**: Generate reports and export visualizations

## 🔧 Configuration

### Environment Variables
```env
PORT=3000                    # Server port (Railway sets this automatically)
NODE_ENV=production         # Environment mode
```

### Build Optimization
- Code splitting for optimal loading
- Asset compression and minification
- Responsive image optimization
- Progressive web app features

## 🚀 Deployment

### Railway (Recommended)
This project is configured for one-click deployment on Railway:

1. Connect your GitHub repository to Railway
2. Railway automatically detects the Dockerfile
3. Build and deployment happen automatically
4. Access your live dashboard via Railway's provided URL

Detailed deployment guide available in [DEPLOYMENT.md](./DEPLOYMENT.md)

### Docker
```bash
# Build Docker image
docker build -t production-dashboard .

# Run container
docker run -p 3000:3000 production-dashboard
```

## 📈 Performance Features

- **Lazy Loading**: Components load on demand
- **Memoization**: Optimized re-renders with React.memo
- **Code Splitting**: Separate bundles for vendors and features  
- **Compression**: Gzip compression for faster loading
- **Caching**: Optimized browser caching strategies

## 🔍 Key Components

### MainDisplayArea
The core visualization component featuring:
- Dynamic chart rendering based on data type
- Responsive design with multiple breakpoints
- Performance-optimized data aggregation
- Interactive tooltips and legends

### DashboardContext
Centralized state management providing:
- Global application state
- Data processing and filtering logic
- Time navigation controls
- Analysis type switching

## 🧪 Development

### Code Quality
- ESLint configuration for consistent code style
- Component-based architecture for maintainability
- Custom hooks for reusable logic
- Comprehensive error handling

### Performance Monitoring
- Optimized bundle sizes
- Lazy loading implementation
- Memory leak prevention
- Efficient data processing algorithms

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pablo** - Full Stack Developer  
- GitHub: [@JPcasado88](https://github.com/JPcasado88)
- LinkedIn: [Juan Pablo Casado](https://www.linkedin.com/in/juan-pablo-casado-bissone-478bb0135/)
- Portfolio: [Portfolio](https://jpcasado88.github.io/portafolio/)

---

⭐ **Star this repository if you found it helpful!**
