const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 8080;


const vect_foldere = ["temp", "logs", "backup", "fisiere_uploadate"];

vect_foldere.forEach((numeFolder) => {

    const caleFolder = path.join(__dirname, numeFolder);

  
    if (!fs.existsSync(caleFolder)) {
        
        fs.mkdirSync(caleFolder);
        console.log(`Folderul "${numeFolder}" a fost creat.`);
    } 
});

app.set('trust proxy', true);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'resurse')));
app.use(function(req, res, next) {
    res.locals.ip = req.ip;
    next();
});

let obGlobal = {
    obErori: null
};

function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, 'erori.json'), 'utf8');
    let obiectErori = JSON.parse(continut);
    
    for (let eroare of obiectErori.info_erori) {
        eroare.imagine = path.join(obiectErori.cale_baza, eroare.imagine);
    }
    obiectErori.eroare_default.imagine = path.join(obiectErori.cale_baza, obiectErori.eroare_default.imagine);
    
    obGlobal.obErori = obiectErori;
}

initErori();

function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroareGasita = obGlobal.obErori.info_erori.find(e => e.identificator === identificator) || obGlobal.obErori.eroare_default;

    let titluFinal = titlu || eroareGasita.titlu;
    let textFinal = text || eroareGasita.text;
    let imagineFinala = imagine || eroareGasita.imagine;

    let statusFinal = identificator || 500;

    res.status(statusFinal).render("pagini/eroare", {
        ...datePagina, 
        titlu: titluFinal,
        infoEroare: {
            ip: res.req.ip,
            titlu: titluFinal,
            text: textFinal,
            imagine: imagineFinala
        }
    });
}

const datePagina = {
    titlu: "F1 Apex Gear",
    autor: "Cirstea Constantin-Valentin",
    descriere: "Echipamente F1 originale pentru fanii adevărați.",
    paginiMeniu: [
        { text: "Acasă", link: "/index", icon: "fas fa-home" },
        { text: "Echipamente", link: "/echipamente", icon: "fas fa-helmet-safety" },
        { text: "Înregistrare", link: "/inregistrare", icon: "fas fa-user-plus" },
        { text: "Contact", link: "/index#contact", icon: "fas fa-envelope" }
    ]
};

app.get(['/', '/index', '/home'], (req, res) => {
    let ipUtilizator = req.ip;
    res.render('pagini/index', datePagina);
});


app.get(/^\/resurse\/.*\/$/, function(req, res) {
    afisareEroare(res, 403);
});

app.get(/\.ejs$/, function(req, res) {
    afisareEroare(res, 400);
});

app.get('/favicon.ico', function(req, res) {
    res.sendFile(path.join(__dirname, 'resurse', 'ico', 'favicon', 'favicon.ico'), function(err) {
        if (err) {
            console.log("Eroare la trimiterea faviconului:", err);
            res.status(404).end(); // Dacă nu găsește fișierul, măcar să nu crape serverul
        }
    });
});

app.get(/^\/(.*)/, function(req, res) {
    let numePagina = req.params[0]; 
    if (!numePagina) numePagina = "index";
    let ipUtilizator = req.ip;

    res.render("pagini/" + numePagina, datePagina, function(eroare, rezultatRandare) {
        if (eroare) {
            if (eroare.message.startsWith("Failed to lookup view")) {
                afisareEroare(res, 404);
            } else {
                afisareEroare(res, 500);
            }
        } else {
            res.send(rezultatRandare);
        }
    });
});


app.listen(port, () => {
    console.log(`Serverul rulează la: http://localhost:${port}`);
});