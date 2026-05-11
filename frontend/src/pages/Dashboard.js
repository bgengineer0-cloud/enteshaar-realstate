import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import SectionEditor from '../components/SectionEditor';
import './Dashboard.css';

const sectionsMeta = [
  { key: 'hero', label: 'القسم الرئيسي', labelEn: 'Hero Section', icon: '🏠', desc: 'العنوان والصورة الرئيسية ومعلومات التواصل' },
  { key: 'about', label: 'من نحن', labelEn: 'About Us', icon: '📖', desc: 'نبذة عن الشركة' },
  { key: 'valuation', label: 'التقييم العقاري', labelEn: 'Real Estate Valuation', icon: '🏷️', desc: 'خدمات التقييم للأفراد والشركات' },
  { key: 'marketing', label: 'التسويق العقاري', labelEn: 'Real Estate Marketing', icon: '🏘️', desc: 'بيع وشراء وتأجير العقارات' },
  { key: 'management', label: 'إدارة الأملاك', labelEn: 'Property Management', icon: '🏢', desc: 'إدارة الأملاك الفردية والمشاريع' },
  { key: 'investment', label: 'الاستثمار والتطوير', labelEn: 'Investment & Development', icon: '📈', desc: 'برامج الاستثمار والتطوير العقاري' },
  { key: 'settlement', label: 'تسوية وتوثيق', labelEn: 'Settlement & Documentation', icon: '📋', desc: 'توثيق الملكيات وتعديل الاستخدامات' },
  { key: 'studies', label: 'دراسات واستشارات', labelEn: 'Studies & Consultations', icon: '🔍', desc: 'الدراسات والاستشارات المتخصصة' },
  { key: 'contact', label: 'تواصل معنا', labelEn: 'Contact Us', icon: '📞', desc: 'معلومات التواصل والعنوان' },
];

export default function Dashboard() {
  const { content, loading, updateSection, uploadImage } = useContent();
  const [activeSection, setActiveSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const handleSave = async (key, data) => {
    setSaving(true);
    setSaveMsg('');
    const ok = await updateSection(key, data);
    setSaving(false);
    setSaveMsg(ok ? '✅ تم الحفظ بنجاح' : '❌ حدث خطأ، تحقق من الاتصال بقاعدة البيانات');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <div className="dash-logo-dots">
            {[...Array(9)].map((_, i) => <span key={i} />)}
          </div>
          <div>
            <div className="dash-logo-text">انتشار العقارية</div>
            <div className="dash-logo-sub">لوحة التحكم</div>
          </div>
        </div>

        <nav className="dash-nav">
          <div className="dash-nav-label">أقسام الموقع</div>
          {sectionsMeta.map(s => (
            <button
              key={s.key}
              className={`dash-nav-item ${activeSection === s.key ? 'active' : ''}`}
              onClick={() => setActiveSection(s.key)}
            >
              <span className="dash-nav-icon">{s.icon}</span>
              <div className="dash-nav-info">
                <span className="dash-nav-title">{s.label}</span>
                <span className="dash-nav-en">{s.labelEn}</span>
              </div>
              {activeSection === s.key && <span className="dash-nav-arrow">◀</span>}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <Link to="/" className="dash-preview-btn" target="_blank">
            🌐 معاينة الموقع
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        {/* Top Bar */}
        <header className="dash-topbar">
          <div>
            <h1 className="dash-page-title">
              {activeSection
                ? sectionsMeta.find(s => s.key === activeSection)?.label
                : 'لوحة التحكم'}
            </h1>
            <p className="dash-page-sub">
              {activeSection
                ? sectionsMeta.find(s => s.key === activeSection)?.desc
                : 'اختر قسمًا من القائمة الجانبية للتعديل'}
            </p>
          </div>
          {saveMsg && (
            <div className={`save-toast ${saveMsg.includes('✅') ? 'success' : 'error'}`}>
              {saveMsg}
            </div>
          )}
        </header>

        {/* Dashboard Home */}
        {!activeSection && (
          <div className="dash-home">
            <div className="dash-welcome">
              <div className="welcome-icon">👋</div>
              <h2>مرحبًا بك في لوحة التحكم</h2>
              <p>يمكنك من هنا تعديل جميع محتويات الموقع — النصوص والصور والمعلومات لكل قسم بشكل مستقل.</p>
            </div>

            <div className="sections-overview">
              {sectionsMeta.map(s => (
                <div
                  key={s.key}
                  className="section-card"
                  onClick={() => setActiveSection(s.key)}
                >
                  <div className="section-card-icon">{s.icon}</div>
                  <div className="section-card-info">
                    <h3>{s.label}</h3>
                    <p>{s.desc}</p>
                    <span className="section-card-status">
                      {content[s.key]?.updated_at
                        ? `آخر تعديل: ${new Date(content[s.key].updated_at).toLocaleDateString('ar-SA')}`
                        : 'انقر للتعديل'}
                    </span>
                  </div>
                  <div className="section-card-arrow">◀</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Editor */}
        {activeSection && !loading && (
          <SectionEditor
            sectionKey={activeSection}
            sectionMeta={sectionsMeta.find(s => s.key === activeSection)}
            data={content[activeSection] || {}}
            onSave={(data) => handleSave(activeSection, data)}
            onUpload={uploadImage}
            saving={saving}
          />
        )}
      </main>
    </div>
  );
}
