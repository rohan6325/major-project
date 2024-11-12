import { useState, useEffect } from "react";
import { ChevronRight, Menu, Shield, Clock, Lock, Vote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const carouselItems = [
    {
      title: "Secure Digital Voting",
      subtitle: "Built with advanced encryption",
      buttonText: "Create a poll today",
      bgColor: "bg-gradient-to-r from-blue-600 to-indigo-700",
    },
    {
      title: "Time-Based Security",
      subtitle: "Protection that evolves with time",
      buttonText: "Learn more",
      bgColor: "bg-gradient-to-r from-indigo-600 to-purple-700",
    },
    {
      title: "Homomorphic Encryption",
      subtitle: "Next-gen vote protection",
      buttonText: "Get started",
      bgColor: "bg-gradient-to-r from-purple-600 to-blue-700",
    },
  ];

  const features = [
    {
      title: "Homomorphic Cipher",
      description:
        "Perform computations directly on encrypted votes without decryption, ensuring complete privacy and security throughout the entire voting process. Perfect for maintaining vote secrecy while allowing transparent tallying.",
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      details: [
        "Secure vote tallying without decryption",
        "End-to-end verification",
        "Mathematical proof of accuracy",
      ],
    },
    {
      title: "Time-Based Encryption",
      description:
        "Dynamic encryption keys that change over time, making it virtually impossible for attackers to compromise votes. Perfect for ensuring that votes remain sealed until the designated counting time.",
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
      details: [
        "Temporal security barriers",
        "Scheduled key rotation",
        "Time-locked vote protection",
      ],
    },
  ];

  const benefits = [
    {
      title: "Enhanced Security",
      description: "Military-grade encryption protecting every vote",
      icon: "🔒",
    },
    {
      title: "Complete Privacy",
      description: "Your vote remains anonymous and secure",
      icon: "🛡️",
    },
    {
      title: "Transparent Process",
      description: "Verify without compromising security",
      icon: "✅",
    },
  ];

  const handleSignIn = () => {
    navigate("/signin");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 px-8 py-4 flex justify-between items-center border-b">
        <div className="text-2xl font-bold text-indigo-600">TruVote</div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-indigo-600">
            Features
          </a>
          <a href="#" className="text-gray-700 hover:text-indigo-600">
            Security
          </a>
          <button
            onClick={handleSignIn}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-indigo-700"
          >
            Start Voting <ChevronRight size={16} />
          </button>
        </nav>
        <button className="md:hidden text-gray-700">
          <Menu size={24} />
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              item.bgColor
            } ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full flex items-center px-8 md:px-16 lg:px-24">
              <div className="max-w-4xl text-white">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                  {item.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white/90">
                  {item.subtitle}
                </p>
                <button
                  onClick={handleSignIn}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-full flex items-center gap-2 hover:bg-gray-100 w-fit"
                >
                  {item.buttonText} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            Advanced Security Features
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Why Choose TruVote?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-gray-50"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
