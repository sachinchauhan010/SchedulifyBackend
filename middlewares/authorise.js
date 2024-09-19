export default function authoriseRoute(role) {
  return (req, res, next) => {
    const token = req?.facultyToken
    const userRole = 'faculty'// get role from token
    console.log(token, '###token')
    if (userRole === role) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  }
}
