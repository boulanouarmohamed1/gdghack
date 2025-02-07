const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" }, // Store image URL
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requiredSkills: { type: [String], default: [] },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
