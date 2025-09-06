import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
            }`}
          />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black-500 bg-opacity-25 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            💕 Elena's App 💕
          </h2>
          
          <nav className="space-y-4">
            <Link
              to="/"
              onClick={closeMenu}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                location.pathname === '/'
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl mr-3">📅</span>
              <span className="font-medium">Dates List</span>
            </Link>
            
            <Link
              to="/map"
              onClick={closeMenu}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                location.pathname === '/map'
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl mr-3">🗺️</span>
              <span className="font-medium">Map View</span>
            </Link>
          </nav>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Made with 💖 for Elena
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default BurgerMenu
