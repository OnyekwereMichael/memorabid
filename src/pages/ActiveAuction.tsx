import { useEffect, useState } from "react";

export function useAuctionStatus(startTime: string, endTime: string) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
      setIsActive(now >= start && now <= end);
    };

    checkStatus(); // Check once on mount

    const interval = setInterval(checkStatus, 1000); // Check every second (optional)

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return isActive;
}
