import { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage'
import ContactPage from './pages/ContactPage'
import CustomerServicePage from './pages/CustomerServicePage'
import FarmersPage from './pages/FarmersPage'
import HomePage from './pages/HomePage'
import OrdersPage from './pages/OrdersPage'
import ProductsPage from './pages/ProductsPage'
import SignInPage from './pages/SignInPage'
import AccountPage from './pages/AccountPage'
import HowItWorksPage from './pages/HowItWorks'
import SeasonsPage from './pages/SeasonsPage'
import SeasonDetailsPage from './pages/SeasonDetailsPage'
import FarmProfilePage from './pages/FarmProfilePage'
import SettingsPage from './pages/SettingsPage'
import AddressPage from './pages/AddressPage'
import RecentlyViewedPage from './pages/RecentlyViewedPage'
import AddAddressPage from './pages/AddAddressPage'
import MyActivityPage from './pages/MyActivityPage'
import WishlistPage from './pages/WishlistPage'
import SupportPage from './pages/SupportPage'
import SearchPage from './pages/SearchPage'

const RTL_LANGUAGES = ['ur', 'sd', 'ks'];

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = RTL_LANGUAGES.includes(i18n.language) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/customer-service" element={<CustomerServicePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/Account/:username" element={<AccountPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/seasons" element={<SeasonsPage />} />
        <Route path="/seasons/:seasonId" element={<SeasonDetailsPage />} />
        <Route path="/farm-profile/:farmerName" element={<FarmProfilePage />} />
        <Route path="/profile/settings" element={<SettingsPage />} />
        <Route path="/profile/address" element={<AddressPage />} />
        <Route path="/profile/recently-viewed" element={<RecentlyViewedPage />} />
        <Route path="/profile/address/add" element={<AddAddressPage />} />
        <Route path="/profile/activity" element={<MyActivityPage />} />
        <Route path="/profile/wishlist" element={<WishlistPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<Navigate to="/profile/activity" replace />} />
      </Route>
    </Routes>
  )
}
