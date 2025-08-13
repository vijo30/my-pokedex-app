import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import LandingButton from '../components/LandingButton';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/pokegrid');
  };

  return (
    <div className="landing-container">
      <div>
        <h1 className="landing-title">Pokedex App</h1>
        <h2 className="landing-subtitle">Another front-end app for PokéAPI</h2>
      </div>
      <LandingButton onClick={handleStartClick}>START</LandingButton>
    </div>
  );
};

export default LandingPage;