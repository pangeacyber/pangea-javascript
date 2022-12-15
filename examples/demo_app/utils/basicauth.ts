/* eslint-disable no-param-reassign */
async function basicAuth(req, res, next) {
  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username] = credentials.split(":");

  // attach user to request object
  req.user = username;

  next();
}

export default basicAuth;
