import jwt from "jsonwebtoken";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ ok: false, message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ ok: false, message: "Invalid or expired token" });
      }

      req.user = decoded;

      if (!req.user.role) {
        return res
          .status(401)
          .json({ ok: false, message: "Authentication required" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ ok: false, message: "Forbidden" });
      }

      return next();
    });
  };
};

export default authorizeRoles;
