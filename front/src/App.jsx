import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import Products from "./pages/ProductsPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import HistoryPage from "./pages/HistoryPage";
import NoPage from "./pages/NoPage";

function App() {
  const [cartProducts, setCartProducts] = useState([]);
  
  return (
    <div className="flex bg-slate-300">
          <BrowserRouter>
          <Sidebar/>
          <Routes>
            <Route>
              <Route path="/" element={<HomePage setCartProducts={setCartProducts} cartProducts={cartProducts}/>} />
              <Route path="/products" element={<Products />} />
              <Route className="col-span-5" path="/categories" element={<CategoriesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/cart" element={<ShoppingCartPage setCartProducts={setCartProducts} cartProducts={cartProducts}/>} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;