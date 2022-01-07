import './App.css';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import '@ionic/react/css/core.css';

function App() {
  return (
    <>
      
      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/register' component={Register} />
          <ProtectedRoute exact path="/home" component={Home} />
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
          <ProtectedRoute exact path="/about" component={About} />
          <Route path="*" component={() => "404 NOT FOUND"} />
        </Switch>
        
      </Router>
      
      
      
      
    </>
  );
}

export default App;
