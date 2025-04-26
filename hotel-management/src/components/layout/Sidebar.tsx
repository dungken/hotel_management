import { NavLink } from 'react-router-dom';
import { hasRole } from '../../utils/auth.utils';

const Sidebar = () => {
  const isAdmin = hasRole('ADMIN');

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Rooms', path: '/rooms', icon: '🛏️' },
    { name: 'Bookings', path: '/booking', icon: '📅' },
    { name: 'Customers', path: '/customers', icon: '👥' },
    { name: 'Payments', path: '/payments', icon: '💰' },
  ];

  return (
    <aside className="bg-white shadow-md w-64 min-h-screen">
      <nav className="px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}

          {isAdmin && (
            <li className="mb-2">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3">👑</span>
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
