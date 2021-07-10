import * as yup from "yup";
import strings from "./strings";

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .min(3)
    .max(50)
    .email(strings.emailRequired)
    .matches(new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$").compile())
    .required(strings.emailRequired)
});

export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8)
    .max(50)
    .required()
});
/**
 * @TODO remove this in all dependencies
 */
export const firstNameSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2)
    .max(50)
    .required()
});
/**
 * @TODO remove this in all dependencies
 */
export const lastNameSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2)
    .max(50)
    .required()
});
