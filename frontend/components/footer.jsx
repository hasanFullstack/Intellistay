import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaGoogle,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="relative text-white h-[700px]">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
                }}
            ></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/85"></div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 py-20">
                
                {/* TOP ROW (Newsletter LEFT + Links RIGHT) */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                    
                    {/* LEFT → Newsletter */}
                    <div className="max-w-lg w-full">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Stay Updated! Subscribe To <br /> Our Newsletter
                        </h2>

                        <div className="flex items-center bg-white rounded-full p-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-3 text-black outline-none bg-transparent"
                            />

                            {/* PERFECT CIRCLE BUTTON */}
                            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-xl shrink-0">
                                →
                            </button>
                        </div>
                    </div>

                    {/* RIGHT → Pages + Resources */}
                    <div className="flex gap-16">
                        <div>
                            <h4 className="font-semibold mb-4">Pages</h4>
                            <ul className="space-y-2 text-gray-1000">
                                <li className="hover:text-white cursor-pointer">Home</li>
                                <li className="hover:text-white cursor-pointer">About-Us</li>
                                <li className="hover:text-white cursor-pointer">Contact-Us</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li className="hover:text-white cursor-pointer">FAQS</li>
                                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                                <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="mt-20 flex items-center justify-between">
                    <div className="text-sm text-white font-semibold">
                        © 2025 FindByFeature. All Rights Reserved.
                    </div>

                    <div className="flex items-center gap-6 text-2xl">
                        <FaGoogle className="cursor-pointer hover:text-gray-300" />
                        <FaFacebookF className="cursor-pointer hover:text-gray-300" />
                        <FaTwitter className="cursor-pointer hover:text-gray-300" />
                        <FaInstagram className="cursor-pointer hover:text-gray-300" />
                    </div>
                </div>
            </div>

            {/* BIG TEXT */}
            <div className="absolute bottom-0 left-0 w-full text-center pointer-events-none">
                <h1 className="text-[80px] md:text-[140px] font-bold text-white/10 tracking-widest">
                    FINDBYFEATURE
                </h1>
            </div>
        </footer>
    );
};

export default Footer;