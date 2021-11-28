import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppContainer from './app/containers/AppContainer';

function App() {
  return (
    <div className="App">
      <Router>
        <AppContainer />
      </Router>
    </div>
  );
}

export default App;
