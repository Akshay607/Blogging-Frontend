import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-700 px-4 py-2 w-full flex justify-between items-center sticky top-0 z-10">
      <div className="items-center">
        <h1 className="text-white text-2xl font-bold">
          <a href='/tweets'>My App</a>
        </h1>
      </div>
      <div className="flex items-center">
       
        <div className="relative">
          <FaUserCircle
            className="text-white cursor-pointer"
            size={24}
            onClick={toggleDropdown}
          />
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Settings
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export { Nav };
