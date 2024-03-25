import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { FaPlus, FaMinus } from "react-icons/fa6";

function Picker (props) {
    const [quantity, setQuantity] = useState(1);

    const handleDecrement = () => {
        if(quantity > 1) {
            setQuantity(prevCount => prevCount - 1);
        }

        handleChange();
    };

    const handleIncrement = () => {
        if(quantity < 10) {
            setQuantity(prevCount => prevCount + 1);
        }

        handleChange();
    };

    const handleChange = () => {
        props.onChange(quantity);
    };

    return (
        <div className="flex justify-center items-center shadow w-1/3">
            <Button picker onClick={handleDecrement}><FaMinus /></Button>
                <Input secondary name={"amount"} value={quantity} onChange={handleChange}/>
            <Button picker onClick={handleIncrement}><FaPlus /></Button>
        </div> 
    )
};

export default Picker;