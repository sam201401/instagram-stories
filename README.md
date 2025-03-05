# Instagram Stories

A simplified Instagram Stories feature built with React.js and TypeScript.

## Deployment Link
- [Live Demo](https://instagram-stories-three.vercel.app/) 

## Setup and Running
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sam201401/instagram-stories.git
   cd instagram-stories
   npm install
   npm run dev
   Open http://localhost:5173 in a mobile browser or emulator.
   npm run test:e2e
   Requires Playwright installed (npx playwright install).
   
Design Choices
Performance: Stories are fetched once from stories.json and stored in state. Images use objectFit: 'cover' for efficient rendering.
Scalability: Modular components (StoryList, StoryViewer) allow easy extension (e.g., adding usernames).
UX: Instagram-like UI with circular thumbnails, progress bars, and tap navigation for an intuitive mobile experience.
Testing: Playwright E2E tests ensure core functionality (list loading, auto-advance, taps).


