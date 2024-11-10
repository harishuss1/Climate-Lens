import './App.css';
import View1 from './components/View1.jsx';
import View2 from './components/View2.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

function App() {

  return (
    
    <div id="app-container">
      <Header />
      <section className="page-section">
        <View1 />
      </section>
      <section className="page-section">
        <View2 />
      </section>
      <Footer />
    </div>
  );
}

export default App;
