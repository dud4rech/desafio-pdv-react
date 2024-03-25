import logo from "../imgs/logo.png";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
    const [activeLink, setActiveLink] = useState('');
      
    const handleLinkClick = (link) => {
          setActiveLink(link);
    };

    return (
        <div className="min-h-screen flex flex-row">
           <div className="flex flex-col rounded-r overflow-hidden bg-slate-900 shadow-lg w-60">
            <div className="flex items-center w-56 justify-center h-1/6 pl-4 transform hover:scale-105 ease-in duration-500">
                <NavLink to="/" onClick={() => handleLinkClick('')}>
                    <img src={logo}/>
                </NavLink>
            </div>
            <ul className="flex flex-col text-gray-100">
                <li>
                    <NavLink className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-300 text-gray-400 hover:text-gray-10 active" to="/cart">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-home"></i></span>
                        <span className={activeLink === 'cart' ? 'active' : 'notActive'} onClick={() => handleLinkClick('cart')}>Shopping Cart</span>
                    </NavLink>
                    <NavLink className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-300 text-gray-400 hover:text-gray-100 active" to="/products">
                        <span className="inline-flex items-center justify-center h-12 w-12"><i className="bx bx-home"></i></span>
                        <span className={activeLink === 'products' ? 'active' : 'notActive'} onClick={() => handleLinkClick('products')}>Products</span>
                    </NavLink>
                    <NavLink className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-300 text-gray-400 hover:text-gray-100 focus:text-white" to="/categories">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400 focus:outline-none focus:ring focus:ring-violet-300"><i className="bx bx-home"></i></span>
                        <span className={activeLink === 'categories' ? 'active' : 'notActive'} onClick={() => handleLinkClick('categories')}>Categories</span>
                    </NavLink>
                    <NavLink className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-300 text-gray-400 hover:text-gray-100 focus:text-white" to="/history">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-home"></i></span>
                        <span className={activeLink === 'history' ? 'active' : 'notActive'} onClick={() => handleLinkClick('history')}>History</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    </div>
)};

export default Sidebar;