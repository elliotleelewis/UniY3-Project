import * as React from 'react';
import { Link } from 'react-router-dom';
import {
	Collapse,
	Nav,
	Navbar,
	NavbarToggler,
	NavItem,
} from 'reactstrap';

interface IProps {
	loading: boolean;
}

export default class Layout extends React.Component<IProps> {
	static defaultProps = {
		loading: false,
	};

	constructor(props: IProps) {
		super(props);
		this.toggleNavbar = this.toggleNavbar.bind(this);
	}

	toggleNavbar() {
		console.log('TOGGLED');
	}

	render() {
		const { children, loading } = this.props;
		return (
			<>
				<Navbar color="light" light={true} expand="md">
					<Link className="navbar-brand" to="/">TITLE</Link>
					<NavbarToggler onClick={this.toggleNavbar} />
					<Collapse isOpen={false} navbar={true}>
						<Nav className="ml-md-auto" navbar={true}>
							<NavItem>
								<Link className="nav-link" to="/viewer">Viewer</Link>
							</NavItem>
							<NavItem>
								<Link className="nav-link" to="/editor">Editor</Link>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
				{children}
				<div
					className="position-fixed w-100 h-100"
					style={{
						display: loading ? '' : 'none',
						left: 0,
						top: 0,
					}}
				/>
			</>
		);
	}
}
