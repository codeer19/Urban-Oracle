# 🔮 UrbanOracle

**AI-Powered Civic Infrastructure Platform**

See problems before they happen. Predictive AI + Blockchain voting + Smart routing.

🎬 **[Watch Demo Video](YOUR_YOUTUBE_LINK_HERE)** | 🔗 **[Live Demo](YOUR_DEPLOYED_URL_HERE)** | 📚 **[Documentation](./WINNING_FEATURES.md)**

> **Hackathon Submission**: Built with Kiro AI for [Hackathon Name]
> 
> **Category**: Smart Cities / Civic Tech | **Bonus**: AI/ML Innovation

---

## 🚀 Features

### For Citizens:
- 📝 **Report Issues** - Upload photos, AI auto-classifies (pothole, streetlight, etc.)
- 🗺️ **Interactive Map** - See all reported issues in real-time
- 🗳️ **Blockchain Voting** - Vote on priority, transparent & tamper-proof
- 🏆 **Gamification** - Earn points, badges, climb leaderboards
- 🔔 **Real-time Notifications** - Get updates when your reports are fixed
- 📊 **Impact Tracking** - See how much money your reports saved

### For City Officials:
- 🏛️ **Admin Dashboard** - Manage all reports, update status
- 🚗 **Route Optimization** - AI generates optimal repair routes (saves 40% time)
- 📈 **Analytics** - Track costs, efficiency, ROI
- 🗺️ **Map View** - Visual overview of all issues

### AI-Powered:
- 🔮 **Predictive Analytics** - "This pothole will worsen in 14 days"
- 🤖 **Risk Scoring** - Prioritize dangerous issues automatically
- 💰 **Cost Estimation** - Predict repair costs and time
- 🎯 **Smart Recommendations** - AI suggests best actions

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, Leaflet Maps
- **Backend**: Firebase (Firestore, Storage, Auth)
- **AI**: Groq LLaMA 3.2 Vision, Google Gemini
- **Blockchain**: Crypto-JS (SHA-256 hashing)
- **Maps**: OpenStreetMap, React-Leaflet

---

## 📦 Installation

### Prerequisites:
- Node.js 16+
- npm or yarn
- Firebase account
- Groq API key (free)

### Setup:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/urbanoracle.git
   cd urbanoracle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Enable Storage
   - Enable Authentication (Email/Password, Google)
   - Copy your Firebase config to `src/firebase.js`

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your API keys:
   - Get Firebase config from https://console.firebase.google.com
   - Get Groq API key from https://console.groq.com (free)

5. **Deploy Firebase Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

6. **Start development server**
   ```bash
   npm start
   ```

---

## 🔐 Security

### Firebase Rules:
- ✅ Reports: Anyone can read, only authenticated users can create
- ✅ Users: Can only access their own data
- ✅ Storage: Max 5MB images, authenticated uploads only

### Best Practices:
- Never commit `.env` file
- Use Firebase Auth for user management
- Validate all inputs on client and server
- Rate limit API calls

---

## 🚀 Deployment

### Deploy to Vercel:
```bash
npm run build
vercel --prod
```

### Deploy to Firebase Hosting:
```bash
npm run build
firebase deploy --only hosting
```

### Environment Variables:
Set these in your hosting platform:
- `REACT_APP_GEMINI_KEY`
- `REACT_APP_GROQ_API_KEY`

---

## 📊 Testing

### Before Launch Checklist:

#### Backend:
- [ ] Firebase security rules deployed
- [ ] Storage rules configured
- [ ] Authentication enabled
- [ ] Firestore indexes created
- [ ] API keys secured

#### Frontend:
- [ ] All forms validate input
- [ ] Error handling on all API calls
- [ ] Loading states everywhere
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Images optimized

#### Features:
- [ ] Report submission works
- [ ] Map loads and shows markers
- [ ] Voting system functional
- [ ] Admin dashboard accessible
- [ ] Route optimization calculates correctly
- [ ] Notifications work
- [ ] Gamification tracks points

#### Performance:
- [ ] Lighthouse score > 90
- [ ] Images lazy loaded
- [ ] Code split with React.lazy
- [ ] Firebase queries optimized

---

## 🐛 Common Issues

### "Firebase permission denied"
- Deploy security rules: `firebase deploy --only firestore:rules`

### "Map not loading"
- Check internet connection
- Verify Leaflet CSS is imported

### "AI classification not working"
- Verify Groq API key is set
- Check API quota limits

### "Images not uploading"
- Check Firebase Storage rules
- Verify file size < 5MB

---

## 📈 Roadmap

### Phase 1 (Current):
- ✅ Report submission
- ✅ Map view
- ✅ Blockchain voting
- ✅ Admin dashboard
- ✅ Route optimization

### Phase 2 (Next):
- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with city databases

### Phase 3 (Future):
- [ ] IoT sensor integration
- [ ] Machine learning predictions
- [ ] Augmented reality reporting
- [ ] Public API for developers

---

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use for your city!

---

## 👥 Team

Built with ❤️ for making cities better

---

## 📞 Support

- Email: support@urbanoracle.com
- Twitter: @urbanoracle
- Discord: discord.gg/urbanoracle

---

## 🙏 Acknowledgments

- OpenStreetMap for maps
- Firebase for backend
- Groq for AI inference
- All the citizens making their communities better

---

**Made with 🔮 by UrbanOracle Team**
