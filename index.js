import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//our database URL
const appSettings = {
    databaseUrl: "https://realtime-database-1bc48-default-rtdb.firebaseio.com/",
    projectId: "realtime-database-1bc48"//agregar siempre el ID del proyecto
}
//databse information:
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorstmentsInDb = ref(database,"endorsments")
 
//obtener DOMs
const publishBtnEl = document.getElementById("publishButton")
let inputFieldEL = document.getElementById("inputField")
let endorsmentsSection = document.getElementById("endorsmentsSection")
let fromFieldEl = document.getElementById("fromField")
let toFieldEl = document.getElementById("toField")


publishBtnEl.addEventListener("click", function() {
    let inputFieldValue = inputFieldEL.value
    let fromFieldValue = fromFieldEl.value
    let toFieldValue = toFieldEl.value
    if(inputFieldValue && fromFieldValue && toFieldValue) {

        let commentData = {//mandamos el objeto que contiene la información completa
            from: fromFieldValue,
            to: toFieldValue,
            text: inputFieldValue
        }
        push(endorstmentsInDb, commentData)//mandamos guardar a la base de datos
        cleanInputsFields()
    }
   // return fromFieldValue.value = ""
})

onValue( endorstmentsInDb, function(snapshot) {
    cleanEndorsmentsList()
    let endorsmentsArray = Object.entries( snapshot.val() )
    for (let i = 0 ; i < endorsmentsArray.length; i++) {//array de arrays
        showEndorsments(endorsmentsArray[i])//le paso tanto [0] que tiene el ID y el [1] que tiene el value, que en este caso es un objeto en si mismo
    }
    
})

function showEndorsments(item) {
    //trae los items en pares, 0 el id y 1 el valor
    let itemId = item[0]//tengo el ID
    let itemValue = item[1]//tengo el objeto, que contiene las keys "from, to, text" que debo acceder
    let newEl = document.createElement("li")
    let divToComments = document.createElement("div")
    let likeToComments = document.createElement("p")//para poder escuchar eventos en él
    let likeCounter = 0
    let commentsFooter = document.createElement("footer")


//organizar el interior del <li>
    divToComments.setAttribute("id", "divInsideComments")
    likeToComments.setAttribute("id", "likeIconComments")
    commentsFooter.setAttribute("id", "commentsFooterDiv")

    //preparando la división de los elementos htmls dinámicos:
    likeToComments.innerHTML = `❤`
    commentsFooter.innerHTML = ` 
        <h4> From ${itemValue.from} </h4> 
    `
    commentsFooter.appendChild(likeToComments)

    divToComments.innerHTML = `
        <h4> To ${itemValue.to} </h4>  
        <p> ${itemValue.text} </p>
    `
    divToComments.appendChild(commentsFooter)
    
    

    //newEl.textContent = itemValue
    newEl.appendChild(divToComments) 

    newEl.addEventListener("dblclick", function() {
        let confirmation = confirm("Are you sure you want to eliminated this comment?")
        if (confirmation) {
            let exactLocationOfItemInDb = ref( database, `endorsments/${itemId}` )
            remove(exactLocationOfItemInDb)
            alert("The comment was eliminated")
        }
    })

    //evento para dar like
    likeToComments.addEventListener("click", function() {
        likeCounter += 1
        likeToComments.innerHTML = `❤️ ${likeCounter}` 
        
    })



   /*  endorsmentsSection.innerHTML += `<li> ${itemValue} </li>` */
   endorsmentsSection.append(newEl)
} 

//limpieza
function cleanInputsFields() {
   return inputFieldEL.value = "", fromFieldEl.value = "", toFieldEl.value = ""
}

function cleanEndorsmentsList() {
    return endorsmentsSection.textContent = ""
}