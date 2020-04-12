
/** API FETCHING FUNCTION **/

//used by fetch function to verify that the 200 response was received when calling the API
function checkStatus (response) {
	if(response.ok) {
		return Promise.resolve(response);
	}else{
		return Promise.reject(new Error(response.statusText));
	}
}

//featches 12 results from the United States, Great Britain, Australia, and New Zealand
//checks that there's a response from the api
//then it transforms the response string into JSON
//then it uses the results of the JSON object to create an array of user objects with the needed data for the page
//then it creates the cards, creates event listeners on the cards, and adds a search box

let userArray = [];
fetch('https://randomuser.me/api/?results=12&nat=us,gb,au,nz')
	.then(checkStatus)
	.then(response => response.json())
	.then(data => {
		userArray = createUserArray(data.results)
		createUserCards(userArray);
		cardListeners();
		searchDirectory();
	})
	.catch(error => console.log('Fetch error', error))



/** HELPER FUNCTIONS **/


//used by createUserArray to transform date of birth from the API to a readable date of birth

function createDOB(date){
	const DOBObject = new Date(date)
	const month = DOBObject.getMonth()+1
	const day = DOBObject.getDate()
	const year = DOBObject.getFullYear().toString().slice(2)

	return month + "/" + day + "/" + year; 
};

//uses the fetch response json to create an array of objects that can be easily read and used 
//for the creation of the user cards

function createUserArray(resultArray){
	let  = newUserArray = [];
	for(let user of resultArray){
		let newUserObject = {}
		newUserObject.mediumImg = user.picture.medium
		newUserObject.largeImg = user.picture.large
		newUserObject.name= user.name.first + " " + user.name.last 
		newUserObject.email = user.email 
		newUserObject.city = user.location.city
		newUserObject.cell = user.cell
		newUserObject.fullAddress= user.location.street.number + " " + user.location.street.name + " " + user.location.city + ", " + user.location.state + " " + user.location.postcode
		newUserObject.dob= createDOB(user.dob.date)
		newUserArray.push(newUserObject);
	}
	return newUserArray; 
}


//iterates throught the userArray, making a user card out of each object, and appending it to the gallery container

function createUserCards(userArray){
	const gallery = document.getElementById('gallery')
	for (let user of userArray){
		const divCard = document.createElement("DIV");
		divCard.className = 'card';

		divCard.innerHTML += 
		`<div class="card-img-container"> \
			<img class="card-img" src="${user.mediumImg}" alt="profile picture">\
		</div>`

		divCard.innerHTML +=
		`<div class="card-info-container">\
            <h3 id="name" class="card-name cap">${user.name}</h3>\
            <p class="card-text">${user.email}</p>\
            <p class="card-text cap">${user.city}</p>\
        </div>`

		gallery.appendChild(divCard)
	}

}

//adds 'click' event listeners to the cards that were created by createUserCards
//if the event is called, it brings up a modal card with more details

function cardListeners(){
	cardDivs = document.getElementsByClassName('card');
	for (let cd of cardDivs){
		cd.addEventListener('click', (e) => {
			const cdName = cd.querySelector('h3').innerText;
			for (let user of userArray){
				if(cdName === user.name){
					addModalCard(user);

				}
			}
		})
	}
}

//when a card is clicked, it brings up a card with addtional details about the clicked user

function addModalCard(user){

	console.log('Add', user)
	let modalContainer = document.createElement("DIV")
	modalContainer.className = "modal-container"

	modalContainer.innerHTML += 
	`<div class="modal">\
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>\
        <div class="modal-info-container">\
            <img class="modal-img" src="${user.largeImg}" alt="profile picture">\
            <h3 id="name" class="modal-name cap">${user.name}</h3>\
            <p class="modal-text">${user.email}</p>\
            <p class="modal-text cap">${user.city}</p>\
            <hr>\
            <p class="modal-text">${user.cell}</p>\
            <p class="modal-text">${user.fullAddress}</p>\
            <p class="modal-text">Birthday: ${user.dob}</p>\
		</div>\
		<div class="modal-btn-container">\
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>\
            <button type="button" id="modal-next" class="modal-next btn">Next</button>\
        </div>\
    </div>`

   document.getElementsByTagName("BODY")[0].appendChild(modalContainer);

   alterModalCard(user);
}

//creates event listeners for modal card 
//if the 'X' button is clicked, it closes
//if 'PREV' or 'NEXT', are created, it takes the index of the current user and then jumps to
// the previous or the next users

function alterModalCard(user){
	const modalContainer = document.getElementsByClassName('modal-container')[0]
	const userIndex = userArray.indexOf(user);
	const closeButton = modalContainer.querySelector('#modal-close-btn')
	const nextButton = modalContainer.querySelector('#modal-next')
	const prevButton = modalContainer.querySelector('#modal-prev')


	closeButton.addEventListener('click', ()=>{
		modalContainer.remove()
	});

	nextButton.addEventListener('click', ()=> {
		modalContainer.remove();
		if (userIndex < userArray.length-1){
			addModalCard(userArray[userIndex+1]);
		} else {
			addModalCard(userArray[0])
		}
	});

	prevButton.addEventListener('click', ()=> {
		modalContainer.remove();
		if(userIndex > 0){
			addModalCard(userArray[userIndex-1]);
		} else {
			addModalCard(userArray[userArray.length-1])
		}
		
	});

}

//creates a search form field and appends it to 'search container' div
//iterates through card names to see if there is match with the current input text
//hides all of the cards where there isn't a match

function searchDirectory(input){
	let searchForm = document.createElement("FORM");
	searchForm.method = 'get';
	searchForm.action = '#';
	searchForm.innerHTML +=
	`<input type="search" id="search-input" class="search-input" placeholder="Search...">\
     <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`

    document.getElementsByClassName('search-container')[0].appendChild(searchForm);

	const cardNames = document.getElementsByClassName('card-name');
	const submitButton = document.getElementById('search-submit');

	submitButton.addEventListener('click', (e)=>{
		e.preventDefault();

		const searchInput = document.getElementById('search-input').value;
		for (let cn of cardNames){
			const match = cn.innerText.search(searchInput);
			if(match > -1){
				cn.parentNode.parentNode.style.display = '';
			} else {
				cn.parentNode.parentNode.style.display = 'None';
			}
		}	
	})
	
}
