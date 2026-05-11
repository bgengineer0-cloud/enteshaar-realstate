import React, { useState, useEffect, useRef } from 'react';
import './SectionEditor.css';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';

function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('blob')) return url;
  return API_BASE + url;
}

export default function SectionEditor({ sectionKey, sectionMeta, data, onSave, onUpload, saving }) {
  const [form, setForm] = useState({
    title_ar: '', title_en: '', body_ar: '', body_en: '',
    image_url: '', extra_json: ''
  });
  const [extra, setExtra] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (data) {
      setForm({
        title_ar: data.title_ar || '',
        title_en: data.title_en || '',
        body_ar: data.body_ar || '',
        body_en: data.body_en || '',
        image_url: data.image_url || '',
        extra_json: data.extra_json || ''
      });
      setExtra(data.extra || {});
      setImagePreview(data.image_url || null);
    }
  }, [data, sectionKey]);

  const handleField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setUploadingImg(true);
    try {
      const url = await onUpload(file);
      setForm(prev => ({ ...prev, image_url: url }));
    } catch {
      setForm(prev => ({ ...prev, image_url: localUrl }));
    }
    setUploadingImg(false);
  };

  const handleExtraList = (field, index, value) => {
    const arr = [...(extra[field] || [])];
    arr[index] = value;
    setExtra(prev => ({ ...prev, [field]: arr }));
  };

  const addExtraItem = (field) => {
    setExtra(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
  };

  const removeExtraItem = (field, index) => {
    const arr = [...(extra[field] || [])];
    arr.splice(index, 1);
    setExtra(prev => ({ ...prev, [field]: arr }));
  };

  const handleExtraField = (field, value) => {
    setExtra(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...form,
      extra_json: JSON.stringify(extra)
    });
  };

  const listFields = Object.entries(extra).filter(([k, v]) => Array.isArray(v));
  const scalarFields = Object.entries(extra).filter(([k, v]) => !Array.isArray(v));

  return (
    <div className="section-editor">
      <div className="editor-grid">
        {/* Text Content Card */}
        <div className="editor-card">
          <div className="editor-card-header">
            <h2>✏️ المحتوى النصي</h2>
            <span>Text Content</span>
          </div>

          <div className="field-group">
            <label className="field-label">العنوان بالعربية <span className="field-required">*</span></label>
            <input
              className="field-input"
              value={form.title_ar}
              onChange={e => handleField('title_ar', e.target.value)}
              placeholder="أدخل العنوان بالعربية"
              dir="rtl"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Title in English</label>
            <input
              className="field-input ltr"
              value={form.title_en}
              onChange={e => handleField('title_en', e.target.value)}
              placeholder="Enter title in English"
              dir="ltr"
            />
          </div>

          <div className="field-group">
            <label className="field-label">الوصف بالعربية</label>
            <textarea
              className="field-textarea"
              value={form.body_ar}
              onChange={e => handleField('body_ar', e.target.value)}
              placeholder="أدخل الوصف بالعربية"
              rows={4} dir="rtl"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Description in English</label>
            <textarea
              className="field-textarea ltr"
              value={form.body_en}
              onChange={e => handleField('body_en', e.target.value)}
              placeholder="Enter description in English"
              rows={4} dir="ltr"
            />
          </div>
        </div>

        {/* Image Card */}
        <div className="editor-card">
          <div className="editor-card-header">
            <h2>🖼️ الصورة</h2>
            <span>Section Image</span>
          </div>

          <div
            className={`image-drop-zone ${uploadingImg ? 'uploading' : ''}`}
            onClick={() => fileRef.current.click()}
          >
            {imagePreview ? (
              <div className="image-preview-wrap">
                <img src={imgSrc(imagePreview)} alt="preview" className="image-preview" />
                <div className="image-overlay">
                  <span>🔄 تغيير الصورة</span>
                </div>
              </div>
            ) : (
              <div className="image-placeholder">
                <div className="upload-icon">📤</div>
                <p>انقر لرفع صورة</p>
                <span>PNG, JPG, WEBP حتى 5MB</span>
              </div>
            )}
            {uploadingImg && <div className="uploading-overlay"><div className="spinner" /></div>}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          {form.image_url && (
            <div className="field-group" style={{ marginTop: 12 }}>
              <label className="field-label">رابط الصورة الحالي</label>
              <input
                className="field-input ltr"
                value={form.image_url}
                onChange={e => {
                  handleField('image_url', e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="أو أدخل رابط صورة مباشر"
                dir="ltr"
              />
            </div>
          )}

          {/* Extra scalar fields (phone, email, etc.) */}
          {scalarFields.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div className="editor-card-header" style={{ marginBottom: 12 }}>
                <h2>⚙️ بيانات إضافية</h2>
              </div>
              {scalarFields.map(([key, value]) => (
                <div key={key} className="field-group">
                  <label className="field-label">{key}</label>
                  <input
                    className="field-input ltr"
                    value={value}
                    onChange={e => handleExtraField(key, e.target.value)}
                    dir="ltr"
                    placeholder={key}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extra List Fields */}
        {listFields.length > 0 && (
          <div className="editor-card full-width">
            <div className="editor-card-header">
              <h2>📋 القوائم والخيارات</h2>
              <span>Lists & Options</span>
            </div>
            <div className="lists-grid">
              {listFields.map(([fieldKey, items]) => (
                <div key={fieldKey} className="list-editor">
                  <div className="list-header">
                    <label className="field-label">{fieldKey}</label>
                    <button className="btn-add" onClick={() => addExtraItem(fieldKey)}>
                      + إضافة
                    </button>
                  </div>
                  <div className="list-items">
                    {items.map((item, i) => (
                      <div key={i} className="list-item-row">
                        <span className="list-item-num">{i + 1}</span>
                        <input
                          className="field-input list-input"
                          value={item}
                          onChange={e => handleExtraList(fieldKey, i, e.target.value)}
                          dir={fieldKey.endsWith('_en') ? 'ltr' : 'rtl'}
                        />
                        <button
                          className="btn-remove"
                          onClick={() => removeExtraItem(fieldKey, i)}
                        >✕</button>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <p style={{ color: 'var(--gray)', fontSize: '0.85rem', padding: '12px 0' }}>
                        لا توجد عناصر. انقر "+ إضافة" لإضافة عنصر.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Bar */}
      <div className="save-bar">
        <div className="save-bar-info">
          <span>📌 قسم: <strong>{sectionMeta?.label}</strong></span>
          <span className="save-bar-key">{sectionKey}</span>
        </div>
        <button
          className={`btn btn-primary save-btn ${saving ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={saving || uploadingImg}
        >
          {saving ? (
            <><div className="spinner-sm" /> جاري الحفظ...</>
          ) : (
            '💾 حفظ التغييرات'
          )}
        </button>
      </div>
    </div>
  );
}
