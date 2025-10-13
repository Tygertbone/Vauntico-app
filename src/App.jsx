import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Core Pages
import Homepage from './pages/Homepage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import VaultDetailPage from './pages/VaultDetailPage.jsx';
import VaultSuccessPage from './pages/VaultSuccessPage.jsx';
import DemoPage from './pages/DemoPage.jsx';
import DelegationPage from './pages/DelegationPage.jsx';

// Ascension Codex Funnel
import AscensionCodexPage from './pages/AscensionCodexPage.jsx';       // ✅ MAIN SALES PAGE
import CheckoutPage from './pages/CheckoutPage.jsx';                   // ✅ PAYMENT PAGE
import AscensionOnboardingPage from './pages/AscensionOnboardingPage.jsx'; // ✅ SOUL PROFILE
import AscensionWelcomePage from './pages/AscensionWelcomePage.jsx';   // ✅ SUCCESS PAGE

// Vault & Creator
import PromptVaultPage from './components/PromptVaultPage.jsx';
import VaultsPage from './components/VaultsPage.jsx';
import CreatorPassPage from './components/CreatorPassPage.jsx';

// SSO pages
import AccountPage from './pages/AccountPage.jsx';
import LinkRitesPage from './pages/LinkRitesPage.jsx';
import DreamMoverBridgePage from './pages/DreamMoverBridgePage.jsx';
import VaultPage from './pages/VaultPage.jsx';
import RitesPage from './pages/RitesPage.jsx';
import WebhookStudioPage from './pages/WebhookStudioPage.jsx';

// UI Shell (sidebar removed for clean top-nav layout)

// 🚀 NEW: Transmission Pages
import TransmissionPage from './pages/codex/TransmissionPage.jsx';
import TodayPage from './pages/codex/TodayPage.jsx';   
import ArchivePage from './pages/codex/ArchivePage.jsx';   // ✅ FIXED
import WebhookLog from './pages/admin/WebhookLog.jsx';
import BrandPage from './pages/BrandPage.jsx';

import './App.css';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

function App() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black text-white px-3 py-2 rounded"
      >
        Skip to content
      </a>
      <header className="w-full bg-black text-white border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">Vauntico</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/dream-mover" className="nav-link">Dream Mover</Link>
          <Link to="/webhook-studio" className="nav-link">Webhook Studio</Link>
          <Link to="/admin/webhook-log" className="nav-link">Admin</Link>
          <Link to="/brand" className="nav-link">Brand</Link>
        </nav>
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link to="/account" className="text-sm underline hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">Sign in</Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
      <div id="main-content">
        <Router>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<Homepage />} />

            {/* Vaults */}
            <Route path="/prompt-vault" element={<PromptVaultPage />} />
            <Route path="/vaults" element={<VaultsPage />} />
            <Route path="/vaults/:slug" element={<VaultDetailPage />} />
            <Route path="/vault-success" element={<VaultSuccessPage />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/rites" element={<RitesPage />} />

            {/* Creator / Pricing */}
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/creator-pass" element={<CreatorPassPage />} />

            {/* Generic Onboarding */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Demos */}
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/delegation" element={<DelegationPage />} />

            {/* Webhook Studio */}
            <Route path="/webhook-studio" element={<WebhookStudioPage />} />

            {/* 🚀 Ascension Codex Funnel */}
            <Route path="/ascension-codex" element={<AscensionCodexPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/ascension-onboarding" element={<AscensionOnboardingPage />} />
            <Route path="/ascension-welcome" element={<AscensionWelcomePage />} />

            {/* 🚀 Ascension Codex Transmissions */}
            <Route path="/codex/:week/:day" element={<TransmissionPage />} />
            <Route path="/codex/today" element={<TodayPage />} />
            <Route path="/codex/archive" element={<ArchivePage />} />   {/* ✅ FIXED */}

            {/* Auth */}
            <Route path="/account" element={<AccountPage />} />
            <Route path="/link-rites" element={<LinkRitesPage />} />
            <Route path="/dream-mover" element={<DreamMoverBridgePage />} />

            {/* Admin */}
            <Route path="/admin/webhook-log" element={<WebhookLog />} />

            {/* Brand Grimoire */}
            <Route path="/brand" element={<BrandPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
