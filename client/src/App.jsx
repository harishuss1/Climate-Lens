import './App.css';
import co2Logo from '/co2.svg';
import View1 from './components/View1.jsx';
function App() {

  return (
    
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src={co2Logo} className="logo" alt="co2 logo" />
      </a>
      <View1/>
    </div>
      
    
  );
}

export default App;
