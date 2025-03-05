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

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 5000); // Auto-advance after 5 seconds

    return () => clearTimeout(timer);
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
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleTap}
    >
      <img
        src={currentStory.imageUrl}
        alt={`Story ${currentStory.id}`}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isTransitioning ? 0 : 1,
        }}
      />
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', color: 'white' }}>
        Close
      </button>
    </div>
  );
};

export default StoryViewer;