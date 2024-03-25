import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Table from "../components/Table.jsx";
import Dropdown from "../components/Dropdown.jsx";
import trashBin from "../imgs/delete.png"
import { useState, useEffect } from "react";
import axiosInstance from "../helper/axios-instance.js";

function ProductsPage () {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [rerender, setRerender] = useState(false);
    const [selection, setSelection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isActiveProducts, setIsActiveProducts] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [categoryName, setCategoryName] = useState('');
    const [categoryCode, setCategoryCode] = useState('');
    const [categoryTax, setCategoryTax] = useState('');

     useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let response = await axiosInstance.get(
                    "products/select.php"
                );
                if(response.data.length !== 0) setIsActiveProducts(true);
                setProducts(response.data);
            } catch (error) {
                console.log(error);
                setError(error.message);
            } finally {
                setLoading(false);
                setRerender(false);
            }
        };
        fetchProducts();
    }, [rerender]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let response = await axiosInstance.get(
                    "categories/select.php"
                );
                const data = response.data;
                if(data.length !== 0) setIsActive(true);
                const categoryName = data.map((item) => { 
                    return item.name;
                });
                setCategories(categoryName);

                const categoryCode = data.map((item) => {
                     return item.code; 
                });
                setCategoryCode(Number(categoryCode));

                const categoryTax = data.map((item) => {
                    return item.tax; 
               });
               setCategoryTax(Number(categoryTax));
            } catch (error) {
                console.log(error);
                setError(error.message);
            } finally {
                setLoading(false);
                setRerender(false);
            }
        };
        fetchProducts();
    }, []);

    const addData = async () => {
        if(name == null || amount == null || price == null) {
            alert("Please fill all the input areas.")
        } else {
            await axiosInstance.post("products/insert.php", { name, amount, price, categoryName, categoryCode, categoryTax });
            alert("Product added!");
            setRerender(true);
        }
    };

    const handleDelete = async (e) => {
       let id = e.target.id;
        try {
            await axiosInstance.delete(`products/delete.php?id=${id}`);
            setProducts(
                products.filter((product) => {
                    return product.id !== id;
                })
             );
             setRerender(true);
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    const handleSelect = (option) => {
        setSelection(option);
        setCategoryName(option);
    };

    const config = [
        { 
            label: 'Code', 
            render: (product) => product.code,
        },
        { 
            label: 'Product',
            render: (product) => product.name,
        },
        { 
            label: 'Amount',
            render: (product) => product.amount || 0,
        },
        { 
            label: 'Unit Price',
            render: (product) => `$${Number(product.price).toFixed(2)}`,
        },
        { 
            label: 'Category',
            render: (product) => product.category_name,
        },
        {
            label: '',
            render: (product) => <Button icon><img id={product.code} onClick={handleDelete} src={trashBin}/></Button>,
        }
    ];

    if(loading) return <div>Loading...</div>

    if(error) return <div>{error}</div>

    return (
        <div className="flex flex-row m-16 w-full">
            <div className="flex flex-col w-full mx-16 my-5" >
                <div className="flex flex-col items-center bg-white/60 z-10 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-10">
                <div className="flex flex-row w-full">
                    <Input primary name={"name"} type={"text"} placeholder={"Product"} onChange={(e) => setName(e.target.value)}/>
                    <Input primary name={"amount"} type={"number"} placeholder={"Amount"}  min={1} onChange={(e) => setAmount(e.target.value)}/>
                    <Input primary name={"price"} type={"number"} placeholder={"Unit Price"}  min={1} onChange={(e) => setPrice(e.target.value)}/>
                    <Dropdown value={selection} data={categories} onChange={handleSelect}/>
                </div>
                <div className="w-full m-2"> 
                    <Button primary id={"add"} onClick={() => addData()}>Add product</Button>
                </div>
            </div>
            {isActiveProducts ? <div className="shadow-md rounded-lg mt-10"><Table primary config={config} data={products}></Table></div> : 'Lets add some new products for your local store. **First you need to create a category for it**'}
        </div>
    </div>     
    )
};
  
export default ProductsPage;