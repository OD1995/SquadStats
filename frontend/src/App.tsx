import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
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
import { TeamOverview } from './pages/team/overview/TeamOverview';
import { TeamScrape } from './pages/team/scrape/TeamScrape';
import { TeamNames } from './pages/team/name/TeamNames';
import { MatchView } from './pages/match/MatchView';
import { ClubMatches } from './pages/club/ClubMatches';
import { ClubOverview } from './pages/club/ClubOverview';
import { TeamMatches } from './pages/team/TeamMatches';
import { ClubPlayers } from './pages/club/ClubPlayers';
import { TeamPlayers } from './pages/team/TeamPlayers';
import { PlayerView } from './pages/player/PlayerView';
import { EditPlayerName } from './pages/player/EditPlayerName';


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
						<Route path='/club/:clubId/overview' element={<ClubOverview/>}/>
						<Route path='/club/:clubId/matches' element={<ClubMatches/>}/>
						<Route path='/club/:clubId/players' element={<ClubPlayers/>}/>
						<Route path='/team/:teamId/overview' element={<TeamOverview/>}/>
						<Route path='/team/:teamId/update-data' element={<TeamScrape/>}/>
						<Route path='/team/:teamId/matches' element={<TeamMatches/>}/>
						<Route path='/team/:teamId/players' element={<TeamPlayers/>}/>
						<Route path='/team/:teamId/team-names' element={<TeamNames/>}/>
						<Route path='/match/:matchId' element={<MatchView/>}/>
						<Route path='/player/:playerId' element={<PlayerView/>}/>
						<Route path='/player/:playerId/edit-name' element={<EditPlayerName/>}/>
						<Route path="*" element={<Navigate to="/about" replace/>}/>
					</Routes>
				</div>
			</Router>
		</div>
	)
}

export default App;