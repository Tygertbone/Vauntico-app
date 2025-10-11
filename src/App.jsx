import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// UI Shell
import { Sidebar, SidebarProvider, SidebarInset } from './components/ui/sidebar.jsx';

// 🚀 NEW: Transmission Pages
import TransmissionPage from './pages/codex/TransmissionPage.jsx';
import TodayPage from './pages/codex/TodayPage.jsx';   
import ArchivePage from './pages/codex/ArchivePage.jsx';   // ✅ FIXED

import './App.css';

function App() {
  return (
    <SidebarProvider>
      <Sidebar />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black text-white px-3 py-2 rounded"
      >
        Skip to content
      </a>
      <SidebarInset>
        <Router>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<Homepage />} />

            {/* Vaults */}
            <Route path="/prompt-vault" element={<PromptVaultPage />} />
            <Route path="/vaults" element={<VaultsPage />} />
            <Route path="/vaults/:slug" element={<VaultDetailPage />} />
            <Route path="/vault-success" element={<VaultSuccessPage />} />

            {/* Creator / Pricing */}
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/creator-pass" element={<CreatorPassPage />} />

            {/* Generic Onboarding */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Demos */}
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/delegation" element={<DelegationPage />} />

            {/* 🚀 Ascension Codex Funnel */}
            <Route path="/ascension-codex" element={<AscensionCodexPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/ascension-onboarding" element={<AscensionOnboardingPage />} />
            <Route path="/ascension-welcome" element={<AscensionWelcomePage />} />

            {/* 🚀 Ascension Codex Transmissions */}
            <Route path="/codex/:week/:day" element={<TransmissionPage />} />
            <Route path="/codex/today" element={<TodayPage />} />
            <Route path="/codex/archive" element={<ArchivePage />} />   {/* ✅ FIXED */}
          </Routes>
        </Router>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;