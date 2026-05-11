const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// DB Connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'enteshaar_user',
  password: process.env.DB_PASS || 'Ss010229005@',
  database: process.env.DB_NAME || 'enteshaar_db'
};

let pool;
async function getDB() {
  if (!pool) pool = mysql.createPool(dbConfig);
  return pool;
}

// Init DB
async function initDB() {
  const db = await getDB();
  await db.execute(`CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    title_ar TEXT,
    title_en TEXT,
    body_ar TEXT,
    body_en TEXT,
    image_url VARCHAR(500),
    extra_json TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);

  // Seed default content
  const defaults = [
    { section_key: 'hero', title_ar: 'انتشار العقارية', title_en: 'ENTESHAAR Real Estate', body_ar: 'شريكك الموثوق في عالم العقارات بالمنطقة الشرقية', body_en: 'Your Trusted Partner in Real Estate - Eastern Province', image_url: '', extra_json: JSON.stringify({ phone: '+966 56 0603888', email: 'info@enteshaar.com', website: 'www.enteshaar.com' }) },
    { section_key: 'about', title_ar: 'من نحن', title_en: 'About Us', body_ar: 'شركة انتشار العقارية شركة متخصصة في مجال العقارات بالمنطقة الشرقية، تقدم خدمات متكاملة تشمل التقييم والتسويق وإدارة الأملاك والاستثمار والتطوير، مع فريق من الخبراء المتخصصين لضمان أفضل النتائج لعملائنا.', body_en: 'Enteshaar Real Estate is a specialized company in the Eastern Province offering comprehensive real estate services including valuation, marketing, property management, investment and development, with a team of experts ensuring the best results for our clients.', image_url: '', extra_json: '' },
    { section_key: 'valuation', title_ar: 'التقييم العقاري', title_en: 'Real Estate Valuation', body_ar: 'نقدم خدمات التقييم العقاري للأفراد والشركات لأغراض متعددة', body_en: 'We provide real estate valuation services for individuals and companies for various purposes', image_url: '', extra_json: JSON.stringify({ services_ar: ['لأغراض المحاسبية', 'لغرض الزكاة والضرائب', 'لغرض التمويل والقروض', 'لغرض نزع الملكية', 'لغرض المزادات والتأمين', 'لغرض الإرث وتوزيع التركات'], services_en: ['For accounting purposes', 'For zakat and taxes', 'For financing and loans', 'For expropriation purpose', 'For auctions and insurance', 'For inheritance purposes'] }) },
    { section_key: 'marketing', title_ar: 'التسويق العقاري', title_en: 'Real Estate Marketing', body_ar: 'بيع - شراء - تأجير', body_en: 'Sell - Buy - Rent', image_url: '', extra_json: JSON.stringify({ items_ar: ['أراضي', 'مزارع', 'فلل', 'مصانع', 'مباني تجارية', 'مستودعات', 'مجمعات'], items_en: ['Land', 'Farms', 'Villas', 'Factories', 'Commercial Buildings', 'Warehouses', 'Compounds'] }) },
    { section_key: 'management', title_ar: 'إدارة الأملاك', title_en: 'Property Management', body_ar: 'إدارة أملاك فردية ومشاريع ووقف', body_en: 'Management of individual properties, projects, and endowments', image_url: '', extra_json: JSON.stringify({ items_ar: ['فردية . مشاريع . أوقاف', 'تسويق . تحصيل . صيانة', 'سنوي . نصف سنوي . ربع سنوي'], items_en: ['Individual . Projects . Endowments', 'Marketing . Collection . Maintenance', 'Annual . Semi-annual . Quarterly'] }) },
    { section_key: 'investment', title_ar: 'الاستثمار والتطوير العقاري', title_en: 'Real Estate Investment & Development', body_ar: 'برامج استثمارية متنوعة ومشاريع سياحية', body_en: 'Diverse investment programs and tourism projects', image_url: '', extra_json: JSON.stringify({ items_ar: ['برامج انتشار الاستثمارية (P.O.T)', 'برنامج البيع والشراء والتطوير', 'المشاريع السياحية', 'الاستثمار في برامج الدعم الموجه'], items_en: ['ENTESHAAR Investment Programs (P.O.T)', 'Purchase and sale and development program', 'Tourism projects', 'Investing in targeted support programs'] }) },
    { section_key: 'settlement', title_ar: 'تسوية وتوثيق', title_en: 'Settlement & Documentation', body_ar: 'خدمات التوثيق وتعديل الاستخدامات وترقية مستندات الملكية', body_en: 'Documentation services, land use modification, and upgrade ownership documents', image_url: '', extra_json: '' },
    { section_key: 'studies', title_ar: 'دراسات واستشارات', title_en: 'Real Estate Studies & Consultations', body_ar: 'استشارات ودراسات متخصصة للأفراد والشركات والجهات الحكومية', body_en: 'Specialized consultations and studies for individuals, companies, and government agencies', image_url: '', extra_json: '' },
    { section_key: 'contact', title_ar: 'تواصل معنا', title_en: 'Contact Us', body_ar: 'المملكة العربية السعودية، المنطقة الشرقية - الخبر - شارع الأمير تركي', body_en: 'Saudi Arabia, Eastern Province - Al-Khobar - Prince Turki Street', image_url: '', extra_json: JSON.stringify({ phone1: '+966 56 0603888', phone2: '+966 03 8427777', phone3: '+966 564911297', email: 'info@enteshaar.com', website: 'www.enteshaar.com', social: '@enteshaar' }) }
  ];

  for (const item of defaults) {
    await db.execute(
      `INSERT IGNORE INTO site_content (section_key, title_ar, title_en, body_ar, body_en, image_url, extra_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [item.section_key, item.title_ar, item.title_en, item.body_ar, item.body_en, item.image_url, item.extra_json]
    );
  }
  console.log('DB initialized');
}

// Routes
app.get('/api/content', async (req, res) => {
  try {
    const db = await getDB();
    const [rows] = await db.execute('SELECT * FROM site_content ORDER BY id');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/content/:key', async (req, res) => {
  try {
    const db = await getDB();
    const [rows] = await db.execute('SELECT * FROM site_content WHERE section_key = ?', [req.params.key]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/content/:key', async (req, res) => {
  try {
    const db = await getDB();
    const { title_ar, title_en, body_ar, body_en, image_url, extra_json } = req.body;
    await db.execute(
      `UPDATE site_content SET title_ar=?, title_en=?, body_ar=?, body_en=?, image_url=?, extra_json=? WHERE section_key=?`,
      [title_ar, title_en, body_ar, body_en, image_url, extra_json, req.params.key]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

const PORT = process.env.PORT || 3001;
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to init DB:', err.message);
  console.log('Starting server without DB (demo mode)...');
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (no DB)`));
});
