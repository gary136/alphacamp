const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
// const movies = []
// 電影總清單 movies 的來源，從串接 API 取得 ，變成取用 local storage
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const qs = document.querySelector.bind(document);
const dataPanel = qs('#data-panel')

// 渲染畫面
function renderMovieList(data) { 
  let rawHTML = ''
  data.forEach(item => {
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
          <button class="btn btn-danger btn-remove-favorite" 
          data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

  dataPanel.addEventListener("click", function onPanelClicked(e) { // name easier debug
    // 委派點擊事件
    if (e.target.matches('.btn-show-movie')) {
      fillModal(Number(e.target.dataset.id))
    }
    else if (e.target.matches('.btn-remove-favorite')) {
      removeFavorite(Number(e.target.dataset.id))
    }
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

function removeFavorite(id) {
  // console.log(id)
  if (!movies || !movies.length) return 

  // object.findIndex(func)
    // the Index that is true for func 
  const tgtIndex = movies.findIndex((x) => x.id === id) 
  if(tgtIndex === -1) return
  // arr.splice(index, 1)
    // start from index del 1 elm of arr
  movies.splice(tgtIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

// axios 
//   .get(INDEX_URL)
//   .then((response) => {
//     movies.push(...response.data.results)
//     // console.log(movies)
//     renderMovieList(movies)    
//   })
//   .catch((err) => console.log(err))

// const lst = JSON.parse(localStorage.getItem('favoriteMovies')) || []
// movies.push(...lst)
// console.log(movies)
renderMovieList(movies)