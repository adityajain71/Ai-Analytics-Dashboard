# ADmyBRAND Analytics Dashboard

A modern, responsive analytics dashboard built with Next.js, TypeScript, and Tailwind CSS. This dashboard provides comprehensive insights into campaign performance, user analytics, and business metrics with an integrated AI chatbot and PDF report generation.

## 🚀 Features

- **📊 Real-time Analytics**: Live dashboard with key performance metrics
- **📈 Interactive Charts**: Beautiful visualizations using Recharts
- **🤖 AI Chatbot**: Integrated AI assistant for data insights and support
- **📄 PDF Reports**: Generate and download detailed performance reports
- **📱 Responsive Design**: Fully responsive across all device sizes
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **⚡ Fast Performance**: Optimized with Next.js 14 and React 18
- **🔍 Data Tables**: Enhanced data tables with sorting, filtering, and pagination

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityajain71/Ai-Analytics-Dashboard.git
   cd Ai-Analytics-Dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── chat/              # Chat page
│   ├── settings/          # Settings page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── charts/           # Chart components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
│   └── pdf/              # PDF files
└── styles/               # Additional styles
```

## 🎯 Key Components

### Dashboard Features
- **Metrics Cards**: Display key KPIs (revenue, users, conversions, etc.)
- **Revenue Chart**: Interactive line chart showing revenue trends
- **Traffic Sources**: Pie chart visualization of traffic distribution
- **Campaign Performance**: Bar chart for campaign analysis
- **Device Breakdown**: Analytics by device type
- **Data Tables**: Comprehensive data with advanced filtering

### AI Chatbot
- Floating chat widget with AI-powered responses
- Context-aware assistance for dashboard navigation
- Support for analytics queries and insights

### Report Generation
- PDF report download functionality
- Customizable date ranges
- Multiple report types (Monthly, Campaign, Performance)
- Professional report formatting

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub** (already done)

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

3. **Follow the prompts** to connect your GitHub repository

### Alternative Deployment Options

- **Netlify**: Connect your GitHub repository for automatic deployments
- **AWS Amplify**: Deploy with `amplify init` and `amplify publish`
- **Docker**: Use the included Dockerfile for containerized deployment

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
# NEXT_PUBLIC_API_URL=your_api_url
# DATABASE_URL=your_database_url
```

### Customization
- **Colors**: Modify `tailwind.config.ts` for custom color schemes
- **Components**: Extend or modify components in the `/components` directory
- **API Routes**: Add custom API endpoints in `/app/api`

## 📱 Features Overview

### 📊 Analytics Dashboard
- Real-time metrics visualization
- Interactive charts and graphs
- Responsive design for all screen sizes
- Dark/light mode support

### 🤖 AI Integration
- Intelligent chatbot for user assistance
- Context-aware responses
- Analytics insights and recommendations

### 📄 Report Generation
- PDF export functionality
- Multiple report formats
- Customizable date ranges
- Professional report templates

### 🎨 UI/UX
- Modern, clean interface
- Smooth animations and transitions
- Intuitive navigation
- Accessibility-first design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Recharts](https://recharts.org/) for the chart components
- [Vercel](https://vercel.com/) for the deployment platform

## 📞 Support

If you have any questions or need support, please:
- Create an issue on GitHub
- Contact: adityapradipjain2005@gmail.com

---

**Built with ❤️ by [Aditya Jain](https://github.com/adityajain71)**
