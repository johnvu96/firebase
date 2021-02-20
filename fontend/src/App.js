import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
function App() {
  return (
    <Router>
    <div>
       <Switch>
           <Route exact path="/login" component={Login}/>
           <Route exact path="/signup" component={SignUp}/>
           <Route exact path="/" component={Home}/>
       </Switch>
    </div>
</Router>
  );
}

export default App;
