import Button from "../components/Button";
import Table from "../components/Table";
import view from "../imgs/view.png"
import { useState, useEffect } from "react";
import axiosInstance from "../helper/axios-instance";

function HistoryPage () {
    const [rerender, setRerender] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);

     useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                let response = await axiosInstance.get(
                    "history/select.php"
                );
                if(response.data.length !== 0) setIsActive(true);
                setOrders(response.data);
            } catch (error) {
                console.log(error);
                setError(error.message);
            } finally {
                setLoading(false);
                setRerender(false);
            }
        };
        
        fetchOrders();
    }, [rerender]);

    const handleView = async (e) => {
        const id = e.target.id;

        await axiosInstance.get(
            "home/select.php"
        )
        .then(res => {
            const data = res.data;
            console.log(data)
            setOrder(
                data.filter((item) => {
                   return item.order_code == id;
                })
             );
        })
        .catch(err => {
            setError(err);
        })
        setIsOpen(!isOpen);
    };

    const configOrders = [
        { 
            label: 'Code', 
            render: (order) => order.code,
        },
        { 
            label: 'Date',
            render: (order) => order.date,
        },
        { 
            label: 'Tax',
            render: (order) => `$ ${order.tax}`,
        },
        { 
            label: 'Total',
            render: (order) => `$ ${Math.floor(order.total)}`,
        },
        {
            label: '',
            render: (order) => <Button icon><img id={order.code} onClick={handleView} src={view}/></Button>,
        }
    ];

    const configOrder = [
        { 
            label: 'Code', 
            render: (order) => order.code,
        },
        { 
            label: 'Product',
            render: (order) => order.name,
        },
        { 
            label: 'Amount',
            render: (order) => order.amount,
        },
        { 
            label: 'Price',
            render: (order) => `$ ${order.price}`,
        },
        { 
            label: 'Tax',
            render: (order) => `$ ${order.tax}`,
        },
    ];

    if(loading) return <div>Loading...</div>

    if(error) return <div>{error}</div>

    return (
        <div className="m-10"> 
            <h2 className="font-medium text-2xl my-2">History</h2>
            <div className="flex flex-col m-16">
                {isActive ? <Table primary config={configOrders} data={orders}></Table> : 'You have not bought anything yet.'}
            </div>
            <div className="flex flex-col m-16">
                {isOpen && <Table secondary config={configOrder} data={order}></Table>}
            </div>
    </div>
    )
};
  
export default HistoryPage;