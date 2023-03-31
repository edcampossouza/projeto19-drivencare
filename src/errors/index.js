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
function duplicatedEmailError(email) {
  return {
    name: "DuplicatedEmailError",
    message: "There is already a user with given email",
    email,
  };
}
export default {
  invalidCredentialsError,
  unauthorizedError,
  duplicatedEmailError,
};
