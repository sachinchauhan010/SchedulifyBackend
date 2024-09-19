import jwt from 'jsonwebtoken';

export default function authoriseRoute(requiredRole) {
  return (req, res, next) => {
    const token = req?.cookies?.facultyToken;

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userRole = decoded?.role;

      console.log(userRole, '###userRole from token');

      if (userRole === requiredRole) {
        next();
      } else {
        res.status(403).json({ message: 'Access denied' });
      }

    } catch (err) {
      console.error(err);
      res.status(403).json({ message: 'Invalid token or authentication failed' });
    }
  };
}
