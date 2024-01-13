import {
    CHAPTER,
    COURSE,
    CYCLE,
    GROUP,
    PAPER,
    QUIZ,
    SECTION,
    SEMESTER,
    SIMULATION,
    SUBJECT,
    SUBSCRIPTION,
    TOPIC,
} from "../action";

let data = {
    group_name: "Group",
    subject_name: "Subject",
    subscription_name: "Subscription",
    course_name: "Course",
    chapter_name: "Chapter",
    topic_name: "Topic",
    cycle_name: "Cycle",
    quiz_name: "Quiz",
    semester_name: "Semester",
    section_name: "Section",
    simulation_name: "Simulation",
    paper_name: "Paper",
};

const contentReducer = (state = data, action) => {
    switch (action.type) {
        case GROUP:
            return { ...state, group_name: action.payload };
        case SUBJECT:
            return { ...state, subject_name: action.payload };
        case SUBSCRIPTION:
            return { ...state, subscription_name: action.payload };
        case COURSE:
            return { ...state, course_name: action.payload };
        case CHAPTER:
            return { ...state, chapter_name: action.payload };
        case TOPIC:
            return { ...state, topic_name: action.payload };
        case CYCLE:
            return { ...state, cycle_name: action.payload };
        case QUIZ:
            return { ...state, quiz_name: action.payload };
        case SEMESTER:
            return { ...state, semester_name: action.payload };
        case SECTION:
            return { ...state, section_name: action.payload };
        case SIMULATION:
            return { ...state, simulation_name: action.payload };
        case PAPER:
            return { ...state, paper_name: action.payload };
        default:
            return state;
    }
};

export default contentReducer;
