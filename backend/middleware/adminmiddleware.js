export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Proceed if admin
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};
