import { PROFILE } from "../action";

let initialState = {
    profile: {},
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROFILE:
            return { ...state, profile: action.payload };
        default:
            return state;
    }
};

export default userReducer;
