import { createHashRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
import { NoticeBar } from "@/components/NoticeBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BookPage } from "@/pages/BookPage";
import { BrowsePage } from "@/pages/BrowsePage";
import { CreditsPage } from "@/pages/CreditsPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { SavedPage } from "@/pages/SavedPage";
import { TripPage } from "@/pages/TripPage";
import { TripsPage } from "@/pages/TripsPage";
import { AppStateProvider } from "@/state/AppStateContext";

function Layout() {
  return (
    <>
      <button type="button" className="skip-link" onClick={() => document.getElementById("main")?.focus()}>
        Skip to content
      </button>
      <SiteHeader />
      <NoticeBar />
      <main id="main" className="page" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </>
  );
}

const router = createHashRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <BrowsePage /> },
        { path: "/stays/:homeId", element: <HomePage /> },
        { path: "/book/:homeId", element: <BookPage /> },
        { path: "/trip/:reference", element: <TripPage /> },
        { path: "/bookings", element: <TripsPage /> },
        { path: "/saved", element: <SavedPage /> },
        { path: "/credits", element: <CreditsPage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  { future: { v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_normalizeFormMethod: true, v7_partialHydration: true, v7_skipActionErrorRevalidation: true } },
);

export function App({ now }: { now: Date }) {
  return (
    <AppStateProvider now={now}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </AppStateProvider>
  );
}
