import { configureStore } from '@reduxjs/toolkit'
import appReducer from './reducers/appReducer';
import userReducer from './reducers/userReducer';
import { spotTypes } from './types/spotTypes';
import { userTypes } from './types/userTypes';
import { spotifyTypes } from './types/spotifyTypes';
import { favoritesTypes } from './types/favoritesTypes';

// Reference here all your application reducers
const reducer = {
  appReducer: appReducer,
  userReducer: userReducer
}

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [spotTypes.FETCH_SPOT, spotifyTypes.GET_USER_CURRENT_MUSIC, favoritesTypes.ADD_FAVORITE_MUSICS, favoritesTypes.REMOVE_FAVORITE_MUSICS ],
      ignoredActionPaths: ['appReducer'],
      ignoredPaths: ['appReducer', 'userReducer']
    }
  })
},);

export default store;