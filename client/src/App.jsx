import './App.css';
import co2Logo from '/co2.svg';
import TemperatureStub from './TemperatureStub';
function App() {

  return (
    
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src={co2Logo} className="logo" alt="co2 logo" />
      </a>
      <TemperatureStub />
    </div>
      
    
  );
}

export default App;
