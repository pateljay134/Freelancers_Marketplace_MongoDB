import {combineReducers} from 'redux';
import UserSession from './user-session';

const allReducers = combineReducers({
    userLoggedIn : UserSession
})

export default allReducers;