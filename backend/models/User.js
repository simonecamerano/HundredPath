/**
 * User Model
 * 
 * Defines the schema for users in the database 
 */
const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcryptjs' );

// User Schema  
const userSchema = new mongoose.Schema( {

  avatar: {
    type: String,
    default: 'shape_default' // Prefisso 'shape_' attiva lo stile astratto
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email is invalid']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Not return password in default queries 
  },
  stats: {
    gamesPlayed: {
      type: Number,
      default: 0
    },
    gamesCompleted: {
      type: Number,
      default: 0
    },
    bestMoves: {
      type: Number,
      default: null // null = no games completed yet
    },
    totalTime: {
      type: Number,
      default: 0 // in seconds
    }
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt
} );
// ===== MIDDLEWARE PRE-SAVE =====
// Hash password before saving
userSchema.pre( 'save', async function () {
  // Skip if password is not modified
  if ( !this.isModified( 'password' ) ) {
    return;
  }

  // Generate salt and hash password  
  const salt = await bcrypt.genSalt( 10 );
  this.password = await bcrypt.hash( this.password, salt );
} );
// ===== METODI CUSTOM =====
// Method to compare password (used at login)
userSchema.methods.comparePassword = async function ( candidatePassword ) {
  return await bcrypt.compare( candidatePassword, this.password );
};
// Method to return user data without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};
// Create and export the Model
const User = mongoose.model( 'User', userSchema );
module.exports = User;