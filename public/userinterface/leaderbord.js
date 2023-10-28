const  leaderbordbtn = document.getElementById('leaderbordbtn')

leaderbordbtn.addEventListener("click", () => {
    axios
      .get("http://localhost:3000/premium/leaderboard", {
        headers: { Authorization: token },
      })
      .then((result) => {
        
      })
      .catch((err) => console.log(err));
  });
