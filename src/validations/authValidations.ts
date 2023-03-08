import * as yup from "yup";

export const userNameSchema = yup
  .string()
  .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Incorrect email")
  .required("Email required");

export const emailSchema = yup
  .string()
  .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Incorrect email")
  .required("Email required");

export const passwordSchema = yup
  .string()
  .required("Password required")
  .min(8, "Too short password")
  .max(248, "Too long password");

export const requiredFieldSchema = yup
  .string()
  .required("This field is required");
