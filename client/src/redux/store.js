import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import logged from './reducers/logged'
import users from './reducers/user'

const middlewares = compose(applyMiddleware(thunk))


const reducers = combineReducers({
    users,
    logged
})

export default createStore(reducers, middlewares)