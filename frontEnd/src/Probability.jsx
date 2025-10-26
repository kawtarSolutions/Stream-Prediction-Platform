import React, { useState, useEffect } from 'react';
import { CheckCircle, TrendingUp, Users, BookOpen, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProbability } from './services/api';
import performance from "./images/performance.png";
import average from "./images/average.png";
import capacity from "./images/capacity.png"

export default function Probability() {
  const location = useLocation();
  const navigate = useNavigate();

  const [probability, setProbability] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualProbability, setActualProbability] = useState(0);

  const studentId = location.state?.studentId;
  const studentName = location.state?.studentName;

  useEffect(() => {
    // Check if we have a student ID
    if (!studentId) {
      setError('No student data found. Please complete the application form first.');
      setIsLoading(false);
      return;
    }

    // Fetch probability from backend
    const fetchProbability = async () => {
      try {
        const result = await getProbability(studentId);

        // The backend might return probability in different formats
        // Adjust based on your actual backend response
        const probValue = result.result || result.probability || 0;

        setActualProbability(probValue);
        setIsLoading(false);
        animateProbability(probValue);

      } catch (err) {
        console.error('Error fetching probability:', err);
        // Show user-friendly error message
        setError('Unable to retrieve your admission probability at this time. Please try refreshing the page.');
        setActualProbability(0);
        setIsLoading(false);
      }
    };

    fetchProbability();
  }, [studentId]);

  const animateProbability = (targetProbability) => {
    let current = 0;
    const increment = targetProbability / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetProbability) {
        setProbability(targetProbability);
        clearInterval(timer);
      } else {
        setProbability(Math.floor(current));
      }
    }, 20);
  };

  const getProbabilityColor = (prob) => {
    if (prob >= 70) return 'text-green-600';
    if (prob >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProbabilityBg = (prob) => {
    if (prob >= 70) return 'from-green-500 to-emerald-600';
    if (prob >= 50) return 'from-yellow-500 to-amber-600';
    return 'from-orange-500 to-red-600';
  };

  const getMessage = (prob) => {
    if (prob >= 80) return { title: "Excellent Chances!", text: "Your profile is highly competitive for your chosen stream." };
    if (prob >= 70) return { title: "Strong Chances!", text: "You have a very good probability of admission to your preferred stream." };
    if (prob >= 50) return { title: "Good Chances!", text: "You have a solid chance of admission. Consider preparing backup options." };
    return { title: "Consider Alternatives", text: "Your chances are moderate. We recommend exploring additional stream options." };
  };

  const message = getMessage(probability);

  return (
    <div className="probability">
        {/* Main Results Card */}
        <div className="loading">
          {error && !studentId ? (
            <div className="error-container welcomeButton" style={{ textAlign: 'center', padding: '2rem' }}>
              <h5>{error}</h5>
              <button
                onClick={() => navigate('/form')}
              >
                Go to Application Form
              </button>
            </div>
          ) : isLoading ? (
            <div className="loading-container">
              <p className="">Calculating your admission probability...</p>
            </div>
          ) : (
            <>
              {/* Warning if using demo data */}
              {error && studentId && (
                <div style={{ background: '#fff3cd', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', color: '#856404' }}>
                  {error}
                </div>
              )}

              {/* Header Section */}
              <div>
                <div className="header">
                  <div className="header-results">
                    <div className='checkCircle'>
                        <CheckCircle size={22}/>
                    </div>
                    <h1>Results Ready</h1>
                  </div>
                  <div>
                    <p>Based on your academic performance and stream capacity analysis</p>
                  </div>
                </div>
               </div>

              {/* Probability Display */}
              <div className="text-center probability-display">
                <h2>Your Admission Probability</h2>
                
                <div className="relative inline-block">
                  <svg className="transform -rotate-90" width="280" height="280">
                    {/* Background circle */}
                    <circle
                      cx="140"
                      cy="140"
                      r="120"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="140"
                      cy="140"
                      r="120"
                      stroke="url(#gradient)"
                      strokeWidth="20"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${2 * Math.PI * 120 * (1 - probability / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={probability >= 70 ? "#70B2B2" : probability >= 50 ? "#C66E52" : "#CD2C58"} />
                        <stop offset="100%" stopColor={probability >= 70 ? "#70B2B2" : probability >= 50 ? "#C66E52" : "#CD2C58"} />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                    <div>
                      <div className="number">
                        {probability}%
                      </div>
                    </div>
                  </div>

                {/* Message */}
                <div className="message">
                  <h3>
                    {message.title}
                  </h3>
                  <p>{message.text}</p>
                </div>
              </div>

              {/* Info Cards */}
              <div className="infocard">
                <InfoCardItem title="Your Performance" src={performance}>Evaluated against historical admission data</InfoCardItem>
                <InfoCardItem title="Student Average" src={average}>Compared with all applicant averages</InfoCardItem>
                <InfoCardItem title="Stream Capacity" src={capacity}>Calculated based on available positions</InfoCardItem>
              </div>

              {/* Footer Note */}
              <div className="footer">
                <p>
                  <span className="">Note:</span> This probability is calculated using your academic grades, the average performance of all applicants, and the capacity limits of your selected stream. Results are estimated and actual admission decisions may vary.
                </p>
              </div>
            </>
          )}
        </div>
    </div>
  );
}

function InfoCardItem({title, children, src}) { 
    return(
        <div className="infocard-item">
            <img src={src} />
            <h4 className="">{title}</h4>
            <p className="">{children}</p>
            </div>
    );
}