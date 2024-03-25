import Button from "../components/Button";
import Display from "../components/Display";
import { useEffect, useState } from "react";
import axiosInstance from "../helper/axios-instance";

function ShoppingCartPage ({setCartProducts, cartProducts}) {
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [orderCode, setOrderCode] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [products, setProducts] = useState([]);

    const calculateTotalAndTaxCart = () => {
        cartProducts.map((item) => {
            setTotal((total) => total + item.itemPrice);
            setTax((tax) => tax + item.itemTax);
        })
    };

    const registerDate = () => {
        const date = new Date;
        return (`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
    };

    
    useEffect(() => {
        const getProducts = async () => {
            await axiosInstance.get("products/select.php")
            .then(res => {
                setProducts(res.data);
            }
        )};

        const getCode = async () => {
            await axiosInstance.get("history/select.php")
            .then(res => {
                setOrderCode(res.data.length + 1);
            }
        )};

        if(cartProducts.length !== 0) setIsActive(true);

        window.addEventListener("beforeunload", () => {
        });

        getProducts();
        getCode();
        getUpdate();
        setTotal(0);
        setTax(0);
        calculateTotalAndTaxCart();
    }, []);

    const addData = async () => {
        const date = registerDate();

        await axiosInstance.post("history/insert.php", {date, tax, total})
            .catch(err => {
                setError(err);
        });

        await cartProducts.map((item) => {
            item.orderCode = orderCode;
            axiosInstance.post("home/insert.php", item)
            .catch(err => {
                setError(err);
            })
        });  
        getUpdate();
        setCartProducts([]);
        setIsActive(false);
        localStorage.clear();
        alert("Your items have been purchased!");
    };

    const handleUpdate = (id, amount) => {
        axiosInstance.put(`products/update.php?id=${id}`, {amount})
        .catch(err => {
            console.log(err);
        })
    };

    const handleCancel = () => {
        setCartProducts([]);
        setIsActive(false);
        alert("Your shopping cart is empty.");
    };

    const getData = (data) => {
        setCartProducts(data);
    };

    const getUpdate = () => {
        products.map(product => { 
        cartProducts.map(item => { 
            if(product.code == item.code) {
                const newAmount = product.amount - item.amount;
                handleUpdate(product.code, newAmount);
            }
        })
    })};

    if(error) return <div>{error}</div>;

    return (
        <div className="flex flex-col m-10">
            <div className="font-medium text-2xl py-2">Shopping Cart</div>
            {isActive ? <div>
                <Display data={cartProducts} onClick={getData}/> 
                <div className="flex flex-col bottom-16 border-2 p-2 w-fit ">
                <div className="text-medium font-medium">Total price: ${total.toFixed(2)}</div>
                <div className="text-medium font-medium">Total tax: ${tax.toFixed(2)}</div>
            </div>
            <div className="flex flex-row bottom-0">
                <div className="mx-1"><Button primary onClick={addData}>Finish</Button></div>
                <div className="mx-1"><Button secondary onClick={handleCancel}>Cancel</Button></div>
            </div>
            </div> : "Your shopping cart is empty."}

        </div>
    )
};
  
export default ShoppingCartPage;