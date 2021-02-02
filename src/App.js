import './i18n';
import Planning from "./redux/containers/Planning"
import PlanningBanner from "./redux/components/PlanningBanner"
import Footer from "./redux/components/Footer"
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
      <Footer />
    </Provider>
  );
}

export default App;
