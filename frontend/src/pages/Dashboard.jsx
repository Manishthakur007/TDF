import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">Creator Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.username}!</p>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/create-post"
            className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
          >
            + New Recipe
          </Link>
          <button 
            onClick={logout}
            className="px-6 py-2 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-gray-400 mb-2">Total Recipes</h3>
          <p className="text-4xl font-serif font-bold text-primary">0</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-gray-400 mb-2">Total Views</h3>
          <p className="text-4xl font-serif font-bold text-primary">0</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-gray-400 mb-2">Total Likes</h3>
          <p className="text-4xl font-serif font-bold text-primary">0</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-serif mb-4">Your Published Recipes</h2>
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
        <p className="text-gray-400 mb-4">You haven't published any recipes yet.</p>
        <Link to="/create-post" className="text-primary hover:underline">
          Write your first recipe →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
