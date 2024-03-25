import Button from "./Button";
import Picker from "./Picker";
import { useEffect, useState } from "react";
import img from '../imgs/background.jpeg';

function Card (props) {
    /* LocalStorage */
    const getLocalStorage = (item) => JSON.parse(localStorage.getItem(item)) ?? '';
    const setLocalStorageValue = (item, dbItems) => localStorage.setItem(item, JSON.stringify(dbItems));
    const [amount, setAmount] = useState(1);
    var storage;
   
    const getQty = (value) => {
        setAmount(value+1);
    };

    const inStore = (storage) => {
        if(amount > storage) {
            alert(`Error. The stock quantity for this product is: ${storage || 0}`);
            return 1;
        }
    };

    const updateLocalStorage = (id, newValue) => {
        if(newValue == 0) {
            alert('Error. The stock quantity for this product is: 0');
            return 0;
        } else {
            localStorage.removeItem(id)
        
            setLocalStorageValue(id, newValue);
            return 1;
        }   
    };

    
    const handleClick = (e) => {
        const id = e.target.id;
        const dbItems = getLocalStorage(id); 
     
        if(!dbItems[id] && storage !== 0) {
            storage = props.products[id].amount;
        } else {
            storage = getLocalStorage(id);
        };

        if(inStore(storage)) {
            return 1;
        };

        const newStorageQty = storage - amount;

        const code = props.products[id].code;
        const name = props.products[id].name;
        const price = Number(props.products[id].price).toFixed(2);
        const categoryTax = Number(props.products[id].category_tax).toFixed(2);
        const itemTax = (props.products[id].price * amount * props.products[id].category_tax) / 100;
        const itemPrice = (props.products[id].price * amount);

        if(updateLocalStorage(id, newStorageQty)) {
            props.onClick({code, name, amount, price, categoryTax, itemTax, itemPrice});
            alert("Item added!");
        }  
    };

    return (
        <div className="container mx-auto py-10 px-8 break-words">
            <div className="grid lg:grid-cols-3 gap-6">
            {props.products.map((card, index) => (
                <div key={index} className="shadow-lg rounded-lg bg-white p-5">
                    <div className="text-sm px-2 bg-blue-100 w-fit rounded-md uppercase" >{card.category_name}</div>
                    <img className="rounded-lg my-2 shadow" src={img} alt="" />
                    <div className="relative">
                        <h3 className="text-2xl font-medium text-slate-700 mb-2">{card.name}</h3>
                        <p className="text-xl font-medium text-green-700 mb-2">$ {card.price}</p>
                            <Picker onChange={getQty} />
                        <div className="w-fit absolute bottom-0 right-0"><Button action id={index} onClick={handleClick}>Add to cart</Button></div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
};

export default Card;