import './i18n';
import Planning from "./redux/containers/Planning"
import PlanningBanner from "./redux/components/PlanningBanner"
import { Provider } from 'react-redux'
import store from './redux/store'
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <PlanningBanner />
        <Planning />
      </div>
    </Provider>
  );
}

export default App;
