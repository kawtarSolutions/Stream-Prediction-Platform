import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  function handleExploreClick() {
    navigate('/streams');
  }
    return(
            <div className="Welcome px-4 py-5 my-5 text-center"> 
              <h1 className="display-5 fw-bold">Welcome, Students!</h1> 
              <div className="col-lg-6 mx-auto hero"> 
                <p className="lead mb-4">Discover the academic streams available at our institution and explore your options. Our intelligent system analyzes your grades to predict your probability of acceptance into your preferred stream, helping you make informed decisions about your academic future.</p> 
                <div className="welcomeButton d-grid gap-2 d-sm-flex justify-content-sm-center">  
                  <button type="button" onClick={handleExploreClick}>Explore Streams</button>  
                </div> 
              </div> 
            </div>

    )
}