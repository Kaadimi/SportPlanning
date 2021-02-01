import { createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import PlanningReducer from './reducers/PlanningReducer'

const store = createStore(PlanningReducer, applyMiddleware(thunk))

export default store;