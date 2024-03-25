/* LocalStorage */
const getLocalStorage = () => JSON.parse(localStorage.getItem("db_items")) ?? []
const setLocalStorage = (dbItems) => localStorage.setItem("db_items", JSON.stringify(dbItems));

const getLocalProducts = () => JSON.parse(localStorage.getItem("db_product")) ?? []
const setLocalProducts = (dbProduct) => localStorage.setItem("db_product", JSON.stringify(dbProduct));

const getOrderCode = () => parseInt(localStorage.getItem("db_code")) ?? 0;
const setOrderCode = (dbCode) => localStorage.setItem("db_code", dbCode);

const getTotal =  () =>  parseFloat(localStorage.getItem("db_total"));
const setTotal = (dbTotal) => localStorage.setItem("db_total", dbTotal);

const getTax = () => parseFloat(localStorage.getItem("db_tax"));
const setTax = (dbTax) => localStorage.setItem("db_tax", dbTax);

const createLocalItems = (data) => {
    const dbItems = getLocalStorage(); 
    dbItems.push(data);
    setLocalStorage(dbItems);
};

const deleteLocalItem = (index) => {
    const dbItem = getLocalStorage();
    dbItem.splice(index, 1);
    setLocalStorage(dbItem);
};

const deleteAllLocalItems = (index) => {
    const dbItem = getLocalStorage();
    dbItem.splice(index);
    setLocalStorage(dbItem);
};

/***************************/

/* Vars */
var page = 'order_item';
var orderCode = getOrderCode();
var inStore;

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
    return Math.floor(Date.now() * Math.random() / 10000000);
};

