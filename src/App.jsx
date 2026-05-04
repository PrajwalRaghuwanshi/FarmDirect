import { Route, Routes } from 'react-router-dom'
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
import IDProofPage from './pages/IDProofPage'
import RecentlyViewedPage from './pages/RecentlyViewedPage'
import AddAddressPage from './pages/AddAddressPage'

export default function App() {
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
        <Route path="/profile/id-proof" element={<IDProofPage />} />
        <Route path="/profile/recently-viewed" element={<RecentlyViewedPage />} />
        <Route path="/profile/address/add" element={<AddAddressPage />} />
      </Route>
    </Routes>
  )
}
