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
  const [progress, setProgress] = useState(0); // Progress from 0 to 100%

  useEffect(() => {
    setProgress(0); // Reset progress on story change
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // Increment every 100ms (5s = 5000ms / 100 = 50 increments, but 2% per step for smoothness)
      });
    }, 100); // Update every 100ms

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
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleTap}
    >
      {/* Progress Bars */}
      <div style={{ width: '90%', display: 'flex', gap: '4px', position: 'absolute', top: '10px' }}>
        {stories.map((story, index) => (
          <div
            key={story.id}
            style={{
              flex: 1,
              height: '4px',
              background: index < currentIndex ? '#fff' : '#555',
              position: 'relative',
            }}
          >
            {index === currentIndex && (
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: '#fff',
                  transition: 'width 0.1s linear',
                }}
              />
            )}
          </div>
        ))}
      </div>

      <img
        src={currentStory.imageUrl}
        alt={`Story ${currentStory.id}`}
        style={{
          maxWidth: '100%',
          maxHeight: '90%',
          objectFit: 'cover', // Ensure proper aspect ratio
          transition: 'opacity 0.3s ease-in-out',
          opacity: isTransitioning ? 0 : 1,
        }}
      />
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
        }}
      >
        X
      </button>
    </div>
  );
};

export default StoryViewer;