import './App.css';
import co2Logo from '/co2.svg';
import View1 from './components/View1.jsx';
import View2 from './components/View2.jsx';

function App() {

  return (
    
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src={co2Logo} className="logo" alt="co2 logo" />
      </a>
      <View1/>
      <View2 />
    </div>
      
    
  );
}

export default App;
