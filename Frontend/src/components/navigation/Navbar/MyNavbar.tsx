import { Fragment, useContext } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from 'src/configs/routeNames';
import { HomeModernIcon } from '@heroicons/react/20/solid';
import { AuthContext } from 'src/contexts/AuthContext';
import AvatarPlaceholder from 'src/components/UI/Avatar/Avatar';
import { joinClassNames } from 'src/shared/utility';

const navigation = [
  { name: 'Home', to: ROUTES.HOME },
  { name: 'Search', to: ROUTES.SEARCH },
  {
    name: 'Sign in',
    to: ROUTES.LOGIN,
    margin: 'true',
  },
  { name: 'Sign up', to: ROUTES.SIGN_UP },
];

const authedNavigation = [
  { name: 'Home', to: ROUTES.HOME },
  { name: 'Search', to: ROUTES.SEARCH },
  {
    name: 'Add Listing',
    to: ROUTES.CREATE_LISTING,
    margin: 'true',
  },
  { name: 'My Interests', to: ROUTES.MY_INTERESTS },
];

const profileNavigation = [
  { name: 'My Profile', to: ROUTES.MY_PROFILE },
  { name: 'My Listings', to: ROUTES.MY_LISTINGS },
];

interface MyNavbarProps {
  variant?: 'auth' | 'default';
}

const MyNavbar: React.FC<MyNavbarProps> = ({ variant }) => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  return (
    <Disclosure
      as="nav"
      className={`absolute w-full min-w-full bg-transparent bg-thistle py-3 ${
        variant !== 'auth' ? 'z-1' : ''
      }`}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <NavLink to="/">
                    <div className="rounded-full bg-primary-100 p-3">
                      <span className="sr-only">Logo</span>
                      <HomeModernIcon className="h-7 w-auto text-primary sm:h-9" />
                    </div>
                  </NavLink>
                </div>
                <div className="hidden flex-1 items-center sm:ml-6 sm:flex">
                  {variant !== 'auth' && (
                    <div className="flex flex-1 items-center space-x-4 lg:pl-20">
                      {[...(!!user ? authedNavigation : navigation)].map(
                        (item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) =>
                              joinClassNames(
                                isActive
                                  ? 'bg-primary-600 text-white'
                                  : 'text-gray-800 hover:bg-primary-100 hover:bg-opacity-50',
                                'rounded-md px-3 py-2 text-sm font-medium  ',
                                item?.margin ? 'sm:!ml-auto' : ''
                              )
                            }
                          >
                            {item.name}
                          </NavLink>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                {!!user && (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full border-2 border-primary-400 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-200">
                        <span className="sr-only">Open user menu</span>
                        {user?.avatar ? (
                          <div className="inline-block h-9 w-9 overflow-hidden rounded-full bg-gray-100">
                            <img
                              src={user?.avatar}
                              className="h-full w-full object-cover"
                              alt="your avatar"
                            />
                          </div>
                        ) : (
                          <AvatarPlaceholder className="max-h-9 max-w-[2.25rem] text-primary" />
                        )}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-[200] mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {profileNavigation.map((navItem) => (
                          <Menu.Item key={navItem.name}>
                            <NavLink
                              to={navItem.to}
                              className={({ isActive }) => {
                                return joinClassNames(
                                  isActive
                                    ? 'bg-primary-400 text-white'
                                    : 'hover:bg-primary-100',
                                  'block bg-white px-4 py-2 text-sm text-gray-800'
                                );
                              }}
                            >
                              {navItem.name}
                            </NavLink>
                          </Menu.Item>
                        ))}
                        <Menu.Item
                          as="button"
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                          className={
                            'w-full bg-white px-4 py-2 text-left text-sm text-gray-800 file:block hover:bg-primary-100'
                          }
                        >
                          Sign Out
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {[...(!!user ? authedNavigation : navigation)].map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    joinClassNames(
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )
                  }
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default MyNavbar;
