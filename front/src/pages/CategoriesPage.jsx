import Button from "../components/Button";
import Input from "../components/Input";
import Table from "../components/Table";
import trashBin from "../imgs/delete.png"
import { useState, useEffect } from "react";
import axiosInstance from "../helper/axios-instance";

function CategoriesPage () {
    const [rerender, setRerender] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [name, setName] = useState();
    const [tax, setTax] = useState();
  

     useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                let response = await axiosInstance.get(
                    "categories/select.php"
                );
                if(response.data.length !== 0) setIsActive(true);
                setCategories(response.data);
            } catch (error) {
                console.log(error);
                setError(error.message);
            } finally {
                setLoading(false);
                setRerender(false);
            }
        };
        fetchCategories();
    }, [rerender]);

    const addData = async () => {
        if(name == null || tax == null) {
            alert("Please fill all the input areas.")
        } else {
            await axiosInstance.post("categories/insert.php", { name, tax });
            alert("Category added!");
            setRerender(true);
        }
    };
     
    const handleDelete = async (e) => {
        let id = e.target.id;
        try {
            await axiosInstance.delete(`categories/delete.php?id=${id}`);
            setCategories(
                categories.filter((category) => {
                   return category.id !== id;
                })
             );
             setRerender(true);
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    const config = [
        { 
            label: 'Code', 
            render: (category) => category.code,
        },
        { 
            label: 'Category',
            render: (category) => category.name,
        },
        { 
            label: 'Tax',
            render: (category) => `${Number(category.tax).toFixed(2)}%`,
        },
        {
            label: '',
            render: (category) => <Button icon><img id={category.code} onClick={handleDelete} src={trashBin}/></Button>,
        }
    ];

    if(loading) return <div>Loading...</div>

    if(error) return <div>{error}</div>

    return (
        <div className="flex flex-row m-16 w-full">
            <div className="flex flex-col w-full mx-16 my-5" >
                <div className="flex flex-col items-center bg-white/70 z-10 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-10">
                <div className="flex flex-row w-full">
                    <Input primary name={"name"} type={"text"} placeholder={"Category"} onChange={(e) => setName(e.target.value)}/>
                    <Input primary name={"tax"} type={"number"} placeholder={"Tax"}  min={1} onChange={(e) => setTax(e.target.value)}/>
                </div>
                <div className="w-full m-2"> 
                    <Button primary id={"add"} onClick={() => addData()}>Add category</Button>
                </div>   
            </div>
            {isActive ? <div className="shadow-md rounded-lg mt-10"><Table primary config={config} data={categories}></Table></div> : 'Lets create a new category for your products.'}
        </div>
    </div>     
    )
};
  
export default CategoriesPage;