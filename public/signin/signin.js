const signName = document.getElementById('signname');
const signEmail = document.getElementById('signemail');

const signPassword = document.getElementById('signpassword'); // Fixed typo
const signBtn = document.getElementById('signin');
const errmsg = document.getElementById('errormsg'); // Error message element

// Logic for the sign in 
signBtn.addEventListener('click', async () => {
    let name = signName.value;
    let email = signEmail.value;
    let password = signPassword.value; // Fixed typo
    let obj = {
        name: name,
        email: email,
        password: password
    };
    try {
        await axios.post('http://localhost:3000/user/sign-in', obj);
        console.log('Send successfully');
        window.location.href = '../login/login.html';
    } catch (err) {
        errmsg.textContent = 'Email already exists'; // Update error message
        setTimeout(() => {
            errmsg.textContent = ''; // Clear error message after 3 seconds
        }, 3000);
    }
});
