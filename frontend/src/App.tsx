import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css';
import { About } from './pages/about/About';
import { AbrORDOB } from './pages/abrORDOB/AbrORDOB';
import { NavigationBar } from './navigation-bar/NavigationBar';
import { AddClub } from './pages/add-club/AddClub';
import { isWiderThanHigher } from './helpers/windowDimensions';
import { Register } from './pages/register/Register';
import { Login } from './pages/login/Login';
import { GetStarted } from './pages/get-started/GetStarted';
import { Home } from './pages/home/Home';
import { MyClubs } from './pages/my-clubs/MyClubs';
import { ClubOverview } from './pages/club/ClubOverview';
import { TeamOverview } from './pages/team/TeamOverview';
import { TeamScrape } from './pages/team/TeamScrape';


const App = () => {

	const isDesktop = isWiderThanHigher();

	return (
		<div
			id={(isDesktop ? 'desktop-' : 'mobile-') + 'app-parent'}
			className='app-parent'
		>
			<Router>
				<NavigationBar/>
				<div id={(isDesktop ? 'desktop-' : 'mobile-') + 'page-content'} className='page-content'>
					<Routes>
						<Route index path='/about' element={<About/>}/>
						<Route path='/home' element={<Home/>}/>
						<Route path='/abrORDOB' element={<AbrORDOB/>}/>
						<Route path='/register' element={<Register/>}/>
						<Route path='/login' element={<Login/>}/>
						<Route path='/get-started' element={<GetStarted/>}/>
						<Route path='/add-club' element={<AddClub includeHeirachy={false}/>}/>
						<Route path='/my-clubs' element={<MyClubs/>}/>
						<Route path='/club/:club_id/overview' element={<ClubOverview/>}/>
						<Route path='/team/:team_id/overview' element={<TeamOverview/>}/>
						<Route path='/team/:team_id/scrape' element={<TeamScrape/>}/>
					</Routes>
				</div>
			</Router>
		</div>
	)
}

export default App;