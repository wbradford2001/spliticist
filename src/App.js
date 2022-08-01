import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import ContactPage from './pages/Contact';
import EditPage from './pages/EditPage'
import HomePage from './pages/HomePage'


function App() {
  return (
    <div>
      <Router>
        <NavigationBar/>
        <Routes>
          <Route path='' element = {<HomePage/>}/>
          <Route path='Edit' element = {<EditPage/>}/>
          <Route path='Contact' element = {<ContactPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
