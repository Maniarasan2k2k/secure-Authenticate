import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token; // cookie-la token check

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.id }; // 👈 standardized key name: id
    next();

    if (!decoded.id) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }


    console.log("Cookies:", req.cookies); // cookie backend-ku varudhu nu check
    console.log("Token:", req.cookies?.token);


  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default userAuth;
