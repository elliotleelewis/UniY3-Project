import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {
	render() {
		return (
			<>
				<h1>Hello, world!</h1>
				<Link className="btn btn-lg btn-primary" to="/viewer">Viewer</Link>
				<Link className="btn btn-lg btn-secondary" to="/editor">Editor</Link>
			</>
		);
	}
}
