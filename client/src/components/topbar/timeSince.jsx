import { useCallback, useEffect, useState } from "react";

const TimeSince = ({ createdAt }) => {
  const calculateTimeSince = useCallback(() => {
    const now = new Date();
    const past = new Date(createdAt);
    const diffInSeconds = (now - past) / 1000; // difference in seconds

    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes > 1 ? "s" : ""} `;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} `;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} `;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks > 1 ? "s" : ""}`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months > 1 ? "s" : ""}`;
    }
  }, [createdAt]);

  const [timeSince, setTimeSince] = useState(calculateTimeSince());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeSince(calculateTimeSince());
    }, 60000); // update every minute

    return () => clearInterval(intervalId);
  }, [createdAt, calculateTimeSince]);

  return timeSince;
};

export default TimeSince;
