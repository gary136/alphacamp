const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filteredMovies = [] // changeable when filter newly so let rather than const
const qs = document.querySelector.bind(document);
const dataPanel = qs('#data-panel')
const searchForm = qs('#search-form')
const searchInput = qs('#search-input')
const paginator = qs('#paginator')
const MOVIES_PER_PAGE = 12
// const details = document.querySelector('.btn-show-movie')

// 渲染畫面
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    // assign id for later use
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${
          POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">          
          <button class="btn btn-primary btn-show-movie" 
          data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}"
          >More</button>
          <button class="btn btn-info btn-add-favorite" 
          data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE) // 無條件進位，使得不足一頁最大值者亦能顯示在一頁
  let rawHTML = ''
  for (let i=1; i<=numberOfPages; i++) { // include numberOfPages
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
  }  
  paginator.innerHTML = rawHTML
}
  // details.addEventListener("click", function () {
  //   modal.innerHTML = 'X'   
  // })
  // event delegation: access parent element then use e.target to identify child elms   
  // 監聽 data-panel
  dataPanel.addEventListener("click", function onPanelClicked(e) { // name easier debug
    // 委派點擊事件
    if (e.target.matches('.btn-show-movie')) {
      fillModal(Number(e.target.dataset.id))
    }
    else if (e.target.matches('.btn-add-favorite')) {
      fillFavorite(Number(e.target.dataset.id))
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
  filteredMovies = movies.filter((movie) => 
    movie.title.toLowerCase().includes(keyword)) // 當使用者沒有輸入任何關鍵字時，畫面顯示全部電影 ( 在 include () 中傳入空字串，所有項目都會通過篩選）
  // 錯誤處理
  if (filteredMovies.length===0) {return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)}
  // 重新輸出至畫面
  renderMovieList(getMoviesByPage(1))
  renderPaginator(filteredMovies.length)
})
  
  // 監聽 paginator
  paginator.addEventListener("click", function onPaginatorClicked(e) { 
    // console.log('click!')
    // 對點擊非 <a>...</a> 的事件不作出回應
    if (e.target.tagName!='A') {console.log('X'); return}
    const page = Number(e.target.dataset.page)
    // 重新渲染
    renderMovieList(getMoviesByPage(page))
  })

  // after show movie
  function fillModal(id) {
    const modalTitle = qs('#movie-modal-title')
    const modalImage = qs('#movie-modal-image')
    const modalDate = qs('#movie-modal-date')
    const modalDescription = qs('#movie-modal-description')
    // 向 Show API request 資料
    axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src="${
        POSTER_URL + data.image
      }" class="img-fluid" alt="Movie Poster">`
    })
    .catch((err) => console.log(err))
  }

  // after add favorite
  function fillFavorite(id) {
    // console.log(id)
    const lst = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    // console.log(movies[0])
    // console.log(lst)
    // object.find(func)
      // the first elm that is true for func 
    const tgt = movies.find((x) => x.id === id) 
    // console.log(tgt)  
    // object.some(func) 
      // at least one elm in object is true for func then this returns true and vise versa
    if (lst.some((x) => x.id === id)) {
      return alert('此電影已經在收藏清單中！') // pop and terminate so below not executed
    } 
    lst.push(tgt)
    localStorage.setItem('favoriteMovies', JSON.stringify(lst))
  }

function getMoviesByPage(page) { // 依照被點擊到的頁碼i，第12 * (i -1) ~ -1 + 12 * i 出現在畫面上
  const startIndex = MOVIES_PER_PAGE * (page-1)
  // 根據現在呈現的是否為搜尋後結果來決定用 movies 或 filteredMovies 作為內容
  const data = filteredMovies.length ? filteredMovies : movies // filteredMovies 非空陣列則 data 為 filteredMovies 反之 movies
  // object.slice(start, end)
      // shallow copy of elms in object from start to end (end not included)
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    // console.log(movies)
    renderMovieList(getMoviesByPage(1)) // load page 1 default
    renderPaginator(movies.length)    
  })
  .catch((err) => console.log(err))