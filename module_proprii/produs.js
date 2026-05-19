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
}
module.exports = Produs;