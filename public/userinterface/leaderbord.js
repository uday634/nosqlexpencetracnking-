const  leaderbordbtn = document.getElementById('leaderbordbtn')

leaderbordbtn.addEventListener("click", () => {
    axios
      .get("http://54.198.128.52:3000/premium/leaderboard", {
        headers: { Authorization: token },
      })
      .then((result) => {
        
      })
      .catch((err) => console.log(err));
  });
