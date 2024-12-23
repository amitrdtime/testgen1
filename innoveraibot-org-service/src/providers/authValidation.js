const jwt = require("jsonwebtoken");

const validateRole = async (request) => {
  const authHeader = await request.headers.get("authorization");
  let role_type = "";
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return { status: 401, body: "Invalid token/missed" };
    }
    try {
      const decodedToken = jwt.decode(token);

      //return;
      role_type = decodedToken.extension_Role;
      let msg = {
        id: decodedToken.oid,
        name: decodedToken.name,
        superUserEmail: decodedToken.extension_UserEmail,
      };
      if (role_type != "SuperAdmin") {
        return { status: 401, body: "Unauthorized" };
      } else {
        return { status: 200, body: { msg: msg } };
      }
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return { status: 401, body: "Token expired" };
      } else {
        return { status: 401, body: "Invalid token" };
      }
    }
  } else {
    return { status: 500, body: "Authorization header is not found" };
  }
};

module.exports = validateRole;
