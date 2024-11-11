import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const carouselItems = [
    {
      title: "TruVote",
      buttonText: "Create a poll today",
      bgImage: "https://picsum.photos/800"
    },
    {
      title: "Easy Polling",
      buttonText: "Get started",
      bgImage: "https://picsum.photos/800"
    },
    {
      title: "Secure Voting",
      buttonText: "Learn more",
      bgImage: "https://picsum.photos/800"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const goToSlide = (index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      {/* Hero Section Carousel */}
      <div className="mb-16">
        <div className="relative h-[700px] rounded-xl overflow-hidden shadow-lg">
          {/* Background Images */}
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={item.bgImage}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-500 bg-opacity-30"></div>
            </div>
          ))}

          {/* Carousel Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-center px-6">
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col justify-center items-center transition-opacity duration-500 ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <h1 className="text-5xl font-bold text-white mb-6">{item.title}</h1>
                <button
                  onClick={handleSignIn}
                  className="bg-blue-700 text-white rounded-full px-8 py-3 shadow-md hover:bg-blue-800 transition-colors"
                >
                  {item.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-blue-700' : 'bg-blue-200 border-2 border-blue-700'
                } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-blue-900">Time-Based Encryption</h2>
          <div className="border-2 border-blue-100 rounded-lg p-6 bg-white shadow-lg">
            <p className="font-medium text-gray-800 mb-4">
              Time-based encryption is a cryptographic technique that uses time as a key element. The encryption key changes over time, making it harder for attackers to decrypt data without access to the correct key for a specific time period.
            </p>
          </div>
          
          <div className="mt-8 border-2 border-blue-100 rounded-lg aspect-video flex items-center justify-center bg-blue-50 shadow-lg">
            <p className="text-gray-700">Admin Interface Image</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-blue-100 rounded-lg aspect-video mb-8 flex items-center justify-center bg-blue-50 shadow-lg">
            <p className="text-gray-700">Voter Interface Image</p>
          </div>

          <h2 className="text-2xl font-semibold text-blue-900">Homomorphic Encryption</h2>
          <div className="border-2 border-blue-100 rounded-lg p-6 bg-white shadow-lg">
            <p className="font-medium text-gray-800 mb-4">
              Homomorphic encryption allows computations to be performed directly on encrypted data without decryption. This technique is beneficial for secure cloud computing, machine learning, and voting applications.
            </p>
          </div>
        </div>
      </div>

      {/* Sign In Button */}
      <div className="mt-16 text-center">
        <button
          onClick={handleSignIn}
          className="bg-blue-700 text-white rounded-full px-8 py-3 shadow-md hover:bg-blue-800 transition-colors"
        >
          Sign In to Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
