import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login';
import Home from './home';
import Nav from './nav';
import Problem from './problem';
import Submissions from './submissions';
import { UserProvider } from './UserContext'; // Import the UserProvider

export default function App() {
  return (
    <UserProvider> {/* Wrap your app with UserProvider */}
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/problems/:id" element={<Problem />} />
          <Route path="/submissions/:id/:username" element={<Submissions />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
