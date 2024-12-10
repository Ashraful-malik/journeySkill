import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <nav className="bg-dark-800 p-2 ">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">JourneySkill</div>

        <div className="social-links flex space-x-4">
          <Link
            aria-label="Twitter"
            href="https://twitter.com/Ashraful__malik"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-950 dark:text-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-twitter-x"
              viewBox="0 0 16 16"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
            </svg>
          </Link>
          <Link
            aria-label="Instagram"
            href="https://www.instagram.com/uiwebbyte/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-950 dark:text-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
