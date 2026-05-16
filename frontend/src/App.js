import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import Website from './pages/Website';
import Dashboard from './pages/Dashboard';
import './App.css';
import About from "./pages/About";
import Services from './pages/Services';
import Contact from './pages/Contact';
export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Website />} />
          <Route path="/About" element={<About />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/admin/*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}