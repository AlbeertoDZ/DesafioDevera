import Login from './components/Login/Login'
import './App.css'
import Home from "./components/Home/Home";
import OnboardingContainer from './components/Onboarding/OnboardingContainer';


function App() {
  return (
    <div className="App">
      <Login />
      <Home />
      <OnboardingContainer />
    </div>
  )
}

export default App
