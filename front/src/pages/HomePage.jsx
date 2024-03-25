import { useState, useEffect } from "react";
import axiosInstance from "../helper/axios-instance";
import Button from "../components/Button";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function HomePage ({setCartProducts, cartProducts}) {
    const [rerender, setRerender] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(cartProducts);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let response = await axiosInstance.get(
                    "products/select.php"
                );
                if(response.data.length !== 0) setIsActive(true);
                setProducts(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
                setRerender(false);
            }
        };
        fetchProducts();
        }, [rerender]);
    
    const getData = (data) => {
        const selected = data;
        setSelectedProducts([...selectedProducts, selected]);
    };
    setCartProducts(selectedProducts);

    if(loading) return <div>Loading...</div>

    if(error) return <div>{error}</div>

    return (
        <div className="flex flex-col m-16">
            <Card products={products} cart={selectedProducts} onClick={getData}/>
            <Link to="/cart">
                {isActive ? <div className="w-fit m-7"><Button primary >Go to cart<FaShoppingCart className="ml-3"/></Button></div> : 'Your local store does not have any products yet. Lets add some of them! **First you need to create a category for it**'}
            </Link>
        </div>
    )
};
  
export default HomePage;