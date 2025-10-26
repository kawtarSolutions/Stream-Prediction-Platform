import { useState, useEffect } from "react";
import streams from "./streamsArray";
import "./AllStreams.css";

export default function AllStreams() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const updateCarousel = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((newIndex + streams.length) % streams.length);
    setExpandedIndex(-1);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const getCardClass = (index) => {
    const offset = (index - currentIndex + streams.length) % streams.length;
    if (offset === 0) return "center";
    if (offset === 1) return "right-1";
    if (offset === 2) return "right-2";
    if (offset === streams.length - 1) return "left-1";
    if (offset === streams.length - 2) return "left-2";
    return "hidden";
  };

  const handleSwipe = (touchEndX) => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
  };

  const handleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? -1 : index));
  };

  const nextSlide = () => {
    updateCarousel(currentIndex + 1);
  };

  const previousSlide = () => {
    updateCarousel(currentIndex - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") previousSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="AllStreams">
      <h1 className="about-title">STREAMS</h1>
      <div className="carousel-container">
        <button
          className="nav-arrow left"
          onClick={() => updateCarousel(currentIndex - 1)}
          
        >
          ‹
        </button>
        <div
          className="carousel-track"
          onTouchStart={(e) => setTouchStartX(e.changedTouches[0].screenX)}
          onTouchEnd={(e) => handleSwipe(e.changedTouches[0].screenX)}
        >
          {streams.map((stream, index) => (
            <Stream
              key={stream.id}
              id = {stream.id}
              index={index}
              description={stream.description}
              jobs = {stream.jobs}
              url = {stream.url}
              cardClass={getCardClass(index)}
              isExpanded={expandedIndex === index}
              onCardClick={() => updateCarousel(index)}
              onExpandClick={() => handleExpand(index)}
            />
          ))}
        </div>
        <button
          className="nav-arrow right"
          onClick={() => updateCarousel(currentIndex + 1)}
        >
          ›
        </button>
      </div>

      <div className="member-info">
        <h2 className="member-name" style={{ opacity: isAnimating ? 0 : 1 }}>
            {streams[currentIndex]?.title}
        </h2>
      </div>

      <div className="dots">
        {streams.map((stream, index) => (
          <div
            key={stream.id}
            className={`dot ${index === currentIndex ? "Active" : ""}`}
            data-index={index}
            onClick={() => updateCarousel(index)}
          />
        ))}
      </div>
    </div>
  );
}

function Badge({badgeIcon}) {
    return (
      <div className="badge">
        <div className="badge-icon"></div>
        <span>{badgeIcon}</span>
      </div>
    )
}

function Stream({key, index, id ,description, jobs, url, cardClass, isExpanded, onCardClick, onExpandClick}) {
  return (
    <div
      className={`card ${cardClass} ${isExpanded ? "active" : ""}`}
      data-index={id}
      onClick={onCardClick}
    >
      <img src={url} alt={id} />
      
      {isExpanded && <div className="slide-content">
        <div className="car-subtitle">{description}</div>
        
        <div className="performance-badges">
          {jobs.map((job) => {
            return (
              <Badge badgeIcon={job} />
            )
          })}
        </div>
      </div>}
      
      <div
        className={isExpanded ? "minus-button" : "add-button"}
        onClick={(e) => {
          e.stopPropagation();
          onExpandClick();
        }}
      ></div>
    </div>
  );
}

