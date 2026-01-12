import cleaningImg from '../assets/popular/pro-cleaning.png';
import plumbingImg from "../assets/card-plumber.png";
import electricImg from "../assets/popular/pro-electrician.png";
import acImg from "../assets/card-ac.png";
import painterImg from "../assets/popular/pro-painter.png";
import Wsalon from "../assets/popular/pro-wsalon.png";
import chef from '../assets/popular/pro-chef.png';
import applianceImg from '../assets/popular/pro-applience.png';

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";



const services = [
  { title: "Cleaning", bookings: "450K+", img: cleaningImg },
  { title: "Plumbing", bookings: "325K+", img: plumbingImg },
  { title: "Electrician", bookings: "280K+", img: electricImg },
  { title: "AC Repair", bookings: "165K+", img: acImg, featured: true },
  
  { title: "Painter", bookings: "120K+", img: painterImg },
  { title: "women's Salon", bookings: "140K+", img: Wsalon },
  { title: "Chef", bookings: "90K+", img: chef },
  { title: "Appliance Repair", bookings: "200K+", img: applianceImg },

];

//     <section className="mt-20 px-4 md:px-16">
      
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900">
//             Popular Services
//           </h2>
//           <p className="text-sm text-slate-600 mt-1">
//             Quickly book the most popular home services nearby.
//           </p>
//         </div>

//         <button className="text-blue-600 text-sm font-medium hover:underline">
//           View All →
//         </button>
//       </div>

//       {/* SERVICES GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {services.map((service, i) => (
//           <div
//             key={i}
//             className="
//               flex items-center gap-4
//               p-4
//               rounded-2xl
//               bg-white/70
//               backdrop-blur-md
//               border border-white/40
//               shadow-[0_8px_30px_rgba(0,0,0,0.08)]
//               hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
//               transition
//             "
//           >
//             {/* IMAGE */}
//             <img
//               src={service.img}
//               alt={service.title}
//               className="w-20 h-20 rounded-xl object-cover"
//             />

//             {/* CONTENT */}
//             <div className="flex-1">
//               <h3 className="font-semibold text-slate-900">
//                 {service.title}
//               </h3>
//               <p className="text-xs text-slate-600 mt-1">
//                 {service.bookings} Bookings
//               </p>

//               <button className="
//                 mt-3
//                 px-4 py-1.5
//                 text-xs
//                 font-medium
//                 rounded-full
//                 bg-blue-600
//                 text-white
//                 hover:bg-blue-700
//                 transition
//               ">
//                 Book Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* MOBILE VIEW ALL */}
//       <div className="mt-6 text-center sm:hidden">
//         <button className="text-blue-600 text-sm font-medium">
//           View All →
//         </button>
//       </div>
//     </section>
//   );
// }/ 

export default function PopularServices() {

  const desktopServices = services.slice(0, 8);
  const mobileServices = services.slice(0, 4);

  return (
    <section className="pt-20 pb-12 px-4 md:px-16 bg-gradient-to-br from-[#dbeafe] via-[#f8fafc] to-[#fde2e4]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
            Popular Services
          </h2>
          <p className="text-slate-600 mt-1 text-lg">
            Choose what you need — trusted professionals nearby
          </p>
                  
          <p className="text-slate-500 mt-1 text-md">Book in minutes - Serving verified experts in your area <span className='text-blue-700 text-sm'>🛡️ Verified📍 Local 🔒 Secure ⚡ Fast Service</span></p>
                  
        </div>

        {/* Desktop View All */}
        <Link
  to="/services"
  className="text-xs font-medium text-blue-600 hover:underline ml-auto block"
>
  View All →
</Link>

      </div>

      {/* DESKTOP: 4x2 GRID */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-5">
  {desktopServices.map((service, i) => (
    <DesktopServiceCard key={i} service={service} />
  ))}
</div>



      {/* MOBILE: 1x4 LIST */}
      <div className="sm:hidden flex flex-col gap-4">
        {mobileServices.map((service, i) => (
          <ServiceCard key={i} service={service} />
        ))}

        <button className="
  block sm:hidden
  text-blue-600 text-sm font-medium
  py-2
  text-center
">
  View All →
</button>

        </div>
    </section>
  );
}

function ServiceCard({ service }: { service: any }) {
  const navigate = useNavigate();
  return (
    <div
      className="
        relative
        flex items-center justify-between
        rounded-2xl
        p-6
        border border-slate-200
        bg-gradient-to-br from-white via-slate-50 to-slate-100
        shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        hover:shadow-[0_18px_50px_rgba(0,0,0,0.14)]
        transition
      "
    >
      {/* LEFT CONTENT */}
      <div className="pr-20">
        {service.featured && (
          <span className="inline-flex items-center gap-1 mb-2 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
            ⭐ Recommended
          </span>
        )}

        <h3 className="text-base md:text-lg font-semibold text-slate-900">
          {service.title}
        </h3>

        <p className="text-xs text-slate-600 mt-1">
          {service.bookings} bookings nearby
        </p>

        <button
          onClick={() => navigate("/service")}
          className="
            mt-4
            inline-flex items-center gap-1
            px-4 py-1.5
            text-xs font-medium
            rounded-full
            bg-blue-600
            text-white
            hover:bg-blue-700
            shadow-md
            transition
          "
        >
          Book Now →
        </button>
      </div>

      {/* RIGHT IMAGE */}
      <img
        src={service.img}
        alt={service.title}
        className="
          absolute
          right-4 bottom-4
          w-20 h-28
          object-contain
          drop-shadow-lg
        "
      />
    </div>
  );
}

function DesktopServiceCard({ service }: { service: any }) {
  const navigate = useNavigate();
  return (
    <div
      className="
        relative
        flex flex-col items-center text-center
        rounded-2xl
        p-5
        h-[240px]
        bg-white
        border border-slate-200
        shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        hover:shadow-[0_14px_40px_rgba(0,0,0,0.14)]
        transition
      "
    >
      {/* IMAGE WRAPPER */}
      <div className="relative">
        {/* RECOMMENDED BADGE */}
        {service.featured && (
          <span className="
            absolute -top-2 -left-2
            text-[10px] font-semibold
            px-2 py-0.5
            rounded-full
            bg-blue-600 text-white
            shadow
          ">
            ⭐ Recommended
          </span>
        )}

        <img
          src={service.img}
          alt={service.title}
          className="w-32 h-32 object-contain mb-3"
        />
      </div>

      <h3 className="text-sm font-semibold text-slate-900">
        {service.title}
      </h3>

      <p className="text-[11px] text-slate-600 mt-0.5">
        {service.bookings} bookings nearby
      </p>

      <button
        onClick={() => navigate("/service")}
        className="
          mt-auto
          px-3 py-1
          text-[11px]
          font-medium
          rounded-full
          bg-blue-600
          text-white
          hover:bg-blue-700
          transition
        "
      >
        Book Now →
      </button>
    </div>
  );
}



