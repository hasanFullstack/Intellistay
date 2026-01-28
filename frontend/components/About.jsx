import React, { useState } from "react";
// Rooms component defined locally below
import { Link } from "react-router-dom";

const About = () => {
  const [showVideo, setShowVideo] = useState(false);
  // Removed showRooms state, not needed
  const faqItems = [
    {
      id: 1,
      title: "How do you choose the right hostel?",
      body: "Consequat interdum varius sit amet mattis vulputate enim nulla. Posuere morbi leo urna molestie at elementum eu facilisis sed excepteur sint occaecat",
    },
    {
      id: 2,
      title: "How many people are in a hostel room?",
      body: "Consequat interdum varius sit amet mattis vulputate enim nulla. Posuere morbi leo urna molestie at elementum eu facilisis sed excepteur sint occaecat",
    },
    {
      id: 3,
      title: "Are there private rooms in Hostels?",
      body: "Consequat interdum varius sit amet mattis vulputate enim nulla. Posuere morbi leo urna molestie at elementum eu facilisis sed excepteur sint occaecat",
    },
    {
      id: 4,
      title: "How do I keep my things safe in a hostel?",
      body: "Consequat interdum varius sit amet mattis vulputate enim nulla. Posuere morbi leo urna molestie at elementum eu facilisis sed excepteur sint occaecat",
    },
    {
      id: 5,
      title: "How do you stay safe in a hostel?",
      body: "Consequat interdum varius sit amet mattis vulputate enim nulla. Posuere morbi leo urna molestie at elementum eu facilisis sed excepteur sint occaecat",
    },
    {
      id: 6,
      title: "What facilities are usually included?",
      body: "Consequat interdum varius sit amet mattis vulputate enim nulla. Posuere morbi leo urna molestie at elementum eu facilisis sed excepteur sint occaecat",
    },
  ];

  const FaqCard = ({ item }) => (
    <div id={`faq-${item.id}`} className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold text-sky-800">{item.title}</h3>
      <p className="mt-3 text-gray-600">{item.body}</p>
    </div>
  );

  const faqSection = (
    <div className="container py-20 bg-white w-full">
      <div className="px-0 w-full">
        <div className="flex justify-between gap-8 px-16">
          <h2 className="font-bold text-slate-900 mb-8">
            <span className="block font-bold">Frequently asked</span>
            <span className="block font-bold">questions about hostel</span>
          </h2>
          <p className="text-end text-xl px-25 text-slate-600">
            Diam phasellus vestibulum lorem sed risus ultricies tristique
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 w-full px-16">
          {faqItems.map((f) => (
            <FaqCard key={f.id} item={f} />
          ))}
        </div>
      </div>
    </div>
  );

  // Rooms data for the Rooms component
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

  // Rooms component
  function Rooms() {
    return (
      <section className="bg-white py-12 w-full">
        <div className="w-full px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 px-10">
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

          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full ">
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

  return (
    <section className="">
      <div className="bg-sky-50">
        <div className=" max-w-8xl px-40  py-16">
          <div className=" text-sm text-gray-500">
            <a href="/" className="text-sky-600 font-medium">
              Home
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">About</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            About
          </h1>
        </div>
      </div>

      {/* Description row (right-aligned on md) */}
      <div className="container mx-auto">
        <div className="p-10 mt-20">
          <div className="row mt-6  align-items-center justify-between ">
            <div className="col-md-6 ">
              <p className="text-5xl  font-bold">
                The main benefits to choose Hosteller
              </p>
            </div>
            <div className="col-md-6 text-md-end text-muted">
              <p className="mb-0 text-[18px] pl-30 font-normal">
                Aliquam eleifend mi in nulla. Viverra nibh cras pulvinar mattis
                nunc
              </p>
            </div>
          </div>

          {/* Stats card */}

          <div className="card mx-auto shadow-md">
            <div className="row text-center py-4">
              <div className="col-md-4">
                <h1 className="display-4 fw-bold text-primary">240+</h1>
                <p className="text-muted items-center font-normal">
                  Consequat interdum varius sit amet mattis vulputate enim nulla
                </p>
              </div>
              <div className="col-md-4 border-start border-end">
                <h1 className=" fw-bold text-primary">60+</h1>
                <p className="text-muted items-center font-normal">
                  Consequat interdum varius sit amet mattis vulputate enim nulla
                </p>
              </div>
              <div className="col-md-4">
                <h1 className="display-4 fw-bold text-primary">98%</h1>
                <p className="text-muted items-center font-normal">
                  Consequat interdum varius sit amet mattis vulputate enim nulla
                </p>
              </div>
            </div>
          </div>
          {/* Video poster + overlay */}
          <div className="video mt-20 relative">
            <img
              src="\src\assets\video.webp"
              alt="About video poster"
              className="w-100 rounded"
              style={{ objectFit: "cover", width: "100%", height: "500px" }}
            />
            <button
              type="button"
              className="video-play-btn"
              onClick={() => setShowVideo(true)}
              aria-label="Play video"
            >
              <svg
                width="64"
                height="44"
                viewBox="0 0 24 17"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="false"
              >
                <rect width="24" height="17" rx="3" fill="#FF0000" />
                <path d="M9.5 4.5L15 8.5L9.5 12.5V4.5Z" fill="#fff" />
              </svg>
            </button>

            {showVideo && (
              <div
                className="video-overlay"
                onClick={() => setShowVideo(false)}
              >
                <div
                  className="video-frame"
                  onClick={(e) => e.stopPropagation()}
                >
                  <iframe
                    width="100%"
                    height="540"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="About video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Rooms section (now always visible) */}
          <div className="mt-12">
            <Rooms />
          </div>
        </div>
        {/* Booking stages section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="justify-start">
                <h1 className="text-xl px-6 font-extrabold ">
                  Stages of booking a room
                </h1>

                <div className="space-y-2 px-6 mt-8">
                  <div className="flex items-start gap-6">
                    <div className="">
                      <div className="w-16 h-16 bg-sky-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-sky-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V9H3v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Room reservation</h3>
                      <p className="text-gray-500 mt-2">
                        Integer eget aliquet nibh praesent tristique magna sit
                        amet purus
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="">
                      <div className="w-16 h-16 bg-sky-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-sky-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7h18M7 11h10M7 15h6"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Filling in documents and payment
                      </h3>
                      <p className="text-gray-500 mt-2">
                        Leo duis ut diam quam. Sed velit dignissim sodales ut eu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="">
                      <div className="w-16 h-16 bg-sky-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-sky-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5S10.343 11 12 11zM4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Check in hostel</h3>
                      <p className="text-gray-500 mt-2">
                        Vulputate enim nulla aliquet porttitor. Sagittis nisl
                        rhoncus mattis rhoncus
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="bg-sky-900 text-white px-6 py-3 rounded-lg">
                      Choose room
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <img
                  src="/src/assets/3.webp"
                  alt="booking"
                  className="w-full rounded-lg shadow"
                  style={{ height: 720, objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Rules & Contact section */}
      <div className="py-16 bg-gray-50 mx-auto">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full items-start">
            <div className="pr-6 px-20">
              <h2 className="text-xl px-10 font-extrabold text-slate-900 mb-8">
                Rule settlement, eviction and stay
              </h2>

              <ul className="space-y-2 px-20 mx-auto text-gray-700">
                <li className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p>
                    Time of arrival is after 14-00. Time of departure is to
                    12-00
                  </p>
                </li>

                <li className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p>Does a settlement take place only at complete payment</p>
                </li>

                <li className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p>
                    Is there a settlement in hostel only after the presence of
                    passport
                  </p>
                </li>

                <li className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Volutpat odio facilisis mauris sit amet massa vitae tortor
                    condimentum. Quam elementum pulvinar etiam non quam lacus
                    suspendisse. Eget gravida cum sociis natoque
                  </p>
                </li>
              </ul>
            </div>

            <div className="h-full">
              <div className="bg-white h-full rounded-xl shadow-lg p-8">
                <h3 className="text-3xl font-extrabold mb-6">
                  We are ready answer your question
                </h3>

                <form className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      className="flex-1 border rounded-lg px-4 py-3 outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="flex-1 border rounded-lg px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Message"
                      rows={6}
                      className="w-full border rounded-lg p-4 resize-none outline-none"
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      className="bg-sky-900 text-white px-6 py-3 rounded-md"
                    >
                      Send message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {faqSection}

      {/* Testimonial & Newsletter Section */}
      <div className="bg-sky-50 mt-20 py-20 w-full">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            {/* Testimonial and Newsletter stacked vertically */}
            <div className="flex flex-col gap-10 w-full md:w-2/3">
              {/* Testimonial */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Founder of the hostel"
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <p className="text-xl md:text-xl font-bold text-slate-900 leading-snug">
                    “Mauris a diam maecenas sed enim ut sem. Scelerisque in
                    dictum non consectetur a erat nam. Commodo viverra maecenas
                    accumsan lacus”
                  </p>
                  <div className="mt-4 flex flex-col md:flex-row md:items-center gap-2 text-slate-600 text-lg">
                    <span className="font-semibold">Johnathan Jennings</span>
                    <span className="hidden md:inline mx-2">|</span>
                    <span>Founder of the hostel “Hosteller”</span>
                  </div>
                </div>
              </div>
              {/* Newsletter */}
              <div>
                <h3 className="text-2xl font-bold mb-2">Newsletter</h3>
                <p className="text-slate-600 mb-4">
                  Urna id volutpat lacus laoreet. Viverra vitae congue eu
                  consequat ac
                </p>
                <form className="flex max-w-md">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 px-4 py-3 rounded-l-lg border border-slate-300 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-sky-800 hover:bg-sky-900 text-white px-6 rounded-r-lg flex items-center justify-center"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Newsletter & Apartment Search */}
            <div className="flex-1 flex flex-col gap-10 w-full">
              {/* Apartment Search */}
              <div className="border-l-4 border-sky-700 pl-6 pb-8">
                <h3 className="text-2xl font-bold mb-2">
                  Are you looking for an apartment?
                </h3>
                <p className="text-slate-600 mb-6">
                  Tellus mauris a diam maecenas sed enim. Facilisi etiam
                  dignissim diam quis enim lobortis scelerisque fermentum
                </p>
                <Link to="/rooms">
                  <button className="bg-sky-800 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-sky-900 transition">
                    View rooms
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
