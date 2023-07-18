const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  return null;
}

// Cache-busting middleware
function cacheBusting(req, res, next) {
  // Append a version or timestamp query parameter to the static file URLs
  const bustingQuery = `v=${Date.now()}`;

  // Modify the response headers to instruct the browser not to cache the files
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  // Append the cache-busting query parameter to the requested URL
  req.url += (req.url.indexOf("?") === -1 ? "?" : "&") + bustingQuery;

  next();
}


// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
  cacheBusting,
};
