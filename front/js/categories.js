/* LocalStorage */

const getOrderCode = () => parseInt(localStorage.getItem("db_code")) ?? 0;
const setOrderCode = (dbCode) => localStorage.setItem("db_code", dbCode);

/***************************/

/* Vars */

const page = 'categories';

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

const readCategory = async () => {
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
            <td>${response[index].code}</td>
            <td>${response[index].name.replace(/</g, "$lt;").replace(/>/g,"&gt;")}</td>
            <td>${response[index].tax.replace(/</g, "$lt;").replace(/>/g,"&gt;")}</td>
            <td class="btn-delete"><button class="material-symbols-outlined icon" data-action="delete" id="delete-${response[index].code}">
            delete</button></td>
        </tr>
        `
        }
    tbody.innerHTML = tr;
};

const createCategory = async () => {
    let code = codeGenerator();
    let name = document.getElementById("name").value.replace(/</g, "$lt;").replace(/>/g,"&gt;");
    let tax = document.getElementById("tax").value.replace(/</g, "$lt;").replace(/>/g,"&gt;"); 
    
    if(name == '' || tax == '') {
        alert('Please fill all the blanks input areas.');
    } else {
        await fetch("http://localhost/php/insert.php?page=" + page, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"code": code, "name": name, "tax": tax}),
        }).then(function(response) {
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
            deleteCategory('categories', index);
            updateTable();
        }
    }
};

const deleteCategory = async (page, code) => {
    const obj = {
        page: page,
        code: code,
    };

    const searchParams = new URLSearchParams(obj);
    const queryString = searchParams.toString();

    await fetch("http://localhost/php/delete.php?" + queryString, {
            method: "GET",
        }).then(function(response) {
            return response.json();
    })
};

const updateTable = () => {
    readCategory();
    clearFields();
    
    if(!getOrderCode()) {
        setOrderCode(0);
    }
};
updateTable();

/* Events */

document.getElementById('add').addEventListener('click', createCategory);
document.querySelector('#table>tbody').addEventListener('click', deleteRow);

/***************************/





