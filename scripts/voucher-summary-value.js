// -----------------------
// VYPSÁNÍ HODNOT Z LOCALSTORAGE - SUMARIZACE
// VYKRESLOVACÍ LOGIKA
// -----------------------

// hodnota VS ošetření
let ValueVoucher = localStorage.getItem("hodnotaVyber");
let ValueOwn = localStorage.getItem("hodnotaPozadovana");
let giftedValueSpace = document.getElementById("summary-gifted-value");
let finalValueSpace = document.getElementById("summary-final-price");

if(ValueVoucher === "jinaHodnota") {
    // zobrazení <p> a načtení vlastní hodnoty poukazu
    document.getElementById("gifted--remove-value").style.display = "flex"
    finalValueSpace.textContent = ValueOwn + " Kč";
}
else {
    // zobrazení <p> a načtení předurčené hodnoty poukazu
    document.getElementById("gifted--remove-value").style.display = "flex"
    finalValueSpace.textContent = ValueVoucher + " Kč";
}

if(ValueVoucher === "jinaHodnota") {
    giftedValueSpace.textContent = ValueOwn + " Kč";
}
else {
    giftedValueSpace.textContent = ValueVoucher + " Kč";
}

// vyzvednutí v salonu nebo odeslání kurýre
let pickup = localStorage.getItem("odeslatPoukazKuryrem");
let pickupSpace = document.getElementById("summary-client-pickup");
let pickupNote = document.getElementById("summary-client-pickup-note");

if( pickup == "odeslat na adresu") {
    pickupSpace.textContent = "Odeslání kurýrem";
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
let giftedForNameSpace = document.getElementById("summary-gifted-name");
giftedForNameSpace.textContent = clientforName;



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
    constructor(jmeno, telefon, email, poznamkaSalon, provedeni, vyzvednuti, hodnota, hodnotaVlastni, kodPoukazu, obdarovana, prani, variabilniSymbol) {
        this.jmeno = jmeno;
        this.telefon = telefon;
        this.email = email;
        this.poznamkaSalon = poznamkaSalon;
        this.provedeni = provedeni;
        this.vyzvednuti = vyzvednuti;
        this.hodnota = hodnota;
        this.hodnotaVlastni = hodnotaVlastni;
        this.kodPoukazu = kodPoukazu;
        this.obdarovana = obdarovana;
        this.prani = prani;
        this.variabilniSymbol = variabilniSymbol;
    }
}

//vytvoření metody
let poukazVyplneno = new Voucher(clientName, clientPhone, clientEmail, clientNote, variantVoucher, pickup, ValueVoucher, ValueOwn, randomCode, clientforName, wish, getVariabilniSymbol);

// nacteni provedeni poukazu pro následný switch
let vyberPoukazu = localStorage.getItem("_PROVEDENI POUKAZU");

// odeslání na server
let sendToServer = document.getElementById("final-page__link");
sendToServer.addEventListener('click', sendDataToServer);

function sendDataToServer() {

const form = new URLSearchParams(poukazVyplneno);
fetch('https://www.kosmetika-daniela.cz/22/scripts/mail_value.php', { // !!!! po nahrání na server změnit na aktuální cestu !!!!!
  method: 'POST',
  body: form
})
.then(() => {
    switch (vyberPoukazu){
        case "papírová verze":
        window.location.href = "voucher-success-paper.html";
        break;
        case "elektronická verze":
        window.location.href = "voucher-final-value.html";
        break;
    }
    });
}

// podmínky pro "hodnoty do e-mailu"
if(poukazVyplneno.provedeni == "papírová verze") {
    poukazVyplneno.variabilniSymbol = "";
}

if(poukazVyplneno.hodnota == "jinaHodnota") {
    poukazVyplneno.hodnota = "";
}

if(poukazVyplneno.provedeni == "papírová verze" && poukazVyplneno.vyzvednuti == null) {
    poukazVyplneno.vyzvednuti = "v salonu";
}



