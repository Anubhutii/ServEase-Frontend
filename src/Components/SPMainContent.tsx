import React from "react";
import MiddleImg from "../assets/SPimg.png";
import { HiMenu } from "react-icons/hi";
import { Clock } from "lucide-react";




interface Props {
  onOpenFilters?: () => void;
}

const services = [
  { title: "AC Repair & Servicing", rating: "4.7", bookings: "1,200+", price: "₹299" },
  { title: "Electrician Services", rating: "4.6", bookings: "980+", price: "₹199" },
  { title: "Home Cleaning", rating: "4.8", bookings: "2,300+", price: "₹399" },
  { title: "Plumbing Services", rating: "4.5", bookings: "870+", price: "₹149" },
  { title: "Carpenter Services", rating: "4.4", bookings: "640+", price: "₹249" },
];


const SPMainContent: React.FC<Props> = ({ onOpenFilters }) => {

  const [currentIndex, setCurrentIndex] = React.useState(0);

React.useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  }, 3000); // changes every 3 seconds

  return () => clearInterval(interval);
}, []);

  return (
    <div className="space-y-6">

      {/* HERO IMAGE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <img
          src={MiddleImg}
          alt="Service"
          className="w-full h-80 md:h-96 object-cover"
        />
      </div>

      {/* MOBILE FILTER BUTTON */}
      <div className="lg:hidden flex justify-end">
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow"
        >
          <HiMenu size={18} />
          Filters
        </button>
      </div>

      {/* SERVICE HEADER */}
<div className="bg-white rounded-xl p-5 shadow-sm space-y-2">
      {/* SERVICE SLIDESHOW */}
<div className=" p-5 transition-all duration-500">
  <h1 className="text-2xl font-semibold">
    {services[currentIndex].title}
  </h1>

  <p className="text-sm text-gray-500 mt-2">
    ⭐ {services[currentIndex].rating} · {services[currentIndex].bookings} bookings
  </p>

  <p className="text-xl font-semibold text-slate-900 mt-2">
    Starting {services[currentIndex].price}
  </p>
</div>


      </div>

      {/* DURATION */}
      <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-3">
        <Clock size={18} className="text-blue-600" />
        <p className="text-sm text-gray-700">
          Estimated duration: <strong>60–90 minutes</strong>
        </p>
      </div>

      {/* PRIMARY CTA */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        {/* <button
          className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-xl
            font-semibold
            text-lg
            hover:bg-blue-700
            transition
          "
        >
          Book Now
        </button> */}

        <p className="text-xs text-gray-500 text-center mt-2">
          No payment required until service completion
        </p>
      </div>

    </div>
  );
};

export default SPMainContent;
