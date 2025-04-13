import './App.css';

function App() {
  return (
    <div className="App">
      <div className = "Top"> 
      <nav className="navbar">
        <div className="logo">HMCHAT</div>
        <ul className="nav-links">
        {['Home', 'About'].map((text) => (
          <li key={text}>
            <a href={`#${text.toLowerCase()}`}>{text}</a>
          </li>
        ))}
          </ul>
        </nav>
      </div>
    
    </div>
  );
}

export default App;
