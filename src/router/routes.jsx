import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/RootLayout';

// After a new deploy, the previously-loaded index.html references chunk
// filenames (hashed) that no longer exist on the server. Importing one throws
// "Failed to fetch dynamically imported module". When that happens, reload once
// to pull the fresh index.html and the current chunk names. A sessionStorage
// guard prevents an infinite reload loop if the import fails for another reason.
const RELOAD_KEY = 'chunk-reload-attempted';

function lazyWithReload(factory) {
  return lazy(() =>
    factory()
      .then((module) => {
        // Successful load — clear the guard so a later deploy can self-heal too.
        sessionStorage.removeItem(RELOAD_KEY);
        return module;
      })
      .catch((error) => {
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, '1');
          window.location.reload();
          // Return a never-resolving promise so React doesn't render the error
          // before the reload takes effect.
          return new Promise(() => {});
        }
        throw error;
      })
  );
}

const MainPage         = lazyWithReload(() => import('../pages/MainPage'));
const GlossaryPage     = lazyWithReload(() => import('../pages/GlossaryPage'));
const ReadingListPage  = lazyWithReload(() => import('../pages/ReadingListPage'));
const FaqPage          = lazyWithReload(() => import('../pages/FaqPage'));
const ContactPage      = lazyWithReload(() => import('../pages/ContactPage'));
const ScriptureIndexPage = lazyWithReload(() => import('../pages/ScriptureIndexPage'));
const BaptismPage      = lazyWithReload(() => import('../pages/BaptismPage'));
const SalvationPage    = lazyWithReload(() => import('../pages/SalvationPage'));
const SacramentsPage   = lazyWithReload(() => import('../pages/SacramentsPage'));
const ChrismationPage  = lazyWithReload(() => import('../pages/ChrismationPage'));
const ConfessionPage   = lazyWithReload(() => import('../pages/ConfessionPage'));
const HolyOrdersPage   = lazyWithReload(() => import('../pages/HolyOrdersPage'));
const MatrimonyPage    = lazyWithReload(() => import('../pages/MatrimonyPage'));
const UnctionPage      = lazyWithReload(() => import('../pages/UnctionPage'));
const FathersPage      = lazyWithReload(() => import('../pages/FathersPage'));
const IntercessionOfSaintsPage = lazyWithReload(() => import('../pages/IntercessionOfSaintsPage'));
const ChurchHistoryPage = lazyWithReload(() => import('../pages/ChurchHistoryPage'));
const BooksPage        = lazyWithReload(() => import('../pages/BooksPage'));
const EucharistPage    = lazyWithReload(() => import('../pages/EucharistPage'));
const SaintsCalendarPage = lazyWithReload(() => import('../pages/SaintsCalendarPage'));
const DailyReadingsPage  = lazyWithReload(() => import('../pages/DailyReadingsPage'));
const FatherProfilePage  = lazyWithReload(() => import('../pages/FatherProfilePage'));
const NotFoundPage     = lazyWithReload(() => import('../pages/NotFoundPage'));

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
  {
    element: <RootLayout />,
    children: [
      { path: '/',               element: withSuspense(MainPage)          },
      { path: '/glossary',       element: withSuspense(GlossaryPage)      },
      { path: '/reading-list',   element: withSuspense(ReadingListPage)   },
      { path: '/faq',            element: withSuspense(FaqPage)           },
      { path: '/contact',        element: withSuspense(ContactPage)       },
      { path: '/scripture-index', element: withSuspense(ScriptureIndexPage) },
      { path: '/baptism',        element: withSuspense(BaptismPage)         },
      { path: '/salvation',      element: withSuspense(SalvationPage)       },
      { path: '/sacraments',     element: withSuspense(SacramentsPage)      },
      { path: '/chrismation',    element: withSuspense(ChrismationPage)     },
      { path: '/confession',     element: withSuspense(ConfessionPage)      },
      { path: '/holy-orders',    element: withSuspense(HolyOrdersPage)      },
      { path: '/matrimony',      element: withSuspense(MatrimonyPage)       },
      { path: '/unction',        element: withSuspense(UnctionPage)         },
      { path: '/fathers',         element: withSuspense(FathersPage)          },
      { path: '/intercession-of-saints', element: withSuspense(IntercessionOfSaintsPage) },
      { path: '/church-history', element: withSuspense(ChurchHistoryPage)   },
      { path: '/books',          element: withSuspense(BooksPage)           },
      { path: '/eucharist',     element: withSuspense(EucharistPage)        },
      { path: '/saints-calendar',  element: withSuspense(SaintsCalendarPage)  },
      { path: '/daily-readings',   element: withSuspense(DailyReadingsPage)   },
      { path: '/fathers/:id',      element: withSuspense(FatherProfilePage)   },
      { path: '*',              element: withSuspense(NotFoundPage)          },
    ],
  },
]);
