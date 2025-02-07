const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await mongoose.model("User").findOne({ email });
      if (!user) return res.status(404).send({ message: "User not found." });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).send({ message: "Invalid credentials." });
  
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      res.json({ token });
    } catch (error) {
      res.status(500).send({ message: "Login error." });
    }
  };

  exports.register = async (req, res) => {
    const {email, password,fullName} = req.body;
  
    try {
      const existingUser = await mongoose.model("User").findOne({email });
      if (existingUser)
        return res.status(409).send({ message: "Email already in use." });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await mongoose.model("User").create({
        email,
        password: hashedPassword,
        fullName    
      });
  
      const token = jwt.sign(
        { userId: user.id, },
        process.env.JWT_SECRET
      );
  
      res.json({ token });
    } catch (error) {
        console.log(error);
      res.status(500).send({ message: "Error creating user." });
    }
  };