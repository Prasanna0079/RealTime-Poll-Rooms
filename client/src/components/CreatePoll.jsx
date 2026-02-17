import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Sparkles } from 'lucide-react';
import { pollAPI } from '../services/api';

const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    setLoading(true);

    try {
      const response = await pollAPI.createPoll({
        question: question.trim(),
        options: validOptions,
      });

      // Navigate to the poll page
      navigate(`/poll/${response.poll.shareLink}`);
    } catch (err) {
      setError(err.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create a Poll</h2>
            <p className="text-gray-600">Ask a question and get instant feedback</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Input */}
          <div>
            <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-2">
              Your Question
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="input-field"
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {question.length}/500 characters
            </p>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="input-field"
                      maxLength={200}
                      required
                    />
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-3 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Add Option
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Poll...
              </span>
            ) : (
              'Create Poll'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
