import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css';
import { LandingPage } from './pages/landing-page/LandingPage';

interface AppProps {
	isDesktop : boolean
}

const App = (props : AppProps) => {
	return (
		<div>
			<Router>
				<div className='navigation-bar'>

				</div>
				<div className='page-content'>
					<Routes>
						<Route index element={<LandingPage/>}/>
					</Routes>
				</div>
			</Router>
		</div>
	)
}

export default App;