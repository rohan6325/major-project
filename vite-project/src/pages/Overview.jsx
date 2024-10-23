import React from 'react';
import Sb from '../components/sidebar.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VotingDashboard = () => {
  const votingData = [
    { name: 'C1', votes: 10 },
    { name: 'C2', votes: 5 },
    { name: 'C3', votes: 7 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sb /> */}
      <div className="flex-1 overflow-hidden">
        <main className="p-8">
          <div className="rounded-xl bg-white shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">Voting Statistics</h2>
            
            <div className="h-[400px] w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={votingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-blue-50 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Total Voters
                </h3>
                <p className="text-3xl font-bold text-blue-600">10</p>
              </div>
              <div className="rounded-xl bg-green-50 p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Voters Voted
                </h3>
                <p className="text-3xl font-bold text-green-600">5</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VotingDashboard;