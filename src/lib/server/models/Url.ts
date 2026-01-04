import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },

  shortUrl: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  tags: {
    type: [String],
    default: []
  },

  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Url =
  mongoose.models.Url || mongoose.model('Url', UrlSchema);
