import React, { useRef } from 'react';
import { Share, Printer, Check } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const VoteConfirmation = () => {
  const [showCopySuccess, setShowCopySuccess] = React.useState(false);
  const contentRef = useRef(null);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePrint = () => {
    const element = contentRef.current;
    const opt = {
      margin: 1,
      filename: 'vote-receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8" ref={contentRef}>
      <div className="max-w-2xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Your Vote has been cast Successfully!
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Voter Id:</span>
                <span className="text-gray-900 font-semibold">adfadfa</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Vote Cast for:</span>
                <span className="text-gray-900 font-semibold">Etews</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">DateTimeStamp:</span>
                <span className="text-gray-900 font-semibold">28/06/24</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleShare}
                className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {showCopySuccess ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share className="w-5 h-5" />
                    Share Link
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>

        {/* Encryption Notice */}
        <div className="mt-6 text-center text-gray-600">
          <p className="flex items-center justify-center gap-2">
            Vote Encrypted Securely though Shadow Cipher
            <span role="img" aria-label="locked" className="text-xl">🔒</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmation;