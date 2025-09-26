import CTAButton from "./CTAButton";

export default function PricingTable() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gray-900 p-6 rounded-lg hover:shadow-xl hover:shadow-vauntico-glow hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <h3 className="text-xl font-bold text-vauntico-gold mb-2">Monthly</h3>
        <p className="text-white text-lg mb-2">$29/month</p>
        <ul className="text-gray-300 text-sm mb-4 list-disc list-inside">
          <li>All vaults</li>
          <li>Branding kit</li>
          <li>Onboarding sprint</li>
          <li>VIP community</li>
        </ul>
        <CTAButton
          label="Join Monthly"
          to="/checkout?plan=monthly"
          trackEvent={true}
          className="w-full mt-4"
        />
      </div>

      <div className="bg-gray-900 p-6 rounded-lg hover:shadow-xl hover:shadow-vauntico-glow hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <h3 className="text-xl font-bold text-vauntico-gold mb-2">Yearly</h3>
        <p className="text-white text-lg mb-2">$199/year</p>
        <ul className="text-gray-300 text-sm mb-4 list-disc list-inside">
          <li>Everything in monthly</li>
          <li>2 bonus vaults</li>
          <li>Priority support</li>
        </ul>
        <CTAButton
          label="Join Yearly"
          to="/checkout?plan=yearly"
          trackEvent={true}
          className="w-full mt-4"
        />
      </div>
    </div>
  );
}