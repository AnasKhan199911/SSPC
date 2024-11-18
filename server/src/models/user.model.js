const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['student', 'alumni', 'admin'],
    default: 'student',
  },
  profile: {
    type: String,
    default: '',
  },
  picturePath: {
    type: String,
    default: '',
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assuming friends are other users in the same collection
    }
  ],
  aboutme: {
    type: String,
    default: '',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  githubLink: {  // New field for GitHub link
    type: String,
    default: '',
  }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
