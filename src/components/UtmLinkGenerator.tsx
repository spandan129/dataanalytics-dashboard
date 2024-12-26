import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';

const UTMLinkGenerator = () => {
  // State for input fields
  const [referrer, setReferrer] = useState('');
  const [campaign, setCampaign] = useState('');
  const [medium, setMedium] = useState('');
  const [pageLink, setPageLink] = useState("");

  const [generatedLink, setGeneratedLink] = useState('');

  const [error, setError] = useState('');

  const generateUTMLink = () => {
    setError('');

    if (!referrer || !campaign || !medium) {
      setError('Please fill in all fields');
      return;
    }

    const utmParams = new URLSearchParams({
      utm_source: referrer,
      utm_medium: medium,
      utm_campaign: campaign
    });

    const link = `${pageLink}?${utmParams.toString()}`;
    setGeneratedLink(link);
  };

  const copyLink = () => {
    if (!generatedLink) {
      setError('Generate a link first');
      return;
    }

    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        alert('Link copied to clipboard');
      })
      .catch((err) => {
        setError('Failed to copy link');
      });
  };

  return (
    <div className="p-6 max-w-xl mx-auto border border-gray-300 rounded-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Generate a UTM Link</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="referrer" className="block mb-2 text-sm font-medium text-gray-700">
            Referrer (UTM Source)
          </label>
          <input 
            id="referrer"
            type="text"
            placeholder="Enter referrer (e.g., google, newsletter)"
            value={referrer}
            onChange={(e) => setReferrer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        <div>
          <label htmlFor="campaign" className="block mb-2 text-sm font-medium text-gray-700">
            Campaign (UTM Campaign)
          </label>
          <input 
            id="campaign"
            type="text"
            placeholder="Enter campaign name"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        <div>
          <label htmlFor="medium" className="block mb-2 text-sm font-medium text-gray-700">
            Medium (UTM Medium)
          </label>
          <input 
            id="medium"
            type="text"
            placeholder="Enter medium (e.g., cpc, email, social)"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        <div>
          <label htmlFor="pageLink" className="block mb-2 text-sm font-medium text-gray-700">
            Page LinK
          </label>
          <input 
            id="pageLink"
            type="text"
            placeholder="Enter the page Link (e.g. www.example.com/home)"
            value={pageLink}
            onChange={(e) => setPageLink(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={generateUTMLink}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Generate UTM Link
          </button>
          
          {generatedLink && (
            <button 
              onClick={copyLink}
              className="w-16 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Copy className="h-5 w-5" />
            </button>
          )}
        </div>

        {generatedLink && (
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Generated UTM Link:
            </label>
            <div className="bg-gray-100 p-3 rounded-md break-all text-sm text-gray-800 border border-gray-200">
              {generatedLink}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UTMLinkGenerator;