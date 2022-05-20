/* Event to read DB at the body load */
document.addEventListener('readystatechange', event =>{
  
  readDB();

});

/* Function to read the Json data */
async function readDB(){
  var WordsDB = await fetch('../static/js/db.json');
  var WordsObject = await WordsDB.json();

  //console.log(WordsDB);
  //console.log(WordsObject);
  return WordsObject; 
}

/* Function for convert the JSON Object  */
async function convertArray(object){
  var WordsArray = [];

  /* Converting object in array. and save as string content*/
  for (var i in object.words){
    WordsArray.push(String([object.words[i]]));
  }

  return WordsArray;
}

function addWord() {
  /* Reading the values on the input text */
  let newWord = document.getElementById("textInput").value;
  let warning = document.getElementById("warning");

  /* Clean the warning */
  warning.innerHTML = "";

  /* Validate the characters must be letters */
  var letters = /^[A-Za-z]+$/;

  if(newWord.length > 8 || newWord.length < 4){
    warning.style.color = "red";
    warning.innerHTML = "Min 4 y Max 8 letras estan admitidas";
    
  } else {
    if(!newWord.match(letters)){
      warning.style.color = "red";
      warning.innerHTML = "Solo letras estan admitidas";    
    } else{
      saveLocalSession(newWord);
      location.href = "Juego.html"
    }
  }
  var localSe = sessionStorage.getItem("Word");
//  console.log(localSe);
}

// Save to Local Session the word. 
function saveLocalSession(Word){
  var WordUpper = Word.toUpperCase();
  sessionStorage.setItem("Word", WordUpper);
}

// Funcion para iniciar el Juego
function initGame() {
  wordSelected();
  location.href = "./pages/Juego.html";
}

// Function for restart the game.
function restartGame(){
  wordSelected();
  //location.href = "./Juego.html";
  
}

// Funcion para escoger la palabra aleatoria
async function wordSelected(){
  // Read DB 
  var WordsObject = await readDB();
  
  // Convert the Object in Array
  var WordsArray = await convertArray(WordsObject);

  // Select the word randomly based on the array length
  var Word = WordsArray[Math.floor(Math.random()*WordsArray.length)];

  //Call function to save the word on local Session
  saveLocalSession(Word);
}


//hangmanGame function
function hangmanGame(){
  var Word = sessionStorage.getItem("Word");
  sessionStorage.setItem("OriginalWord",Word);
  sessionStorage.setItem("Oportunities",Word.length);

  console.log(Word);

  drawOportunities(Word);
  var $Oportunities = document.getElementById("Oportunities");
  var $Word = document.getElementById("Word");


  document.addEventListener('keydown', logKey);
  function logKey(e) {
    if (e.key.length > 1){
      console.log(e.key);
    }else{
      console.log(e.key);
      var key = e.key.toUpperCase();
      keyPressed(key);
    }    
  }
}

// Draw he oportunities and the letters spaces under hagnman. 
function drawOportunities(Word){
    
  for (var i = 0; i < Word.length; i++ ){
    var $img = document.getElementById("img"+[i]);
    $img.style.display = "block";
  }
}



// funcion para guardar la tecla que se presiono
function keyPressed(key) {
  var Word = sessionStorage.getItem("Word");
  var Oportunities = sessionStorage.getItem("Oportunities");
  

  // Validate the key pressed most be a letter
  key = onlyLetter(key);drawWordPressed


  if (Word.includes(key)){
    // Delete the found letter.
    newWord = Word.replace(key, "");
    console.log(newWord.length);   
    
    youWin(newWord);
    saveLocalSession(newWord);
    drawWordPressed(key,"Word");

  } else {
    
    //Take off one oportunitie
    failLetter(Oportunities,key);
  }

}


//rest 1 oportunities, draw the letter, draw the space and draw the hangman. 
function failLetter(Oportunities,key) {
  const letter = document.getElementById("img" + (Oportunities - 1 ));
  const body = document.getElementById('body'+ (Oportunities - 1));
  letter.style.display = 'none';
  body.style.display = 'block';
  Oportunities -= 1;
 // console.log(letter);
  drawWordPressed(key,"usedletter");

   
  console.log(Oportunities);
  youLose(Oportunities)

  sessionStorage.setItem("Oportunities",Oportunities);
}


// Function draw the letter pressed.
function drawWordPressed(key,id){
  console.log(key,id);
  var $Word = document.getElementById(id);

  var $p = document.createElement("p");
  $p.classList.add("keyword");
  $p.classList.add("p");
  $p.textContent = key;
  $Word.appendChild($p);

}



function youLose(Oportunities){
  if (Oportunities === 0){
    alert("Sorry u lose the game");
    var originalWord = sessionStorage.getItem("OriginalWord");
    drawWordPressed(originalWord,"originalWord")
  }

}

function youWin(Word){
  if(Word.length < 1){    
    var originalWord = sessionStorage.getItem("OriginalWord");
    
    drawWordPressed(originalWord,"originalWord")
    alert("You Win");
  }
}

// funcion para validar letras
function onlyLetter(key){
  var letters = /^[A-Za-z]+$/;
  if(key.length != 1){
    alert("Solo letras estan admitidas");
    return null;
  }
  if(!key.match(letters)){
    alert("No esta permitido numeros o simbolos");
  } else{
    return key;
  }
}