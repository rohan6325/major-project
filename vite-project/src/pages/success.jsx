import React, { useRef } from 'react';
import { Share, Printer, Check } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const VoteConfirmation = () => {
  const [showCopySuccess, setShowCopySuccess] = React.useState(false);
  const contentRef = useRef(null);
  const timestampRef = useRef(null);

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
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    
    if (timestampRef.current) {
      timestampRef.current.textContent = `PDF Generated on: ${formattedTimestamp}`;
      timestampRef.current.style.display = 'block';
    }

    const voterId = 'adfadfa'; // Replace with actual voter ID
    const timestamp = '28-06-24'.replace(/\//g, '-'); // Replace with actual timestamp
    const filename = `${voterId}_votereceipt_${timestamp}.pdf`;

    const element = contentRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5], // Reduced margins [top, left, bottom, right] in inches
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      if (timestampRef.current) {
        timestampRef.current.style.display = 'none';
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* PDF Content Container */}
        <div ref={contentRef} className="bg-white rounded-xl shadow-lg overflow-hidden p-8" style={{ minHeight: '842px' }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800">
              Your Vote has been cast Successfully!
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
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

            {/* Buttons - Only visible in web view */}
            <div className="flex gap-4 pt-4 print:hidden">
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

            {/* Encryption Notice */}
            <div className="mt-12 text-center text-gray-600">
              <p className="flex items-center justify-center gap-2">
                Vote Encrypted Securely though Shadow Cipher
                <span role="img" aria-label="locked" className="text-xl">🔒</span>
              </p>
            </div>

            {/* PDF Generation Timestamp - Hidden by default */}
            <div 
              ref={timestampRef} 
              className="mt-8 text-center text-sm text-gray-500 pt-4"
              style={{ display: 'none' }}
            >
              PDF Generated on: {/* This will be filled dynamically */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmation;


