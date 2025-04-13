"use client";
import {
  Copy,
  Facebook,
  Linkedin,
  Mail,
  Share,
  Share2,
  Twitter,
  TwitterIcon,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function ShareButtons({ url, title, description }) {
  const [copied, setCopied] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const [isNativeSharingSupported, setIsNativeSharingSupported] =
    useState(false);

  useEffect(() => {
    setIsNativeSharingSupported(!!navigator.share);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareDate = {
    title: title,
    text: description,
    url: url,
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share(shareDate);
    } catch (error) {
      setIsNativeSharingSupported(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Only show native share button if supported */}

      {isNativeSharingSupported ? (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-full hover:bg-accent"
          aria-label="Share"
        >
          <Share size={20} />
        </button>
      ) : (
        <button
          onClick={() => setShowShareDialog(true)}
          className="p-2 rounded-full hover:bg-accent"
          aria-label="Share"
        >
          <Share size={20} />
        </button>
      )}
      {showShareDialog && (
        // sharing dialog
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  "
          onClick={() => setShowShareDialog(false)}
        >
          <div
            className="bg-background px-8 py-10 rounded-lg border border-border relative w-full max-w-md m-2 md:m-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close icon */}
            <div
              className="absolute top-4 right-4 cursor-pointer dark:bg-neutral-900 bg-neutral-200 p-2 rounded-full"
              onClick={() => setShowShareDialog(false)}
            >
              <X size={24} className="" />
            </div>
            <h3 className="text-xl font-bold mt-4 text-accent-foreground">
              Share this content
            </h3>
            <div className="mt-4 h-0.5 bg-secondary"></div>
            <div className="flex item-center justify-between mt-4">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  url
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full dark:bg-neutral-900 bg-neutral-100 dark:hover:bg-accent hover:bg-neutral-200"
                aria-label="Share on Facebook"
              >
                <Facebook size={30} color="#1877F2" />
              </a>

              {/* Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  title
                )}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full dark:bg-neutral-900 bg-neutral-100 dark:hover:bg-accent hover:bg-neutral-200"
                aria-label="Share on Twitter"
              >
                <TwitterIcon size={30} color="#1DA1F2" />
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  url
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full dark:bg-neutral-900 bg-neutral-100 dark:hover:bg-accent hover:bg-neutral-200"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={30} color="#0A66C2" />
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  title
                )}&body=${encodeURIComponent(
                  `${description}\n\nRead more: ${url}`
                )}`}
                className="p-2 rounded-full dark:bg-neutral-900 bg-neutral-100 dark:hover:bg-accent hover:bg-neutral-200"
                aria-label="Share via Email"
              >
                <Mail size={30} />
              </a>

              {/* Copy link */}
              <button
                onClick={handleCopy}
                className="p-2 rounded-full dark:bg-neutral-900 bg-neutral-100 dark:hover:bg-accent hover:bg-neutral-200"
                aria-label="Copy link"
              >
                <Copy size={30} />
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
              {/* copy link */}
            </div>
            <div className="flex mt-8 ">
              <input
                type="text"
                value={url}
                readOnly
                className="px-4 py-2 w-full border rounded-l-md focus:outline-none bg-secondary 
                dark:border-neutral-700
                text-accent-foreground "
                aria-label="Share link"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-secondary font-bold rounded-r-md border  text-accent-foreground
                dark:border-neutral-700
                 border-l-0"
                aria-label="Copy link"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareButtons;
