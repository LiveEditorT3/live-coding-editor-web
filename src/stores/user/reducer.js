import { actions } from "./actions.js";

const userReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return action.payload;
    case actions.CLEAR_USER:
      return "";
    default:
      throw new Error(`The action.type ${action.type} is not supported`);
  }
};

export default userReducer;
