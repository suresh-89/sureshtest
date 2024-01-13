import { RESPONSE, EXAMDATA, TEMP, NOTIFICATION, STUDY_GUIDE } from "../action";

let initialState = {
    response: {},
    temp: {},
    examData: {},
    notification: [],
    study_guide: [],
};

const storageReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESPONSE:
            return { ...state, response: action.payload };
        case TEMP:
            return { ...state, temp: action.payload };
        case EXAMDATA:
            return { ...state, examData: action.payload };
        case NOTIFICATION:
            return { ...state, notification: action.payload };
        case STUDY_GUIDE:
            return { ...state, study_guide: action.payload };
        default:
            return state;
    }
};

export default storageReducer;
