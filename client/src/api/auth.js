import axiosClient from "./axiosClient";

const authAPI = {
  userSignup({
    firstName,
    lastName,
    email,
    phone_number,
    address,
    password,
    role,
  }) {
    const url = `/auth/signup`;
    return axiosClient.post(url, {
      firstName,
      lastName,
      email,
      password,
      phone_number,
      address,
      role,
    });
  },

  userLogin(email, password) {
    const url = `/auth/login`;
    return axiosClient.post(url, {
      email,
      password,
    });
  },
};

export default authAPI;
