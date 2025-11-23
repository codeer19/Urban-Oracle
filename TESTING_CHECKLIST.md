# 🧪 UrbanOracle Testing Checklist

## Before Launch - Complete This Checklist

### 🔐 Security (CRITICAL)
- [ ] Firebase security rules deployed (`firebase deploy --only firestore:rules`)
- [ ] Storage rules deployed (`firebase deploy --only storage:rules`)
- [ ] `.env` file NOT committed to git
- [ ] API keys secured and not exposed in client code
- [ ] Admin credentials changed from default (admin/admin123)
- [ ] CORS configured properly
- [ ] Rate limiting enabled on Firebase

### 🔥 Firebase Setup
- [ ] Firestore Database created
- [ ] Storage bucket created
- [ ] Authentication enabled (Email/Password + Google)
- [ ] Firestore indexes created (check console for warnings)
- [ ] Billing account set up (even for free tier)
- [ ] Usage alerts configured

### 🎨 Frontend Testing

#### Landing Page
- [ ] Sign-up form validates input
- [ ] Name and address required
- [ ] Redirects to home after sign-up
- [ ] Statistics load correctly
- [ ] Animations work smoothly

#### Home Page
- [ ] Hero section displays
- [ ] Statistics cards show real data
- [ ] Trending issues load
- [ ] CTA buttons navigate correctly
- [ ] Dark mode toggle works

#### Report Submission
- [ ] Photo upload works (camera + file)
- [ ] Category selection required
- [ ] Severity selection required
- [ ] Location detected automatically
- [ ] Voice input works (if browser supports)
- [ ] AI analysis shows results
- [ ] Form submits successfully
- [ ] Success message displays
- [ ] Form resets after submission

#### Map View
- [ ] Map loads within 3 seconds
- [ ] All markers display correctly
- [ ] Marker colors match severity
- [ ] Click marker shows popup
- [ ] Popup shows image and details
- [ ] Vote button works
- [ ] Filter by status works
- [ ] Zoom in/out works
- [ ] Mobile touch gestures work

#### Voting System
- [ ] Vote button increments count
- [ ] Can't vote twice on same issue
- [ ] Blockchain hash generated
- [ ] Vote count updates in real-time
- [ ] Leaderboard shows top issues

#### User Profile
- [ ] Stats display correctly
- [ ] Points and level shown
- [ ] Badges earned display
- [ ] Edit profile works
- [ ] Name and address update
- [ ] Leaderboard loads

#### Notifications
- [ ] Bell icon shows unread count
- [ ] Panel opens/closes
- [ ] Auto-closes when clicking outside
- [ ] Enable notifications works
- [ ] Browser notifications appear
- [ ] Visible in dark mode

#### Admin Dashboard
- [ ] Login required
- [ ] Office location picker works
- [ ] Map click selects location
- [ ] Address input required
- [ ] Reports table loads
- [ ] Filter by status works
- [ ] Sort by votes/risk/date works
- [ ] Status dropdown updates
- [ ] Route optimization generates
- [ ] Route shows correct distances
- [ ] Route starts from office

### 📱 Responsive Design
- [ ] Works on mobile (320px width)
- [ ] Works on tablet (768px width)
- [ ] Works on desktop (1920px width)
- [ ] Touch gestures work on mobile
- [ ] Buttons are tap-friendly (44px min)
- [ ] Text is readable on small screens
- [ ] Images scale properly

### 🎨 Dark Mode
- [ ] Toggle switches smoothly
- [ ] All text visible in dark mode
- [ ] All buttons visible in dark mode
- [ ] Modals visible in dark mode
- [ ] Maps visible in dark mode
- [ ] Preference saved to localStorage

### ⚡ Performance
- [ ] Initial load < 3 seconds
- [ ] Map loads < 2 seconds
- [ ] Images lazy loaded
- [ ] Code split with React.lazy
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] No console errors
- [ ] No memory leaks

### 🐛 Error Handling
- [ ] Network errors show message
- [ ] Firebase errors handled
- [ ] Image upload errors handled
- [ ] Location permission denied handled
- [ ] Invalid input shows validation
- [ ] API rate limits handled
- [ ] Offline mode shows message

### 🔄 Real-time Features
- [ ] New reports appear on map
- [ ] Vote counts update live
- [ ] Status changes reflect immediately
- [ ] Notifications arrive in real-time

### 🧪 Edge Cases
- [ ] Works without location permission
- [ ] Works with slow internet
- [ ] Works with large images (5MB)
- [ ] Works with many reports (100+)
- [ ] Works with special characters in text
- [ ] Works with very long addresses
- [ ] Works when Firebase is down (graceful degradation)

### 🌐 Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### 📊 Data Validation
- [ ] Images must be < 5MB
- [ ] Images must be image/* type
- [ ] Text fields have max length
- [ ] Email format validated
- [ ] Coordinates validated
- [ ] Dates are valid

### 🚀 Deployment
- [ ] Build succeeds (`npm run build`)
- [ ] No build warnings
- [ ] Environment variables set on host
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error tracking configured (Sentry)

### 📈 Monitoring
- [ ] Firebase usage dashboard checked
- [ ] API quota limits monitored
- [ ] Error logs reviewed
- [ ] Performance metrics tracked
- [ ] User feedback collected

---

## 🚨 Critical Bugs to Fix Before Launch

1. **Firebase Security** - Deploy rules immediately
2. **API Keys** - Never expose in client code
3. **Image Size** - Validate before upload
4. **Error Boundaries** - Add to prevent white screen
5. **Loading States** - Show on all async operations
6. **Mobile Scroll** - Fix modal scroll issues
7. **Memory Leaks** - Clean up listeners on unmount

---

## 🎯 Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

## 📝 Testing Scenarios

### Scenario 1: New User Journey
1. Land on page
2. Sign up with name/address
3. See home page
4. Click "Report Issue"
5. Upload photo
6. Select category and severity
7. Submit report
8. See success message
9. Go to map
10. See their report on map

### Scenario 2: Voting Journey
1. Go to map
2. See trending issues
3. Click on an issue
4. Click vote button
5. See vote count increase
6. Try to vote again (should fail)
7. See blockchain hash

### Scenario 3: Admin Journey
1. Click Admin tab
2. Login with credentials
3. Set office location on map
4. See all reports in table
5. Filter by pending
6. Generate optimal route
7. See route with distances
8. Update report status to "fixed"
9. See status change

---

## ✅ Sign-off

- [ ] All critical bugs fixed
- [ ] All features tested
- [ ] Performance targets met
- [ ] Security rules deployed
- [ ] Ready for production

**Tested by**: _______________
**Date**: _______________
**Version**: _______________
