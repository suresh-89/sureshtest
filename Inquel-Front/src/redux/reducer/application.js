import { ACTIVE_STATE, CART_COUNT, EXAM_STATE } from "../action";

let initialState = {
    active_state: {
        id: "",
        chapter_key: [],
        topic_key: [],
    },
    exam_state: {
        examStarted: false,
        id: "",
        type: "",
    },
    cart_count: 0,
};

const applicationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVE_STATE:
            return { ...state, active_state: action.payload };
        case EXAM_STATE:
            return { ...state, exam_state: action.payload };
        case CART_COUNT:
            return { ...state, cart_count: action.payload };
        default:
            return state;
    }
};

export default applicationReducer;
