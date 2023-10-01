const logEmail = document.getElementById('logemail');
const logPassword = document.getElementById('logpassword'); // Fixed typo
const logBtn = document.getElementById('login');
const errmsg = document.getElementById('errormsg');



// Logic for the log in
logBtn.addEventListener('click', async () => {
    let email = logEmail.value;
    let password = logPassword.value; // Fixed typo
    let obj = {
        email: email,
        password: password
    };
    try {
        const response = await axios.post('http://localhost:3000/user/log-in', obj);
        const data = response.data;
        console.log(data);
        
        // Check if login was successful based on response status or message
        if (response.status === 200 && data.message === 'User login successful') {
            localStorage.removeItem('isPrimeum');
            localStorage.setItem('token', data.token);
            console.log('Login successful');
            errmsg.textContent = "Logged in";
            window.location.href = '../userinterface/userinterface.html';
        } else {
            // Handle unsuccessful login
            console.log('Login failed');
            errmsg.textContent = "Can't find the user or incorrect password";
        }

        setTimeout(() => {
            errmsg.textContent = ''; 
        }, 3000);
    } catch (err) {
        console.error(err);
        errmsg.textContent = "Can't connect to the server";
        setTimeout(() => {
            errmsg.textContent = ''; 
        }, 3000);
    }
});


