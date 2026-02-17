import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Poll question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Option cannot exceed 200 characters']
    },
    votes: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  shareLink: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Anti-abuse tracking
  votedIPs: [{
    ip: String,
    votedAt: Date,
    optionIndex: Number
  }],
  votedFingerprints: [{
    fingerprint: String,
    votedAt: Date,
    optionIndex: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Auto-delete after 30 days (in seconds)
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient lookups
pollSchema.index({ shareLink: 1 });
pollSchema.index({ createdAt: -1 });

// Method to check if user has already voted
pollSchema.methods.hasVoted = function(identifier, type = 'ip') {
  const votes = type === 'ip' ? this.votedIPs : this.votedFingerprints;
  return votes.some(v => v[type === 'ip' ? 'ip' : 'fingerprint'] === identifier);
};

// Method to record a vote with anti-abuse tracking
pollSchema.methods.recordVote = function(optionIndex, identifier, type = 'ip') {
  // Check if already voted
  if (this.hasVoted(identifier, type)) {
    throw new Error('You have already voted on this poll');
  }

  // Validate option index
  if (optionIndex < 0 || optionIndex >= this.options.length) {
    throw new Error('Invalid option index');
  }

  // Increment vote count
  this.options[optionIndex].votes += 1;

  // Track the vote
  const voteRecord = {
    [type === 'ip' ? 'ip' : 'fingerprint']: identifier,
    votedAt: new Date(),
    optionIndex
  };

  if (type === 'ip') {
    this.votedIPs.push(voteRecord);
  } else {
    this.votedFingerprints.push(voteRecord);
  }

  return this.save();
};

// Virtual for total votes
pollSchema.virtual('totalVotes').get(function() {
  return this.options.reduce((sum, option) => sum + option.votes, 0);
});

// Ensure virtuals are included in JSON
pollSchema.set('toJSON', { virtuals: true });
pollSchema.set('toObject', { virtuals: true });

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
