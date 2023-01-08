
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const qs = document.querySelector.bind(document);
// const button = qs('button')
const users = []
let filteredUsers = []
const show = qs('#show')
const searchForm = qs('#search-form')
const modal = qs('#user-modal')
const searchInput = qs('#search-input')
const paginator = qs('#paginator')
const USERS_PER_PAGE = 40
// console.log(INDEX_URL)

        // <div class="card-footer">          
        //   <button class="btn btn-primary btn-show-user" 
        //   data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">More</button>
        //   <button class="btn btn-info btn-add-favorite">+</button>
        // </div>
// data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE) // 無條件進位，使得不足一頁最大值者亦能顯示在一頁
  let rawHTML = ''
  for (let i=1; i<=numberOfPages; i++) { // include numberOfPages
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
  }  
  // console.log(numberOfPages)
  paginator.innerHTML = rawHTML
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

// click on image
show.addEventListener("click", function onPanelClicked(e) { // name easier debug
    if (e.target.matches('.btn-show-user')) {
        // console.log('i')
    fillModal(Number(e.target.dataset.id))
    }
})

// click on modal
modal.addEventListener("click", function onModalClicked(e) { // name easier debug
  if (e.target.matches('.btn-add-favorite')) {
      // console.log(e.target.dataset.id)
      fillFavorite(Number(e.target.dataset.id))
  }
})

//監聽表單提交事件
searchForm.addEventListener("submit", function onSearchFormSubmitted(e) { 
  // 預防重新導向    
  e.preventDefault()
  // if (!keyword.length) {return alert('請輸入有效字串！')}
  // 用 .value 取得 input 值
  const keyword = searchInput.value.trim().toLowerCase()
  // filteredMovies = movies.filter((movie) => 
  //   movie.title.toLowerCase().includes(keyword)) // 當使用者沒有輸入任何關鍵字時，畫面顯示全部電影 ( 在 include () 中傳入空字串，所有項目都會通過篩選）
  filteredUsers = users.filter((user) => 
  user.name.toLowerCase().includes(keyword))
  // 錯誤處理
  // if (filteredMovies.length===0) {return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)}
  if (filteredUsers.length===0) {return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人物`)}
  // 重新輸出至畫面
  // renderMovieList(getMoviesByPage(1))
  renderUserList(filteredUsers)
  // renderPaginator(filteredMovies.length)
})

// 監聽 paginator
paginator.addEventListener("click", function onPaginatorClicked(e) { 
  // console.log('click!')
  // 對點擊非 <a>...</a> 的事件不作出回應
  if (e.target.tagName!='A') {console.log('X'); return}
  const page = Number(e.target.dataset.page)
  // 重新渲染
  renderUserList(getUsersByPage(page))
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
        qs('#user-modal-add-favorite').innerHTML = `<button class="btn btn-outline-info btn-add-favorite" data-id="${data.id}">+</button>`
        qs('#user-modal-email').innerText = 'Email: ' + data.email
        qs('#user-modal-gender').innerText = 'Gender: ' + data.gender
        qs('#user-modal-age').innerText = 'Age: ' + data.age
        qs('#user-modal-region').innerText = 'Region: ' + data.region
        qs('#user-modal-birthday').innerText = 'Birthday: ' + data.birthday
        qs('#user-modal-image').innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="user Poster">`
        })
    .catch((err) => console.log(err))
}

// after add favorite
function fillFavorite(id) {
  // console.log(id)
  const lst = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  // console.log(users[0]) 
  // console.log(lst)
  // object.find(func)
    // the first elm that is true for func 
  const tgt = users.find((x) => x.id === id) 
  // console.log(tgt)  
  // object.some(func) 
    // at least one elm in object is true for func then this returns true and vise versa
  if (lst.some((x) => x.id === id)) {
    return alert('此人物已經在收藏清單中！') // pop and terminate so below not executed
  } 
  lst.push(tgt)
  localStorage.setItem('favoriteUsers', JSON.stringify(lst))
}

function getUsersByPage(page) { // 依照被點擊到的頁碼i，第12 * (i -1) ~ -1 + 12 * i 出現在畫面上
  const startIndex = USERS_PER_PAGE * (page-1)
  console.log(startIndex)
  // 根據現在呈現的是否為搜尋後結果來決定用 movies 或 filteredMovies 作為內容
  const data = filteredUsers.length ? filteredUsers : users // filteredMovies 非空陣列則 data 為 filteredMovies 反之 movies
  // object.slice(start, end)
      // shallow copy of elms in object from start to end (end not included)
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

axios
  .get(INDEX_URL)
  .then((response) => {
    // console.log(response.data.results)
    users.push(...response.data.results)
    // console.log(users)
    renderUserList(getUsersByPage(1))
    renderPaginator(users.length)
  })
  .catch((err) => console.log(err))