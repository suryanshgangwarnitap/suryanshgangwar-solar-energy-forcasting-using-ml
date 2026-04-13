import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Battery, 
  Settings, 
  BarChart3, 
  TrendingUp,
  Code,
  X,
  Sun
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentPath }) => {
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, visible: true },
    { name: 'Flow Chart', path: '/energy-flow', icon: Zap, visible: true },
    { name: 'Storage Analysis', path: '/battery', icon: Battery, visible: true },
    { name: 'Load Analysis', path: '/load', icon: BarChart3, visible: true },
    { name: 'Solar Prediction', path: '/forecast', icon: TrendingUp, visible: true },
    { name: 'Settings', path: '/settings', icon: Settings, visible: true },
    { name: 'Developer', path: '/developer', icon: Code, visible: false }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Sun className="text-yellow-400" />
            <h1 className="text-lg font-bold tracking-wide">Solar Forcasting</h1>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navigationItems.filter(item => item.visible).map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-yellow-400 text-black shadow-lg scale-[1.02]' 
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white'}
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <div className="bg-gray-700 rounded-xl p-3 text-sm text-gray-300">
            <p className="font-semibold text-white"></p>
            <p>Suryansh Gangwar</p>
            <p>521248,EEE</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;