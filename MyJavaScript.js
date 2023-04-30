//Selektor-Funktion
let $ = function(id){
    return document.getElementById(id);
}

// 1. Abschnitt - Initialisieren der Events

// Mobil-Menü-Event[1]
$("menuIcon").addEventListener('click', showMobileMenu)

// Übergabeart-Event[2]
$("field4").addEventListener('change', checkType);

// PLZ-Prüfung-Event[3]
$("field6").addEventListener('change', checkPLZ);

// Andere-Kleidungsart-Event[4]
$("other").addEventListener('click', showNewInput);

// Formularabgabe-Event[5]
let form = $('form');
form.addEventListener("submit", executeSubmit);

//Kleidungsart-Prüfung-Event[6]
let checkboxes = document.getElementsByClassName("clothesType")
for(let i = 0; i < checkboxes.length; i++){
    checkboxes[i].addEventListener('click', checkClothesType);
}

// 2. Abschnitt - Event-Funktionen

// Mobil-Menü-Funktion[1]
function showMobileMenu() {
    let menuLinks = $("menuLinks");

    // Sichtbarkeit des mobile Menus, an- bzw. abschalten
    if (menuLinks.style.display === "block") {
        menuLinks.style.display = "none";
    }else {
        menuLinks.style.display = "block";
    }
}

// Übergabeart-Funktion[2]
function checkType(){
    let type = $("field4");
    let street = $("field5");
    let plz = $("field6");
    let city = $("field7");
    
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

// PLZ-Prüfung-Funktion[3]
function checkPLZ(){
    let errorParent = $("plzLabel");
    let plzValue = $("field6").value;
    let correctInput = false;

    // Erstellen der Fehlermeldung
    let p = document.createElement("p");
    let text = document.createTextNode("Leider bieten wir keine Abholung für diesen Ort an.");
    p.appendChild(text);
    p.setAttribute("id", "errorMessagePLZ");
    p.style.color = "red";
    p.style.marginBlockStart = 0;
    p.style.marginBlockEnd = 0;

    // Prüfen ob PLZ fünfstellig und mit 60 beginnt
    if(plzValue.length !== 5 || !plzValue.startsWith('60')){
        $("field6").style.border = "medium solid red";
        correctInput = false;
    }else{
        $("field6").style.border = "medium solid green";
        correctInput = true;
    }

    //Prüfen, ob die Fehlernachricht bereits angezeigt wird
    if(!correctInput){
        if(!errorParent.contains($("errorMessagePLZ"))){
            errorParent.appendChild(p);
        }
    }else {
        if(errorParent.contains($("errorMessagePLZ"))){
            errorParent.removeChild($("errorMessagePLZ"));
        }
    }

    return correctInput;
}

// Andere-Kleidungsart-Funktion[4]
function showNewInput(){
    let input = document.createElement("input");
    let parent = $("parent");
    let other = $("other").checked;

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
        parent.removeChild($("AdditionalClothes"));
    }
}

// Formularabgabe-Funktion[5]
function executeSubmit(event){
    event.preventDefault();

    // Erneutes check-Funktionen
    if(checkClothesType() && checkPLZ()){
        
        // Formulardaten wandeln, an API senden und bei Erfolg Bestätigung erstellen
        let arr = mergeAttributesToArray();
        let fdata = new FormData(form);
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
        .catch(err => alert(err))
    }
}

// Checkoxen wie Pflichtfeld behandeln
function checkClothesType(){
    checkboxes = document.getElementsByClassName("clothesType");
    let checked = false;

    // Checkboxen prüfen
    for(let i=0; i<checkboxes.length; i++){
        if(checkboxes[i].checked){
            checked = true;
            break;
        }
    }

    //Falls keine angehakt, Hinzufügen der Fehlernachricht, falls noch nicht vorhanden
    if(!checked){
        let errorParent = $("errorParent");
        let p = document.createElement("p");
        let text = document.createTextNode("Bitte Art der Kleidung angeben");

        p.appendChild(text);
        p.setAttribute("id", "errorMessage");
        p.style.color = "red";
        p.style.marginBlockStart = 0;
        p.style.marginBlockEnd = 0;

        if(!errorParent.contains($("errorMessage"))){
            errorParent.appendChild(p);
        }
    }else {
        if(errorParent.contains($("errorMessage"))){
            errorParent.removeChild($("errorMessage"));
        }
    }
    return checked;
}

// 3. Abschnitt - Weitere Funktionen

// Erstellen der Registrierungsbestätigung
function showConfirmation(jsonData){
    let object = JSON.parse(jsonData);

    // Entfernen der Registrierung
    let parent = $("mainPart");
    let registration = $("registration");
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
    }
}

//Kleidungsarten-Checkboxen zu einem Array bündeln
function mergeAttributesToArray(){
    let array = [];
    let additionalClothes = $("AdditionalClothes")
    let checkboxes = document.getElementsByClassName("clothesType");

    // Textbox für variablen Input wird als Wert genommen, falls verwendet
    if(document.body.contains(additionalClothes)){
        $("other").value = additionalClothes.value;
    }
    
    // alle ausgewählten Checkboxen werden dem Array hinzugefügt
    for(let i = 0; i < checkboxes.length; i++){
        if(checkboxes[i].checked){
            array.push(checkboxes[i].value);
        }
    }
    return array
}