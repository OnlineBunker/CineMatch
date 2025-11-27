import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // getting the header from jwt token 
  // header contains "Bearer "
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // we dont need the { "Bearer " } part so we are just splitting it up
  const token = header.split(" ")[1];

  try {
    // verifying the token with our real token which we have in our .env file 
    // if the token fetched from the header from the website matches our local token then the user is authorized 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
