import './App.css';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import '@ionic/react/css/core.css';

function App() {
  return (
    <>
      
      <Router>
        <Switch>
          <Route path='/home' component={Home} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/about' component={About} />
          <Route path='/' exact component={Login} />
          <Route path='/register' component={Register} />
        </Switch>
        
      </Router>
      
      
      
      
    </>
  );
}
/* <Header />
      <Route exact path="/" component={Home} />
      <Route exact path="/Register" component={Register} />
      <Route exact path="/Feature1" component={Feature1} />
      <Route exact path="/Feature2" component={Feature2} />
      <Route exact path="/Feature3" component={Feature3} />
      <Route exact path="/About" component={About} />
      <Route exact path="/Myaccount" component={Myaccount} />
      <Route exact path="/Profile" component={Profile} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Logout" component={Logout} /> */



export default App;
