import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/Reducer';
import authMiddleware from '../middleware/authMiddleware';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk, authMiddleware)
  );

export default store;