const registerDate = () => {
    const date = new Date;
    return (`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
};

/***************************/

/* Main */

const readItem = async (data, index) => {
    const newRow = document.createElement('tr');
    
     newRow.innerHTML = `
        <td>${data.code}</td>
        <td>${data.orderCode}</td>
        <td>${data.name}</td>
        <td>${data.amount}</td>
        <td>R$ ${data.itemPrice}</td>
        <td><button class="material-symbols-outlined icon" data-action="view" id="delete-${index}">delete</button></td>
    `
    document.querySelector('#table>tbody').appendChild(newRow);
    newRow.classList.add('main-row');
};

const productSelector = async () => {
    page = 'products';
    
    const data = await fetch("http://localhost/php/selector.php?page=" + page, { 
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const response = await data.json();
    
    response.forEach(product => {
        const optionElement = document.createElement("option");
        optionElement.innerText = `${product.name}`;

        document.querySelector('#product').appendChild(optionElement);
    })
};
productSelector();

const inputAutoFill = async () => {
    const product = document.getElementById('product').value;
    const price = await getValues('products', 'price', 'name', product);

    const category = await getValues('products', 'category_code', 'name', product);
    const tax = await getValues('categories', 'tax', 'code', category[0].category_code);

    const taxInput = document.getElementById('tax');
    const priceInput = document.getElementById('price');
    
    taxInput.value = tax[0].tax;
    priceInput.value = price[0].price;
};

const getValues = async (page, action, column, product) => {
    const obj = {
        page: page,
        action: action,
        column: column,
        value: product,
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

const updateValues = async (page, action, newvalue, column, product) => {
    const obj = {
        page: page,
        action: action,
        newvalue: newvalue,
        column: column,
        value: product,
    };
    const searchParams = new URLSearchParams(obj);
    const queryString = searchParams.toString();

    const data = await fetch("http://localhost/php/update.php?" + queryString, { 
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const response = await data.json();
    return response;
};

const calculateProductTotal = async (amount, price) => {
    return Number(amount * price);
};

const calculateTotal = () => {
    const items = getLocalStorage();
    let total = 0;

    items.forEach(item => {
        total = (total + item.itemPrice +  item.itemTax);
    });
    setTotal(total);
    document.getElementById('total').setAttribute('value', total);
};

const calculateProductTax = async (total, tax) => {
    return Number(total * (Number(tax))/100);
};


const displayTaxAndTotal = () => {
    const items = getLocalStorage();
    let tax = 0;
    let total = 0;

    items.forEach(item => {
        total = (total + Number(item.itemPrice)) +  item.itemTax;
    });
    setTotal(total);
    document.getElementById('total').setAttribute('value', `R$ ${total.toFixed(2)}`);

    items.forEach(item => {
        tax = tax + Number(item.itemTax);
    })
    setTax(tax);
    document.getElementById('total-tax').setAttribute('value', `R$ ${tax.toFixed(2)}`);
};

const selectItems = async () => {
    let product = document.getElementById('product').value;
    let amount = document.getElementById('amount').value;
    await productInStore(product, amount);
    
    if(inStore) {
        let selectedProduct = document.getElementById('product').value; 
        let productCode = await getValues('products', 'code', 'name', selectedProduct);
        let productPrice = await getValues('products', 'price', 'name', selectedProduct);

        let category = await getValues('products', 'category_code', 'name', 'rice');
        let categoryTax = await getValues('categories', 'tax', 'code', category[0].category_code);

        await inputAutoFill(productPrice[0].price, categoryTax[0].tax);
        
        let itemPrice = await calculateProductTotal(amount, productPrice[0].price);
        let itemTax = await calculateProductTax(itemPrice, categoryTax[0].tax);

        const items = {
            code: codeGenerator(),
            orderCode: orderCode,
            name: product,
            productCode: productCode[0].code,
            amount: document.getElementById('amount').value.replace(/</g, "$lt;").replace(/>/g,"&gt:"),
            itemPrice: itemPrice,
            itemTax: itemTax,
            total: getTotal(),
            tax: getTax(),
        };

        createLocalItems(items);
        updateTable();
        clearFields();
    }  else {
        clearFields();
    }
};

const createItem = (index) => {
    page = 'order_item';
    const data = getLocalStorage();
    let orderCode = getOrderCode();
    
    if(amount == '') {
        alert('Please fill all the blanks input areas.');
    } else {
        for(index in data) {
            fetch("http://localhost/php/insert.php?page=" + page, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"code": data[index].code, "order_code": orderCode, "name": data[index].name, "product_code": data[index].productCode, "amount": data[index].amount, "price": data[index].itemPrice, "tax": data[index].itemTax}),
            }).then(function(response) {
                updateTable();
                return response.json();
            })     
        }
    }
};
    
const createOrder = async () => {
    page = 'orders';
    let total = getTotal();
    let tax = getTax();
    let orderCode = getOrderCode();

    await fetch("http://localhost/insert.php?page=" + page, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"code": orderCode, "date": registerDate(), "total": Number(total), "tax": tax}),
        }).then(function(response) {
            updateTable();
            return response.json();
    })     
};
 
const deleteRow = (e) => {
    const [action, index] = e.target.id.split('-');
    if(action == 'delete') {
        const response = confirm("Delete data? You can't undo this action");
        if(response) {
            deleteLocalItem(index);
            dbProducts();
            updateTable();
        }
    }
};

const buyItems = async () => {
    const rowCount = document.getElementById('table').rows.length;
    
    if(rowCount != 0) {
        const response = confirm("Would you like to confirm your purchase?");
        if(response) {
            const orderCode = getOrderCode();
            await createOrder(orderCode);

            const selectedProducts = getLocalProducts();
            selectedProducts.forEach((product) => {
                updateValues('products', 'amount', product.amount, 'name', product.name);
            });
        
            createItem(orderCode);
            deleteAllLocalItems();
            updateTable();
            setOrderCode(orderCode+1);
            alert("The selected items have been successfully purchased.");
            } else {
                alert("Please, continue buying.");
        }
    }
};

const cancelItems = () => {
    const response = confirm("Cancel purchase?");
        if(response) {
            deleteAllLocalItems();
            updateTable();
            alert("The selected items have been deleted.");
        } else {
            alert("Please, continue buying or press 'Finish' button to confirm your purchase.");
    }
};

const updateTable = () => {
    const dbItems = getLocalStorage();
    clearTable();
    dbItems.forEach(readItem);
    displayTaxAndTotal();

    if(!getOrderCode()) {
        setOrderCode(0);
    }
};
updateTable();

/* Store */
const dbProducts = async () => {
    getLocalProducts();
    page = 'products';
    const products = await fetch("http://localhost/php/select.php?page=" + page, {
        method: "GET",
    }).then(function(response) {
        return response.json();
    })
    setLocalProducts(products);
} 
dbProducts();

const productInStore = async (selectedProduct, selectedAmount) => { 
    const products = getLocalProducts();
    
    products.forEach(product => {
        if(selectedProduct == product.name) {
            if(product.amount < selectedAmount) {
                alert('Sorry, this product is out of stock.');
                inStore = false;
            } else {

                let storage = product.amount;
                product.amount = storage - selectedAmount;  
                inStore = true;
            }
        }
    });
    localStorage.setItem("db_product", JSON.stringify(products));
};


/* Events */
document.getElementById('add').addEventListener('click', selectItems);
document.getElementById('product').addEventListener('change', inputAutoFill);
document.querySelector('#table>tbody').addEventListener('click', deleteRow);
document.getElementById('cancel').addEventListener('click', cancelItems);
document.getElementById('confirm').addEventListener('click', buyItems);


const confirmExit = () => {
    if(true) {
        deleteAllLocalItems();
    }
    return '';
};
window.onbeforeunload = confirmExit;

/***************************/



