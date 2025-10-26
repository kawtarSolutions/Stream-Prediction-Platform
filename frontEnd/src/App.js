import './App.css';
import NavBar from './NavBar';
import Welcome from './Welcome';
import Particles from './Particles';
import Streams from './streams';
import Footer from './Footer';
import AllStreams from './AllStreams';
import { Routes, Route } from 'react-router-dom';
import  Form  from './Form';
import Probability from './Probability';

function App() {
  return (
    <div className="App">
      <div style={{ width: '100%', height: '600px', position: 'absolute', zIndex: "-1" }}>
        <Particles
          particleColors={['#4682A9', '#4682A9']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      
      <NavBar />
      
      <Routes>
        <Route path="/" element={
          <>
            <Welcome />
            <Streams />
          </>
        } />
        <Route path="/streams" element={<AllStreams />} />
        <Route path="/form" element={<Form />} />
        <Route path="/probability" element={<Probability />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;