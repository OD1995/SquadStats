import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css';
import { LandingPage } from './pages/landing-page/LandingPage';
import { AbrORDOB } from './pages/abrORDOB/AbrORDOB';

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
						<Route path='/abrORDOB' element={<AbrORDOB/>}/>
					</Routes>
				</div>
			</Router>
		</div>
	)
}

export default App;