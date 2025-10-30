# 💐 Wedding Invitation - 임진석♥신해숙

결혼식 모바일 청첩장

## 📅 Wedding Details

- **Date:** 2025년 11월 16일 (일요일)
- **Time:** 오후 1:00
- **Venue:** 영동 아모르아트웨딩컨벤션 2층 아모르홀

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## ✨ Features

- ✅ Responsive mobile-first design
- ✅ Background music toggle
- ✅ Photo gallery section
- ✅ Kakao/Naver map integration (to be completed)
- ✅ Contact buttons (call/SMS)
- ✅ Share button
- ✅ Bank account information
- ✅ Beautiful animations
- ✅ Korean fonts (Nanum Myeongjo, Noto Sans KR)

## 📝 Customization Needed

### 1. Add Wedding Photos
- Place photos in `/public/images/` folder
- Update gallery section in `src/app/page.tsx`

### 2. Add Background Music
- Place audio file as `/public/music/wedding-bgm.mp3`
- Recommended: soft instrumental or romantic song

### 3. Update Contact Numbers
- Find and replace phone numbers in `src/app/page.tsx`:
  - Groom: `01012345678`
  - Bride: `01087654321`

### 4. Update Bank Accounts
- Update account information in the "마음 전하실 곳" section

### 5. Add Venue Address
- Get exact address from venue
- Update in venue section

### 6. Integrate Maps (Optional)
- Kakao Map API: https://developers.kakao.com/
- Or use direct links to map apps

## 🎨 Color Theme

- Primary (Gold): `#D4AF37`
- Secondary (Brown): `#8B7355`
- Accent (Cream): `#F5E6D3`
- Background: `#FAF8F5`

## 📱 Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Deploy automatically

---

Made with ❤️ for a special day
