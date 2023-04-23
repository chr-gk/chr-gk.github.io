
// document.querySelector("form").onsubmit = function() {
//     let suche = document.querySelector(".test2").value;
//     if (suche.length < 3) {
//         alert("zu kurzer Suchbegriff");
//     } else {
//         alert("Super");
//     }
//     return false;
// }


let div = document.getElementById("parent");
let bt = document.getElementById("submitButton");
bt.addEventListener("click", validate);
div.addEventListener("blur", validate);
function validate(){
    let markedcheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    let checkboxes = document.getElementsByClassName("clothesType");
    if(markedcheckboxes.length >0){
        checkboxes.required = false;
    }else{
        checkboxes.required = true;
    }
}

// Übergabeart-Event
document.getElementById("field4").addEventListener('change', checkType);

// PLZ-Event
document.getElementById("field6").addEventListener('change', checkPLZ);

// Andere Kleidungsart-Event
document.getElementById("other").addEventListener('click', showNewInput);

// Formularabgabe-Event
let formEl = document.querySelector('.form');
formEl.addEventListener("submit", handleSubmit);

// Übergabeart-Funktion
function checkType(){
    let type = document.getElementById("field4");
    let street = document.getElementById("field5");
    let plz = document.getElementById("field6");
    let city = document.getElementById("field7");
    
    if(type.value === "Geschäftsstelle Frankfurt"){
        // Setzen der Adresse der Geschäfsstelle
        street.value = "Teststraße 15";
        plz.value = "60306";
        city.value = "Frankfurt";
        
        // Anzeigen des Autofills durch Rahmen & ReadOnly zur Fehlervermeidung
        street.readOnly = true;
        street.style.border = "medium solid aqua"
        
        plz.readOnly = true;
        plz.style.border = "medium solid aqua"
        
        city.readOnly = true;
        city.style.border = "medium solid aqua"
    }else{
        // Adresseingabe für Abholung ermöglichen
        street.value = "";
        street.readOnly = false;
        street.style.border = "initial"

        plz.value = "";
        plz.readOnly = false;
        plz.style.border = "initial"

        city.value = "";
        city.readOnly = false;
        city.style.border = "initial"
    }
}

// PLZ-Funktion
function checkPLZ(){
    let val = document.getElementById("field6").value;

    if(val.length !== 5 || !val.startsWith('60')){
        document.getElementById("field6").style.border = "medium solid red";
    }else{
        document.getElementById("field6").style.border = "medium solid green";
    }
}

// Andere Kleidungsart-Funktion
function showNewInput(){
    let input = document.createElement("input");
    let parent = document.getElementById("parent");
    let other = document.getElementById("other").checked;

    // Definieren eines neuen Text-Inputs für diverse Kleidungsstücke
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'AdditionalClothes');
    input.setAttribute('name', 'Kleidung');
    input.setAttribute('class', 'clothesType')
    input.setAttribute('placeholder', 'Bitte angeben...');
    input.required = true;
    
    // Laden bzw. Entfernen des Text-Inputs abhängig von der Checkbox 'Anderes'
    if(other === true){
        parent.appendChild(input);
    }else if(other === false){
        parent.removeChild(document.getElementById("AdditionalClothes"));
    }
}

// Formularabgabe-Funktion
function handleSubmit(event){
    event.preventDefault();
    // if(checkClothesType()){
        
        //Inputs erneut überprüfen?
        
        let arr = AttributesToArray();
        let fdata = new FormData(formEl);
        fdata.append("Datum der Registrierung", new Date().toLocaleString('en-GB', {hour12: false}));
        fdata.set("Kleidung", arr);
        let data = Object.fromEntries(fdata);
        let jsonData = JSON.stringify(data);
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        }).then(res => res.json())
        .then(result => console.log(result))
        .then(showConfirmation(jsonData))
        .catch(err => console.log(err))
    // }else{
    //     alert("Bitte Art der Kleidung angeben!");
    // }
    
}


// https://www.tutorials.de/threads/pruefen-ob-mind-1-checkbox-gecheckt-ist.389018/
function checkClothesType(){
    let checkboxes = document.getElementsByClassName("clothesType");
    let checked = false;

    for(let i=0; i<checkboxes.length; i++){
        if(checkboxes[i].checked){
            checked = true;
            break;
        }
    }
    
    if(!checked){
        document.getElementById("socks").required = true; 
    }
}

function showConfirmation(jsonData){
    let object = JSON.parse(jsonData);
    console.log(object);

    // Entfernen der Registrierung
    let parent = document.getElementById("mainPart");
    let registration = document.getElementById("registration");
    parent.removeChild(registration);

    // Erstellen der neuen section
    let section = document.createElement("section");
    section.setAttribute("id", "confirmation");
    parent.appendChild(section);

    // Erstellen des neuen Headers
    let header = document.createElement("h2");
    header.setAttribute("id", "h2_confirmation");
    header.innerText = "Registrierungsbestätigung";
    section.appendChild(header);
    
    //Kurztext, abhängig von Art der Abgabe über der Bestätigung
    let paragraph = document.createElement("p");
    if(object.Übergabeart === "Abholung per Sammelfahrzeug"){
        let pText = document.createTextNode("Vielen Dank für Ihre Registirierung. " +
        "Sie erhalten eine E-Mail mit allen weiteren Informationen für die Abholung. " +
        "Bei Rückfragen stehen wir gerne zur Verfügung.");
        paragraph.appendChild(pText);
    }else {
        let pText = document.createTextNode("Vielen Dank für Ihre Spende. " +
        "Die folgende Bestätigung erhalten Sie zusätzlich als Mail. " +
        "Wir informieren Sie, sobald Ihre Kleidung in dem Krisengebiet angekommen ist.");
        paragraph.appendChild(pText);
    }
    section.appendChild(paragraph);

    // Erstellen der Bestätigungspositionen
    for(attribute in object){
        let p = document.createElement("p");
        let text = document.createTextNode(attribute + ": " + object[attribute]);
        p.appendChild(text);
        section.appendChild(p);
        // console.log(attribute + ": " + object[attribute]);
    }
}

//Kleidungsarten-Checkboxen zu einem Array bündeln
function AttributesToArray(){
    let arr = [];
    let additionalClothes = document.getElementById("AdditionalClothes")
    let checkboxes = document.getElementsByClassName("clothesType");

    if(document.body.contains(additionalClothes)){
        document.getElementById("other").value = additionalClothes.value;
    }
    
    for(let i = 0; i < checkboxes.length; i++){
        if(checkboxes[i].checked){
            arr.push(checkboxes[i].value);
        }
    }
    return arr
}
