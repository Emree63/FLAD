import { configureStore } from '@reduxjs/toolkit'
import appReducer from './reducers/appReducer';
import userReducer from './reducers/userReducer';

// Reference here all your application reducers
const reducer = {
  appReducer: appReducer,
  userReducer: userReducer
}

const store = configureStore({
  // @ts-ignore
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
},);

export default store;