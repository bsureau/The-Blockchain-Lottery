import {combineReducers} from "redux";
import lotteryReducer from "./lottery/lotteryReducer"

const rootReducer = combineReducers({
    lottery: lotteryReducer
})

export default rootReducer