import { useEffect, useState } from 'react';
import { Story } from '../types';

interface StoryListProps {
  onStorySelect: (story: Story) => void;
}

const StoryList: React.FC<StoryListProps> = ({ onStorySelect }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/stories.json')
      .then((response) => response.json())
      .then((data: Story[]) => {
        setStories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching stories:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading stories...</div>;

  return (
    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px' }}>
      {stories.map((story) => (
        <img
          key={story.id}
          src={story.imageUrl}
          alt={`Story ${story.id}`}
          style={{ width: '60px', height: '100px', marginRight: '10px', cursor: 'pointer' }}
          onClick={() => onStorySelect(story)}
        />
      ))}
    </div>
  );
};

export default StoryList;