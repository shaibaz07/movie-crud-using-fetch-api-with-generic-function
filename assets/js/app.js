const cl = console.log;




const movieModal = document.getElementById('movieModal')
const backDrop = document.getElementById('backDrop')
const showMovieBtn = document.getElementById('showMovieBtn')
const closeMovieModal = [...document.querySelectorAll('.closeMovieModal')]

const movieForm = document.getElementById('movieForm')
const movieName = document.getElementById('movieName')
const movieImg = document.getElementById('movieImg')
const movieDescription = document.getElementById('movieDescription')
const movieRating = document.getElementById('movieRating')
const updateMovieBtn = document.getElementById('updateMovieBtn')
const addMovieBtn = document.getElementById('addMovieBtn')
const spinner = document.getElementById('spinner')



function snackBar(msg, icon) {
    swal.fire({
        title: msg,
        icon: icon,
        timer: 2500,
        confirmButtonColor: "#212529"
    })
}

function showSpinner(){
    spinner.classList.remove('d-none')
}

function hideSpinner(){
    spinner.classList.add('d-none')
}



const movieContainer = document.getElementById('movieContainer')

let moviesData = localStorage.getItem('moviesArr')

let moviesArr = []

if (moviesData) {
    moviesArr = JSON.parse(moviesData)
}




function setRating(rating) {
    if (rating >= 4) {
        return "badge-success"
    } else if (rating >= 3 && rating < 4) {
        return "badge-warning"
    } else {
        return "badge-danger"
    }
}





function onModalToggle() {
    movieModal.classList.toggle('active')
    backDrop.classList.toggle('active')
    movieForm.reset()

}








const Base_Url = `https://studentpost-5eee3-default-rtdb.asia-southeast1.firebasedatabase.app`

const Movie_Url = `${Base_Url}/movie.json`

const state = {
    moviesArr: [],
    editId: null
}


function ObjtoArr(obj) {
    for (const key in obj) {
        obj[key].id = key,
            state.moviesArr.unshift(obj[key])
    }
}





