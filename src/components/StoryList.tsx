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
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px' }}>
        {Array(3).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              width: '60px',
              height: '100px',
              marginRight: '10px',
              background: '#ccc',
              display: 'inline-block',
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
    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px' }}>
      {stories.map((story) => (
        <img
          key={story.id}
          src={story.imageUrl}
          alt={`Story ${story.id}`}
          style={{ width: '60px', height: '100px', marginRight: '10px', cursor: 'pointer', borderRadius: '8px' }}
          onClick={() => onStorySelect(story)}
        />
      ))}
    </div>
  );
};

export default StoryList;