import express from 'express';
import Poll from '../models/Poll.js';
import crypto from 'crypto';

const router = express.Router();

// Utility function to generate unique share link
const generateShareLink = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Utility function to get client IP
const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress;
};

/**
 * @route   POST /api/polls
 * @desc    Create a new poll
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { question, options } = req.body;

    // Validation
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'At least 2 options are required' });
    }

    if (options.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 options allowed' });
    }

    // Validate each option
    const validOptions = options
      .filter(opt => opt && opt.trim())
      .map(opt => ({ text: opt.trim(), votes: 0 }));

    if (validOptions.length < 2) {
      return res.status(400).json({ error: 'At least 2 valid options are required' });
    }

    // Generate unique share link
    let shareLink;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      shareLink = generateShareLink();
      const existing = await Poll.findOne({ shareLink });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Failed to generate unique link. Please try again.' });
    }

    // Create poll
    const poll = new Poll({
      question: question.trim(),
      options: validOptions,
      shareLink,
      votedIPs: [],
      votedFingerprints: []
    });

    await poll.save();

    res.status(201).json({
      success: true,
      poll: {
        _id: poll._id,
        question: poll.question,
        options: poll.options,
        shareLink: poll.shareLink,
        totalVotes: poll.totalVotes,
        createdAt: poll.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

/**
 * @route   GET /api/polls/:shareLink
 * @desc    Get a poll by share link
 * @access  Public
 */
router.get('/:shareLink', async (req, res) => {
  try {
    const { shareLink } = req.params;
    
    const poll = await Poll.findOne({ shareLink, isActive: true });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const clientIP = getClientIP(req);
    const hasVotedByIP = poll.hasVoted(clientIP, 'ip');

    res.json({
      success: true,
      poll: {
        _id: poll._id,
        question: poll.question,
        options: poll.options,
        shareLink: poll.shareLink,
        totalVotes: poll.totalVotes,
        createdAt: poll.createdAt,
        hasVoted: hasVotedByIP
      }
    });

  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

/**
 * @route   POST /api/polls/:shareLink/vote
 * @desc    Vote on a poll
 * @access  Public
 */
router.post('/:shareLink/vote', async (req, res) => {
  try {
    const { shareLink } = req.params;
    const { optionIndex, fingerprint } = req.body;

    // Validation
    if (typeof optionIndex !== 'number') {
      return res.status(400).json({ error: 'Valid option index is required' });
    }

    const poll = await Poll.findOne({ shareLink, isActive: true });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Get client identifiers for anti-abuse
    const clientIP = getClientIP(req);
    
    // Check both IP and fingerprint (dual-layer protection)
    const hasVotedByIP = poll.hasVoted(clientIP, 'ip');
    const hasVotedByFingerprint = fingerprint && poll.hasVoted(fingerprint, 'fingerprint');

    if (hasVotedByIP || hasVotedByFingerprint) {
      return res.status(403).json({ 
        error: 'You have already voted on this poll',
        hasVoted: true
      });
    }

    // Record vote with IP tracking
    try {
      await poll.recordVote(optionIndex, clientIP, 'ip');
      
      // Also record fingerprint if provided
      if (fingerprint) {
        // Manually add fingerprint (since we already saved with IP)
        poll.votedFingerprints.push({
          fingerprint,
          votedAt: new Date(),
          optionIndex
        });
        await poll.save();
      }

    } catch (voteError) {
      return res.status(400).json({ error: voteError.message });
    }

    // Emit socket event for real-time update (handled by socket.io in server.js)
    req.app.get('io').to(shareLink).emit('voteUpdate', {
      pollId: poll._id,
      options: poll.options,
      totalVotes: poll.totalVotes
    });

    res.json({
      success: true,
      poll: {
        _id: poll._id,
        question: poll.question,
        options: poll.options,
        totalVotes: poll.totalVotes,
        hasVoted: true
      }
    });

  } catch (error) {
    console.error('Error voting on poll:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

/**
 * @route   GET /api/polls/:shareLink/results
 * @desc    Get poll results
 * @access  Public
 */
router.get('/:shareLink/results', async (req, res) => {
  try {
    const { shareLink } = req.params;
    
    const poll = await Poll.findOne({ shareLink });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json({
      success: true,
      results: {
        question: poll.question,
        options: poll.options,
        totalVotes: poll.totalVotes,
        createdAt: poll.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;
