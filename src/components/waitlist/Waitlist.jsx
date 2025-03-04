"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import axios from "axios";

function WaitList() {
  const [signupCount, setSignupCount] = useState();

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const response = await axios.get(
          `https://api.getwaitlist.com/api/v1/waitlist/${process.env.NEXT_PUBLIC_WAITLIST_ID}`
        );
        setSignupCount(response.data.statistics.total_signups);
      } catch (error) {
        console.error("Error fetching signups:", error.message);
      }
    };
    fetchSignups();
  }, []);

  return (
    <>
      <Script
        src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"
        strategy="lazyOnload"
      />
      <div className="flex w-full items-center justify-center flex-col space-y-4 ">
        <div
          id="getWaitlistContainer"
          data-waitlist_id="22971"
          data-widget_type="WIDGET_3"
        ></div>
        <div className="mt-8 dark:text-gray-300 flex items-center justify-start max-w-screen-lg  ">
          {/* Show avatars up to the first 10 users */}
          {Array.from({ length: Math.min(signupCount, 5) }).map((_, i) => (
            <img
              key={i}
              src={`https://xsgames.co/randomusers/avatar.php?g=pixel&i=${i}`}
              alt="signup users"
              className="w-10 h-10 rounded-full bg-red-green-200 -ml-3"
            />
          ))}

          {/* Display "More" indicator if there are more than 10 users */}
          {signupCount > 10 && (
            <div className="w-10 h-10 flex justify-center items-center bg-gray-300 dark:bg-green-700 rounded-full -ml-3 ">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                +{signupCount - 5}
              </p>
            </div>
          )}
        </div>

        <p className="text-gray-900 dark:text-gray-300 text-sm items-center ">
          Join the early access list and shape the future with us.
        </p>
      </div>
    </>
  );
}

export default WaitList;
