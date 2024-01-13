import { combineReducers, createStore, compose } from "redux";
import contentReducer from "../reducer/content";
import userReducer from "../reducer/user";
import storageReducer from "../reducer/storage";
import applicationReducer from "../reducer/application";
import { RESET_STATE } from "../action";

function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state", serializedState);
    } catch (e) {
        console.warn(e);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem("state");
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn(e);
        return undefined;
    }
}

const persistedState = loadFromLocalStorage();

const appReducer = combineReducers({
    content: contentReducer,
    user: userReducer,
    storage: storageReducer,
    application: applicationReducer,
});

// rootreducer to reset the state after user logout
const rootReducer = (state, action) => {
    if (action.type === RESET_STATE) {
        return appReducer(undefined, action);
    }

    return appReducer(state, action);
};

const store = createStore(
    rootReducer,
    persistedState,
    process.env.NODE_ENV === "development"
        ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
              window.__REDUX_DEVTOOLS_EXTENSION__()
        : compose
);

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
