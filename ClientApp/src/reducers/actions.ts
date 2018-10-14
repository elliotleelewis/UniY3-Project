import { createAction } from 'typesafe-actions';

export const setFrame = createAction('SET_FRAME', (resolve) => {
	return (id: string) => resolve(id);
});
