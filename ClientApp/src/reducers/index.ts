import { combineReducers } from 'redux-immutable';

import cameraReducer from './camera.reducer';

const rootReducer = combineReducers({
	camera: cameraReducer,
});

export default rootReducer;
