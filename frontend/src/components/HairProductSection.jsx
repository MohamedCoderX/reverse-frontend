import { useRef, useState } from "react";
import { FiPlay, FiPause } from "react-icons/fi";
import { FaSeedling } from "react-icons/fa";
import { GiWheat } from "react-icons/gi";
import { GiPotionBall } from "react-icons/gi";
import { GiFlowerPot } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa";
import { LuLeaf } from "react-icons/lu";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Surya() {
    const icons = [
        <LuLeaf key="leaf" />,
        <FaSeedling key="seedling" />,
        <GiWheat key="wheat" />,
        <GiPotionBall key="potion" />,
        <GiFlowerPot key="flower" />,
    ];
    const bgColors = [
        "bg-green-600 text-white",
        "bg-emerald-800 text-white",
        "bg-yellow-500 text-white",
        "bg-black text-white",
        "bg-rose-500 text-white",
    ];
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(true);

    const toggleVideo = () => {
        if (!videoRef.current) return;

        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }

        setPlaying(!playing);
    };

    const ingredients = [
        { title: "Rosemary", desc: "Stimulates hair growth & improves blood circulation to follicles", color: "bg-green-500" },
        { title: "Bhringraj", desc: "The King of Hair - Promotes regrowth & reduces thinning", color: "bg-green-600" },
        { title: "Fenugreek", desc: "Strengthens roots & adds natural shine to hair", color: "bg-yellow-500" },
        { title: "Black Seeds", desc: "Boosts scalp health & fights dandruff naturally", color: "bg-gray-800" },
        { title: "Clove", desc: "Improves circulation & prevents premature greying", color: "bg-red-500", highlight: true },
    ];

    const benefits = [
        { title: "Reduces Hair Fall", desc: "Up to 80% reduction in 21 days" },
        { title: "Stimulates Growth", desc: "Activates dormant follicles" },
        { title: "Fights Dandruff", desc: "Natural antimicrobial protection" },
        { title: "Adds Shine", desc: "Makes hair visibly healthier" },
    ];

    const steps = [
        { num: "01", title: "Apply", desc: "Spray on clean scalp" },
        { num: "02", title: "Massage", desc: "Use fingertips for 5mins" },
        { num: "03", title: "Leave", desc: "Let it absorb naturally" },
        { num: "04", title: "Repeat", desc: "3 times per week" },
    ];


    return (
        <div className="bg-[#f9f7f2] min-h-screen overflow-hidden">

            <section className="px-6 pt-20 md:pt-32 text-center max-w-7xl mx-auto">
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs md:text-sm font-black tracking-[0.4em] text-[#c5a059] mb-4 uppercase"
                >
                    The Transformation Ritual
                </motion.p>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="text-4xl md:text-7xl lg:text-8xl font-serif font-black text-[#064e3b] leading-[1.1] tracking-tight"
                >
                    Rosemary <span className="italic text-[#c5a059]">Alchemy</span> Water
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-[#064e3b]/60 text-lg md:text-2xl mt-8 max-w-2xl mx-auto font-medium"
                >
                    A potent Ayurvedic infusion crafted to transform your hair from root to tip.
                </motion.p>
            </section>

            {/* HERO VIDEO */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="mt-16 md:mt-24 flex justify-center px-4 md:px-6"
            >
                <div className="w-full max-w-6xl rounded-[40px] md:rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(6,78,59,0.15)] relative border-8 border-white group translate-z-0">

                    {/* Video */}
                    <video
                        ref={videoRef}
                        src="https://www.w3schools.com/html/mov_bbb.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-64 sm:h-96 lg:h-[600px] object-cover will-change-transform group-hover:scale-105 transition-transform duration-1000"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute bottom-10 left-10 text-white">
                        <h3 className="text-xl md:text-3xl font-serif font-black mb-2 translate-z-0">
                            Watch the transformation ritual
                        </h3>
                        <p className="text-sm md:text-lg opacity-80 font-medium">
                            See how ease unfolds into excellence
                        </p>
                    </div>

                    {/* Play / Pause Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleVideo}
                        className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-2xl flex items-center justify-center text-white text-2xl border border-white/30 hover:bg-[#c5a059] transition-colors"
                    >
                        {playing ? <FiPause /> : <FiPlay />}
                    </motion.button>

                </div>
            </motion.div>

            {/* INGREDIENTS */}
            <section className="px-4 md:px-6 mt-16 md:mt-24">

                <div className="max-w-7xl mx-auto text-center">

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl lg:text-6xl font-black text-[#064e3b] tracking-tight"
                    >
                        Powerful <span className="italic font-serif text-[#c5a059]">Ayurvedic</span> Fusion
                    </motion.h2>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10 mt-10 md:mt-16">

                        {ingredients.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                className="flex flex-col bg-white rounded-3xl p-6 md:p-8 items-start gap-3 md:gap-4 hover:shadow-2xl border border-black/5 hover:border-[#c5a059]/20 transition-all duration-500 group translate-z-0"
                            >
                                <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-xl md:text-3xl group-hover:scale-110 transition-transform duration-500 ${bgColors[i]}`}>
                                    {icons[i]}
                                </div>

                                <div className="mt-2 text-left">
                                    <h3 className="font-black text-[#064e3b] text-[12px] md:text-lg uppercase tracking-tight mb-1 md:mb-2 leading-tight">
                                        {item.title}
                                    </h3>

                                    <p className="text-[10px] md:text-sm font-medium text-gray-500 leading-relaxed overflow-hidden line-clamp-2 md:line-clamp-none">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                    </div>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="px-4 md:px-6 mt-16 md:mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">

                        {benefits.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                className="bg-[#064e3b] rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-2xl flex flex-col items-center text-center group translate-z-0"
                            >
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6 md:mb-8 group-hover:bg-[#c5a059] transition-colors duration-500">
                                    <FaRegStar className="text-white text-xl md:text-2xl" />
                                </div>

                                <h3 className="font-serif font-black text-white text-xl md:text-2xl mb-2 md:mb-4">
                                    {item.title}
                                </h3>

                                <p className="text-[11px] md:text-sm font-medium text-white/60 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* HOW TO USE */}
            <section className="px-4 md:px-6 mt-16 md:mt-24">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl lg:text-6xl font-black text-[#064e3b] mb-12 md:mb-20"
                    >
                        Master the <span className="italic font-serif text-[#c5a059]">Ritual</span>
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 relative">

                        {steps.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                className="relative bg-white rounded-2xl md:rounded-[40px] p-6 md:p-12 shadow-sm md:shadow-xl flex flex-col items-start translate-z-0 group"
                            >
                                <p className="absolute top-4 md:top-8 right-6 md:right-8 text-3xl md:text-7xl font-serif font-black text-[#f3efe7] group-hover:text-[#c5a059]/5 transition-colors">
                                    {step.num}
                                </p>

                                <div className="z-10">
                                    <h3 className="font-black text-[#064e3b] text-base md:text-2xl uppercase tracking-tighter mb-1 md:mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-[10px] md:text-base font-medium text-gray-400 leading-relaxed max-w-[85%]">
                                        {step.desc}
                                    </p>
                                </div>
                                {i !== steps.length - 1 && (
                                    <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-20">
                                        <FiArrowRight className="text-[#c5a059]/20 text-4xl" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center mt-20 md:mt-32"
                    >
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#064e3b] text-white text-lg font-black px-12 py-6 rounded-full shadow-[0_20px_50px_rgba(6,78,59,0.3)] hover:bg-[#065f46] flex items-center gap-4 transition-all uppercase tracking-widest"
                        >
                            Start Your Ritual
                            <FiArrowRight className="text-2xl" />
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            <div className="h-40"></div>
        </div>
    );
}