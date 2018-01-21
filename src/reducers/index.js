import { combineReducers } from 'redux'
import { reducer as notifications } from 'react-notification-system-redux';
import { createReducer } from './reducers-middleware'


const account = combineReducers({
  users: createReducer('account.users', 'literal-array', []),
  accounts: createReducer('account.accounts', 'literal-array', []),
})

const reducers = combineReducers({ notifications, account });

export default reducers;