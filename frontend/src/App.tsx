import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css';
import { About } from './pages/about/About';
import { AbrORDOB } from './pages/abrORDOB/AbrORDOB';
import { NavigationBar } from './navigation-bar/NavigationBar';
import { AddClub } from './pages/add-club/AddClub';
import { isWiderThanHigher } from './helpers/windowDimensions';
import { Register } from './pages/register/Register';
import { Login } from './pages/login/Login';

interface AppProps {
	// isDesktop : boolean
}

const App = (props:AppProps) => {

	const isDesktop = isWiderThanHigher();

	return (
		<div
			id={(isDesktop ? 'desktop-' : 'mobile-') + 'app-parent'}
			className='app-parent'
		>
			<Router>
				<div id='navigation-bar'>
					<NavigationBar
						// isDesktop={props.isDesktop}
					/>
				</div>
				<div id={(isDesktop ? 'desktop-' : 'mobile-') + 'page-content'} className='page-content'>
					<Routes>
						<Route index path='/about' element={<About/>}/>
						<Route path='/abrORDOB' element={<AbrORDOB/>}/>
						<Route path='/register' element={<Register/>}/>
						<Route path='/login' element={<Login/>}/>
						<Route path='/add-club' element={<AddClub/>}/>
					</Routes>
				</div>
			</Router>
		</div>
	)
}

export default App;