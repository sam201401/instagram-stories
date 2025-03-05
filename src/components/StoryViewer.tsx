import { useEffect, useState } from 'react';
import { Story } from '../types';

interface StoryViewerProps {
  stories: Story[];
  initialStory: Story;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialStory, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = stories.findIndex((s) => s.id === initialStory.id);
    console.log('Initial story ID:', initialStory.id, 'Found index:', index);
    return index === -1 ? 0 : index;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log('Starting auto-advance at index:', currentIndex);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2; // 5s = 5000ms / 100ms = 50 steps
        return newProgress > 100 ? 100 : newProgress; // Cap at 100
      });
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval); // Stop progress
      if (currentIndex < stories.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => {
            const next = prev + 1;
            console.log('Advancing to index:', next, 'Image:', stories[next].imageUrl);
            return next;
          });
          setIsTransitioning(false);
        }, 300);
      } else {
        onClose();
      }
    }, 5000); // Advance after exactly 5s

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentIndex, stories, onClose]);

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
      <img
        src={currentStory.imageUrl}
        alt={`Story ${currentStory.id}`}
        style={{
          width: '100%',
          height: 'calc(100% - 50px)',
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isTransitioning ? 0 : 1,
        }}
      />
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