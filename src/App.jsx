import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import ShananaCheckout from './pages/ShananaCheckout'
import HomemartListing from './pages/HomemartListing'
import OrderFulfillment from './pages/OrderFulfillment'
import CareGrainsMap from './pages/CareGrainsMap'
import PulseTradeAnalytics from './pages/PulseTradeAnalytics'
import BrandNodeExplorer from './pages/BrandNodeExplorer'
import ArtisanShop from './pages/ArtisanShop'
import AdminSeedwave from './pages/AdminSeedwave'
import FruitfulKiosk from './pages/FruitfulKiosk'
import BanimalDashboard from './pages/BanimalDashboard'
import GrandMashadlelaCollection from './pages/GrandMashadlelaCollection'
import SubscriptionShop from './pages/SubscriptionShop'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/ShananaCheckout" element={<LayoutWrapper currentPageName="ShananaCheckout"><ShananaCheckout /></LayoutWrapper>} />
      <Route path="/PulseTradeAnalytics" element={<LayoutWrapper currentPageName="PulseTradeAnalytics"><PulseTradeAnalytics /></LayoutWrapper>} />
      <Route path="/CareGrainsMap" element={<LayoutWrapper currentPageName="CareGrainsMap"><CareGrainsMap /></LayoutWrapper>} />
      <Route path="/HomemartListing" element={<LayoutWrapper currentPageName="HomemartListing"><HomemartListing /></LayoutWrapper>} />
      <Route path="/OrderFulfillment" element={<LayoutWrapper currentPageName="OrderFulfillment"><OrderFulfillment /></LayoutWrapper>} />
      <Route path="/BrandNodeExplorer" element={<LayoutWrapper currentPageName="BrandNodeExplorer"><BrandNodeExplorer /></LayoutWrapper>} />
      <Route path="/GrandMashadlelaCollection" element={<LayoutWrapper currentPageName="GrandMashadlelaCollection"><GrandMashadlelaCollection /></LayoutWrapper>} />
      <Route path="/ArtisanShop" element={<LayoutWrapper currentPageName="ArtisanShop"><ArtisanShop /></LayoutWrapper>} />
      <Route path="/SubscriptionShop" element={<LayoutWrapper currentPageName="SubscriptionShop"><SubscriptionShop /></LayoutWrapper>} />
      <Route path="/AdminSeedwave" element={<LayoutWrapper currentPageName="AdminSeedwave"><AdminSeedwave /></LayoutWrapper>} />
      <Route path="/FruitfulKiosk" element={<LayoutWrapper currentPageName="FruitfulKiosk"><FruitfulKiosk /></LayoutWrapper>} />
      <Route path="/BanimalDashboard" element={<LayoutWrapper currentPageName="BanimalDashboard"><BanimalDashboard /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App