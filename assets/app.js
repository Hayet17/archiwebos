const imgcontainer= document.querySelector('.gallery');
const portfolio= document.querySelector('#portfolio');
const filtres = document.querySelector('.filtres');
const updateProjectsButton = document.querySelector('#updateprojects');
const imgModal = document.querySelector('.photos');
const selectcateg = document.querySelector('#selectcategorie');
const overlay = document.querySelector('#overlay');


function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
//recupération de tous les projets( tous les boutons de filtrage de catégorie)
function get_projects(categid='all'){
  //faire un appel à lapi avec fetch pour recupérer tous les projets 
  fetch('http://localhost:5678/api/works')
  .then((response) => response.json()) 
    .then((prj) => {
      // supprimer les images de la modal avant de les rajouter
      imgModal.innerHTML = '';
      //Parcourir les projets 1 par 1 
      for(i=0; i < prj.length; i++){
          //Creer balise figure
          let fig = document.createElement('figure');
          //creer balise img
          let img = document.createElement('img');
          img.src = prj[i].imageUrl;

          // clone (duplique) l'élément image afin de l'ajouter à la modal
          let imgClone = img.cloneNode(true);

          // DEBUT de la création de la modal
            // creer les balises pour stocker l'image et les "actions" (editer, supprimer) de la modal
          let divModal = document.createElement('div');
          divModal.classList.add('item');
          let iconeRemoveModal = document.createElement('span');
          iconeRemoveModal.classList.add('icone');
          iconeRemoveModal.classList.add('icone-remove');
          iconeRemoveModal.classList.add('fa');
          iconeRemoveModal.classList.add('fa-trash');
          
          // Ajoute l'attribut data-id sur l'icone de suppression afin de récupérer l'id du work
          iconeRemoveModal.setAttribute('data-id', prj[i].id)
          divModal.appendChild(imgClone);
          divModal.appendChild(iconeRemoveModal);
          imgModal.appendChild(divModal);

          // Création des eventListener
          iconeRemoveModal.addEventListener('click', removeWork);
          // FIN de la création de la modal

          //mettre <img> dans <figure>
          fig.appendChild(img);
          let capTitle = prj[i].title;

          // creer balise figcaption
          let cap = document.createElement("figcaption");
          cap.innerHTML = capTitle;

          console.log(categid);
          //Si la categorie que j'ai selectionné depuis le filtre == à la categorie du projet encours que j'ai récuperé de lapi
          //j'affiche la photo
          if((categid == prj[i].category.id) || (categid=='all')){
            fig.appendChild(cap);
            imgcontainer.appendChild(fig);
          }          
      }
    });
}

  // categorie
  fetch('http://localhost:5678/api/categories')
  .then((response) => response.json())
  .then((categ) => {  
    for(i=0; i < categ.length; i++){
      //console.log(categ[i].name);
      let btn = document.createElement('button');
          btn.innerHTML=categ[i].name;
          btn.id = categ[i].id;
      // inserer le bouton dans la balise div.filtres
      filtres.appendChild(btn);
        //ajouter les categories dans le modal ajout photo
          let op = document.createElement("option");
            op.value = categ[i].id;
            op.innerHTML=categ[i].name;
          selectcateg.appendChild(op);
    }
    //Traiter le clic sur les boutons fitres
        let boutons = document.getElementsByTagName("button");
        //Parcourir tous les boutons avec le compteur elem
        for(const elem of boutons){
          elem.addEventListener("click", myFunction);
          function myFunction() {
           
            let b = document.getElementsByTagName("button");
            console.log(b);
            for(j=0; j < b.length; j++) b[j].classList.remove("clickactive");
  
            elem.classList.add("clickactive");
            removeAllChildNodes(imgcontainer);
            get_projects(elem.id);
          }
          
          
        }
       

  });

  getAllProjects();
  function getAllProjects(){
    get_projects('all');
  }

// Si je suis connecté
if (window.localStorage.getItem('token')) {
  // J'affiche le bouton "modifier"
  updateProjectsButton.classList.remove('hidden');
  // Lorsque je clique sur le bouton modifier
  updateProjectsButton.addEventListener('click', () => {
    // Affichage de l'overlay
    overlay.classList.remove('hidden');
    // Affichage de la modal
    document.querySelector('#modal').classList.remove('hidden');


    
  });
  // si je click sur ajouter photo je cache la modal #modal et j'affiche la modale d'ajout d'image #modalajout
  let ajouterphoto = document.querySelector("#ajouterphoto");
    ajouterphoto.addEventListener('click', () => {
      document.querySelector('#modal').classList.add('hidden');
      overlay.classList.remove('hidden');
      document.querySelector('#modalajout').classList.remove('hidden');
    });
    // remplacer login par logout
    document.querySelector('.logout').innerHTML="logout";
}

// envoi nouveau works

let validbtn = document.querySelector("#validerajout");
validbtn.addEventListener("click", creatework)

function creatework(){
  let wimg = document.getElementById('image').files[0];
  let wtitle = document.getElementById('titre').value;
  let wcateg = document.getElementById('selectcategorie').value;
  //message d'erreur si le formulaire n'est pas bien rempli
  if(wimg=="" || wtitle=="" || wcateg==""){
    document.querySelector(".erreurform").innerHTML="erreur, veuillez remplir tous les champs";
  } else {
    let token = window.localStorage.getItem("token");

    //envoi des elements recupérés a l'API /works en methode POST pour l'ajout de l'image
    (async () => {
      const formData = new FormData();
      formData.append('image', wimg);
      formData.append('title', wtitle);
      formData.append('category', wcateg);

      const rawResponse = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        body: formData
      });
      const content = await rawResponse.json();
      console.log(content);
    })();

  }
}

// START FUNCTIONS EVENTLISTENER
function removeWork(event) {
  event.preventDefault();
  // Récupération de l'élément sur lequel j'ai cliqué
    const item = event.target;
    const id = item.getAttribute('data-id');
    const token = window.localStorage.getItem('token');
    console.log(token);
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  });
}
// END FUNCTIONS EVENTLISTENER

function closeModal() {
  document.querySelectorAll('.modal-container').forEach(item => item.classList.add('hidden'));
  overlay.classList.add('hidden');
}
document.querySelectorAll('.gerermodal .fa-solid.fa-xmark').forEach(element => element.addEventListener('click', closeModal));
document.querySelector('#overlay').addEventListener('click', closeModal);

function previousModal(event) {
  console.log('hello');
  const element = event.target;
  const modal = element.closest('.modal-container');
  modal.classList.add('hidden');
  document.querySelector('#modal').classList.remove('hidden');
}

document.querySelectorAll('.gerermodal .fa-solid.fa-arrow-left').forEach(element => element.addEventListener('click', previousModal));


document.querySelector('#image').addEventListener('change', (event) => {
  const img = event.target;
  const [file] = img.files
  if (file) {
    document.querySelector('#img-upload').src = URL.createObjectURL(file)
  }
});
document.querySelector('.logout').addEventListener('click', () => {
  window.localStorage.removeItem('token');
});
document.querySelector('#addPicture').addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#image').click();
});
