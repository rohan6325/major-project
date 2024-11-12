import React, { useEffect, useState, useRef } from 'react';
import { Share, Printer, Check } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const VoteConfirmation = () => {
  const [showCopySuccess, setShowCopySuccess] = React.useState(false);
  const [voteData, setVoteData] = useState(null);  // State to store API response
  const contentRef = useRef(null);
  const timestampRef = useRef(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const voterId = localStorage.getItem('voter_id');
  // Fetch vote data from API
  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`${serverUrl}/api/vote/receipt/${voterId}`);
        const data = await response.json();
        setVoteData(data); // Store response data
      } catch (err) {
        console.error('Failed to fetch vote data:', err);
      }
    };

    fetchVoteData();
  }, []);

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

    if (voteData) {
      const { voter_id, created_at } = voteData;
      const filename = `${voter_id}_votereceipt_${created_at}.pdf`;

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
    }
  };

  if (!voteData) {
    return <div>Loading...</div>; // Show a loading state until data is available
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* PDF Content Container */}
        <div 
          ref={contentRef} 
          className="bg-white rounded-xl shadow-lg overflow-hidden p-8"
          style={{ minHeight: 'auto' }} // Changed from fixed height to auto
        >
          {/* Header */}
          <div className="text-center mb-8"> {/* Reduced margin bottom */}
            <h1 className="text-3xl font-bold text-gray-800">
              Your Vote has been cast Successfully!
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6"> {/* Reduced spacing */}
            <div className="space-y-4"> {/* Reduced spacing */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Voter Id:</span>
                <span className="text-gray-900 font-semibold">{voteData.voter_id}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Vote Cast for:</span>
                <span className="text-gray-900 font-semibold">{voteData.voted_for}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">DateTimeStamp:</span>
                <span className="text-gray-900 font-semibold">{voteData.created_at}</span>
              </div>
            </div>

            {/* Buttons */}
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
            <div className="mt-6 text-center text-gray-600"> {/* Reduced margin top */}
              <p className="flex items-center justify-center gap-2">
                Vote Encrypted Securely through Shadow Cipher
                <span role="img" aria-label="locked" className="text-xl">🔒</span>
              </p>
            </div>

            {/* PDF Generation Timestamp */}
            <div 
              ref={timestampRef} 
              className="mt-4 text-center text-sm text-gray-500"
              style={{ display: 'none' }}
            >
              PDF Generated on: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmation;
