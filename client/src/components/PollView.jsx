import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const PollView = ({ poll, onVote, hasVoted }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  const handleVote = async () => {
    if (selectedOption === null) {
      setError('Please select an option');
      return;
    }

    setVoting(true);
    setError('');

    try {
      await onVote(selectedOption);
    } catch (err) {
      setError(err.message || 'Failed to submit vote');
    } finally {
      setVoting(false);
    }
  };

  if (hasVoted) {
    return null; // Results will be shown by parent
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Question */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {poll.question}
        </h2>
        <p className="text-gray-600">Select one option</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {poll.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(index)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3 group ${
              selectedOption === index
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0">
              {selectedOption === index ? (
                <CheckCircle className="w-6 h-6 text-primary-600" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400 group-hover:text-primary-400" />
              )}
            </div>
            <span className={`text-lg font-medium ${
              selectedOption === index ? 'text-primary-900' : 'text-gray-700'
            }`}>
              {option.text}
            </span>
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Vote Button */}
      <button
        onClick={handleVote}
        disabled={voting || selectedOption === null}
        className="btn-primary w-full text-lg"
      >
        {voting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          'Submit Vote'
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Your vote is anonymous and cannot be changed
      </p>
    </div>
  );
};

export default PollView;
