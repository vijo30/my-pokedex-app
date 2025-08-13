import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import PokeGrid from './pages/PokeGrid'
import Pokedex from './pages/Pokedex'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pokegrid" element={<PokeGrid />} />
        <Route path="/pokedex/:id" element={<Pokedex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
