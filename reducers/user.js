const initialState = {
  isLoginRequest: false,
  isLoginError: false,
  isLoginDone: false,
  userInfo: {},
};

const LOGIN_REQ = "LOGIN_REQ";
const LOGIN_ERROR = "LOGIN_ERROR";
const LOGIN_DONE = "LOGIN_DONE";
const LOGOUT = "LOGOUT";

const user = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQ:
      return {
        ...state,
        isLoginRequest: true,
        isLoginError: false,
        isLoginDone: false,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        isLoginRequest: false,
        isLoginError: true,
        isLoginDone: false,
      };
    case LOGIN_DONE:
      return {
        ...state,
        isLoginRequest: false,
        isLoginError: false,
        isLoginDone: true,
      };
    case LOGOUT:
      return {
        ...state,
        isLoginRequest: false,
        isLoginError: false,
        isLoginDone: false,
      };
    default:
      return state;
  }
};

export { user, LOGIN_REQ, LOGIN_DONE, LOGIN_ERROR, LOGOUT };
