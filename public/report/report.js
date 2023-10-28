// Assuming you have an element with the id 'filedownloaded' where you want to display the links.
const linkdata = document.getElementById('filedownloaded');
const token = localStorage.getItem('token');
console.log(token);

axios
  .get('http://localhost:3000/expence/allExpences', {
    headers: { Authorization: token },
  })
  .then(response => {
    // Handle the response data here.
    const data = response.data;
    let count = 1;
    console.log(data);

    data.forEach(item => {
      const li = document.createElement('li');
      li.setAttribute('class', 'list-group-item');
      li.innerHTML = `${count}:<a href="${item.link}"> ${item.updatedAt.slice(0,9)}</a>`;
      linkdata.appendChild(li);
      count++;
    });
  })
  .catch(error => {
    console.error(error);
  });
