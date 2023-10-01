//logic for the forgot password form 
const forgotemail = document.getElementById('forgotemail')
const forgotemailbtn = document.getElementById('forgotemailbtn')





forgotemailbtn.addEventListener('click',  async ()=>{
    
    let foremail = forgotemail.value;
    let obj = {
        email: foremail, 
    };
    console.log(obj)
    try {
        const response = await axios.post(`http://localhost:3000/password/forgotpassword`, obj);
        const data = response.data;
        console.log(data);
    } catch (err) {
        console.error(err);
    }
})