import { useEffect, useState } from 'react';
import { Story } from '../types';

interface StoryListProps {
  onStorySelect: (story: Story) => void;
}

const StoryList: React.FC<StoryListProps> = ({ onStorySelect }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/stories.json')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch stories');
        return response.json();
      })
      .then((data: Story[]) => {
        setStories(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px 0' }}>
        {Array(10).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#ccc',
              display: 'inline-block',
              margin: '0 8px',
              animation: 'pulse 1.5s infinite',
            }}
          />
        ))}
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px 0', background: '#fff' }}>
      {stories.map((story) => (
        <div
          key={story.id}
          style={{
            display: 'inline-block',
            margin: '0 8px',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            padding: '3px',
            cursor: 'pointer',
            overflow: 'hidden', // Ensure content stays within circle
          }}
          onClick={() => onStorySelect(story)}
        >
          <img
            src={story.imageUrl}
            alt={`Story ${story.id}`}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover', // Crop to fill circle
              border: '2px solid #fff',
              display: 'block', // Remove any default spacing
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/70x70?text=Error'; // Fallback
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StoryList;