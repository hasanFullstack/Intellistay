import React from "react";
import { Link } from "react-router-dom";

const roomsData = [
  {
    id: 1,
    title: "Bed in 6-Bed Room with Shared Bathroom",
    price: 18,
    sleeps: 2,
    beds: "1 bunk bed",
    img: "/src/assets/01.webp",
  },
  {
    id: 2,
    title: "Double Room with Private Bathroom",
    price: 35,
    sleeps: 2,
    beds: "2 twin beds",
    img: "/src/assets/01.webp",
  },
  {
    id: 3,
    title: "Apartment with Private Bathroom",
    price: 99,
    sleeps: 1,
    beds: "1 full bed",
    img: "/src/assets/01.webp",
  },
];

export default function Rooms() {
  return (
    <section className="bg-white py-12 w-full">
      <div className="">
        <div className="flex flex-col space-x-2 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-xl px-10 font-extrabold">Hostel rooms</h1>
          <div>
            <Link
              to="/rooms"
              className="inline-block bg-sky-900 text-white px-4 py-2 rounded-md"
            >
              View all rooms
            </Link>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {roomsData.map((room) => (
            <li
              key={room.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                <img
                  src={room.img}
                  alt={room.title}
                  className="w-full h-56 object-cover"
                />
                <span className="absolute left-70 top-50 bg-white/90 text-sky-700 font-semibold px-3 py-1 rounded">
                  <span className="text-xl">${room.price}</span>
                  <span className="ml-1 text-sm">/ 1 night</span>
                </span>
              </div>

              <div className="p-4 flex flex-col justify-between h-44">
                <div>
                  <Link
                    to={`/room/${room.id}`}
                    className="block text-2xl font-extrabold text-slate-900 hover:text-sky-600"
                  >
                    {room.title}
                  </Link>
                  <div className="mt-3 text-base font-normal text-gray-500 flex gap-3">
                    <span className="inline-flex items-center gap-2">
                      {room.sleeps} Sleeps
                    </span>
                    <span className="inline-flex items-center gap-2">
                      {room.beds}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Link
                    to="#"
                    className="text-sky-600 font-medium inline-flex items-center gap-2"
                  >
                    See availability{" "}
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
