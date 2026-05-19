
DROP TABLE IF EXISTS echipamente;
DROP TYPE IF EXISTS categ_echipament;
DROP TYPE IF EXISTS tipuri_echipe;


CREATE TYPE categ_echipament AS ENUM('Tricouri', 'Pantaloni', 'Sepci', 'Jackete', 'Accesorii');
CREATE TYPE tipuri_echipe AS ENUM('Red Bull Racing', 'Ferrari', 'Mercedes', 'McLaren', 'Aston Martin', 'Universal');


CREATE TABLE IF NOT EXISTS echipamente (
   id serial PRIMARY KEY,
   nume VARCHAR(100) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   greutate_g INT NOT NULL CHECK (greutate_g >= 0), 
   echipa tipuri_echipe DEFAULT 'Universal',
   categorie categ_echipament DEFAULT 'Accesorii',
   marimi_disponibile VARCHAR [], 
   culori VARCHAR [],            
   este_nou BOOLEAN NOT NULL DEFAULT TRUE, 
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);


INSERT INTO echipamente (nume, descriere, pret, greutate_g, echipa, categorie, marimi_disponibile, culori, este_nou, imagine) VALUES 
('Tricou Polo Scuderia Ferrari', 'Tricou oficial de echipă, material respirabil, logo brodat.', 350.00, 250, 'Ferrari', 'Tricouri', '{"S","M","L","XL"}', '{"rosu"}', False, 'tricou-ferrari.jpg'),
('Șapcă Max Verstappen 2024', 'Șapcă oficială Red Bull cu numărul 1 și logo-uri sponsori.', 180.00, 100, 'Red Bull Racing', 'Sepci', '{"Universal"}', '{"albastru","galben"}', True, 'sapca-verstappen.jpg'),
('Jachetă Softshell Mercedes', 'Jachetă rezistentă la vânt și apă, purtată de mecanici în paddock.', 750.00, 800, 'Mercedes', 'Jackete', '{"M","L","XL"}', '{"negru"}', True, 'jacketa-mercedes.jpg'),
('Pantaloni Scurți McLaren Papaya', 'Pantaloni comozi pentru vară, culori oficiale McLaren.', 260.00, 300, 'McLaren', 'Pantaloni', '{"S","M","L"}', '{"portocaliu","albastru"}', False, 'pantaloni-mclaren.jpg'),
('Tricou Red Bull Racing Core', 'Tricou simplu din bumbac cu logo mare imprimat pe piept.', 190.00, 200, 'Red Bull Racing', 'Tricouri', '{"M","L","XL"}', '{"albastru"}', True, 'tricou-redbull.jpg'),
('Șapcă Lewis Hamilton Purple', 'Ediție specială în culoarea purpurie, logo Mercedes frontal.', 210.00, 100, 'Mercedes', 'Sepci', '{"Universal"}', '{"purpuriu"}', True, 'sapca-hamilton.jpg'),
('Hanorac Ferrari cu Glugă', 'Hanorac călduros cu buzunar tip cangur și branding Ferrari.', 520.00, 650, 'Ferrari', 'Jackete', '{"S","M","L"}', '{"rosu","negru"}', False, 'hanorac-ferrari.jpg'),
('Pantaloni Training Aston Martin', 'Pantaloni lungi de trening, material elastic, culoare verde britanic.', 420.00, 500, 'Aston Martin', 'Pantaloni', '{"M","L","XL"}', '{"verde"}', True, 'pantaloni-aston.jpg'),
('Tricou Mercedes Petronas 44', 'Tricou dedicat fanilor Lewis Hamilton, număr mare pe spate.', 220.00, 200, 'Mercedes', 'Tricouri', '{"XS","S","M"}', '{"alb","turcoaz"}', False, 'tricou-mercedes.jpg'),
('Șapcă Lando Norris Neon', 'Șapcă McLaren în culori neon, vizibilitate maximă pe circuit.', 195.00, 100, 'McLaren', 'Sepci', '{"Universal"}', '{"galben-neon"}', True, 'sapca-norris.jpg'),
('Jachetă de ploaie Universal F1', 'Jachetă ușoară de ploaie, transparentă, logo oficial F1.', 150.00, 400, 'Universal', 'Jackete', '{"Universal"}', '{"transparent"}', False, 'jacketa-ploaie.jpg'),
('Pantaloni Cargo Red Bull', 'Pantaloni cu multe buzunare, rezistenți, stil militar.', 550.00, 700, 'Red Bull Racing', 'Pantaloni', '{"L","XL"}', '{"gri-inchis"}', True, 'pantaloni-cargo.jpg'),
('Tricou Aston Martin Team', 'Tricoul oficial purtat de Fernando Alonso în weekend-ul de cursă.', 310.00, 220, 'Aston Martin', 'Tricouri', '{"S","M","L","XL"}', '{"verde"}', True, 'tricou-aston.jpg'),
('Șapcă Ferrari Charles Leclerc', 'Șapcă cu steagul Monaco pe cozoroc și numărul 16.', 190.00, 100, 'Ferrari', 'Sepci', '{"Universal"}', '{"rosu","alb"}', False, 'sapca-leclerc.jpg'),
('Vestă matlasată McLaren', 'Vestă fără mâneci, ideală pentru primăvară, logo brodat.', 480.00, 450, 'McLaren', 'Jackete', '{"M","L"}', '{"albastru"}', True, 'vesta-mclaren.jpg'),
('Pantaloni Scurți Ferrari Sport', 'Pantaloni scurți pentru sală sau alergat, branding discret.', 240.00, 250, 'Ferrari', 'Pantaloni', '{"S","M","L"}', '{"negru"}', False, 'pantaloni-ferrari.jpg'),
('Tricou Retro F1 Classic', 'Tricou cu design inspirat de anii 70, logo F1 vechi.', 180.00, 210, 'Universal', 'Tricouri', '{"M","L","XL"}', '{"bej"}', False, 'tricou-retro.jpg'),
('Șapcă Flatbrim Red Bull', 'Șapcă cu cozoroc drept, stil urban, logo brodat 3D.', 200.00, 110, 'Red Bull Racing', 'Sepci', '{"Universal"}', '{"negru"}', True, 'sapca-flatbrim.jpg'),
('Jacketa Paddock Mercedes', 'Jachetă de lux din materiale premium, ediție Paddock Club.', 1200.00, 900, 'Mercedes', 'Jackete', '{"L","XL"}', '{"negru","argintiu"}', True, 'jacketa-paddock.jpg'),
('Rucsac Accesorii Apex', 'Rucsac pentru echipament, inclus la categoria accesorii etc.', 250.00, 600, 'Universal', 'Accesorii', '{"25L"}', '{"negru"}', False, 'rucsac-apex.jpg');