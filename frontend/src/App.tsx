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
import { MyClubs } from './pages/my-clubs/MyClubs';
import { TeamOverview } from './pages/team/overview/TeamOverview';
import { TeamNames } from './pages/team/name/TeamNames';
import { MatchView } from './pages/match/MatchView';
import { ClubMatches } from './pages/club/ClubMatches';
import { ClubOverview } from './pages/club/ClubOverview';
import { TeamMatches } from './pages/team/TeamMatches';
import { ClubPlayerLeaderboards } from './pages/club/ClubPlayerLeaderboards';
import { TeamPlayers } from './pages/team/TeamPlayers';
import { PlayerOverview } from './pages/player/PlayerOverview';
import { EditPlayerName } from './pages/player/EditPlayerName';
import { ClubTeamsOverviewSelector } from './pages/club/ClubTeamsOverviewSelector';
import { ClubPlayersOverviewSelector } from './pages/club/ClubPlayersOverviewSelector';
import { PlayerTeamsOverviewSelector } from './pages/player/PlayerTeamsOverviewSelector';
import { TeamPlayersOverviewSelector } from './pages/team/TeamPlayersOverviewSelector';
import { ClubAddTeam } from './pages/club/ClubAddTeam';
import { ForgottenPassword } from './pages/login/ForgottenPassword';
import { ResetPassword } from './pages/login/ResetPassword';
import { UpdateData } from './pages/team/scrape/UpdateData';
import { UpdateMatch } from './pages/team/scrape/update-match-sections/UpdateMatch';
import { ShareId } from './pages/club/ShareId';
import { TeamPlayerLeaderboards } from './pages/team/TeamPlayerLeaderboards';
// import { Test } from './pages/Test';
import { ChangeLog } from './pages/change-log/ChangeLog';
import { Contact } from './pages/contact/Contact';
import { RouteChangeTracker } from './helpers/RouteChangeTracker';


const App = () => {

	const isDesktop = isWiderThanHigher();

	return (
		<div
			id={(isDesktop ? 'desktop-' : 'mobile-') + 'app-parent'}
			className='app-parent'
		>
			<Router>
				<RouteChangeTracker/>
				<NavigationBar/>
				<div id={(isDesktop ? 'desktop-' : 'mobile-') + 'page-content'} className='page-content'>
					<Routes>
						<Route index path='/about' element={<About/>}/>
						<Route path='/abrORDOB' element={<AbrORDOB/>}/>
						<Route path='/register' element={<Register/>}/>
						<Route path='/login' element={<Login/>}/>
						<Route path='/forgotten-password' element={<ForgottenPassword/>}/>
						<Route path='/reset-password' element={<ResetPassword/>}/>
						<Route path='/get-started' element={<GetStarted/>}/>
						<Route path='/add-club' element={<AddClub includeHeirachy={false}/>}/>
						<Route path='/my-clubs' element={<MyClubs/>}/>
						<Route path='/club/:clubId/overview' element={<ClubOverview/>}/>
						<Route path='/club/:clubId/matches' element={<ClubMatches/>}/>
						<Route path='/club/:clubId/player-leaderboards' element={<ClubPlayerLeaderboards/>}/>
						<Route path='/club/:clubId/teams' element={<ClubTeamsOverviewSelector/>}/>
						<Route path='/club/:clubId/add-team' element={<ClubAddTeam/>}/>
						<Route path='/club/:clubId/players' element={<ClubPlayersOverviewSelector/>}/>
						<Route path='/club/:clubId/share-id' element={<ShareId/>}/>
						<Route path='/team/:teamId/overview' element={<TeamOverview/>}/>
						<Route path='/team/:teamId/update-data' element={<UpdateData/>}/>
						<Route path='/team/:teamId/update-match/:leagueSeasonId/:matchId' element={<UpdateMatch/>}/>
						<Route path='/team/:teamId/matches' element={<TeamMatches/>}/>
						<Route path='/team/:teamId/players-leaderboards' element={<TeamPlayers/>}/>
						<Route path='/team/:teamId/players' element={<TeamPlayersOverviewSelector/>}/>
						<Route path='/team/:teamId/team-names' element={<TeamNames/>}/>
						<Route path='/team/:teamId/match/:matchId' element={<MatchView/>}/>
						<Route path='/team/:teamId/player-leaderboards' element={<TeamPlayerLeaderboards/>}/>
						<Route path='/player/:playerId/overview' element={<PlayerOverview/>}/>
						<Route path='/player/:playerId/teams' element={<PlayerTeamsOverviewSelector/>}/>
						<Route path='/player/:playerId/edit-name' element={<EditPlayerName/>}/>
						<Route path='/change-log' element={<ChangeLog/>}/>
						<Route path='/contact' element={<Contact/>}/>
						{/* <Route path='/test' element={<Test/>}/> */}
						<Route path="*" element={<Navigate to="/about" replace/>}/>
					</Routes>
				</div>
			</Router>
		</div>
	)
}

export default App;