import Banimal from './pages/Banimal';
import Dashboard from './pages/Dashboard';
import SectorAnalytics from './pages/SectorAnalytics';
import VaultMesh from './pages/VaultMesh';


export const PAGES = {
    "Banimal": Banimal,
    "Dashboard": Dashboard,
    "SectorAnalytics": SectorAnalytics,
    "VaultMesh": VaultMesh,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
};