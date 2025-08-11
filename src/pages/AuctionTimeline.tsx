import { useState, useEffect } from "react";

export default function AuctionTimeline({ auctionStart, auctionEnd }) {
  const [currentStatus, setCurrentStatus] = useState("");
  const [timeNow, setTimeNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTimeNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = new Date(auctionStart);
    const end = new Date(auctionEnd);

    if (timeNow < start) {
      setCurrentStatus("upcoming");
    } else if (timeNow >= start && timeNow <= end) {
      setCurrentStatus("active");
    } else {
      setCurrentStatus("ended");
    }
  }, [timeNow, auctionStart, auctionEnd]);

  const steps = [
    { label: "Auction Starts", date: auctionStart, status: "upcoming" },
    { label: "Auction Active", date: null, status: "active" },
    { label: "Auction Ends", date: auctionEnd, status: "ended" },
  ];

  return (
    <div className=" p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-6 text-center">Auction Timeline</h2>
      <div className="relative border-l border-gray-300">
        {steps.map((step, index) => (
          <div key={index} className="mb-8 ml-6">
            <span
              className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ${
                currentStatus === step.status
                  ? "bg-purple-600 ring-purple-200"
                  : "bg-gray-400 ring-gray-200"
              }`}
            ></span>
            <h3
              className={`font-semibold ${
                currentStatus === step.status
                  ? "text-purple-600"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </h3>
            {step.date && (
              <p className="text-sm text-gray-400">
                {new Date(step.date).toLocaleString()}
              </p>
            )}
            {currentStatus === step.status && (
              <p className="mt-2 text-sm text-purple-500 font-medium">
                {step.status === "upcoming" && "Auction hasn’t started yet."}
                {step.status === "active" && "Auction is live now!"}
                {step.status === "ended" && "Auction has ended."}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
