import { MatchesValidator } from './matches.validator';

describe('MatchesValidator', () => {
	it('should create an instance', () => {
		const directive = new MatchesValidator();
		expect(directive).toBeTruthy();
	});
});
