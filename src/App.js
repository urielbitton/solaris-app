import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppContainer from './app/containers/AppContainer';
import StoreContextProvider from './app/store/store'

function App() {
  return (
    <div className="App">
      <StoreContextProvider>
        <Router>
          <AppContainer />
        </Router>
      </StoreContextProvider>
    </div>
  );
} 

export default App;
