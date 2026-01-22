import Banimal from './pages/Banimal';
import Dashboard from './pages/Dashboard';
import SectorAnalytics from './pages/SectorAnalytics';
import VaultMesh from './pages/VaultMesh';
import Payments from './pages/Payments';


export const PAGES = {
    "Banimal": Banimal,
    "Dashboard": Dashboard,
    "SectorAnalytics": SectorAnalytics,
    "VaultMesh": VaultMesh,
    "Payments": Payments,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
};