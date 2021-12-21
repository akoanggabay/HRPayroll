import { SET_LOGGED_INFO } from "../types";

export function setLoggedInfo(payload) {
    return {
        type: SET_LOGGED_INFO,
        payload: payload
    }
}