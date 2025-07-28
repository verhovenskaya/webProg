import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/home";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
import EventsPage from './pages/Events/events';
import NotFound from './pages/NotFound/notFound';
import Layout from './components/Layout/Layout';
import ProfilePage from "./pages/Profile/ProfilePage";
//import  ProfilePage  from "./pages/Profile/profile";
import { YMaps } from '@pbe/react-yandex-maps';

function AppRoutes() {
  const location = useLocation();
  // Не показываем Layout (и Header) на /login и /register
  const noHeaderRoutes = ['/login', '/register'];
  const isNoHeader = noHeaderRoutes.includes(location.pathname);
  return isNoHeader ? (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  ) : (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
<YMaps>
      <Router>
        <AppRoutes />
      </Router>
    </YMaps>
  );
}


export default App;