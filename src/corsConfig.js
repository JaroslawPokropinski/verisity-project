// { origin: 'http://localhost:3000', credentials: true }

if (process.env.NODE_ENV === 'production') {
  module.exports = { origin: true, credentials: true }
} else {
  module.exports = { origin: 'http://localhost:3000', credentials: true }
}