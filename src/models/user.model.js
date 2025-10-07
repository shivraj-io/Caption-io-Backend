// OLD CODE (commented out for reference):
// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema(
//     {
//         username: {
//             type: String,
//             required: true,
//             unique: true,
//             trim: true,
//         },
//         password: {
//             type: String,
//             required: true,
//         },
//     },
//     { timestamps: true }
// );
// const userModel = mongoose.model('users', userSchema);
// module.exports = userModel;

// NEW CODE (production-level with email field):
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
    },
    { 
        timestamps: true 
    }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// ✅ Only create model if it doesn't exist
const userModel = mongoose.models.users || mongoose.model('users', userSchema);

module.exports = userModel;