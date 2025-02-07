const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const Post = require('/Users/bml/Desktop/Code.BML/gdghack/post.js'); // Ensure the path to the Post model is correct
const User = require('/Users/bml/Desktop/Code.BML/gdghack/User.js'); // Ensure the path to the User model is correct
const {register,login} = require('/Users/bml/Desktop/Code.BML/gdghack/authentification.js')
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());




// MongoDB connection
mongoose.connect('mongodb+srv://nmboulanouar:JMLfI9jRVRMpIZ5q@cluster0.bo8iq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('Connexion à MongoDB réussie!');
})
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB:', error.message);
  });

// CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Home route (for testing the server)
const welcome = (req, res) => {
    res.send('Welcome to the Express & MongoDB app!');
};

const middWelcome = (req, res, next) => {
    console.log('Test to the Express & MongoDB app!');
    next();
};

app.get('/', middWelcome, welcome);

// Route to create a new user (POST request)
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: 'User saved successfully!', data: newUser });
    } catch (error) {
        res.status(400).json({ error: 'Error saving user', details: error });
    }
});

// Route to get all users (GET request)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users', details: error });
    }
});


// Route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting user', details: error });
    }
});

// Route to create a new post
app.post('/posts', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json({ message: 'Post added successfully!', data: newPost });
    } catch (error) {
        res.status(400).json({ error: 'Error adding post', details: error });
    }
});

// Route to delete a post by ID
app.delete('/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting post', details: error });
    }
});

// GET route to search posts by user email, skills, or rating
app.get("/posts", async (req, res) => {
    try {
        const { email, skills, minRating } = req.query;
        let query = {};

        if (email) {
            const foundUser = await User.findOne({ email });
            if (!foundUser) {
                return res.status(404).json({ message: "User not found!" });
            }
            query.user = foundUser._id;
        }

        if (skills) {
            query.requiredSkills = { $in: skills.split(",") };
        }

        if (minRating) {
            query.rating = { $gte: Number(minRating) };
        }

        const posts = await Post.find(query);
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found!" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching posts", error });
    }
});
app.post("/register",register);
app.get("/login",login);



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
