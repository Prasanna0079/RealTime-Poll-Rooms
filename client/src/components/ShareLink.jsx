import { useState } from 'react';
import { Share2, Copy, Check, QrCode } from 'lucide-react';

const ShareLink = ({ shareLink }) => {
  const [copied, setCopied] = useState(false);
  const pollUrl = `${window.location.origin}/poll/${shareLink}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vote on my poll',
          text: 'I created a poll and would love to hear your opinion!',
          url: pollUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="card bg-gradient-to-br from-primary-50 to-purple-50 border-primary-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-600 rounded-lg">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Share Your Poll</h3>
      </div>

      <p className="text-gray-700 mb-4">
        Share this link with others to collect votes
      </p>

      {/* Share Link */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={pollUrl}
          readOnly
          className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-mono text-sm"
          onClick={(e) => e.target.select()}
        />
        <button
          onClick={copyToClipboard}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {copied ? (
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Copied!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Copy
            </span>
          )}
        </button>
      </div>

      {/* Share Button (Mobile) */}
      {navigator.share && (
        <button
          onClick={shareNative}
          className="w-full btn-secondary"
        >
          <span className="flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share
          </span>
        </button>
      )}

      <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> Anyone with this link can vote. The link remains active for 30 days.
        </p>
      </div>
    </div>
  );
};

export default ShareLink;
