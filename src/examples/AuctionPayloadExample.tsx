import React, { useState } from 'react';
import { CreateAuctionData } from '@/lib/api';
import { createAuctionPayloadWithSingleImage } from '@/lib/auctionUtils';

/**
 * Example component demonstrating how to create an auction payload with only the first image
 */
const AuctionPayloadExample: React.FC = () => {
  const [auctionFormData, setAuctionFormData] = useState<CreateAuctionData>({
    title: "",
    description: "",
    auction_start_time: "",
    auction_end_time: "",
    starting_bid: 0,
    reserve_price: 0,
    bid_increment: 1,
    auto_extend: false,
    featured: false,
    promotional_tags: ["", "", ""],
    media: [],
  });
  const [payload, setPayload] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Store all selected files in the form data
      const filesArray = Array.from(e.target.files).filter(f => f instanceof File);
      setAuctionFormData(prev => ({ ...prev, media: filesArray }));
    }
  };

  // Create payload with only the first image
  const handleCreatePayload = async () => {
    setIsProcessing(true);
    try {
      // Use our utility function to create a payload with only the first image
      const auctionPayload = await createAuctionPayloadWithSingleImage(auctionFormData);
      
      // Display the payload as a formatted JSON string
      setPayload(JSON.stringify(auctionPayload, null, 2));
    } catch (error) {
      console.error("Error creating payload:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auction Payload Example</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Images</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select multiple images, but only the first one will be included in the payload.
        </p>
        
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 w-full rounded"
        />
        
        {auctionFormData.media.length > 0 && (
          <div className="mt-2">
            <p className="text-sm">
              {auctionFormData.media.length} image(s) selected. Only the first one will be used.
            </p>
            <ul className="text-xs text-gray-600 mt-1">
              {Array.from(auctionFormData.media).map((file, index) => (
                <li key={index}>
                  {index === 0 ? <strong>{(file as File).name} (will be used)</strong> : (file as File).name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <button
        onClick={handleCreatePayload}
        disabled={isProcessing || auctionFormData.media.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isProcessing ? "Processing..." : "Create Payload with First Image Only"}
      </button>
      
      {payload && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Payload</h2>
          <p className="text-sm text-gray-600 mb-2">
            Notice that only the first image has been converted to Base64 and included in the payload.
          </p>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {payload}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuctionPayloadExample;