import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const memberLogin = async (data) => {
  const formData = {
    memberId: data.memberId,
    password: data.password,
  };
  return await axios.post(`${BASE_URL}/member/login`, formData);
};

export const memberSignUp = async (data) => {
  const formData = {
    memberId: data.memberId,
    email: data.email,
    password: data.password,
  };
  return await axios.post(`${BASE_URL}/member/signup`, formData);
};

export const findPassword = async (memberId) => {
  const formData = {
    memberId,
  };
  return await axios.post(`${BASE_URL}/member/findPassword`, formData);
};

export const findId = async (email) => {
  const formData = {
    email,
  };
  return await axios.post(`${BASE_URL}/member/findId`, formData);
};

export const sendEmailVerification = async (email) => {
  const formData = { email };
  return await axios.post(`${BASE_URL}/member/sendEmail`, formData);
};
