/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Analytics from './pages/Analytics';
import AppBuilder from './pages/AppBuilder';
import ArtisanDashboard from './pages/ArtisanDashboard';
import ArtisanProfile from './pages/ArtisanProfile';
import Banimal from './pages/Banimal';
import BrandOnboarding from './pages/BrandOnboarding';
import Checkout from './pages/Checkout';
import CollaborationSuite from './pages/CollaborationSuite';
import ContentGenerator from './pages/ContentGenerator';
import Dashboard from './pages/Dashboard';
import EcosystemExplorer from './pages/EcosystemExplorer';
import Gallery from './pages/Gallery';
import LoyaltyProgram from './pages/LoyaltyProgram';
import Marketplace from './pages/Marketplace';
import MySubscriptions from './pages/MySubscriptions';
import OrderHistory from './pages/OrderHistory';
import Payments from './pages/Payments';
import SectorAnalytics from './pages/SectorAnalytics';
import SubscriptionBoxes from './pages/SubscriptionBoxes';
import VaultMesh from './pages/VaultMesh';
import Wishlist from './pages/Wishlist';
import DiscoveryEngine from './pages/DiscoveryEngine';
import GlobalBrandMap from './pages/GlobalBrandMap';
import MarketIntelligence from './pages/MarketIntelligence';
import AutomationEngine from './pages/AutomationEngine';
import VideoScriptStudio from './pages/VideoScriptStudio';
import AssetLibrary from './pages/AssetLibrary';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Analytics": Analytics,
    "AppBuilder": AppBuilder,
    "ArtisanDashboard": ArtisanDashboard,
    "ArtisanProfile": ArtisanProfile,
    "Banimal": Banimal,
    "BrandOnboarding": BrandOnboarding,
    "Checkout": Checkout,
    "CollaborationSuite": CollaborationSuite,
    "ContentGenerator": ContentGenerator,
    "Dashboard": Dashboard,
    "EcosystemExplorer": EcosystemExplorer,
    "Gallery": Gallery,
    "LoyaltyProgram": LoyaltyProgram,
    "Marketplace": Marketplace,
    "MySubscriptions": MySubscriptions,
    "OrderHistory": OrderHistory,
    "Payments": Payments,
    "SectorAnalytics": SectorAnalytics,
    "SubscriptionBoxes": SubscriptionBoxes,
    "VaultMesh": VaultMesh,
    "Wishlist": Wishlist,
    "DiscoveryEngine": DiscoveryEngine,
    "GlobalBrandMap": GlobalBrandMap,
    "MarketIntelligence": MarketIntelligence,
    "AutomationEngine": AutomationEngine,
    "VideoScriptStudio": VideoScriptStudio,
    "AssetLibrary": AssetLibrary,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};