import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useState, useCallback, lazy, Suspense } from 'react';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/components/pages/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import AboutMePage from '@/components/pages/AboutMePage';
import PDFViewerPage from '@/components/pages/PDFViewerPage';
import IntroLoader from '@/components/ui/IntroLoader';

const StabondarPage = lazy(() => import('@/components/pages/StabondarPage'));
const CbumPage = lazy(() => import('@/components/pages/CbumPage'));
const SystemPortfolioPage = lazy(() => import('@/components/pages/SystemPortfolioPage'));
const ChatPage = lazy(() => import('@/components/pages/ChatPage'));

import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';

// Custom transition component for the Obsidian Curtain effect
const Curtain = () => (
  <motion.div
    className="absolute inset-0 bg-black z-50 pointer-events-none"
    initial={{ y: "100%" }}
    animate={{ y: "-100%" }}
    exit={{ y: "0%" }}
    transition={{
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1], // Cinematic bezier
    }}
  />
);



// Layout component that includes ScrollToTop and Page Transitions
function Layout() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <PageTransition />
      <div key={location.pathname} className="w-full h-full relative">
        <Outlet />
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about-me",
        element: <AboutMePage />,
      },
      {
        path: "pdf-viewer",
        element: <PDFViewerPage />,
      },
      {
        path: "stabondar",
        element: <Suspense fallback={<div className="h-screen w-full bg-deep-black" />}><StabondarPage /></Suspense>,
      },
      {
        path: "cbum",
        element: <Suspense fallback={<div className="h-screen w-full bg-[#0d0b0d]" />}><CbumPage /></Suspense>,
      },
      {
        path: "system",
        element: <Suspense fallback={<div className="h-screen w-full bg-[#050505]" />}><SystemPortfolioPage /></Suspense>,
      },
      {
        path: "chat",
        element: <Suspense fallback={<div className="h-screen w-full bg-deep-black" />}><ChatPage /></Suspense>,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  const [introVisible, setIntroVisible] = useState(true);
  const handleIntroDone = useCallback(() => setIntroVisible(false), []);

  return (
    <>
      <AnimatePresence>
        {introVisible && <IntroLoader key="intro" onDone={handleIntroDone} />}
      </AnimatePresence>
      {/* Render router immediately; loader sits on top */}
      <RouterProvider router={router} />
    </>
  );
}

