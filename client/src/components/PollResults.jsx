import { BarChart3, Users, TrendingUp } from 'lucide-react';

const PollResults = ({ poll }) => {
  const totalVotes = poll.totalVotes || 0;

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  const getBarColor = (index) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-pink-500 to-pink-600',
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'bg-gradient-to-r from-red-500 to-red-600',
      'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'bg-gradient-to-r from-teal-500 to-teal-600',
      'bg-gradient-to-r from-orange-500 to-orange-600',
      'bg-gradient-to-r from-cyan-500 to-cyan-600',
    ];
    return colors[index % colors.length];
  };

  // Find the winning option(s)
  const maxVotes = Math.max(...poll.options.map(opt => opt.votes));
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
          <BarChart3 className="w-5 h-5" />
          <span className="font-semibold">Live Results</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {poll.question}
        </h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Users className="w-5 h-5" />
          <span className="text-lg font-medium">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </span>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {poll.options.map((option, index) => {
          const percentage = getPercentage(option.votes);
          const isWinning = option.votes === maxVotes && maxVotes > 0;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isWinning
                  ? 'border-green-400 bg-green-50 shadow-lg'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  {isWinning && (
                    <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                  <span className={`font-semibold text-lg ${
                    isWinning ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {option.text}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    isWinning ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${getBarColor(index)} transition-all duration-500 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-4 border-t">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Results update in real-time</span>
      </div>
    </div>
  );
};

export default PollResults;
