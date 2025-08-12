import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/pokegrid');
  };

  return (
    <div className="landing-container">
      <h1 className="landing-title">Pokedex App</h1>
      <h2 className="landing-subtitle">Another front-end app for PokéAPI</h2>
      <Button onClick={handleStartClick}>START</Button>
    </div>
  );
};

export default LandingPage;