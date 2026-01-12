import React, { useState } from "react";
import { Percent } from "lucide-react";

const SPRightSidebar: React.FC = () => {
  const [showAllOffers, setShowAllOffers] = useState(false);

  const offers = [
  {
    title: "No visitation fee",
    subtitle: "On your first booking",
  },
  {
    title: "Flat ₹50 welcome cashback",
    subtitle: "Valid on first successful service",
  },
  {
    title: "Extra savings via UPI",
    subtitle: "Available on selected UPI payments",
  },
  {
    title: "Special launch offer",
    subtitle: "Limited-time deals for early users",
  },
];


  const visibleOffers = showAllOffers ? offers : offers.slice(0, 1);

  return (
    <div className="w-full space-y-4">

      {/* CART EMPTY */}
      <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-300 shadow-sm p-6 text-center">
        <div className="mx-auto mb-3 h-14 w-14 flex items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-purple-100">
          <span className="text-3xl">🛒</span>
        </div>
        <p className="text-sm text-gray-600">
  Add a service to book instantly
</p>

      </div>

      {/* OFFERS */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
        {visibleOffers.map((offer, index) => (
          <Offer
            key={index}
            title={offer.title}
            subtitle={offer.subtitle}
          />
        ))}

        <button
          onClick={() => setShowAllOffers(!showAllOffers)}
          className="text-sm text-purple-600 font-medium flex items-center gap-1"
        >
          {showAllOffers ? "View Less Offers" : "View More Offers"}
          <span className="text-base">
            {showAllOffers ? "⌃" : "⌄"}
          </span>
        </button>
      </div>

      {/* UC PROMISE */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 relative">
        <h4 className="font-semibold mb-3">ServEase Promise</h4>

        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✔</span> Verified Professionals
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✔</span> Hassle Free Booking
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✔</span> Transparent Pricing
          </li>
        </ul>

        <div className="absolute top-4 right-4 text-xs bg-linear-to-br from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          Quality Assured
        </div>
      </div>
    </div>
  );
};

export default SPRightSidebar;

/* -------------------- */
/* OFFER ROW COMPONENT */
/* -------------------- */
const Offer = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="flex gap-3">
    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
      <Percent size={16} />
    </div>
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);
