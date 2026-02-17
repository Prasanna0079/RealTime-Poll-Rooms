import { Link } from 'react-router-dom';
import { Zap, Users, Shield, BarChart3 } from 'lucide-react';
import CreatePoll from '../components/CreatePoll';

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-800 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Real-Time Polling</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Poll Rooms
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Create polls, share instantly, and watch results update in real-time.
            Get instant feedback from your audience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Creation</h3>
            <p className="text-gray-600">
              Create a poll in seconds with a simple question and options. No sign-up required.
            </p>
          </div>

          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Results</h3>
            <p className="text-gray-600">
              Watch votes come in live. Results update instantly for everyone viewing the poll.
            </p>
          </div>

          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fair & Secure</h3>
            <p className="text-gray-600">
              Anti-abuse protection ensures one vote per person. Anonymous and secure voting.
            </p>
          </div>
        </div>

        {/* Create Poll Section */}
        <CreatePoll />

        {/* How It Works */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h4 className="font-semibold text-gray-900">Create Your Poll</h4>
              <p className="text-gray-600 text-sm">
                Enter your question and add at least 2 options
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h4 className="font-semibold text-gray-900">Share the Link</h4>
              <p className="text-gray-600 text-sm">
                Copy and share the unique poll link with your audience
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h4 className="font-semibold text-gray-900">Watch Results Live</h4>
              <p className="text-gray-600 text-sm">
                See votes update in real-time as people participate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
