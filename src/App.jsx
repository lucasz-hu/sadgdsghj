import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BurgerMenu from './components/BurgerMenu'
import DatesList from './components/DatesList'
import MapView from './components/MapView'
import './App.css'

function App() {
  return (
    <Router>
      <div className="h-screen w-screen overflow-hidden">
        <BurgerMenu />
        <Routes>
          <Route path="/" element={<DatesList />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
