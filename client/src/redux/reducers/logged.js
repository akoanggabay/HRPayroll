import { SET_LOGGED_INFO } from "../types";

const initialState = {
    info: {
        logged: false
    }
}

const loggedReducer = (state = initialState, action = {}) => {
    switch(action.type) {
        case SET_LOGGED_INFO:
            return {
                ...state,
                info:{
                    ...state.info,
                    ...action.payload
                }
            }
        default: return state
    }
}

export default loggedReducer