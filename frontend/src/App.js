
import {useRoutes } from 'react-router-dom';
import approuter from './components/AppRouter'

function App() {
  const router = useRoutes(approuter);
    return (
      <div className="App">
        {router}
        <div>app is working</div>
      </div>
    );
  }

export default App;
