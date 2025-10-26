import 'bootstrap/dist/css/bootstrap.min.css';
import energy from "./images/energy.webp"
import biomedical from "./images/biomedical.jpg"
import electrical from "./images/electrical.jpg"

export default function Streams() {
    return (
        <div className="Streams" style={{display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-evenly'}}> 
          <div className='container'>
            <div className='container-inner'>
              <div className='image-wrapper'>
                <img className='image' src={energy} alt="Energy Engineering" />
              </div>
              <div className='middle'>
                <div className='text'>Energetic Engineering</div>
              </div>
            </div>
          </div>
          <div className='container'>
            <div className='container-inner'>
              <div className='image-wrapper'>
                <img className='image' src={biomedical} alt="Biomedical Engineering" />
              </div>
              <div className='middle'>
                <div className='text'>Biomedical Engineering</div>
              </div>
            </div>
          </div>
          <div className='container'>
            <div className='container-inner'>
              <div className='image-wrapper'>
                <img className='image' src={electrical} alt="Electrical Engineering" />
              </div>
              <div className='middle'>
                <div className='text'>Electrical Engineering</div>
              </div>
            </div>
          </div>
        </div>
    )
}