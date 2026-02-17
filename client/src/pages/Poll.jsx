import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AlertCircle, Home, Loader } from 'lucide-react';
import { pollAPI } from '../services/api';
import PollView from '../components/PollView';
import PollResults from '../components/PollResults';
import ShareLink from '../components/ShareLink';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const Poll = () => {
  const { shareLink } = useParams();
  const navigate = useNavigate();
  
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('joinPoll', shareLink);
    });

    newSocket.on('voteUpdate', (data) => {
      console.log('Vote update received:', data);
      setPoll(prevPoll => ({
        ...prevPoll,
        options: data.options,
        totalVotes: data.totalVotes,
      }));
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leavePoll', shareLink);
      newSocket.close();
    };
  }, [shareLink]);

  // Fetch poll data
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await pollAPI.getPoll(shareLink);
        setPoll(response.poll);
        setHasVoted(response.poll.hasVoted);
      } catch (err) {
        setError(err.message || 'Failed to load poll');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [shareLink]);

  const handleVote = async (optionIndex) => {
    try {
      const response = await pollAPI.vote(shareLink, optionIndex);
      setPoll(response.poll);
      setHasVoted(true);
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Poll Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              <span className="flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Poll Area */}
          <div className="lg:col-span-2">
            <div className="card">
              {hasVoted ? (
                <PollResults poll={poll} />
              ) : (
                <PollView poll={poll} onVote={handleVote} hasVoted={hasVoted} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ShareLink shareLink={shareLink} />

            {/* Info Card */}
            <div className="card bg-gray-50 border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Poll Info</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Votes:</span>
                  <span className="font-semibold text-gray-900">{poll.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Options:</span>
                  <span className="font-semibold text-gray-900">{poll.options.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-semibold text-green-700">Live</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poll;
