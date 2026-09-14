# باشگاه شیهان شاهزاده فرد - وب‌سایت رسمی

## راه‌اندازی Firebase

1. به [Firebase Console](https://console.firebase.google.com) بروید
2. یک پروژه جدید بسازید
3. از **Project Settings > General > Your apps > Web app** کد پیکربندی را کپی کنید
4. فایل `js/firebase-config.js` را باز کنید و مقادیر `YOUR_*` را جایگزین کنید

### فعال‌سازی Firestore
1. در Firebase Console روی **Firestore Database** کلیک کنید
2. روی **Create Database** بزنید
3. حالت **Start in test mode** را انتخاب کنید
4. منطقه نزدیک‌ترین سرور را انتخاب کنید

### Rules برای تست (بعداً امنیت را اضافه کنید)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## استقرار روی GitHub Pages

1. یک repository جدید در GitHub بسازید
2. پروژه را push کنید:
```bash
cd shahzadeh-fard-club
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. به **Settings > Pages** بروید
4. Source را روی **Deploy from a branch** و branch را روی **main** و پوشه **/(root)** تنظیم کنید
5. روی **Save** کلیک کنید
6. سایت شما در آدرس `https://YOUR_USERNAME.github.io/YOUR_REPO/` قابل دسترسی است

## ساختار پروژه

```
shahzadeh-fard-club/
├── index.html          # صفحه اصلی
├── css/
│   └── style.css       # استایل‌ها
├── js/
│   ├── firebase-config.js  # تنظیمات Firebase
│   └── app.js              # اسکریپت اصلی
└── images/             # تصاویر
```

## قابلیت‌ها

- ✅ طراحی ریسپانسیو (موبایل و دسکتاپ)
- ✅ اتصال به Firebase Firestore
- ✅ فرم عضویت آنلاین
- ✅ بارگذاری اخبار از Firebase
- ✅ بارگذاری برنامه تمرین از Firebase
- ✅ بارگذاری لیست مربیان از Firebase
- ✅ انیمیشن‌های نرم
- ✅ منوی موبایل
- ✅ دکمه بازگشت به بالا
