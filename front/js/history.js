/* LocalStorage */

const getOrderCode = () => parseInt(localStorage.getItem("db_code")) ?? 0;
const setOrderCode = (dbCode) => localStorage.setItem("db_code", dbCode);

/***************************/

/* Vars */

let page = 'orders';

/***************************/

/* Main */

const readProduct = async () => {
    let tr = '';
    const tbody = document.querySelector("tbody");

    const data = await fetch("http://localhost/php/select.php?page=" + page, { 
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const response = await data.json();

    
    for(let index in response) {
        tr += `
            <tr>
            <td>${response[index].date}</td>
            <td>${response[index].code}</td>
            <td>RS ${response[index].tax}</td>
            <td>R$ ${response[index].total}</td>
            <td><button class="material-symbols-outlined icon" data-action="view" id="view-${response[index].code}">visibility</button></td>
            </tr>
            `
        }
    tbody.innerHTML = tr;
};

const showDetails = async (e) => {
    page = 'order_item';
    const [action, index] = e.target.id.split('-');
    const selectedIndex = index;

    const order = await fetch("http://localhost/php/select.php?page=" + page, {
        method: "GET",
    }).then(function(response) {
        return response.json();
    });
    
    const element = document.getElementById('info-table');
    if(action == 'view' && order[index]) {
        if(element.style.visibility === 'visible') {
            element.style.visibility = 'hidden';
            clearDetails();
        } else {
            order.forEach(item => {
                const newRow = document.createElement('tr');
                if(item.order_code == selectedIndex) {
                    newRow.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.amount}</td>
                    <td>R$ ${item.price}</td>
                    <td>R$ ${item.tax}</td>
                    `
                    document.getElementById('info-table').appendChild(newRow);
                    newRow.classList.add('info-row');
                        
                    element.style.visibility = 'visible';
                }
            })    
        }  
    }    
};

const clearDetails = () => {
    const rows = document.querySelectorAll('.info-row');  
    rows.forEach(row => row.parentNode.removeChild(row));
};


const updateTable = () => {
    readProduct();

    if(!getOrderCode()) {
        setOrderCode(0);
    }
};
updateTable();

/***************************/

/* Events */

document.querySelector('#table>tbody').addEventListener('click', showDetails);

/***************************/


