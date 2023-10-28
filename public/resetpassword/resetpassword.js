const password = document.getElementById("password");
const confpassword = document.getElementById("confirm-password");
const submitbtn = document.getElementById("submitbtn");

submitbtn.addEventListener("click", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    console.log(uuid);
    const error = document.getElementById("error-msg");
    let newpassword = password.value;
    let conpassword = confpassword.value;
    let obj = {
      password: newpassword,
      uuid: uuid
    };
    if (newpassword === conpassword) {
      let sendpassword = await axios.post(
        "http://localhost:3000/password/newpassword",
        obj
      );
      console.log(sendpassword);
    } else {
      error.innerHTML = "password not maching";
      setTimeout(() => {
        error.innerHTML = "";
      }, 3000);
    }
  } catch (err) {
    console.log(err);
  }
});
