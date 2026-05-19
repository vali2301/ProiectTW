
console.log("Fisierul tema.js a fost citit cu succes!");

window.addEventListener("DOMContentLoaded", function() {
    let switchTema = document.getElementById("btn-tema");
    

    console.log("Am cautat butonul de tema si am gasit:", switchTema);

    if (!switchTema) return; 

    let temaCurenta = localStorage.getItem("tema");
    if (temaCurenta === "dark") {
        document.body.classList.add("dark-theme");
        switchTema.checked = true;
    }

    switchTema.onchange = function() {
        if (this.checked) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("tema", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("tema", "light");
        }
    }
});