import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import StoreContextProvider from './app/store/store'
import AppSwitcher from './AppSwitcher';

function App() {
  return (
    <div className="App">
      <StoreContextProvider>
        <Router>
          <AppSwitcher />
        </Router>
      </StoreContextProvider>
    </div>
  );
} 

export default App;
