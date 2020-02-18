//////SWIPER//////
var mySwiper = new Swiper('.App', {
  fadeEffect: {
    crossFade: true
  },

  // If we need pagination

  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

//////VIDEO SYSTEM//////
let mainVideoArray = document.getElementsByClassName("App-video");
let lastVideo = document.getElementsByClassName("App-lastVideo")[0];
let mainVideo = null;

function setVideo(value) {
  clearVideo();

  mainVideoArray[value].style.display = "flex";
  mainVideo = mainVideoArray[value];
  mainVideo.currentTime = 0;

  playVideo(mainVideo);
}

function setLastVideo() {
  clearVideo();

  lastVideo.style.display = "flex";

  playLastVideo(lastVideo);
}

function clearVideo() {
  //last video clear
  lastVideo.style.display = "none";
  stopVideo(lastVideo);

  //disable all video
  for (let index = 0; index < mainVideoArray.length; index++) {
    const element = mainVideoArray[index];
    element.style.display = "none";
    stopVideo(element);
  }
}

function stopVideo(video) {
  video.pause();
  video.currentTime = 0;
}

function pauseVideo(video) {
  video.pause();
}

function playVideo(video) {
  video.play();

  //fires if the video end
  video.addEventListener("ended", OnVideoEnded);
}

function playLastVideo(video) {
  video.play();

  //fires if the video end
  video.addEventListener("ended", OnLastVideoEnded);
}

function OnVideoEnded() {
  //add stage options
  addOptions();
}

function OnLastVideoEnded() {
  //clear video
  clearVideo();

  //add final feed
  addVideoEnd();

  //NOTIFY

  //add last ui interaction
  let indexScore = 0;

  for (let index = 0; index < limitScore.length; index++) {
    const number = limitScore[index];

    if (userScore >= number) {
      indexScore++;
    }
  }

  createResult(indexScore);
}

//////OPTIONS SYSTEM//////
let optionContainer = document.getElementsByClassName("App-optionsCont")[0];
let questionContainer = document.getElementsByClassName("App-question")[0];
let endContainer = document.getElementsByClassName("App-endVideo")[0];

let indexStage = 0;
let maxScore = 0;
let userScore = 0;

let answerArray = [];

let optionsArray = null;

let limitScore = [];

$.getJSON("../data.json", (data) => {
  optionsArray = data;
  console.log("Data Readed: ", optionsArray);

  maxScore = 0;

  for (let index = 0; index < optionsArray.length; index++) {
    const element = optionsArray[index];

    let copyArray = Array.from(element.options);

    let maxScoreObject = copyArray.sort(compareMaxScoreOptions);

    maxScore += maxScoreObject[0].value;
  }

  limitScore[0] = maxScore * 0.5;//bronze
  limitScore[1] = maxScore * 0.7;//silver
  limitScore[2] = maxScore * 0.9;//gold

  console.log("Max Score: ", maxScore);
  console.log("Bronze Score: ", limitScore[0], ", Silver Score: ", limitScore[1], ", Gold Score: ", limitScore[2]);
});

function addOptions() {
  optionContainer.innerHTML = null;

  //add text stage info
  createQuestion(optionsArray[indexStage].question);

  //add option stage
  for (let index = 0; index < optionsArray[indexStage].options.length; index++) {
    const element = optionsArray[indexStage].options[index];

    createOption(element);
  }

  pauseVideo(mainVideo);
}

function createOption(object) {
  let container = document.createElement("div");
  let title = document.createElement("h4");

  title.innerHTML = object.data;

  container.setAttribute("class", "App-option");
  container.appendChild(title);

  container.addEventListener("click", (e) => selectOption(object));

  container.classList.add('animated', 'fadeIn');

  optionContainer.appendChild(container);
}

function selectOption(data) {
  //update score
  userScore += data.value;
  console.log("Current Score: ", userScore, ", Max Score: ", maxScore);
  //clean the options & text
  cleanOptions();
  //next stage
  indexStage++;

  //save user answer id
  answerArray.push(data.id);

  //if there is no more stages, lets show the results
  if (indexStage >= optionsArray.length) {
    setLastVideo();
  } else { //if there is more stages
    setVideo(indexStage);
  }
}

function cleanOptions() {
  //clean the options & text
  optionContainer.innerHTML = null;
  questionContainer.innerHTML = null;
}

function compareMaxScoreOptions(a, b) {
  return b.value - a.value;
}

function createQuestion(value) {
  let text = document.createElement("h3");

  //add stage text
  text.innerHTML = value;

  text.classList.add('animated', 'fadeIn');

  questionContainer.appendChild(text);
}

function addVideoEnd(){
  let text = document.createElement("h3");
  text.innerHTML = "¡Has acabado la prueba!";

  let p = document.createElement("p");
  p.innerHTML = "Ve a la siguiente diapositiva para ver resultados.";

  let container = document.createElement("div");  
  container.classList.add('animated', 'fadeIn');

  container.appendChild(text);
  container.appendChild(p);
  endContainer.appendChild(container);
}

function clearVideoEnd(){
  endContainer.innerHTML = null;
}

//////RESULTS SYSTEM//////
let resultsContainer = document.getElementsByClassName("App-results")[0];

function createResult(value){
  cleanResults();

  let img = document.createElement("img");
  img.src = `../src/img/${value}.png`;

  img.setAttribute("class", "App-imgResult");
  img.classList.add('animated', 'fadeIn');

  resultsContainer.appendChild(img);
}

function cleanResults(){
  resultsContainer.innerHTML = null;
}

//////SLIDES//////
mySwiper.on('slideChangeTransitionEnd', OnSlideChange);

function OnSlideChange() {
  //console.log("Slide Index Changed to: " + mySwiper.realIndex);

  switch (mySwiper.realIndex) {
    default:
      break;
      //if the swiper is in the 1th slide
    case 0:
      if (mainVideo) {
        pauseVideo(mainVideo);
      }
      cleanOptions();
      break;
      //if the swiper is in the 2th slide
    case 1:
      //if the video HTML tag exist, play video
      if (indexStage >= mainVideoArray.length) {

      } else {
        setVideo(indexStage);
      }
      break;
      //if the swiper is in the 3th slide
    case 2:
      if (mainVideo) {
        pauseVideo(mainVideo);
      }
      cleanOptions();
      break;
  }
}

//////KME360//////

let mainTitle = document.getElementsByClassName("App-title")[0];

//
let cc = "alejandro.dominguez";
let token = "*$Km3Coomeva2018$*";

let str = md5(cc + "" + token).toString(16);

let data = {
  username: cc,
  token: str
}

let miInit = {
  mode: 'no-cors',
  method: "POST",
  body: JSON.stringify(data)
};

let strURL = `https://coomeva.kmelx.com/api/users/login`;

function recibirDatos() {
  fetch(strURL, miInit)
    .then((response) => {
      console.log(response);
      return response.json();
    }).then((myJson) => {
      /*
      console.log("DATOS-----------", myJson);
      console.log("USER-----------", data);
      */
  });
}

setTimeout(recibirDatos, 1000);