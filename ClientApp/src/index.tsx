import {
	ConnectedRouter as Router,
	connectRouter,
	routerMiddleware,
} from 'connected-react-router/immutable';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { applyMiddleware, createStore } from 'redux';

import Layout from './components/layout';
import Editor from './pages/editor';
import Home from './pages/home';
import Viewer from './pages/viewer';
import reducers from './reducers';
import registerServiceWorker from './service-worker';

import './index.scss';

const history = createBrowserHistory({
	basename: document.getElementsByTagName('base')[0].getAttribute('href'),
});

let middleware = applyMiddleware(...[
	routerMiddleware(history),
]);
if (process.env.NODE_ENV === 'development') {
	// tslint:disable-next-line no-var-requires
	const { composeWithDevTools } = require('redux-devtools-extension');
	middleware = composeWithDevTools(middleware);
}

ReactDOM.render(
	<Provider store={createStore(connectRouter(history)(reducers), middleware)}>
		<Router history={history}>
			<Layout>
				<Route exact={true} path="/" component={Home} />
				<Route path="/viewer" component={Viewer} />
				<Route path="/editor" component={Editor} />
			</Layout>
		</Router>
	</Provider>,
	document.getElementById('root'),
);

fetch('/api/Example/Forecasts')
	.then((response) => response.json())
	.then(console.log);

registerServiceWorker();
