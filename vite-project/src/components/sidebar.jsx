// Sidemenu.jsx
import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Home, User, UserPlus, ClipboardList, Menu as MenuIcon, X, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidemenu = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Check if the current path matches the menu item path
  const isActive = (path) => location.pathname === path;

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth'); // Remove the auth token from local storage
    navigate('/signin'); // Redirect to login page
  };

  return (
    <div className="relative border-r border-gray-200 h-screen">
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
            {collapsed ? 'Tru' : 'TRUVote'}
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
            className={`px-4 py-2 ${isActive('/') ? 'bg-blue-50' : ''}`}
            onClick={() => navigate('/')}
          >
            <span className="text-sm font-medium">Overview</span>
          </MenuItem>
          <MenuItem 
            icon={<User className="w-5 h-5" />}
            className={`px-4 py-2 ${isActive('/voter') ? 'bg-blue-50' : ''}`}
            onClick={() => navigate('/voter')}
          >
            <span className="text-sm font-medium">Voter</span>
          </MenuItem>
          <MenuItem 
            icon={<UserPlus className="w-5 h-5" />}
            className={`px-4 py-2 ${isActive('/candidate') ? 'bg-blue-50' : ''}`}
            onClick={() => navigate('/candidate')}
          >
            <span className="text-sm font-medium">Candidate</span>
          </MenuItem>
          <MenuItem 
            icon={<ClipboardList className="w-5 h-5" />}
            className={`px-4 py-2 ${isActive('/conduct') ? 'bg-blue-50' : ''}`}
            onClick={() => navigate('/conduct')}
          >
            <span className="text-sm font-medium">Conduct</span>
          </MenuItem>

          <MenuItem 
            icon={<LogOut className="w-5 h-5" />}
            className="px-4 py-2 mt-auto text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <span className="text-sm font-medium">Logout</span>
          </MenuItem>
        
        </Menu>
      </Sidebar>
    </div>
  );
};

export default Sidemenu;