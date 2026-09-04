import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { AdminTranslationsPage } from './pages/AdminTranslationsPage';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectSourcePage } from './pages/ProjectSourcePage';
import { SourceCategoryPage } from './pages/SourceCategoryPage';
import { SourceFeaturePage } from './pages/SourceFeaturePage';
import { getProject } from './data/projects';

function ScrollToTop(){ const {pathname}=useLocation(); useEffect(()=>{ window.scrollTo(0,0); },[pathname]); return null; }
function MetadataSync(){
  const { pathname } = useLocation();
  useEffect(() => {
    const project = pathname.startsWith('/projects/') ? getProject(pathname.split('/').pop() ?? '') : undefined;
    const page = project?.title ?? (pathname === '/projects' ? 'Projects' : pathname === '/about' ? 'About' : pathname === '/admin' ? 'Admin' : pathname === '/admin/translations' ? 'Project translator' : 'Portfolio');
    const title = `${page} — Lim Cheng Yang`;
    const description = project?.summary ?? 'Portfolio of Lim Cheng Yang documenting public software repositories and one project in development.';
    document.title = title;
    const values: Record<string, string> = {
      'meta[property="og:title"]': title,
      'meta[property="og:description"]': description,
      'meta[property="og:url"]': `https://lim-cheng-yang-portfolio.limchengyang.chatgpt.site${pathname}`,
      'meta[name="twitter:title"]': title,
      'meta[name="twitter:description"]': description,
      'meta[name="description"]': description,
    };
    Object.entries(values).forEach(([selector, content]) => document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content));
  }, [pathname]);
  return null;
}
export default function App(){ return <><ScrollToTop/><MetadataSync/><Navbar/><Routes><Route path="/" element={<HomePage/>}/><Route path="/projects" element={<ProjectsPage/>}/><Route path="/projects/:slug/source" element={<ProjectSourcePage/>}/><Route path="/projects/:slug/source/:category" element={<SourceCategoryPage/>}/><Route path="/projects/:slug/source/:category/:feature" element={<SourceFeaturePage/>}/><Route path="/projects/:slug" element={<ProjectDetailPage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/admin" element={<AdminPage/>}/><Route path="/admin/translations" element={<AdminTranslationsPage/>}/><Route path="*" element={<HomePage/>}/></Routes><Footer/></>; }