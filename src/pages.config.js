import Banimal from './pages/Banimal';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Payments from './pages/Payments';
import SectorAnalytics from './pages/SectorAnalytics';
import VaultMesh from './pages/VaultMesh';
import Gallery from './pages/Gallery';


export const PAGES = {
    "Banimal": Banimal,
    "Dashboard": Dashboard,
    "Marketplace": Marketplace,
    "Payments": Payments,
    "SectorAnalytics": SectorAnalytics,
    "VaultMesh": VaultMesh,
    "Gallery": Gallery,
}

export const pagesConfig = {
    mainPage: "Gallery",
    Pages: PAGES,
};