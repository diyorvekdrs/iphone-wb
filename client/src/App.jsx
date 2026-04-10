import Navbar from './components/Navbar.jsx'
import AdminDashboardPage from './components/admin/AdminDashboardPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import BasketPage from './components/BasketPage.jsx'
import PaymentPage from './components/PaymentPage.jsx'
import PurchasePage from './components/PurchasePage.jsx'
import OrdersPage from './components/OrdersPage.jsx'
import CompareIphonePage from './components/CompareIphonePage.jsx'
import IphoneProductPage from './components/IphoneProductPage.jsx'
import BuyIphonePage from './components/BuyIphonePage.jsx'
import LoginPage from './components/auth/LoginPage.jsx'
import RegisterPage from './components/auth/RegisterPage.jsx'
import IphoneCategoryHeader from './components/IphoneCategoryHeader.jsx'
import ExploreLineupSection from './components/ExploreLineupSection.jsx'
import SwitchToIphoneSection from './components/SwitchToIphoneSection.jsx'
import SignificantOthersSection from './components/SignificantOthersSection.jsx'
<<<<<<< HEAD
import AccountPage from './components/AccountPage.jsx'
import Footer from './components/Footer.jsx'
import PrivacyPolicyPage from './components/legal/PrivacyPolicyPage.jsx'
import TermsOfUsePage from './components/legal/TermsOfUsePage.jsx'
import SlaPage from './components/legal/SlaPage.jsx'
import ShippingPolicyPage from './components/legal/ShippingPolicyPage.jsx'
=======
import Footer from './components/Footer.jsx'
import PrivacyPolicyPage from './components/legal/PrivacyPolicyPage.jsx'
import TermsOfUsePage from './components/legal/TermsOfUsePage.jsx'
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
import { useHashRoute } from './hooks/useHashRoute.js'

function App() {
  const route = useHashRoute()

  if (route.view === 'buy-iphone' && route.modelId) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <BuyIphonePage modelId={route.modelId} />
        <Footer />
      </div>
    )
  }

  const { view, modelId } = route

  if (view === 'iphone' && modelId) {
    const isAir = modelId === 'air'
    return (
      <div
        className={
          isAir
            ? 'min-h-screen bg-white text-[#1d1d1f] antialiased'
            : 'min-h-screen bg-black text-white antialiased'
        }
      >
        <Navbar />
        <IphoneProductPage modelId={modelId} />
        {isAir ? <Footer /> : null}
      </div>
    )
  }

  if (view === 'compare') {
    return (
      <div className="min-h-screen bg-white text-neutral-900 antialiased">
        <Navbar />
        <CompareIphonePage />
        <Footer />
      </div>
    )
  }

  if (view === 'basket') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <BasketPage />
        <Footer />
      </div>
    )
  }

  if (view === 'payment') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <PaymentPage />
        <Footer />
      </div>
    )
  }

  if (view === 'order' || view === 'purchase') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <PurchasePage />
        <Footer />
      </div>
    )
  }

  if (view === 'orders') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <ProtectedRoute requireCustomer>
          <OrdersPage />
        </ProtectedRoute>
        <Footer />
      </div>
    )
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <LoginPage />
        <Footer />
      </div>
    )
  }

<<<<<<< HEAD
  if (view === 'account') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <ProtectedRoute>
          <AccountPage />
        </ProtectedRoute>
        <Footer />
      </div>
    )
  }

=======
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
  if (view === 'register') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <RegisterPage />
        <Footer />
      </div>
    )
  }

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-white text-neutral-900 antialiased">
        <Navbar />
        <ProtectedRoute requireSuperAdmin>
          <AdminDashboardPage />
        </ProtectedRoute>
        <Footer />
      </div>
    )
  }

  if (view === 'privacy') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <PrivacyPolicyPage />
        <Footer />
      </div>
    )
  }

  if (view === 'terms') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <TermsOfUsePage />
        <Footer />
      </div>
    )
  }

<<<<<<< HEAD
  if (view === 'sla') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <SlaPage />
        <Footer />
      </div>
    )
  }

  if (view === 'shipping') {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 antialiased">
        <Navbar />
        <ShippingPolicyPage />
        <Footer />
      </div>
    )
  }

=======
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Navbar />
      <main className="pt-11">
        <IphoneCategoryHeader />
        <ExploreLineupSection />
        <SwitchToIphoneSection />
        <SignificantOthersSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
