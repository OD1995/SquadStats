import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css';
import { About } from './pages/about/About';
import { AbrORDOB } from './pages/abrORDOB/AbrORDOB';
import { NavigationBar } from './pages/navigation-bar/NavigationBar';
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';

interface AppProps {
	isDesktop : boolean
}

const App = (props:AppProps) => {
	return (
		<div id='app-parent'>
			<Router>
				<div id='navigation-bar'>
					<NavigationBar/>
				</div>
				<div id='page-content'>
					<Routes>
						<Route index path='/about' element={<About/>}/>
						<Route path='/abrORDOB' element={<AbrORDOB/>}/>
						<Route path='/register' element={<Register/>}/>
						<Route path='/login' element={<Login/>}/>
					</Routes>
				</div>
			</Router>
		</div>
	)
}

export default App;