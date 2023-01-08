
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
// const users = []
// users 的來源從串接 API 取得變成取用 local storage
const users = JSON.parse(localStorage.getItem('favoriteUsers')) || []
const qs = document.querySelector.bind(document);
const show = qs('#show')

// click on image
show.addEventListener("click", function onPanelClicked(e) { // name easier debug
    if (e.target.matches('.btn-show-user')) {
        // console.log('i')
    fillModal(e.target.dataset.id)
    }
})

// use id get api then extract info for filling modal
function fillModal(id) {
    // console.log(id)
    axios
    .get(INDEX_URL + id)
    .then((response) => {
        // console.log(response)
        const data = response.data
        qs('#user-modal-title').innerText = data.name + ' ' + data.surname
        // qs('#user-modal-name').innerText = 'Name: ' + data.name
        // qs('#user-modal-surname').innerText = 'Surname: ' + data.surname
        qs('#user-modal-email').innerText = 'Email: ' + data.email
        qs('#user-modal-gender').innerText = 'Gender: ' + data.gender
        qs('#user-modal-age').innerText = 'Age: ' + data.age
        qs('#user-modal-region').innerText = 'Region: ' + data.region
        qs('#user-modal-birthday').innerText = 'Birthday: ' + data.birthday
        qs('#user-modal-image').innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="user Poster">`
        })
    .catch((err) => console.log(err))
}

// extract info and merge in html
function GetSingleUser(item) {
  // assign id for later use
  return `<div class='ib'>
      <img src="${item.avatar}" alt="x" class="btn-show-user"
      data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
      </br>
      <span>${item.name}</span>        
  </div>
  `;
}

function renderUserList(data) {
  let rawHTML = ''
  data.forEach(item => {    
    rawHTML += GetSingleUser(item)
  })
  show.innerHTML = rawHTML
}
axios
  .get(INDEX_URL)
  .then((response) => {
    // console.log(response.data.results)
    users.push(...response.data.results)
    // console.log(users)    
  })
  .catch((err) => console.log(err))

renderUserList(users)