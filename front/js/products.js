/* LocalStorage */

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_product")) ?? []
const setLocalStorage = (dbProduct) => localStorage.setItem("db_product", JSON.stringify(dbProduct));

const getOrderCode = () => parseInt(localStorage.getItem("db_code")) ?? 0;
const setOrderCode = (dbCode) => localStorage.setItem("db_code", dbCode);

const deleteLocal = (index) => {
    const dbProduct = readProduct();
    dbProduct.splice(index, 1);
    setLocalStorage(dbProduct);
};

const createLocal = (product) => {
    const dbProduct = getLocalStorage(); 
    dbProduct.push(product);
    setLocalStorage(dbProduct);
};

/***************************/

/* Vars */

let page = 'products';

const isValid = () => {
    return document.getElementById('form').reportValidity();
};

const clearFields = () => {
    const fields = document.querySelectorAll('.clear');
    fields.forEach(field => field.value =  "")
};

const clearTable = () => {
    const rows = document.querySelectorAll('#table>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

const codeGenerator = () => {
    return Math.floor(Date.now() * Math.random() / 1000 );
};

/***************************/

/* Main */

const readProduct = async () => {
    let page = 'products';
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
        const categoryName = await getValues('categories', 'name', 'code', response[index].category_code);

        tr += `
            <tr>
                <td>${response[index].code}</td>
                <td>${response[index].name}</td>
                <td>${response[index].amount}</td>
                <td>R$ ${response[index].price}</td>
                <td>${categoryName[0].name.replace(/</g, "$lt;").replace(/>/g,"&gt;")}</td>
                <td class="btn-delete"><button class="material-symbols-outlined icon" data-action="delete" id="delete-${response[index].code}">
                delete</button></td>
            </tr>
            `
        }
    tbody.innerHTML = tr;
};

const categorySelector = async () => {
    page = 'categories';
    
    const data = await fetch("http://localhost/php/selector.php?page=" + page, { 
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const response = await data.json();
    
    response.forEach(category => {
        const optionElement = document.createElement("option");
        optionElement.innerText = `${category.name}`;

        document.querySelector('#category').appendChild(optionElement);
    });
}
categorySelector();

const getValues = async (page, action, column, category)  => {
    const obj = {
        page: page,
        action: action,
        column: column,
        value: category.toString(),
    };
    const searchParams = new URLSearchParams(obj);
    const queryString = searchParams.toString();
    
    const data = await fetch("http://localhost/php/getvalues.php?" + queryString, { 
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const response = await data.json();
    return response;
};

const selectProduct = async () => {
    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    
    const product = {
        name: name,
        amount: amount,
    }
    createLocal(product);
};

const createProduct = async () => {
    let page = 'products';
    let code = codeGenerator();
    let name = document.getElementById("name").value.replace(/</g, "$lt;").replace(/>/g,"&gt;");
    let amount = document.getElementById("amount").value.replace(/</g, "$lt;").replace(/>/g,"&gt;");
    let price = document.getElementById("price").value.replace(/</g, "$lt;").replace(/>/g,"&gt;"); 

    let selectedCategory = document.getElementById("category").value; 
    let categoryCode = await getValues('categories', 'code', 'name', selectedCategory);
  
    if(name == '' || amount == '' || price == '' || categoryCode== '') {
        alert('Please fill all the blanks input areas.');
    } else {
        selectProduct();
        fetch("http://localhost/php/insert.php?page=" + page, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"code": code, "name": name, "amount": amount, "price": price, "category_code": categoryCode[0].code}),
        }).then(function(response) {
            updateTable();
            return response.json();
        })   
        updateTable();  
    }
};

const deleteRow = async (e) => {
    const [action, index] = e.target.id.split('-');
    if(action == 'delete') {
        const response = confirm("Delete data? You can't undo this action");
        if(response) {
            deleteProduct('products', index);
            updateTable();
        }
    }
};

const deleteProduct = async (page, code) => {
    const obj = {
        page: page,
        code: code,
    };

    const searchParams = new URLSearchParams(obj);
    const queryString = searchParams.toString();

    fetch("http://localhost/php/delete.php?" + queryString, {
            method: "GET",
        }).then(function(response) {
            return response.json();
        })
    };

const updateTable = () => {
    readProduct();
    clearFields();

    if(!getOrderCode()) {
        setOrderCode(0);
    }
};
updateTable();

/* Events */

document.getElementById('add').addEventListener('click', createProduct);
document.querySelector('#table>tbody').addEventListener('click', deleteRow);

/***************************/
