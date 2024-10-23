import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, User, UserPlus, PieChart, Menu as MenuIcon, X } from 'lucide-react';

const VotingDashboard = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  
  const votingData = [
    { name: 'C1', votes: 10 },
    { name: 'C2', votes: 5 },
    { name: 'C3', votes: 7 },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="relative border-r border-gray-200">
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 z-10 rounded-full bg-white p-1.5 shadow-md border border-gray-200 hover:bg-gray-50"
        >
          {collapsed ? (
            <MenuIcon className="h-4 w-4 text-gray-600" />
          ) : (
            <X className="h-4 w-4 text-gray-600" />
          )}
        </button>

        <Sidebar 
          collapsed={collapsed} 
          rootStyles={{
            height: '100%',
            backgroundColor: 'white',
          }}
          breakPoint="md"
        >
          <div className="px-4 py-6">
            <h1 className={`text-xl font-bold text-blue-600 transition-all duration-200 ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? 'TV' : 'TRUEVote'}
            </h1>
          </div>
          <Menu
            menuItemStyles={{
              button: {
                backgroundColor: 'transparent',
                color: '#1e293b',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              },
            }}
          >
            <MenuItem 
              icon={<Home className="w-5 h-5" />}
              className="px-4 py-2"
            >
              <span className="text-sm font-medium">Overview</span>
            </MenuItem>
            <MenuItem 
              icon={<User className="w-5 h-5" />}
              className="px-4 py-2"
            >
              <span className="text-sm font-medium">Voter</span>
            </MenuItem>
            <MenuItem 
              icon={<UserPlus className="w-5 h-5" />}
              className="px-4 py-2"
            >
              <span className="text-sm font-medium">Candidate</span>
            </MenuItem>
            <MenuItem 
              icon={<PieChart className="w-5 h-5" />}
              className="px-4 py-2"
            >
              <span className="text-sm font-medium">Statistics</span>
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>

      <main className="flex-1 p-8">
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
  );
};

export default VotingDashboard;