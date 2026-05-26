window.onload = function () {
    const K = 4; 
    let produseFiltrate = Array.from(document.getElementsByClassName("produs"));
   //bonus 5 
    function afiseazaPagina(P) {
        let articole = document.getElementsByClassName("produs");
        for (let art of articole) {
            art.style.display = "none";
        }
        
        let start = (P - 1) * K;
        let end = P * K - 1;
        
        for (let i = 0; i < produseFiltrate.length; i++) {
            if (i >= start && i <= end) {
                produseFiltrate[i].style.display = "flex";
            }
        }
        
        let butoane = document.querySelectorAll("#container-paginare .btn-pagina");
        butoane.forEach(btn => {
            btn.classList.remove("active");
            if(parseInt(btn.textContent) === P) {
                btn.classList.add("active");
            }
        });
    }

    function renderPagination() {
        let container = document.getElementById("container-paginare");
        if (!container) return;
        container.innerHTML = "";
        
        let N = produseFiltrate.length;
        if (N > K) {
            let NRL = Math.ceil(N / K);
            for(let i = 1; i <= NRL; i++) {
                let btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-pagina";
                btn.textContent = i;
                btn.onclick = function() {
                    afiseazaPagina(i);
                };
                container.appendChild(btn);
            }
        }
        afiseazaPagina(1);
    }

    //bonus 7
    function removeDiacritics(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    //am pus logica de filtrare intr o fct sa o pot refolosi
    function aplicaFiltre() {
        let valNume = removeDiacritics(document.getElementById("inp-nume").value.trim().toLowerCase());
        let valDescriere = removeDiacritics(document.getElementById("inp-descriere").value.trim().toLowerCase());
        let valCategorie = document.getElementById("inp-categorie").value;
        let valPretMin = parseInt(document.getElementById("inp-pret-min").value);
        let valPretMax = parseInt(document.getElementById("inp-pret-max").value);
        let bifatNou = document.getElementById("inp-nou").checked;
        let valGreutate = document.querySelector('input[name="gr-greutate"]:checked').value;

        //echipa si culori
        let valEchipa = document.getElementById("inp-echipa").value.trim().toLowerCase();
        let optiuniCulori = document.getElementById("inp-culori").selectedOptions;
        let valCulori = Array.from(optiuniCulori).map(opt => opt.value.toLowerCase());

        // vlidare nume
        if (valNume && /\d/.test(valNume)) {
            alert("Numele produsului nu trebuie să conțină cifre!");
            document.getElementById("inp-nume").style.border = "2px solid red";
            document.getElementById("inp-nume").classList.add("is-invalid");
            return;
        } else {
            document.getElementById("inp-nume").style.border = "";
            document.getElementById("inp-nume").classList.remove("is-invalid");
        }

        // validare textarea
        let txtDescriere = document.getElementById("inp-descriere");
        if (valDescriere.length > 0 && valDescriere.length < 3) {
            alert("Dacă folosești căutarea în descriere, scrie măcar 3 litere!");
            txtDescriere.classList.add("is-invalid");
            return;
        } else {
            txtDescriere.classList.remove("is-invalid");
        }

        if (valPretMin > valPretMax) {
            alert("Prețul minim nu poate fi mai mare decât prețul maxim!");
            return;
        }

        let articole = document.getElementsByClassName("produs");
        produseFiltrate = [];

        for (let art of articole) {
            art.style.display = "none";

            let nume = removeDiacritics(art.querySelector("h3").textContent.trim().toLowerCase());
            let descriere = removeDiacritics(art.querySelector(".descriere-produs").textContent.trim().toLowerCase());
            let categorie = art.querySelector(".val-categorie").textContent.trim();
            let pret = parseFloat(art.querySelector(".val-pret").textContent);
            let esteNou = art.querySelector(".val-nou").textContent.trim();

            let echipa = art.querySelector(".val-echipa").textContent.trim().toLowerCase();
            let culoriProdus = art.querySelector(".val-culori").textContent.trim().toLowerCase();

            let elemGreutate = art.querySelector(".val-greutate");
            let grame = elemGreutate ? parseFloat(elemGreutate.textContent.trim()) : 0;
            let catGreutate = (grame < 400) ? "usor" : (grame <= 1000 ? "mediu" : "greu");
            let condGreutate = (valGreutate === "toate" || catGreutate === valGreutate);

            // cautare cu *
            let condNume = false;
            if (valNume === "") {
                condNume = true;
            } else if (valNume.includes('*')) {
                let regexString = "^" + valNume.split('*').join('.*') + "$";
                let regexCautare = new RegExp(regexString);
                condNume = regexCautare.test(nume);
            } else {
                condNume = nume.includes(valNume);
            }

            let condCategorie = (valCategorie === "toate" || valCategorie === categorie);
            let condPret = (pret >= valPretMin && pret <= valPretMax);
            let condDescriere = (valDescriere === "" || descriere.includes(valDescriere));
            let condNou = bifatNou ? (esteNou === "Da") : true;

            let condEchipa = (valEchipa === "" || echipa.includes(valEchipa));
            let condCulori = (valCulori.length === 0 || valCulori.some(culoare => culoriProdus.includes(culoare)));

            if (condNume && condCategorie && condPret && condDescriere && condNou && condEchipa && condCulori && condGreutate) {
                produseFiltrate.push(art);
            }
        }
        
        renderPagination();
    }

    // 8.1 bultonul de filtrare 
    document.getElementById("filtrare").onclick = aplicaFiltre;


    document.getElementById("inp-nume").onchange = aplicaFiltre;
    document.getElementById("inp-descriere").onchange = aplicaFiltre;
    document.getElementById("inp-categorie").onchange = aplicaFiltre;
    document.getElementById("inp-pret-min").onchange = aplicaFiltre;
    document.getElementById("inp-pret-max").onchange = aplicaFiltre;
    document.getElementById("inp-nou").onchange = aplicaFiltre;
    document.getElementById("inp-echipa").onchange = aplicaFiltre;
    document.getElementById("inp-culori").onchange = aplicaFiltre;

    let radioGreutati = document.getElementsByName("gr-greutate");
    for (let radio of radioGreutati) {
        radio.onchange = aplicaFiltre;
    }

    // punct 9 resetare
    document.getElementById("resetare").onclick = function () {
        let raspuns = confirm("Ești sigur că vrei să resetezi toate filtrele?");
        if (raspuns) {
            document.getElementById("inp-nume").value = "";
            document.getElementById("inp-nume").classList.remove("is-invalid"); // Curăță starea de eroare

            document.getElementById("inp-descriere").value = "";
            document.getElementById("inp-descriere").classList.remove("is-invalid"); // Curăță starea de eroare

            document.getElementById("inp-categorie").value = "toate";
            document.getElementById("inp-echipa").value = "";

            
            let pretMinDOM = document.getElementById("inp-pret-min");
            pretMinDOM.value = pretMinDOM.min;
            document.getElementById("infoRangeMin").innerHTML = pretMinDOM.min;

            
            let pretMaxDOM = document.getElementById("inp-pret-max");
            pretMaxDOM.value = pretMaxDOM.max;
            document.getElementById("infoRangeMax").innerHTML = pretMaxDOM.max;

            document.getElementById("inp-nume").style.border = "";
            document.getElementById("inp-nou").checked = false;

            // resetare radio buttons
            document.getElementById("greutate-toate").checked = true;

            let selectCulori = document.getElementById("inp-culori");
            for (let opt of selectCulori.options) {
                opt.selected = false;
            }

            aplicaFiltre();
        }
    }

    // 8.2 sortare
    function sorteazaProduse(semn) {
        let grid = document.querySelector(".grid-produse");
        let articole = Array.from(grid.getElementsByClassName("produs"));

        articole.sort(function (a, b) {
            let numeA = a.querySelector("h3").textContent.trim().toLowerCase();
            let numeB = b.querySelector("h3").textContent.trim().toLowerCase();

            let lungimeDescA = a.querySelector(".descriere-produs").textContent.trim().length;
            let lungimeDescB = b.querySelector(".descriere-produs").textContent.trim().length;

            if (numeA !== numeB) {
                return semn * numeA.localeCompare(numeB);
            } else {
                return semn * (lungimeDescA - lungimeDescB);
            }
        });

        for (let art of articole) {
            grid.appendChild(art);
        }
        
        aplicaFiltre();
    }

    let btnSortCresc = document.getElementById("sortCresc");
    if (btnSortCresc) {
        btnSortCresc.onclick = function () { sorteazaProduse(1); }
    }

    let btnSortDescresc = document.getElementById("sortDescresc");
    if (btnSortDescresc) {
        btnSortDescresc.onclick = function () { sorteazaProduse(-1); }
    }

    // 8.3 butonul de calcul
    let btnCalculeaza = document.getElementById("calculeaza");
    if (btnCalculeaza) {
        btnCalculeaza.onclick = function () {
            let articole = document.getElementsByClassName("produs");
            let suma = 0;

            for (let art of articole) {
                if (window.getComputedStyle(art).display !== "none") {
                    suma += parseFloat(art.querySelector(".val-pret").textContent);
                }
            }

            let divInfo = document.createElement("div");
            divInfo.innerHTML = `<strong>Suma prețurilor:</strong> ${suma} RON`;

            divInfo.style.position = "fixed";
            divInfo.style.bottom = "30px";
            divInfo.style.right = "30px";
            divInfo.style.backgroundColor = "#ff9800";
            divInfo.style.color = "#fff";
            divInfo.style.padding = "15px 20px";
            divInfo.style.borderRadius = "8px";
            divInfo.style.boxShadow = "0 4px 10px rgba(0,0,0,0.5)";
            divInfo.style.zIndex = "9999";
            divInfo.style.fontSize = "1.2em";

            document.body.appendChild(divInfo);

            setTimeout(function () {
                divInfo.remove();
            }, 2000);
        }
    }
    
    renderPagination();
}