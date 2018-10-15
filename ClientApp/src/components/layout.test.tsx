import { shallow } from 'enzyme';
import * as React from 'react';

import Layout from './layout';

describe('Layout', () => {
	it('renders without crashing', () => {
		shallow(
			<Layout />,
		)
	});
});
