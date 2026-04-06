'use client';
import Image from 'next/image';
import { Marquee } from "../ui/marquee";

const memoria = "/images/demo-sponsor/memoria.png";
const starsLine = "/images/stars-lines.png";

const demoSponsor1 = "/images/demo-sponsor/demo-sponsor- (1).jpeg";
const demoSponsor2 = "/images/demo-sponsor/demo-sponsor- (2).jpeg";
const demoSponsor3 = "/images/demo-sponsor/demo-sponsor- (3).jpeg";
const demoSponsor4 = "/images/demo-sponsor/demo-sponsor- (4).jpeg";
const demoSponsor5 = "/images/demo-sponsor/demo-sponsor- (5).jpeg";
const demoSponsor6 = "/images/demo-sponsor/demo-sponsor- (6).jpeg";
const demoSponsor7 = "/images/demo-sponsor/demo-sponsor- (7).jpeg";
const demoSponsor8 = "/images/demo-sponsor/demo-sponsor- (8).jpeg";
const demoSponsor9 = "/images/demo-sponsor/demo-sponsor- (9).jpeg";
const demoSponsor10 = "/images/demo-sponsor/demo-sponsor- (10).jpeg";

const SponsorMovingCard = () => {
  return (
    <div
      className="z-0 group relative flex flex-col lg:flex-row items-center justify-center overflow-hidden rounded-[2.5rem] lg:rounded-[60px] 
                    bg-gradient-to-tr from-purple-900 via-pink-900 to-amber-700 
                    w-[90%] h-[200px] md:h-[350px] lg:h-[500px] transition-all duration-500"
    >
      {/* 1. THE LOGO CONTAINER */}
      {/* Mobile: Absolute center | Desktop: Static left side (40% width) */}
      <div
        className=" z-20 items-center justify-center p-8 transition-transform duration-500 group-hover:scale-105
                      absolute inset-0 lg:relative lg:inset-auto lg:w-[40%] lg:h-full hidden sm:flex"
      >
        <Image src={memoria} alt="Sponsor Logo" className=" max-w-[80%]  lg:max-w-[65%] object-contain drop-shadow-2xl rounded-2xl " width={100} height={100} />
      </div>

      <Image src={starsLine} className="absolute start-0 bottom-0 rtl:-scale-x-100 w-[15%] hidden sm:block" alt="" width={100} height={100} />

      <div
        className="absolute inset-0 opacity-80 lg:relative lg:inset-auto lg:flex-1 lg:h-full lg:opacity-60 
                      flex flex-row gap-2 px-4  overflow-hidden pointer-events-none "
      >
        {/* Column 1 - Visible always */}
        <Marquee vertical className="[--duration:35s] flex-1">
          {[
            demoSponsor1,
            demoSponsor2,
            demoSponsor3,
            demoSponsor4,
            demoSponsor5,
          ].map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full rounded-2xl aspect-video object-cover mb-4 shadow-lg"
              alt=""
            />
          ))}
        </Marquee>

        {/* Column 3 - Only visible on large screens to fill the side-by-side gap */}
        <Marquee vertical className="[--duration:45s] flex-1 ">
          {[
            demoSponsor6,
            demoSponsor7,
            demoSponsor8,
            demoSponsor9,
            demoSponsor10,
          ].map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full rounded-2xl aspect-video object-cover mb-4 shadow-lg"
              alt=""
            />
          ))}
        </Marquee>
      </div>

      {/* Mobile Overlay: Adds a dark tint and slight blur so the "big logo" stays readable */}
      <div className="absolute inset-0 bg-black/10  lg:hidden pointer-events-none" />
    </div>
  );
};

export default SponsorMovingCard;

// const SponsorMovingCard = ({ sponsor }: { sponsor: Sponsor }) => {
//   return (
//     <div
//       className="relative group flex cursor-pointer items-center justify-center overflow-hidden rounded-[40px] lg:rounded-[60px]
//                     bg-gradient-to-tr from-purple-900 via-pink-900 to-amber-700
//                     w-[90%] h-[300px] md:h-[450px] lg:h-[550px] shadow-2xl"
//     >
//       {/* BACKGROUND LAYER: The Moving Marquees */}
//       <div className="absolute inset-0 flex flex-row gap-4 px-4 opacity-60  group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700">
//         <Marquee vertical className="[--duration:40s] flex-1">
//           {[
//             demoSponsor1,
//             demoSponsor2,
//             demoSponsor3,
//             demoSponsor4,
//             demoSponsor5,
//           ].map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               className="w-full rounded-2xl aspect-video object-cover mb-4"
//               alt=""
//             />
//           ))}
//         </Marquee>
//         <Marquee
//           vertical
//           reverse
//           className="[--duration:50s] flex-1 hidden sm:flex"
//         >
//           {[
//             demoSponsor6,
//             demoSponsor7,
//             demoSponsor8,
//             demoSponsor9,
//             demoSponsor10,
//           ].map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               className="w-full rounded-2xl aspect-video object-cover mb-4"
//               alt=""
//             />
//           ))}
//         </Marquee>
//         <Marquee vertical className="[--duration:45s] flex-1 hidden lg:flex">
//           {[
//             demoSponsor2,
//             demoSponsor4,
//             demoSponsor1,
//             demoSponsor3,
//             demoSponsor5,
//           ].map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               className="w-full rounded-2xl aspect-video object-cover mb-4"
//               alt=""
//             />
//           ))}
//         </Marquee>
//       </div>

//       {/* OVERLAY GRADIENT: Ensures the logo pops against the moving background */}
//       <div className="absolute inset-0 bg-black/10" />

//       {/* FOREGROUND LAYER: The Big Logo */}
//       <div className="relative z-20 flex h-full w-full items-center justify-center p-8 md:p-12">
//         <img
//           src={sponsor.logo!}
//           alt={sponsor.name || "Sponsor Logo"}
//           className="max-h-full max-w-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-500"
//         />
//       </div>
//     </div>
//   );
// };

// export default SponsorMovingCard;
