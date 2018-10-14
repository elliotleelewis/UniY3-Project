import { fromJS } from 'immutable';
import { ActionType, getType } from 'typesafe-actions';

import * as actions from './actions';

const initialState = fromJS({
	test: 0,
});

export default function cameraReducer(state = initialState, action: ActionType<typeof actions>) {
	switch (action.type) {
		case getType(actions.setFrame):
			return state.set('test', state.get('test') + 1);
		default:
			return state;
	}
}
