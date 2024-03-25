import { useEffect, useState } from "react";
import Button from "./Button";
import trashBin from "../imgs/delete.png"

function Display(props) {
    const [rerender, setRerender] = useState(false);

    const handleDelete = async (e) => {
        let id = e.target.id;
        console.log(rerender)
        props.data.splice(0, id);
        props.onClick(props.data);
        setRerender(true)
    };

    useEffect(() => {
        setRerender(false)
    }, [rerender])
    
    return (
        <div className="container mx-auto py-10 px-8 break-words">
            <div>
            {props.data.map((product, index) => (
                <div key={index} className="bg-slate-100 rounded shadow my-3">
                    <div className="flex flex-row py-5 px-3 w-full">
                        <p className="font-medium pl-3">Product: </p>
                        <p className="w-16 mx-2">{product.name}</p>
                        <p className="font-medium pl-3">Amount: </p>
                        <p className="w-16 mx-2">{product.amount}</p>
                        <p className="font-medium pl-3">Item Price: </p>
                        <p className="w-16 mx-2">$ {(product.itemPrice).toFixed(2)}</p>
                        <p className="font-medium pl3">Item Tax: </p>
                        <p className="w-16 mx-2">$ {(product.itemTax).toFixed(2)}</p>
                        <Button icon><img id={product.code} onClick={handleDelete} src={trashBin}/></Button>
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
};

export default Display;