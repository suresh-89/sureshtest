import store from "../store";

export default function storeDispatch(action, data) {
    store.dispatch({ type: action, payload: data });
}
