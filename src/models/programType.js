import mongoose from 'mongoose';

const programTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.ProgramType || mongoose.model('ProgramType', programTypeSchema);
