import logo from "./images/logo.png"
import PillNav from './PillNav';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  function Apply() {
    navigate('/form');
  }
    return(
      <nav className="NavBar">
        <div>
            <img src={logo} alt="Um5 logo Rabat" />
        </div>
        <div className="options">
          <PillNav
            items={[
                { label: 'Home', href: '/' },
                { label: 'Probability of Admission', href: '/probability' }
            ]}
            activeHref="/"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#f0f2f5"
            pillColor="#DAE6EE"
            hoveredPillTextColor="rgb(116, 155, 194)"
            pillTextColor="#749BC2"
            />
        </div>
        <button onClick={Apply}>Apply Now</button>
  </nav>
    )
}