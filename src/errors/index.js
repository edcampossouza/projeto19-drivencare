function invalidCredentialsError() {
  return {
    name: "InvalidCredentialsError",
    message: "Email or password are incorrect",
  };
}
function unauthorizedError() {
  return {
    name: "UnauthorizedError",
    message: "You must be signed in to continue",
  };
}
export default {
  invalidCredentialsError,
  unauthorizedError,
};
