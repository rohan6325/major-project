import React, { useState, useEffect } from 'react';

const LandingPage = () => {
  const carouselItems = [
    {
      title: "TruVote",
      buttonText: "Create a poll today",
      bgImage: "/api/placeholder/1200/700"
    },
    {
      title: "Easy Polling",
      buttonText: "Get started",
      bgImage: "/api/placeholder/1200/700"
    },
    {
      title: "Secure Voting",
      buttonText: "Learn more",
      bgImage: "https://placehold.co/600x400/orange/green"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance carousel
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

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
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

  return (
    <div className="min-h-screen bg-indigo-50 p-8">
      {/* Hero Section Carousel */}
      <div className="mb-16">
        <div className="relative h-[700px] rounded-xl overflow-hidden">
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
            </div>
          ))}
          
          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          {/* Carousel Content */}
          <div className="absolute inset-0 flex flex-col justify-center z-10 p-8">
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="mb-6 ml-8">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {item.title}
                  </h1>
                  <button className="bg-indigo-700 text-white rounded-lg px-8 py-3 hover:bg-indigo-800 transition-colors">
                    {item.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`w-2 h-2 rounded-full border-2 border-white transition-colors ${
                  currentSlide === index ? 'bg-white' : 'bg-transparent'
                } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Feature #1</h2>
          <div className="border-2 border-indigo-200 rounded-lg p-6 bg-white">
            <p className="font-medium text-gray-900 mb-2">Time based encryption</p>
            <p className="text-gray-900">
            Time-based encryption is a type of cryptographic technique that uses time as a key component of the encryption process. It differs from traditional encryption methods in that the encryption key changes over time, typically based on a predetermined schedule. This makes it more difficult for attackers to decrypt data, as they would need to obtain the encryption key for the specific time period during which the data was encrypted. Time-based encryption is often used in conjunction with other security measures, such as public key cryptography, to provide additional layers of protection. It is particularly well-suited for applications where data needs to be protected for a limited period of time, such as temporary credentials or sensitive information that is no longer needed after a certain date. 
            </p>
          </div>
          
          <div className="mt-8">
            <div className="border-2 border-indigo-200 rounded-lg aspect-video flex items-center justify-center bg-indigo-50">
              <p className="text-gray-900">Admin interface img box</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-indigo-200 rounded-lg aspect-video mb-8 flex items-center justify-center bg-indigo-50">
            <p className="text-gray-900">Voter interface img box</p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900">Feature #2</h2>
          <div className="border-2 border-indigo-200 rounded-lg p-6 bg-white">
            <p className="font-medium text-gray-900 mb-2">Homomorphic cipher</p>
            <p className="text-gray-900">
            Homomorphic encryption (HE) is a revolutionary cryptographic technique that allows computations to be performed directly on encrypted data without the need for decryption. This enables secure data processing and analysis in various applications, including cloud computing, machine learning, and electronic voting. HE comes in three main types: partially homomorphic encryption (PHE), somewhat homomorphic encryption (SHE), and fully homomorphic encryption (FHE), each with increasing computational capabilities. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;