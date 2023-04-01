import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import errors from "../errors/index.js";
dotenv.config();
const { JWT_SECRET_PHYSICIAN, JWT_SECRET_PATIENT } = process.env;

export async function physicianAuth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  try {
    if (!token) throw errors.unauthorizedError();
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET_PHYSICIAN);
    } catch (error) {
      throw errors.unauthorizedError();
    }
    console.log(decoded);
    if (decoded) {
      next();
    } else {
      throw errors.unauthorizedError();
    }
  } catch (err) {
    next(err);
  }
}

export async function patientAuth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  try {
    if (!token) throw errors.unauthorizedError();
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET_PATIENT);
    } catch (error) {
      throw errors.unauthorizedError();
    }
    console.log(decoded);
    if (decoded) {
      next();
    } else {
      throw errors.unauthorizedError();
    }
  } catch (err) {
    next(err);
  }
}
