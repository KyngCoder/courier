const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  console.log(accessToken);

  if (!accessToken) {
    return res.status(401).json({ error: "User not logged In" });
  }

  try {
    const validToken = jwt.verify(accessToken, "secret");
    console.log("token", validToken);
    req.user = validToken;

    if (validToken) {
      return next();
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

module.exports = authenticateToken;
