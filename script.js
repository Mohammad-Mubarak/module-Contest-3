let ipad = document.getElementById("ipad");
let detail = document.getElementById("detailsData");
let detailsData = document.getElementById("detailsData");
let getData = document.getElementById("getData");
let mapingArr = document.getElementById("mapingArr");
let dataIsHere = document.querySelector(".dataIsHere");
let search = document.getElementById("search");
let url;
let DetailsArr;
const tokenIp = "cd175824f9927a";

fetch("https://api.ipify.org/?format=json")
	.then((res) => {
		return res.json();
	})
	.then((data) => {
		ipad.innerText = data.ip;
		url = `https://ipinfo.io/${data.ip}?token=${tokenIp}`;
	})
	.catch((err) => {
		console.log(err)
	});

function gettingData() {
	
	getData.style.display = "none";
	fetch(url)
		.then((data) => {
			return data.json();
		})
		.then((data) => {
			navigator.geolocation.getCurrentPosition((position) => {
				fetch(`https://api.postalpincode.in/pincode/${data["postal"]} `)
					.then((res) => {
						return res.json();
					})
					.then((dataDetail) => {
            console.log(dataDetail);
						DetailsArr = dataDetail;
						renderElement(data, position, dataDetail);
						renderDetailItem(DetailsArr);
					});
			});
		})
		.catch((err) => {
			
		});
}

function renderElement(data, position, dataDetail) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`;

	let timez = data["timezone"];
	

	let chicago_datetime_str = new Date().toLocaleString("en-US", {
		timeZone: timez,
	});

	// create new Date object
	let DATE_CHICAGO = new Date(chicago_datetime_str);
	
	let h = DATE_CHICAGO.getHours();
	let min = DATE_CHICAGO.getMinutes();
	let sec = DATE_CHICAGO.getSeconds();

	let times = h + " - " + min + " - " + sec;
	let year = DATE_CHICAGO.getFullYear();
	let month = ("0" + (DATE_CHICAGO.getMonth() + 1)).slice(-2);
	let date = ("0" + DATE_CHICAGO.getDate()).slice(-2);

	let date_time = year + "-" + month + "-" + date;

	detailsData.style.display = "block";
	detailsData.innerHTML = "";

	detailsData.innerHTML = `<div class="uper">
    <div class="fuper">
      <h3 class="lat">Lat: ${position.coords.latitude}</h3>
      <h3 class="city">City: ${data["city"]}</h3>
      <h3 class="org">Organization: ${data["org"]}</h3>
    </div>
    <div class="luper">
      <h3 class="long">Long: ${position.coords.longitude}</h3>
      <h3 class="reg">Region:  ${data["region"]}</h3>
      <h3 class="host">Hostname:</h3>
    </div>
  </div>
  <div class="mid">
  <iframe src=${mapUrl} frameborder="0" class="frames"></iframe>
  </div>
  <div class="lower">
    <h3 class="time_zone">Time Zone: ${data["timezone"]}</h3>
    <h3 class="date_time">Date And Time: ${date_time}  and ${times}</h3>
    <h3 class="pin">Pincode: ${data["postal"]}</h3>
    <h3 class="Message">Message: <span>${dataDetail[0]["Message"]}</span> </h3>
  </div>`;
	mapingArr.style.display = "block";
}

search.addEventListener("input", () => {
	var searchVal = search.value.trim().toLocaleLowerCase();
	let arr = DetailsArr[0]["PostOffice"];
	let filterArr = [];
	for (let i = 0; i < arr.length; i++) {
		if (
			arr[i]["Name"].toLocaleLowerCase().includes(searchVal) ||
			arr[i]["BranchType"].toLocaleLowerCase().includes(searchVal)
		) {
			
			filterArr.push(arr[i]);
		}
	}
	displayData(filterArr);
});

function renderDetailItem(Arr) {
	let dataArr = Arr[0]["PostOffice"];
	
	displayData(dataArr);
}

function displayData(givenArray) {
	dataIsHere.innerHTML = "";
	for (let i = 0; i < givenArray.length; i++) {
		dataIsHere.innerHTML += `<div class="data-box">
       <div>
       <span class="fs">Name:</span>
       <span class="ls">${givenArray[i]["Name"]}</span>
       </div>
       <div>
       <span class="fs">Branch Type:</span>
       <span class="ls">${givenArray[i]["BranchType"]}</span>
       </div>
       <div>
       <span class="fs">Delivery Status:</span>
       <span class="ls">${givenArray[i]["DeliveryStatus"]}</span>
       </div>
       <div>
       <span class="fs">District:</span>
       <span class="ls">${givenArray[i]["District"]}</span>
       </div>
       <div>
       <span class="fs">Division:</span>
       <span class="ls">${givenArray[i]["Division"]}</span>
       </div>
       </div>`;
	}
}
