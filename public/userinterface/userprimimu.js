const navbar = document.getElementById("navbar");
const isPrimeum = localStorage.getItem("isPrimeum");
const primumbtn = document.getElementById("primumbtn");
const itemsPerPage = 5; // Number of items to display per page
let currentPage = 1; // Current page

primumbtn.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");

  try {
    let response = await axios.get("http://localhost:3000/premium/premium", {
      headers: { Authorization: token },
    });
    console.log(response);

    var options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        await axios.post(
          "http://localhost:3000/premium/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );

        alert("You are a premium user now");
        localStorage.setItem("isPrimeum", "true");
        paragraph.innerHTML = "You are the premium user";

        // Remove the Premium button and add the Leaderboard button
        showPremiumUI();
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", function (response) {
      console.log(response);
      alert("Something went wrong");
    });
  } catch (error) {
    console.error(error);
    alert("Error occurred while processing the payment.");
  }
});

// Create the Leaderboard button element
function leaderbordreport(duration,btn){
  btn.addEventListener("click", async () => {
    try {
      let result = await axios.get(`http://localhost:3000/premium/${duration}`, {
        headers: { Authorization: token },
      });
      console.log(result.data)
      let res = result.data;
      let leaderboardData = document.getElementById('leaderbord-data');
      let count=1
      res.forEach((res)=>{
          let li = document.createElement('li');
          li.innerHTML = `${count}: ${res.name} - ${res.total_cost}`
          count++
          leaderboardData.appendChild(li)
      })

    } catch (err) {
      console.log(err);
    }
  });
} 

function reportButton(duration,btn){
  btn.addEventListener("click", async () => {
    try {
      let result = await axios.get(`http://localhost:3000/premium/${duration}`, {
        headers: { Authorization: token },
      });
      console.log(result.data)
      let res = result.data;
      let leaderboardData = document.getElementById('leaderbord-data');
      
      while (leaderboardData.firstChild) {
        leaderboardData.removeChild(leaderboardData.firstChild);
      }


      let count=1
      res.forEach((res)=>{
          let li = document.createElement('li');
          li.innerHTML = `${count}: ${res.amount} - ${res.description}- ${res.desType}-${res.updateAt}`
          count++
          leaderboardData.appendChild(li)
      })

    } catch (err) {
      console.log(err);
    }
  });
} 




function showPremiumUI() {
  const leaderbordbtn = document.createElement("button");
  const dayly = document.createElement("button");
  const monthly = document.createElement("button");
  const yearly = document.createElement("button");
  const report = document.createElement("button");
  const downloadhistory = document.createElement('button')
  leaderbordbtn.innerHTML = "Leaderboard";
  leaderbordbtn.setAttribute("id", "leaderbordbtn");
  dayly.setAttribute("id", "dayly");
  monthly.setAttribute("id", "monthly");
  yearly.setAttribute("id", "yearly");
  report.setAttribute("id", "report");
  downloadhistory.setAttribute("id", "downloadhistory");


  dayly.innerHTML = 'daily'
  monthly.innerHTML = 'monthly'
  yearly.innerHTML = 'yearly'
  report.innerHTML = 'Download Report'
  downloadhistory.innerHTML = 'File History'

  const paragraph = document.createElement("h2");
  paragraph.innerHTML = "You are the premium user";

  // Remove the Premium button and add the Leaderboard button
  navbar.removeChild(primumbtn);
  navbar.appendChild(paragraph);
  navbar.appendChild(leaderbordbtn);
  navbar.appendChild(dayly);
  navbar.appendChild(monthly);
  navbar.appendChild(yearly);
  navbar.appendChild(report);
  navbar.appendChild(downloadhistory);


  let leaderboard = 'leaderboard'
  let daily = 'daily'
  let mounth = 'mountly'
  let year = 'yearly'


  leaderbordreport(leaderboard, leaderbordbtn)  
  reportButton(daily,dayly)  
  reportButton(mounth,monthly)  
  reportButton(year,yearly)  
  report.addEventListener('click',async () => {
    try{
      let reportdownload = await axios.get(`http://localhost:3000/expence/download`, {
        headers: { Authorization: token },
      })
      
      let link = reportdownload.data.fileURL;
      console.log(reportdownload.data.fileURL)
      
      window.location.href = link
    }catch(err){
      console.log(err)
    }
  }) 

  downloadhistory.addEventListener('click', async () =>{
    try{
      window.location.href = '../report/report.html'
    }catch(err){
      console.log(err)
    }
  })
}

if (isPrimeum === "true") {
  showPremiumUI();
}
