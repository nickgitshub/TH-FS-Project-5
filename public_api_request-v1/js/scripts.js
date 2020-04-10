 let userArray = []; 

fetch('https://randomuser.me/api/?results=12')
	.then(response => response.json())
	.then(data => {
		console.log(data.results)
		userArray = createUserArray(data.results);
		createUserCards(userArray)
		cardListeners();
		searchDirectory();

	})

function createUserArray(resultArray){
	let  = newUserArray = [];
	for(let user of resultArray){
		let newUserObject = {}
		newUserObject.img = user.picture.medium
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

function createDOB(date){
	const DOBObject = new Date(date)
	const month = DOBObject.getMonth()+1
	const day = DOBObject.getDate()
	const year = DOBObject.getFullYear().toString().slice(2)

	return month + "/" + day + "/" + year; 
};

function createUserCards(userArray){
	const gallery = document.getElementById('gallery')
	for (let user of userArray){
		const divCard = document.createElement("DIV");
		divCard.className = 'card';

		divCard.innerHTML += 
		`<div class="card-img-container"> \
			<img class="card-img" src="${user.img}" alt="profile picture">\
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

function addModalCard(user){

	console.log('Add', user)
	let modalContainer = document.createElement("DIV")
	modalContainer.className = "modal-container"

	modalContainer.innerHTML += 
	`<div class="modal">\
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>\
        <div class="modal-info-container">\
            <img class="modal-img" src="${user.img}" alt="profile picture">\
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

		for (let cn of cardNames){
			const searchInput = document.getElementById('search-input').value;
			const match = cn.innerText.search(searchInput);
			if(match > -1){
				cn.parentNode.parentNode.style.display = '';
			} else {
				cn.parentNode.parentNode.style.display = 'None';
			}
		}	
	})
	
}
