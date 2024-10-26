/* eslint-disable react/prop-types */
import { useState } from 'react';
// import supabase from '../utils/supabase'; // Assuming the Supabase client is set up here
import axios from 'axios'; // For Admin Sign-In/Sign-Up requests

export default function SignIn({setAuth}) {
  const [voterEmail, setVoterEmail] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isRegisteringAdmin, setIsRegisteringAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const updateAuth = (authState) => {
    setAuth(authState);
    localStorage.setItem("auth", JSON.stringify(authState));
  };

  // Voter Email Sign-In Handler
  const handleVoterSignIn = async (e) => {
    e.preventDefault();
    try {
      // API call to retrieve voter ID using email
      const response = await fetch(`${serverUrl}/api/voter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: voterEmail }),
      });
  
      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.json();
        setMessage('Error: ' + (errorData.error || 'Failed to retrieve voter ID'));
        return;
      }
  
      const data = await response.json();
      const voterId = data.voter_id; // Get the voter ID from the response
      localStorage.setItem("voter_id", voterId)
      // Optionally, handle voterId (e.g., store it or use it as needed)
      console.log('Voter ID:', voterId);
  
      // Proceed with sign-in process
      // const { error } = await supabase.auth.signInWithOtp({ email: voterEmail });
      // if (error) {
        //   setMessage('Error signing in: ' + error.message);
      //   return;
      // } else {
      //   setMessage('Check your email for the login link.');
      // }
  
      setVoterEmail('');
      updateAuth({
        isAuthenticated: true,
        role: "voter",
        voterId: voterId, // Optionally include voterId in auth state
      });
    } catch (error) {
      setMessage('Error signing in: ' + error.message);
    }
  };
  

  // Admin Sign-Up Handler
  const handleAdminSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serverUrl}/api/admin/create`, {
        username: adminUsername,
        password: adminPassword,
      });

      if (response.status != 200) {
        setMessage('Error signing in: ' + response.data.error);
        return;
      }


      updateAuth({
        isAuthenticated: true,
        role: "admin",
      });

      setMessage('Admin account created successfully. You can now sign in.');
    } catch (error) {
      setMessage('Error registering admin: ' + error.response?.data?.error || error.message);
    }
  };

  // Admin Sign-In Handler
  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    try {
      console.log(adminUsername, adminPassword);
      const response = await axios.post(`${serverUrl}/api/admin/login`, {
        username: adminUsername,
        password: adminPassword,
      });

      if (response.status != 200) {
        setMessage('Error signing in: ' + response.data.error);
        return;
      }

      // const data = await response.json();
      // const admin_id = data.admin_id; // Get the voter ID from the response
      // localStorage.setItem("admin_id", admin_id)
      
      updateAuth({
        isAuthenticated: true,
        role: "admin",
        // adminId: admin_id
      });
      setMessage('Signed in as Admin successfully.');
    } catch (error) {
      setMessage('Error signing in: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign In as Voter or Admin
        </h2>
        {message && <div className="text-center text-red-500">{message}</div>}

        {/* Voter Email Sign-In */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Voter Sign-In</h3>
          <form onSubmit={handleVoterSignIn}>
            <div className="mb-4">
              <label htmlFor="voterEmail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="voterEmail"
                value={voterEmail}
                onChange={(e) => setVoterEmail(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Admin Sign-In/Sign-Up */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Admin {isRegisteringAdmin ? 'Sign-Up' : 'Sign-In'}</h3>
          <form onSubmit={isRegisteringAdmin ? handleAdminSignUp : handleAdminSignIn}>
            <div className="mb-4">
              <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="adminUsername"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isRegisteringAdmin ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <div className="text-sm mt-4 text-center">
            <button
              className="text-indigo-600 hover:text-indigo-500"
              onClick={() => setIsRegisteringAdmin(!isRegisteringAdmin)}
            >
              {isRegisteringAdmin ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
