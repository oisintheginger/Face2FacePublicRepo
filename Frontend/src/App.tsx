import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from 'src/pages/Home';
import Layout from 'src/Layout/Layout';
import NotFound from 'src/pages/NotFound';
import Login from 'src/pages/auth/Login';
import Register from 'src/pages/auth/Register';
import { ROUTES } from 'src/configs/routeNames';
import ResetPassword from 'src/pages/auth/ResetPassword';
import ForgotPassword from 'src/pages/auth/ForgotPassword';
import Search from 'src/pages/Search';
import CreateEditListing from 'src/pages/CreateEditListing';
import ViewListing from 'src/pages/ViewListing';
import MyProfile from 'src/pages/MyProfile';
import MyListings from 'src/pages/MyListings';
import MyInterests from 'src/pages/MyInterests';
import ListingInterests from 'src/pages/ListingInterests';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';

function App() {
  const { token } = useContext(AuthContext);

  const generalRoutes = (
    <>
      <Route index element={<Home />} />
      <Route path={ROUTES.SEARCH} element={<Search />} />
      <Route path={ROUTES.LISTING} element={<ViewListing />} />
    </>
  );
  const authRoutes = (
    <>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGN_UP} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
    </>
  );
  const protectedRoutes = (
    <>
      <Route
        path={ROUTES.CREATE_LISTING}
        element={<CreateEditListing pageMode="create" />}
      />
      <Route
        path={ROUTES.EDIT_LISTING}
        element={<CreateEditListing pageMode="edit" />}
      />
      <Route path={ROUTES.MY_PROFILE} element={<MyProfile />} />
      <Route path={ROUTES.MY_LISTINGS} element={<MyListings />} />
      <Route path={ROUTES.MY_INTERESTS} element={<MyInterests />} />
      <Route path={ROUTES.LISTING_INTERESTS} element={<ListingInterests />} />
    </>
  );
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          {generalRoutes}
          {!!token ? protectedRoutes : authRoutes}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
