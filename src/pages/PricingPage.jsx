import { useNavigate } from 'react-router-dom';
import CTAButton from '../components/CTAButton';
import VaultCard from '../components/VaultCard';
import PricingTable from '../components/PricingTable';

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-4xl mx-auto pt-12 px-4">
  <h1 className="text-4xl font-bold text-gray-900 mb-4">
    Choose Your Path to Mastery
  </h1>
  <p className="text-lg text-gray-600 mb-8">
    Whether you're just starting or ready to unlock the full vault, there's a tier for you.
  </p>
</div>
      <VaultCard />
      <PricingTable />
      <div className="text-center">
  <p className="text-md text-red-600 font-semibold">
    🔥 Limited-time bonuses included with Creator Pass and Vault Master tiers.
  </p>
  <p className="text-sm text-gray-500 mt-2">
    Bonuses include DFY templates, exclusive prompts, and early vault access.
  </p>
</div>
      <CTAButton label="Unlock Creator Toolkit" onClick={() => navigate('/vault/creator')} />
      <CTAButton label="Unlock Agency Arsenal" onClick={() => navigate('/vault/agency')} />
      <CTAButton label="Unlock E-commerce Empire" onClick={() => navigate('/vault/ecommerce')} />
        <div className="text-center py-12">
  <p className="text-sm text-gray-500">
    Questions? Reach out anytime — your journey to mastery is just beginning.
  </p>
</div>
    </div>
  );
};

export default PricingPage;

