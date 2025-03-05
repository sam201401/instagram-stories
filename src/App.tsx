import { useState } from 'react';
import StoryList from './components/StoryList';
import StoryViewer from './components/StoryViewer';
import { Story } from './types';
import './styles/App.css';

const App: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([]);

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
    if (stories.length === 0) {
      fetch('/stories.json')
        .then((response) => response.json())
        .then((data: Story[]) => setStories(data));
    }
  };

  return (
    <div className="App">
      <StoryList onStorySelect={handleStorySelect} />
      {selectedStory && stories.length > 0 && (
        <StoryViewer
          stories={stories}
          initialStory={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
};

export default App;