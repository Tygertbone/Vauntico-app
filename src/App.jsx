import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core Pages
import Homepage from './pages/Homepage';
import PricingPage from './pages/PricingPage';
import OnboardingPage from './pages/OnboardingPage';
import VaultDetailPage from './pages/VaultDetailPage';
import VaultSuccessPage from './pages/VaultSuccessPage';
import DemoPage from './pages/DemoPage';
import DelegationPage from './pages/DelegationPage';

// Ascension Codex Funnel
import AscensionCodexPage from './pages/AscensionCodexPage';       // ✅ MAIN SALES PAGE
import CheckoutPage from './pages/CheckoutPage';                   // ✅ PAYMENT PAGE
import AscensionOnboardingPage from './pages/AscensionOnboardingPage'; // ✅ SOUL PROFILE
import AscensionWelcomePage from './pages/AscensionWelcomePage';   // ✅ SUCCESS PAGE

// Vault & Creator
import PromptVaultPage from './components/PromptVaultPage';
import VaultsPage from './components/VaultsPage';
import CreatorPassPage from './components/CreatorPassPage';

// UI Shell
import { Sidebar, SidebarProvider, SidebarInset } from './components/ui/sidebar';

import './App.css';

function App() {
  return (
    <SidebarProvider>
      <Sidebar />
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
          </Routes>
        </Router>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;