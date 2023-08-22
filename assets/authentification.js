
const cnx = document.querySelector("#cnx");
const erreur= document.querySelector(".erreur");


cnx.addEventListener("click", myfunction)
function myfunction(){
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;
    
(async () => {
    const rawResponse = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
        "password": pass
      })
    });
    const content = await rawResponse.json();
  
    //console.log(content); 
    if(content.message){
      erreur.innerHTML = "Login mot de passe incorrect";
    }
    console.log(content.token);
    if(content.token){
      //mettre le token dans localStorage
      window.localStorage.setItem("token", content.token);
      // rediriger vers la page d'accueil
      window.location.href = "index.html";
    }
  })();

}

