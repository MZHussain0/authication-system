import toast from "react-hot-toast";

// validate login page username
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  return errors;
}

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password does not match..!");
  }

  return errors;
}

// ----------------------------------------------------------- //
// Validate password
function passwordVerify(error = {}, values) {
  /* eslint-disable no-useless-escape */
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (!values.password) {
    error.password = toast.error("Password must be provided..!");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Wrong password..!");
  } else if (values.password.lenght < 4) {
    error.password = toast.error("Password must be at least 4 characters");
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("Password must have special character");
  }

  return error;
}

// Validate username
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username must be provided..!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid username..!");
  }

  return error;
}
