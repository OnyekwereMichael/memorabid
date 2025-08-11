import { useEffect, useState } from "react";

const AuctionTimer = ({ auction }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!auction?.auction_start_time || !auction?.auction_end_time) return;

    const updateTimer = () => {
      const now = new Date();
      const startTime = new Date(auction.auction_start_time);
      const endTime = new Date(auction.auction_end_time);

      // If auction hasn't started yet, show countdown to start
      // If auction is ongoing, show countdown to end
      // If auction has ended or invalid, show "Auction has ended"

      // CASE 1: Invalid timing or auction already ended
      if (
        startTime.getTime() === endTime.getTime() ||
        now.getTime() > endTime.getTime()
      ) {
        setTimeLeft("Auction has ended");
        return;
      }

      // CASE 2: Auction not started yet - count down to start time
      if (now.getTime() < startTime.getTime()) {
        const diff = startTime.getTime() - now.getTime();
        setTimeLeft(`Starts in: ${formatTimeDiff(diff)}`);
        return;
      }

      // CASE 3: Auction ongoing - count down to end time
      const diff = endTime.getTime() - now.getTime();
      setTimeLeft(`Ends in: ${formatTimeDiff(diff)}`);
    };

    const formatTimeDiff = (diff) => {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const padded = (n) => n.toString().padStart(2, "0");

      if (days > 0) {
        return `${days}d ${padded(hours)}h ${padded(minutes)}m ${padded(seconds)}s`;
      }

      return `${padded(hours)}h ${padded(minutes)}m ${padded(seconds)}s`;
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction?.auction_start_time, auction?.auction_end_time]);

  return (
    <div className="text-sm font-medium">
      {timeLeft}
    </div>
  );
};

export default AuctionTimer;
