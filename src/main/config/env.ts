export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5050,
  secret: process.env.JWT_SECRET || 'asAOnH6d4O$$@!87!8'
}
