import { useState } from "react";
import { LoginPage } from "./LoginPage";
import { Dashboard } from "./Dashboard";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}





// Bootstrap code
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Login from './Login';
// import Signup from './Signup';
// import './App.css'; // Import your custom CSS

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/" element={<Login />} /> {/* Default route */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;