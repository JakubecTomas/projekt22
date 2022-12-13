// -----------------------
// VYPSÁNÍ HODNOT Z LOCALSTORAGE - SUMARIZACE
// -----------------------


// vyzvednutí v salonu nebo odeslání kurýre
let pickup = localStorage.getItem("odeslatPoukazKuryrem");
let pickupSpace = document.getElementById("summary-client-pickup");
let pickupNote = document.getElementById("summary-client-pickup-note");

if( pickup == "odeslat na adresu") {
    pickupSpace.textContent = "odeslání kurýrem";
    pickupNote.textContent = `Nejpozději do následujícího pracovního dne Vás budeme kontaktovat pro dohodnutí detailů. (adresa doručení, kurýrní společnost, aj.)`;
}
else
    pickupSpace.textContent = "vyzvednutí v salonu (po telefonické domluvě)";



// C.L.I.E.N.T

// jméno objednavatele
let clientName = localStorage.getItem("objednavatelJmeno");
let clientNameSpace = document.getElementById("summary-client-name");
clientNameSpace.textContent = clientName;
// telefon objednavatele
let clientPhone = localStorage.getItem("objednavatelTelefon");
let clientPhoneSpace = document.getElementById("summary-client-phone");
clientPhoneSpace.textContent = clientPhone;
// e-mail objednavatele
let clientEmail = localStorage.getItem("objednavatelEmail");
let clientEmailSpace = document.getElementById("summary-client-email");
clientEmailSpace.textContent = clientEmail;
// poznámka do salonu
let clientNote = localStorage.getItem("objednavatelPoznamkaSalonu");
let clientNoteSpace = document.getElementById("summary-client-note-salon");
clientNoteSpace.textContent = clientNote;



// G.I.F.T.E.D

// provedení poukazu
let variantVoucher = localStorage.getItem("_PROVEDENI POUKAZU");
let variantVoucherSpace = document.getElementById("summary-variant-voucher");
variantVoucherSpace.textContent = variantVoucher;

if(variantVoucher == "elektronická verze") {
    document.getElementById("client--remove-pickup").style.display = "none";
    document.getElementById("summary-client-pickup-note").textContent = "bankovním převodem na účet";
}

if(variantVoucher == "papírová verze") {
    document.getElementById("bank-account-number").style.display = "none";
    document.getElementById("gifted-vs").style.display = "none";
    document.getElementById("final-price").style.display = "none";
    document.getElementById("payable").style.display = "none";
    document.getElementById("warning-pay").style.display = "none";
}


// jméno obdarovaného
let clientforName = localStorage.getItem("obdarovanyJmeno");
let clientForNameSpace = document.getElementById("summary-gifted-name");

clientForNameSpace.textContent = clientforName;






// proměnné pro výběr hodnot do poukazu (název / hodnota)
let figureName = localStorage.getItem("udajeDoPoukazu_1")
let figurePrice = localStorage.getItem("udajeDoPoukazu_2")

// WRITE názvu ošetření
let clientTreatment = localStorage.getItem("osetreniNazev");
let giftedTreatmentSpace = document.getElementById("summary-gifted-treatments");

document.getElementById("gifted--remove-price").style.display = "flex";


// selekce dle výběru - vepsání názvu ošetření
if( figureName == "název ošetření") {
    giftedTreatmentSpace.textContent = clientTreatment;
    document.getElementById("gifted--remove-name").style.display = "flex";  
}

// WRITE ceny ošetření
let clientPrice = localStorage.getItem("osetreniCena");
let giftedPriceSpace = document.getElementById("summary-gifted-price");
let finalPriceSpace = document.getElementById("summary-final-price");
// získání a vypsání pouze číselné hodnoty 
let finalPriceOnly = clientPrice;
 
finalPriceOnly = finalPriceOnly.substr(10);
finalPriceSpace.textContent = finalPriceOnly;



// selekce dle výběru - vepsání hodnoty ošetření
if( figurePrice == "hodnota ošetření") {
    giftedPriceSpace.textContent = clientPrice;
    document.getElementById("gifted--remove-price").style.display = "flex";  
    
}







// přání k poukazu
let wish = localStorage.getItem("obdarovanyPrani");
let wishSpace = document.getElementById("summary-gifted-wish");

if( wish !== "") {
    wishSpace.textContent = wish;
}
else
    document.getElementById("gifted--remove-wish").style.display = "none"




// načtení náhodného kodu ze storage
let randomCode = localStorage.getItem("kodPoukazu");


// variabilní symbol - načtení z localStorage
let getVariabilniSymbol = localStorage.getItem("variabilniSymbol");
document.getElementById("vs-date").innerHTML = getVariabilniSymbol;

// -----------------------
// PŘÍPRAVA PRO ODESLÁNÍ NA SERVER
// -----------------------


// vytvoření classy
class Voucher {
    constructor(jmeno, telefon, email, poznamkaSalon, provedeni, vyzvednuti, osetreni, osetreniCena, kodPoukazu, obdarovana, prani, variabilniSymbol) {
        this.jmeno = jmeno;
        this.telefon = telefon;
        this.email = email;
        this.poznamkaSalon = poznamkaSalon;
        this.provedeni = provedeni;
        this.vyzvednuti = vyzvednuti;
        this.osetreni = osetreni;
        this.osetreniCena = osetreniCena;
        this.kodPoukazu = kodPoukazu;
        this.obdarovana = obdarovana;
        this.prani = prani;
        this.variabilniSymbol = variabilniSymbol;
    }
}

//vytvoření metody
let poukazVyplneno = new Voucher(clientName, clientPhone, clientEmail, clientNote, variantVoucher, pickup, clientTreatment, finalPriceOnly, randomCode, clientforName, wish, getVariabilniSymbol);

if(poukazVyplneno.provedeni == "papírová verze") {
    poukazVyplneno.variabilniSymbol = "";
}

if(poukazVyplneno.provedeni == "papírová verze" && poukazVyplneno.vyzvednuti == null) {
    poukazVyplneno.vyzvednuti = "v salonu";
}

// odeslání na server
let sendToServer = document.getElementById("final-page__link");
sendToServer.addEventListener('click', sendDataToServer);

function sendDataToServer() {

const form = new URLSearchParams(poukazVyplneno);
fetch('https://www.kosmetika-daniela.cz/2022/scripts/mail_offer.php', { // !!!! po nahrání na server změnit na aktuální cestu !!!!!
  method: 'POST',
  body: form
})
}

console.log(poukazVyplneno.email);


// nextStep link dle logiky papírová verze VS elektronická
if(document.getElementById("summary-variant-voucher").textContent == "papírová verze"){
    document.querySelector("#final-page__link").setAttribute("href", "voucher-success-paper.html");
}
else {
    document.querySelector("#final-page__link").setAttribute("href", "voucher-final-offer.html");
}