function makeApiCall(url, methodName, msgBody) {

    msgBody = msgBody ? JSON.stringify(msgBody) : null;

    return fetch(url, {
        method: methodName,
        body: msgBody,
        headers: {
            "Content-Type": "application/json",
            "Auth": "JWT Token"

        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ERROR : ${res.status}`)
            }
            return res.json()
        })

}

function createMovieCard(arr) {
    let result = ``;
    arr.forEach(movie => {
        result += `
                     <div class="col-md-3 mb-4" id="${movie.id}">
                <div class="card h-100 movieCard" >
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${movie.movieName}</h4>

                            </div>
                            <div class="col-2">
                                <h5 class="m-0">
                                    <span class="badge ${setRating(movie.movieRating)}">${movie.movieRating}</span>
                                </h5>
                            </div>
                            
                        </div>
                        <small class="pl-1">  <strong>createdAt : </strong>${new Date(movie.createdAt).toLocaleString("en-IN")}</small> <br>

                        ${movie.updatedAt ? `<small class = "pl-1"> <strong> updatedAt : </strong>${new Date(movie.updatedAt).toLocaleString("en-IN")}</small>` : ""}
                        
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                        <img src="${movie.movieImg}" alt="${movie.movieName}" title="${movie.movieName}">

                            <figcaption>
                                <h5>${movie.movieName}</h5>
                                <p>${movie.movieDescription}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onMovieEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button  onclick="onMovieRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>

                    </div>
                </div>


            </div>

        
        
                    `
    });

    movieContainer.innerHTML = result;
}

function fetchMovie() {
    showSpinner()
    makeApiCall(Movie_Url, "GET", null)
        .then(res => {
            ObjtoArr(res)

            createMovieCard(state.moviesArr)
        })
        .catch(err => {
            cl(err)
        })
        .finally(() =>{
            hideSpinner()
        })
}

fetchMovie()


function onMovieAdd(eve) {
    eve.preventDefault();
    let newMovie_Obj = {
        movieName: movieName.value,
        movieImg: movieImg.value,
        movieDescription: movieDescription.value,
        movieRating: movieRating.value,
        createdAt: Date.now(),
        updatedAt: null

    }
    // cl(newMovie_Obj)
            onModalToggle()

     showSpinner()
    makeApiCall(Movie_Url, "POST", newMovie_Obj)
        .then(res => {
            // cl(res)
            newMovie_Obj.id = res.name;
            state.moviesArr.unshift(newMovie_Obj)
            let card = document.createElement('div');
            card.id = res.name
            card.className = 'col-md-3 mb-4';
            card.innerHTML = `

                     <div class="card movieCard  h-100" >
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${newMovie_Obj.movieName}</h4>

                            </div>
                            <div class="col-2">
                                <h5 class="m-0">
                                    <span class="badge ${setRating(newMovie_Obj.movieRating)}">${newMovie_Obj.movieRating}</span>
                                </h5>
                            </div>

                            </div>
                            <small class="pl-1"><strong>createdAt : </strong>${new Date(newMovie_Obj.createdAt).toLocaleString("en-IN")}</small>                          
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                        <img src="${newMovie_Obj.movieImg}" alt="${newMovie_Obj.movieName}" title="${newMovie_Obj.movieName}">

                            <figcaption>
                                <h5>${newMovie_Obj.movieName}</h5>
                                <p>${newMovie_Obj.movieDescription}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  onclick="onMovieEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button onclick="onMovieRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>
                    </div>
                </div>
    `;
            movieContainer.prepend(card)

            snackBar(`The movie with id: ${newMovie_Obj.movieId} is added successfully`, 'success')

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
                hideSpinner()
        })
}



function onMovieEdit(ele) {
    let Edit_Id = ele.closest('.col-md-3').id
    state.editId = Edit_Id
    // cl(Edit_Id)
    let Edit_Obj = state.moviesArr.find(m => m.id === Edit_Id)
    // cl(Edit_Obj)
    onModalToggle()

    movieName.value = Edit_Obj.movieName;
    movieImg.value = Edit_Obj.movieImg
    movieDescription.value = Edit_Obj.movieDescription
    movieRating.value = Edit_Obj.movieRating

    addMovieBtn.classList.add('d-none')
    updateMovieBtn.classList.remove('d-none')

}


function onUpdateMovie() {
    let Update_Id = state.editId;
    // cl(Update_Id)
    let Update_Url = `${Base_Url}/movie/${Update_Id}.json`

    let movie = state.moviesArr.find(m => m.id === Update_Id)

    let Updated_Obj = {
        movieName: movieName.value,
        movieImg: movieImg.value,
        movieDescription: movieDescription.value,
        movieRating: movieRating.value,
        id: Update_Id,
        createdAt: movie.createdAt,
        updatedAt: Date.now()
    }

    let getIndex = state.moviesArr.findIndex(m => m.id === Update_Id)
    state.moviesArr[getIndex] = Updated_Obj

    // cl(Updated_Obj)
            onModalToggle()

         showSpinner()

    makeApiCall(Update_Url, "PATCH", Updated_Obj)
        .then(res => {
            let getIndex = state.moviesArr.findIndex(m => m.id === Update_Id)
            state.moviesArr[getIndex] = Updated_Obj

            let col = document.getElementById(Update_Id);
            col.innerHTML = `
        
                 
                <div class="card h-100  movieCard " >
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${Updated_Obj.movieName}</h4>

                            </div>
                            <div class="col-2">
                                <h5 class="m-0">
                                    <span class="badge ${setRating(Updated_Obj.movieRating)}">${Updated_Obj.movieRating}</span>
                                </h5>
                            </div>
                            
                        </div>
                        <small class="pl-1">  <strong>createdAt : </strong>${new Date(Updated_Obj.createdAt).toLocaleString("en-IN")}</small> <br>
                        <small class="pl-1">  <strong>updatedAt : </strong>${new Date(Updated_Obj.updatedAt).toLocaleString("en-IN")}</small>
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                        <img src="${Updated_Obj.movieImg}" alt="${Updated_Obj.movieName}" title="${Updated_Obj.movieName}">

                            <figcaption>
                                <h5>${Updated_Obj.movieName}</h5>
                                <p>${Updated_Obj.movieDescription}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onMovieEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button  onclick="onMovieRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>

                    </div>
                </div>


            

           
        
        
        
        
        `
            updateMovieBtn.classList.add('d-none');
            addMovieBtn.classList.remove('d-none')


            snackBar(`The movie with id: ${Update_Id} is updated successfully`, 'success')


        })
        .catch(err => {
            cl(err)
        })
        .finally(() =>{
                 hideSpinner()
        })


}



function onMovieRemove(ele) {
    let Remove_Id = ele.closest('.col-md-3').id
    // cl(Remove_Id)

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#212529",
        cancelButtonColor: "rgb(193, 17, 25)",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {

        if (result.isConfirmed) {
            let Remove_Url = `${Base_Url}/movie/${Remove_Id}.json`
     showSpinner()
            
            makeApiCall(Remove_Url, "DELETE", null)
                .then(res => {
                    let getIndex = state.moviesArr.findIndex(m => m.id === Remove_Id)
                    state.moviesArr.splice(getIndex, 1)

                    ele.closest('.col-md-3').remove()

            snackBar(`The movie with id: ${Remove_Id} is removed successfully`, 'success')
                    

                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                        hideSpinner()
                })
        }
    });

}



showMovieBtn.addEventListener('click', onModalToggle)

closeMovieModal.forEach(ele => {
    ele.addEventListener('click', onModalToggle)
})


updateMovieBtn.addEventListener('click', onUpdateMovie)
movieForm.addEventListener('submit', onMovieAdd)