// Wait for the DOM to load
const token = localStorage.getItem('token');
console.log(window.innerHeight)
console.log(window.innerWidth)

// 454
//  1366

document.addEventListener('DOMContentLoaded', function() {
    const amount = document.getElementById('user-amount');
    const description = document.getElementById('user-description');
    const desType = document.getElementById('des-type');
    const addbtn = document.getElementById('addbtn');
    const data = document.getElementById('data');
    const logout = document.getElementById('logout');
    let  pageSize = 13; // Number of items to display per page
    let currentPage = 1; // Current page
    let totalExpenses = []; // Store all expenses from the server

    if(window.innerHeight<254 && window.innerWidth< 1366){
        pageSize = 5
    }

    logout.addEventListener('click', () => {
        window.location.href = '../login/login.html';
        localStorage.clear()
    })

    // Function to add an expense
    async function addExpense() {
        const useramount = amount.value;
        const userdes = description.value;
        const userdesType = desType.value;
        let li = document.createElement('li');
        let delbtn = document.getElementById('delete');

        li.innerHTML = `Rs.${useramount} - ${userdes} - ${userdesType}  <button class="edit" id="edit">Edit</button><button class="delete" id="delete">delete</button>`;
        data.appendChild(li);
        const obj = {
            amount: useramount,
            description: userdes,
            desType: userdesType
        };

        const deleteButton = li.querySelector('.delete');
        removeing(deleteButton, li);

        try {
            const result = await axios.post('http://localhost:3000/expence/addExpence', obj, { headers: { "Authorization": token } });
            console.log(result);
        } catch (err) {
            console.log(err);
        }
        location.reload();
    }

    // Event listener for the "Add Expense" button
    addbtn.addEventListener('click', addExpense);

    // Function to retrieve and display expenses
    async function getExpenses() {
        try {
            const response = await axios.get('http://localhost:3000/expence/getExpence', { headers: { "Authorization": token } });
            totalExpenses = response.data;
            displayExpenses(currentPage);
        } catch (err) {
            console.log(err);
        }
    }

    // Function to display expenses for a specific page
    function displayExpenses(page) {
        data.innerHTML = ''; // Clear the data container
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const expensesToDisplay = totalExpenses.slice(startIndex, endIndex);

        expensesToDisplay.forEach(expense => {
            const { amount, description, desType } = expense;

            const li = document.createElement('li');
            li.textContent = `Rs.${amount} - ${description} - ${desType}`;

            const editButton = document.createElement('button');
            editButton.className = 'edit';
            editButton.textContent = 'Edit';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.textContent = 'Delete';

            li.appendChild(editButton);
            li.appendChild(deleteButton);

            data.appendChild(li);
            removeing(deleteButton, li, expense.id);
        });

        // Update pagination
        updatePagination();
    }

    // Function to update pagination buttons
    function updatePagination() {
        const totalPages = Math.ceil(totalExpenses.length / pageSize);
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = ''; // Clear previous pagination buttons

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayExpenses(currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    //delete thing the given expenses 
    function removeing(deleteButton, li, id) {
        deleteButton.addEventListener('click', async (e) => {
            try {
                await axios.delete(`http://localhost:3000/expence/deleteExpence/${id}`, { headers: { "Authorization": token } });
                li.remove();
            } catch (err) {
                console.log(err);
            }
        });
    }

    // Call the function to retrieve and display expenses
    getExpenses();
});
