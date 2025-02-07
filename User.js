const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 100, default: 0 },
  bio: { type: String, default: "" },
  image: { type: String, default: "" }, // Store image URL
  schoolYear: { type: String, default: "" },
  phone: { type: String, default: "" },
  insta: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedIn: { type: String, default: "" },
  previousProjects: [{
    description: { type: String, default: "" },
    title: { type: String, required: true },
    sourceCode: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;


//////////////////////////////////////////////////
