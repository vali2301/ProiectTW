class Produs {
    constructor({id, nume, descriere, pret, greutate_g, echipa, categorie, marimi_disponibile, culori, este_nou, imagine, data_adaugare}) {
        this.id = id;
        this.nume = nume;
        this.descriere = descriere;
        this.pret = pret;
        this.greutate_g = greutate_g;
        this.echipa = echipa;
        this.categorie = categorie;
        this.marimi_disponibile = marimi_disponibile; 
        this.culori = culori;
        this.este_nou = este_nou;
        this.imagine = imagine;
        this.data_adaugare = data_adaugare;
    }
    get dataFormata() {
    if (!this.data_adaugare) return "";
    const d = new Date(this.data_adaugare);
    
    const luni = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", 
                  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
    const zile = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
    
    let zi = d.getDate();
    let luna = luni[d.getMonth()];
    let an = d.getFullYear();
    let ziSaptamana = zile[d.getDay()];
    
    return `${zi}/${luna}/${an} (${ziSaptamana})`;
}
}

module.exports = Produs;
