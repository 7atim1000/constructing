import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' ;
import MainLayout from "./pages/ar/MainLayout";

import PrivateRouter from './components/PrivateRouter';
import Login from './pages/ar/Login';
import Signup from './pages/ar/Signup';
import Units from './pages/ar/Units';
import Contacts from './pages/ar/Contacts';
import Categories from './pages/ar/Categories';

import Dashboard from './pages/ar/Dashboard'
import Projects from './pages/ar/Projects';


function App() {
  return (
    <Router>
      <Routes>

      {/* Public pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path= '/' element= {<ARHome />}/>
            <Route path= '/ar-home' element= {<ARHome />}/> */}


      
      {/* Main Layout */}
            <Route element={<MainLayout />}>

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="/units"
                    element={<Units />}
                />
                <Route
                    path="/contacts"
                    element={<Contacts />}
                />
                <Route
                    path="/items"
                    element={<Categories />}
                />
                <Route
                    path="/projects"
                    element={<Projects />}
                />

            </Route>

        
      </Routes>
     
    </Router>
  );
}

export default App ;


