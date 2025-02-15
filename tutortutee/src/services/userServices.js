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
export const memberLogout = async (access) => {
  return await axios.post(
    `${BASE_URL}/member/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
};
export const refreshToken = async (access) => {
  return await axios.post(`${BASE_URL}/member/tokenCheck`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
};
export const deleteMember = async (access) => {
  return await axios.delete(`${BASE_URL}/member/outMember`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
};
export const findPassword = async (memberId) => {
  const formData = {
    memberId,
  };
  return await axios.post(`${BASE_URL}/member/findPassword`, formData);
};

export const findId = async (email) => {
  const formData = {
    email: email,
  };
  return await axios.post(`${BASE_URL}/member/findId`, formData);
};

export const sendEmailVerification = async (email) => {
  const formData = { email };
  return await axios.post(`${BASE_URL}/member/sendEmail`, formData);
};

export const resetPassword = async (data) => {
  const formData = {
    memberId: data.memberId,
    password: data.password,
  };
  return await axios.patch(`${BASE_URL}/member/pwdNonuser`, formData);
};
