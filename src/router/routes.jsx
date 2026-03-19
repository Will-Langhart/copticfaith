import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const MainPage         = lazy(() => import('../pages/MainPage'));
const GlossaryPage     = lazy(() => import('../pages/GlossaryPage'));
const ReadingListPage  = lazy(() => import('../pages/ReadingListPage'));
const FaqPage          = lazy(() => import('../pages/FaqPage'));
const ContactPage      = lazy(() => import('../pages/ContactPage'));
const ScriptureIndexPage = lazy(() => import('../pages/ScriptureIndexPage'));
const BaptismPage      = lazy(() => import('../pages/BaptismPage'));
const SalvationPage    = lazy(() => import('../pages/SalvationPage'));

function PageLoader() {
  return (
    <div className="page-loader" aria-busy="true" aria-label="Loading…">
      <div className="page-loader__spinner" />
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  { path: '/',               element: withSuspense(MainPage)          },
  { path: '/glossary',       element: withSuspense(GlossaryPage)      },
  { path: '/reading-list',   element: withSuspense(ReadingListPage)   },
  { path: '/faq',            element: withSuspense(FaqPage)           },
  { path: '/contact',        element: withSuspense(ContactPage)       },
  { path: '/scripture-index', element: withSuspense(ScriptureIndexPage) },
  { path: '/baptism',        element: withSuspense(BaptismPage)         },
  { path: '/salvation',      element: withSuspense(SalvationPage)       },
]);
