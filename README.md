<div align="center">
  <img src="public/logo.png" alt="Mayhem Radar Logo" width="200"/>
  
  # Mayhem Radar
  
  **Solana Mayhem intelligence in real time**
  
  [![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)](https://vitejs.dev/)
  [![Material-UI](https://img.shields.io/badge/MUI-7.3.5-007FFF?logo=mui)](https://mui.com/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
</div>

---

## 📖 Overview

**Mayhem Radar** is a real-time cryptocurrency intelligence platform that tracks and analyzes Pump.fun tokens in "Mayhem Mode" on the Solana blockchain. It provides traders and investors with actionable insights through DexScreener's live data feeds, AI-powered scoring, and comprehensive token analytics.

### Key Highlights

- 🔴 **Real-Time Tracking**: Live data from DexScreener's Pump.fun Mayhem feeds
- 🤖 **AI Scoring System**: Intelligent token evaluation with breakout potential analysis
- 💼 **Wallet Integration**: Seamless Phantom wallet connectivity
- 📊 **Advanced Filters**: Filter by timeframe, volume, liquidity, and AI score
- 🎨 **Modern UI**: Beautiful, responsive interface built with Material-UI
- 🔄 **Auto-Refresh**: Automatic data updates every 30 seconds
- 🛡️ **Fallback System**: Mock data generation when API is unavailable

---

## ✨ Features

### 🎯 Core Functionality

- **Token Radar Dashboard**: Real-time table displaying newly launched Mayhem tokens
- **Multi-Timeframe Analysis**: Filter tokens by 1h, 6h, or 24h creation windows
- **Volume & Liquidity Tracking**: Monitor trading volume and liquidity in SOL
- **AI Intelligence Indicators**:
  - Breakout Potential
  - Liquidity Health
  - Community Hype
- **Token Detail Views**: In-depth information including charts, holders, and social links
- **Search Functionality**: Quick search by token name or symbol

### 🔗 Integrations

- **DexScreener API**: Live Pump.fun token data
- **Phantom Wallet**: Solana wallet connection
- **x402 Protocol**: Enhanced protocol features
- **Social Links**: Direct links to Twitter (X), Telegram, and project websites

### 🎨 UI/UX

- Dark mode interface optimized for crypto trading
- Responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Material Design components
- Real-time status indicators

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI framework
- **Vite 7.2.2** - Build tool and dev server
- **Material-UI (MUI) 7.3.5** - Component library
- **React Router 7.9.5** - Navigation
- **Framer Motion 12.23.24** - Animations
- **Recharts 3.4.1** - Data visualization
- **Day.js 1.11.19** - Date manipulation

### Backend/API
- **Vercel Edge Functions** - Serverless API endpoints
- **DexScreener API** - Token data source
- **Vercel Edge Config** - Configuration management

### Development
- **ESLint** - Code linting
- **Vite Plugin React** - Fast refresh and HMR

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Phantom Wallet** (browser extension) - for wallet features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/albatroner/MayhemRadar.git
   cd radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
radar/
├── api/                      # Vercel serverless functions
│   └── ca.js                # Contract address endpoint
├── public/                  # Static assets
│   └── logo.png            # Application logo
├── src/
│   ├── components/         # React components
│   │   ├── FiltersBar.jsx      # Token filtering controls
│   │   ├── TokenTable.jsx      # Main token data grid
│   │   ├── TokenDetailDialog.jsx  # Token detail modal
│   │   └── UnlockDialog.jsx    # Unlock features dialog
│   ├── hooks/              # Custom React hooks
│   │   └── useMayhemTokens.js  # Token data fetching hook
│   ├── pages/              # Page components
│   │   ├── Home.jsx           # Main dashboard
│   │   ├── About.jsx          # About page
│   │   └── HowItWorks.jsx     # Documentation page
│   ├── services/           # API services
│   │   ├── pumpfun.js        # DexScreener API integration
│   │   └── x402-client.js    # x402 Protocol client
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Application entry point
│   ├── theme.js            # MUI theme configuration
│   └── index.css           # Global styles
├── eslint.config.js        # ESLint configuration
├── vite.config.js          # Vite configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Project dependencies
```

---

## 🔌 API Endpoints

### `/api/ca`

Returns the contract address for the Mayhem Radar token.

**Response:**
```json
{
  "success": true,
  "ca": "CONTRACT_ADDRESS_HERE"
}
```

---

## 🔄 Data Flow

1. **Data Fetching**: `useMayhemTokens` hook polls DexScreener API every 30 seconds
2. **Data Processing**: Raw API data is normalized and enriched with AI scores
3. **Filtering**: Client-side filtering by timeframe, volume, score, and search terms
4. **Display**: Tokens displayed in sortable, interactive data grid
5. **Fallback**: Automatic mock data generation if API is unavailable

---

## 🌐 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Connect your repository** to Vercel
2. **Configure environment variables** (if needed)
3. **Deploy** - Vercel will automatically detect Vite configuration

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Platforms

The production build can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

---

## 🎯 Features in Development

- [ ] Historical price charts
- [ ] Portfolio tracking
- [ ] Price alerts and notifications
- [ ] Token comparison tools
- [ ] Advanced trading signals
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website**: [Coming Soon]
- **Twitter/X**: [https://x.com/MayhemRadar](https://x.com/MayhemRadar)
- **GitHub**: [https://github.com/albatroner/MayhemRadar](https://github.com/albatroner/MayhemRadar)

---

## ⚠️ Disclaimer

This tool is for informational purposes only. Cryptocurrency trading carries significant risks. Always do your own research (DYOR) and never invest more than you can afford to lose. The AI scores and indicators are experimental and should not be considered financial advice.

---

## 📧 Support

For questions, issues, or feature requests, please open an issue on GitHub or contact the development team.

---

<div align="center">
  Made with ❤️ for the Solana community
  
  **Mayhem Radar** - Real-time DexScreener intel for Pump.fun Mayhem launches
</div>
