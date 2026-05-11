import React, { createContext, useContext, useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export function ContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API}/content`);
      const data = await res.json();
      const map = {};
      data.forEach(item => {
        map[item.section_key] = {
          ...item,
          extra: item.extra_json ? JSON.parse(item.extra_json) : {}
        };
      });
      setContent(map);
    } catch (e) {
      console.error('Failed to fetch content:', e);
      // Use default content if API fails
      setContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(); }, []);

  const updateSection = async (key, data) => {
    try {
      const payload = { ...data };
      if (data.extra) payload.extra_json = JSON.stringify(data.extra);
      delete payload.extra;
      delete payload.id;
      delete payload.updated_at;

      await fetch(`${API}/content/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await fetchContent();
      return true;
    } catch (e) {
      console.error('Update failed:', e);
      return false;
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API.replace('/api', '')}/api/upload`, { method: 'POST', body: formData });
    const data = await res.json();
    return data.url;
  };

  return (
    <ContentContext.Provider value={{ content, loading, updateSection, uploadImage, refetch: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
}

function getDefaultContent() {
  return {
    hero: { title_ar: 'انتشار العقارية', title_en: 'ENTESHAAR Real Estate', body_ar: 'شريكك الموثوق في عالم العقارات بالمنطقة الشرقية', body_en: 'Your Trusted Partner in Real Estate', image_url: '', extra: { phone: '+966 56 0603888', email: 'info@enteshaar.com', website: 'www.enteshaar.com' } },
    about: { title_ar: 'من نحن', title_en: 'About Us', body_ar: 'شركة انتشار العقارية متخصصة في مجال العقارات بالمنطقة الشرقية', body_en: 'Enteshaar Real Estate is specialized in real estate services', image_url: '', extra: {} },
    valuation: { title_ar: 'التقييم العقاري', title_en: 'Real Estate Valuation', body_ar: '', body_en: '', image_url: '', extra: { services_ar: ['لأغراض المحاسبية', 'الزكاة والضرائب', 'التمويل والقروض'], services_en: ['Accounting purposes', 'Zakat and taxes', 'Financing and loans'] } },
    marketing: { title_ar: 'التسويق العقاري', title_en: 'Real Estate Marketing', body_ar: '', body_en: '', image_url: '', extra: { items_ar: ['أراضي', 'مزارع', 'فلل', 'مصانع'], items_en: ['Land', 'Farms', 'Villas', 'Factories'] } },
    management: { title_ar: 'إدارة الأملاك', title_en: 'Property Management', body_ar: '', body_en: '', image_url: '', extra: {} },
    investment: { title_ar: 'الاستثمار والتطوير', title_en: 'Investment & Development', body_ar: '', body_en: '', image_url: '', extra: {} },
    settlement: { title_ar: 'تسوية وتوثيق', title_en: 'Settlement & Documentation', body_ar: '', body_en: '', image_url: '', extra: {} },
    studies: { title_ar: 'دراسات واستشارات', title_en: 'Studies & Consultations', body_ar: '', body_en: '', image_url: '', extra: {} },
    contact: { title_ar: 'تواصل معنا', title_en: 'Contact Us', body_ar: '', body_en: '', image_url: '', extra: { phone1: '+966 56 0603888', email: 'info@enteshaar.com' } }
  };
}
