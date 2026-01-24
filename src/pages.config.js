import Banimal from './pages/Banimal';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Marketplace from './pages/Marketplace';
import Payments from './pages/Payments';
import SectorAnalytics from './pages/SectorAnalytics';
import VaultMesh from './pages/VaultMesh';


export const PAGES = {
    "Banimal": Banimal,
    "Dashboard": Dashboard,
    "Gallery": Gallery,
    "Marketplace": Marketplace,
    "Payments": Payments,
    "SectorAnalytics": SectorAnalytics,
    "VaultMesh": VaultMesh,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
};