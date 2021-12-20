import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import StoreContextProvider from './app/store/store'
import AppSwitcher from './AppSwitcher';
import ErrorBoundary from './app/utils/ErrorBoundary'

function App() {
  return (
    <div className="App">
      <StoreContextProvider>
        <Router>
          <ErrorBoundary>
            <AppSwitcher />
          </ErrorBoundary>
        </Router>
      </StoreContextProvider>
    </div>
  );
} 

export default App;
