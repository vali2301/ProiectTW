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




function valideazaErori() {
    const caleJson = path.join(__dirname, "erori.json");

    // A
    if (!fs.existsSync(caleJson)) {
        console.error("Eroare: Fisierul 'erori.json' nu a fost gasit la calea: " + caleJson);
        process.exit(1);
    }

    const continutString = fs.readFileSync(caleJson, "utf8");
    
    // F
    const regexDuplicate = /"(\w+)":\s*[^,}]*,\s*.*"\1":/g;
    if (regexDuplicate.test(continutString)) {
        console.error("Eroare (Punct F): In fisierul JSON exista proprietati duplicate.");
    }

    let obErori;
    try {
        obErori = JSON.parse(continutString);
    } catch (e) {
        console.error("Eroare: Sintaxa JSON invalida.");
        process.exit(1);
    }

    // B
    const campuriRadacina = ["info_erori", "cale_baza", "eroare_default"];
    campuriRadacina.forEach(camp => {
        if (!obErori.hasOwnProperty(camp)) {
            console.error(`Eroare (Punct B): Lipseste proprietatea obligatorie "${camp}" din radacina JSON-ului.`);
        }
    });

    // C
    const ed = obErori.eroare_default;
    if (ed && (!ed.titlu || !ed.text || !ed.imagine)) {
        console.error("Eroare (Punct C): Obiectul 'eroare_default' trebuie sa contina 'titlu', 'text' si 'imagine'.");
    }

    // D
   
    let directorErori = obErori.cale_baza || "";
    if (!directorErori.startsWith("resurse") && directorErori !== "") {
        directorErori = path.join("resurse", directorErori);
    }
    const caleBazaAbs = path.join(__dirname, directorErori);

    if (!fs.existsSync(caleBazaAbs)) {
        console.error(`Eroare (Punct D): Directorul configurat nu exista pe disc: ${caleBazaAbs}`);
    }

    // E G 
    
    const idsVerificate = [];
    if (Array.isArray(obErori.info_erori)) {
        obErori.info_erori.forEach((eroare) => {
            const caleImg = path.join(caleBazaAbs, eroare.imagine || "");
            if (!fs.existsSync(caleImg)) {
                console.error(`Eroare (Punct E): Imaginea "${eroare.imagine}" pentru ID ${eroare.identificator} nu a fost gasita la ${caleImg}.`);
            }

            if (idsVerificate.includes(eroare.identificator)) {
                console.error(`Eroare (Punct G): Identificatorul "${eroare.identificator}" este duplicat. Proprietati: Titlu: ${eroare.titlu}, Text: ${eroare.text}, Imagine: ${eroare.imagine}`);
            }
            idsVerificate.push(eroare.identificator);
        });
    }
}


valideazaErori();