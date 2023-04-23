
// Mobil-Menü-Event
document.getElementById("menuIcon").addEventListener('click', showMobileMenu)

// Übergabeart-Event
document.getElementById("field4").addEventListener('change', checkType);

// PLZ-Pürfung-Event
document.getElementById("field6").addEventListener('change', checkPLZ);

// Andere Kleidungsart-Event
document.getElementById("other").addEventListener('click', showNewInput);

// Formularabgabe-Event
let formEl = document.querySelector('.form');
formEl.addEventListener("submit", handleSubmit);

//Kleidungsart-Prüfung-Event
let checkboxes = document.getElementsByClassName("clothesType")
for(let i = 0; i < checkboxes.length; i++){
    checkboxes[i].addEventListener('click', checkClothesType);
}

function showMobileMenu() {
    var menuLinks = document.getElementById("menuLinks");
    if (menuLinks.style.display === "block") {
        menuLinks.style.display = "none";
    }else {
        menuLinks.style.display = "block";
    }
}

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
    let errorParent = document.getElementById("plzLabel");
    let plzValue = document.getElementById("field6").value;
    let correctInput = false;
    let p = document.createElement("p");
    let text = document.createTextNode("Leider bieten wir keine Abholung für diesen Ort an.");

    p.appendChild(text);
    p.setAttribute("id", "errorMessagePLZ");
    p.style.color = "red";
    p.style.marginBlockStart = 0;
    p.style.marginBlockEnd = 0;

    if(plzValue.length !== 5 || !plzValue.startsWith('60')){
        document.getElementById("field6").style.border = "medium solid red";
        correctInput = false;
    }else{
        document.getElementById("field6").style.border = "medium solid green";
        correctInput = true;
    }

    //Überprüft, ob die Fehlernachricht bereits angezeigt wird
    if(!correctInput){
        if(!errorParent.contains(document.getElementById("errorMessagePLZ"))){
            errorParent.appendChild(p);
        }
    }else {
        if(errorParent.contains(document.getElementById("errorMessagePLZ"))){
            errorParent.removeChild(document.getElementById("errorMessagePLZ"));
        }
    }

    return correctInput;
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
    if(checkClothesType() && checkPLZ()){
        
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
    }
}


// https://www.tutorials.de/threads/pruefen-ob-mind-1-checkbox-gecheckt-ist.389018/
function checkClothesType(){
    checkboxes = document.getElementsByClassName("clothesType");
    let checked = false;

    for(let i=0; i<checkboxes.length; i++){
        if(checkboxes[i].checked){
            checked = true;
            break;
        }
    }

    if(!checked){
        let errorParent = document.getElementById("errorParent");
        let p = document.createElement("p");
        let text = document.createTextNode("Bitte Art der Kleidung angeben");

        p.appendChild(text);
        p.setAttribute("id", "errorMessage");
        p.style.color = "red";
        p.style.marginBlockStart = 0;
        p.style.marginBlockEnd = 0;

        if(!errorParent.contains(document.getElementById("errorMessage"))){
            errorParent.appendChild(p);
        }
    }else {
        if(errorParent.contains(document.getElementById("errorMessage"))){
            errorParent.removeChild(document.getElementById("errorMessage"));
        }
    }
    return checked;
}

function showConfirmation(jsonData){
    let object = JSON.parse(jsonData);
    // console.log(object);

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