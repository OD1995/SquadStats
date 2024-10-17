import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import './index.css'


const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		{/* <Provider store={}> */}
    		<App isDesktop={!isMobile}/>
		{/* </Provider> */}
  	</StrictMode>,
)
