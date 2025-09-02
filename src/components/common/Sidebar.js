import React from 'react';

const Sidebar = ({ items, activeItem, onItemClick }) => {
  return (
    <div className="w-16 bg-white/90 backdrop-blur-sm shadow-xl h-full border-r border-ayur-light hover:w-64 transition-all duration-300 group">
      <div className="p-3 border-b border-ayur-light bg-gradient-to-r from-ayur-primary to-ayur-secondary text-white">
        <div className="flex items-center justify-center group-hover:justify-start group-hover:space-x-3 transition-all duration-300">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl text-ayur-primary">🌿</span>
          </div>
          <div className="hidden group-hover:block">
            <h2 className="text-xl font-bold">AyurSutra</h2>
            <p className="text-sm text-ayur-light">Wellness Portal</p>
          </div>
        </div>
      </div>
      <nav className="p-2 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center px-2 py-3 text-gray-700 hover:bg-ayur-light hover:text-ayur-primary rounded-xl transition-all duration-300 cursor-pointer group-hover:px-4 ${
              activeItem === item.id ? 'bg-gradient-to-r from-ayur-primary to-ayur-secondary text-white' : ''
            }`}
            onClick={() => onItemClick(item.id)}
            title={item.label}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <span className="ml-3 font-medium hidden group-hover:block">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;