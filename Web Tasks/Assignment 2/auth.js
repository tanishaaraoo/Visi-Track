const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null

  if (!token) return res.status(401).send('Access denied')

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret')
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).send('Invalid token')
  }
}
