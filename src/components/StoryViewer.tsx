import { useEffect, useState } from 'react';
import { Story } from '../types';

interface StoryViewerProps {
  stories: Story[];
  initialStory: Story;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialStory, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(stories.findIndex((s) => s.id === initialStory.id));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // 5s = 5000ms / 100ms = 50 steps, 2% each
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const width = e.currentTarget.offsetWidth;
    const tapX = e.clientX - e.currentTarget.getBoundingClientRect().left;
    if (tapX < width / 3) {
      handlePrevious();
    } else if (tapX > (2 * width) / 3) {
      handleNext();
    }
  };

  const currentStory = stories[currentIndex];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'black',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handleTap}
    >
      {/* Progress Bars */}
      <div style={{ width: '100%', padding: '10px 5px', display: 'flex', gap: '3px' }}>
        {stories.map((story, index) => (
          <div
            key={story.id}
            style={{
              flex: 1,
              height: '2px',
              background: index < currentIndex ? '#fff' : '#555',
              borderRadius: '2px',
              position: 'relative',
            }}
          >
            {index === currentIndex && (
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: '#fff',
                  borderRadius: '2px',
                  transition: 'width 0.1s linear',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Story Image */}
      <img
        src={currentStory.imageUrl}
        alt={`Story ${currentStory.id}`}
        style={{
          width: '100%',
          height: 'calc(100% - 50px)', // Leave space for progress bars
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isTransitioning ? 0 : 1,
        }}
      />

      {/* Tap Zone Overlays (Optional Visual Cues) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '33%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.3')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '0')}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '33%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.3')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '0')}
      />

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        ×
      </button>
    </div>
  );
};

export default StoryViewer;