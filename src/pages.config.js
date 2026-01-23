import Banimal from './pages/Banimal';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import SectorAnalytics from './pages/SectorAnalytics';
import VaultMesh from './pages/VaultMesh';
import Marketplace from './pages/Marketplace';


export const PAGES = {
    "Banimal": Banimal,
    "Dashboard": Dashboard,
    "Payments": Payments,
    "SectorAnalytics": SectorAnalytics,
    "VaultMesh": VaultMesh,
    "Marketplace": Marketplace,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
};