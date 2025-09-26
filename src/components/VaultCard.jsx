import PropTypes from "prop-types";
import CTAButton from "@/components/ui/CTAButton";

export default function VaultCard({ title, price, description, buttonText, slug, isLoading = false }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl hover:shadow-vauntico-glow hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <h3 className="text-xl font-bold text-vauntico-gold mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <p className="text-lg font-semibold text-white mb-4">{price}</p>

      {slug ? (
        <CTAButton
          label={isLoading ? "Unlocking..." : buttonText}
          to={`/checkout?vault=${slug}`}
          disabled={isLoading}
          className="w-full"
        />
      ) : (
        <CTAButton
          label={buttonText}
          disabled
          className="w-full opacity-50 cursor-not-allowed"
        />
      )}
    </div>
  );
}

// ✅ Prop validation
VaultCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  slug: PropTypes.string,
  isLoading: PropTypes.bool,
};