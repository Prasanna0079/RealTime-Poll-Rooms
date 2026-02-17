import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Poll from './pages/Poll';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poll/:shareLink" element={<Poll />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
