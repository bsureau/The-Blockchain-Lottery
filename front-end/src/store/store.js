import {createStore} from "redux"
import rootReducer from "../reducers/rootReducer";

//create the store and associate the rootReducer to handle our different dispatched events
const store = createStore(rootReducer);

export default store