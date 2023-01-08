
const qs = document.querySelector.bind(document);
// const button = qs('button')
const show = qs('#show')
const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = []
const searchForm = qs('#search-form')
const searchInput = qs('#search-input')
// console.log(INDEX_URL)

// extract info and merge in html
function getText(item) {
    // console.log(item)
    return `<div class='ib'>
        <img src="${item.avatar}" alt="x" class="btn-show-user"
        data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
        </br>
        <span>${item.name}</span>        
    </div>
    `;
}
        // <div class="card-footer">          
        //   <button class="btn btn-primary btn-show-user" 
        //   data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">More</button>
        //   <button class="btn btn-info btn-add-favorite">+</button>
        // </div>
// data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}

// click on image
show.addEventListener("click", function onPanelClicked(e) { // name easier debug
    if (e.target.matches('.btn-show-user')) {
        // console.log('i')
    fillModal(e.target.dataset.id)
    }
})

//監聽表單提交事件
searchForm.addEventListener("submit", function onSearchFormSubmitted(e) { 
    // 預防重新導向    
    e.preventDefault()
    // console.log('click!')
    // if (!keyword.length) {return alert('請輸入有效字串！')}
    // 用 .value 取得 input 值
    const keyword = searchInput.value.trim().toLowerCase()
    filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(keyword)) // 當使用者沒有輸入任何關鍵字時，畫面顯示全部 user ( 在 include () 中傳入空字串，所有項目都會通過篩選）
    // console.log(filteredUsers)
    // 錯誤處理
    if (filteredUsers.length===0) {return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的 user`)}
    // 重新輸出至畫面
    // renderMovieList(getMoviesByPage(1))
    renderUserList(filteredUsers)
    // renderPaginator(filteredUsers.length)
})

// use id get api then extract info for filling modal
function fillModal(id) {
    // console.log(id)
    axios
    .get(INDEX_URL + id)
    .then((response) => {
        console.log(response)
        const data = response.data
        qs('#user-modal-title').innerText = data.name + ' ' + data.surname
        // qs('#user-modal-name').innerText = 'Name: ' + data.name
        // qs('#user-modal-surname').innerText = 'Surname: ' + data.surname
        qs('#user-modal-email').innerText = 'Email: ' + data.email
        qs('#user-modal-gender').innerText = 'Gender: ' + data.gender
        qs('#user-modal-age').innerText = 'Age: ' + data.age
        qs('#user-modal-region').innerText = 'Region: ' + data.region
        qs('#user-modal-birthday').innerText = 'Birthday: ' + data.birthday
        qs('#user-modal-image').innerHTML = `<img src="${
            data.avatar
        }" class="img-fluid" alt="user Poster">`
        })
    .catch((err) => console.log(err))
}


function renderUserList(data) {
  let rawHTML = ''
  data.forEach(item => {
    // assign id for later use
    rawHTML += getText(item)
  })
  // console.log(rawHTML)
  show.innerHTML = rawHTML
}

axios
  .get(INDEX_URL)
  .then((response) => {
    // console.log(response.data.results)
    users.push(...response.data.results)
    // console.log(users)
    renderUserList(users)
    
  })
  .catch((err) => console.log(err))