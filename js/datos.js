/* Estrella del Balón · datos del mundo.
   Clubes con nombres parecidos a los reales (no oficiales) y fuerza aproximada a la temporada 2025-26.
   Todos los jugadores son ficticios. */

/* Países con liga. Cada liga: [nombre, nº clubes, fuerza mínima, fuerza máxima].
   El nivel 1 usa la lista de clubes explícita (top); el resto se genera con pueblos y prefijos del país,
   salvo que haya lista explícita en extra[nivel]. */
var COUNTRIES=[
 {id:'ESP',n:'España',cul:'es',pre:['CD','UD','CF','SD','Real','Club Atlético','Deportivo','Racing','Unión','Gimnástica'],
  lg:[['Primera División',20],['Segunda División',22,56,70],['Primera Federación',20,44,58],['Segunda Federación',20,32,46]],
  cup:'Copa de España',rn:['LaLiga','Segunda División','Primera Federación','Segunda Federación'],rcup:'Copa del Rey',
  top:[['Chamartín CF',88],['Blaugrana FC',87],['Atlético Manzanares',83],['Athletic Leones',78],['Submarino Amarillo CF',79],['Real Verdiblanco',77],['Celeste de Vigo',74],['Rayo de Vallekas',72],['Pamplona Rojillos',72],['Real Mallorca Isla',71],['Real Donostia',78],['Mestalla CF',74],['Getafe Azulón',71],['Periquitos de Barcelona',72],['Babazorros de Vitoria',70],['Girona Blanquivermell',71],['Sevilla Nervión',73],['Ilicitano CF',68],['Levante Granota',67],['Real Carbayón',67]],
  towns:['Zaragoza','Málaga','Granada','Cádiz','Almería','Tenerife','Huesca','Burgos','Eibar','Santander','Gijón','Albacete','Córdoba','Castellón','Miranda','A Coruña','Valladolid','Las Palmas','Leganés','Andorra','León','Ceuta','Huelva','Murcia','Cartagena','Alcorcón','Fuenlabrada','Ponferrada','Lugo','Ourense','Salamanca','Badajoz','Mérida','Algeciras','Marbella','Antequera','Linares','Jaén','Lorca','Elda','Alcoy','Ibiza','Sabadell','Terrassa','Tarragona','Lleida','Reus','Logroño','Teruel','Tarazona','Guadalajara','Talavera','Toledo','Segovia','Ávila','Zamora','Palencia','Avilés','Langreo','Pontevedra','Ferrol','Santiago','Barakaldo','Sestao','Irún','Tudela']},
 {id:'ENG',n:'Inglaterra',cul:'en',suf:[' Town',' City',' United',' Rovers',' Athletic',' Albion',' Wanderers',' County'],
  lg:[['Primera inglesa',20],['Segunda inglesa',24,62,74],['Tercera inglesa',24,52,64],['Cuarta inglesa',24,44,56]],
  cup:'Copa de Inglaterra',rn:['Premier League','Championship','League One','League Two'],rcup:'FA Cup',
  top:[['Merseyside Reds',89],['North London Gunners',88],['Manchester Celeste',88],['London Blues',86],['Tyneside Magpies',83],['Villa Lions',81],['Forest Garibaldis',79],['Brighton Seagulls',79],['Bournemouth Cherries',77],['Brentford Bees',76],['Fulham Cottagers',76],['Palace Eagles',77],['Everton Toffees',75],['East London Hammers',76],['Manchester Red Devils',81],['Wolverhampton Wolves',74],['Spurs Lilywhites',81],['Leeds Peacocks',73],['Burnley Clarets',71],['Wearside Black Cats',72]],
  towns:['Leicester','Southampton','Ipswich','Sheffield','Norwich','Middlesbrough','Coventry','West Bromwich','Hull','Stoke','Swansea','Cardiff','Watford','Preston','Bristol','Millwall','Blackburn','Shepherd\'s Bush','Derby','Portsmouth','Oxford','Plymouth','Luton','Wigan','Bolton','Barnsley','Charlton','Reading','Huddersfield','Birmingham','Wrexham','Peterborough','Stockport','Lincoln','Exeter','Rotherham','Wycombe','Burton','Leyton','Mansfield','Northampton','Blackpool','Cambridge','Shrewsbury','Bradford','Doncaster','Burslem','Chesterfield','Nottingham','Gillingham','Walsall','Swindon','Crewe','Salford','Grimsby','Carlisle','Tranmere','Colchester','Barrow','Accrington','Fleetwood','Harrogate','Bromley','Newport','Cheltenham','Crawley','Morecambe','Hartlepool','Oldham','Yeovil','Southend','Scunthorpe','Torquay','Stevenage']},
 {id:'ITA',n:'Italia',cul:'it',pre:['AC','US','SS','Calcio','FC','AS','Virtus','Unione Sportiva'],
  lg:[['Primera italiana',20],['Segunda italiana',20,56,69],['Tercera italiana',20,42,56]],
  cup:'Copa de Italia',rn:['Serie A','Serie B','Serie C'],rcup:'Coppa Italia',
  top:[['Partenopei Napoli',84],['Inter Nerazzurri',86],['Bergamo Dea',81],['Vecchia Signora',83],['Giallorossi Roma',80],['Viola Firenze',78],['Aquile Biancocelesti',78],['Rossoneri Milano',82],['Rossoblù Bologna',77],['Lariani Como',75],['Granata Torino',74],['Friulani Udine',72],['Grifone Genova',72],['Scaligeri Verona',70],['Sardi Cagliari',70],['Crociati Parma',71],['Salentini Lecce',69],['Neroverdi Sassuolo',70],['Nerazzurri Pisani',68],['Grigiorossi Cremona',68]],
  towns:['Palermo','Genova Doria','Bari','La Spezia','Venezia','Empoli','Monza','Frosinone','Salerno','Catanzaro','Modena','Reggio Emilia','Cesena','Brescia','Bolzano','Carrara','Castellammare','Mantova','Padova','Avellino','Chiavari','Vicenza','Trieste','Terni','Perugia','Pescara','Foggia','Catania','Benevento','Novara','Alessandria','Lucca','Arezzo','Ascoli','Ancona','Livorno','Siena','Piacenza','Cosenza','Crotone','Trapani','Rimini']},
 {id:'GER',n:'Alemania',cul:'de',pre:['FC','SV','VfL','VfB','TSV','SC','SpVgg','1. FC','Eintracht','Borussia','Fortuna','Rot-Weiss'],
  lg:[['Primera alemana',18],['Segunda alemana',18,58,71],['Tercera alemana',20,46,58]],
  cup:'Copa de Alemania',rn:['Bundesliga','2. Bundesliga','3. Liga'],rcup:'DFB-Pokal',
  top:[['Múnich Rojo FC',89],['Leverkusen Werkself',83],['Frankfurt Adler',80],['Dortmund Schwarzgelb',84],['Freiburg Breisgau',76],['Mainz Nullfünfer',73],['Leipzig Toros',80],['Bremen Fischköppe',74],['Stuttgart Suabos',78],['Gladbach Fohlen',75],['Wolfsburg Lobos',75],['Augsburg Fuggerstädter',72],['Union Köpenick',73],['St. Pauli Piratas',71],['Sinsheim Kraichgau',75],['Heidenheim Brenz',70],['Köln Geißböcke',72],['Hamburgo Rothosen',72]],
  towns:['Gelsenkirchen','Berlín','Hannover','Núremberg','Düsseldorf','Kaiserslautern','Karlsruhe','Paderborn','Darmstadt','Bochum','Kiel','Magdeburgo','Braunschweig','Elversberg','Bielefeld','Münster','Fürth','Dresde','Rostock','Duisburgo','Saarbrücken','Aquisgrán','Osnabrück','Wiesbaden','Mannheim','Essen','Cottbus','Ratisbona','Ulm','Ingolstadt','Aue','Verl','Unterhaching','Sandhausen','Halle','Zwickau','Oldemburgo','Jena']},
 {id:'FRA',n:'Francia',cul:'fr',pre:['AS','FC','US','Stade','Olympique','SC','En Avant','AJ','Racing Club','Football Club'],
  lg:[['Primera francesa',18],['Segunda francesa',18,54,66],['Tercera francesa',18,40,52]],
  cup:'Copa de Francia',rn:['Ligue 1','Ligue 2','National'],rcup:'Coupe de France',
  top:[['París Rouge et Bleu',88],['Olympique Phocéen',81],['Monaco Principado',80],['Niza Aiglons',76],['Lille Dogues',79],['Lyon Gones',79],['Estrasburgo Racing',76],['Lens Sang et Or',76],['Brest Pirates',73],['Toulouse Violets',73],['Auxerre Bourgogne',70],['Rennes Rouge et Noir',75],['Nantes Canaris',71],['Angers Scoïstes',69],['Le Havre Ciel et Marine',69],['Lorient Merlus',69],['París Ciudad FC',70],['Metz Grenats',68]],
  towns:['Saint-Étienne','Montpellier','Reims','Burdeos','Caen','Guingamp','Amiens','Grenoble','Bastia','Ajaccio','Pau','Rodez','Laval','Annecy','Dunkerque','Clermont','Troyes','Saint-Ouen','Sochaux','Nancy','Valenciennes','Dijon','Le Mans','Orléans','Niort','Châteauroux','Boulogne','Nîmes','Martigues','Quevilly','Versalles','Concarneau','Villefranche','Bourg','Avranches','Beauvais','Rouen','Tours','Béziers','Cholet']},
 {id:'POR',n:'Portugal',cul:'pt',pre:['SC','CD','FC','GD','UD','Clube','Sporting','Académico','Associação'],
  lg:[['Primera portuguesa',18],['Segunda portuguesa',18,48,60]],
  cup:'Copa de Portugal',rn:['Liga Portugal','Liga Portugal 2'],rcup:'Taça de Portugal',
  top:[['Águias da Luz',82],['Dragões do Porto',82],['Leões de Alvalade',82],['Guerreiros de Braga',76],['Vitória Conquistadores',72],['Famalicão Minho',69],['Gil Vicente Galos',68],['Moreirense Cónegos',66],['Estoril Canarinhos',67],['Rio Ave Vila do Conde',66],['Arouca Lobos',65],['Casa Pia Gansos',64],['Santa Clara Açores',67],['Nacional Madeira',63],['Estrela Amadora',63],['Alverca Ribatejo',62],['Tondela Auriverdes',62],['Aves Vila das Aves',61]],
  towns:['Matosinhos','Feira','Viseu','Penafiel','Portimão','Funchal','Chaves','Oliveira','Paços de Ferreira','Torres Vedras','Felgueiras','Vizela','Leiria','Faro','Boavista','Belém','Coimbra','Póvoa de Varzim','Covilhã','Trofa']},
 {id:'NED',n:'Países Bajos',cul:'nl',pre:['FC','SC','VV','RKC','Sportclub','BV'],
  lg:[['Primera neerlandesa',18],['Segunda neerlandesa',20,46,58]],
  cup:'Copa de los Países Bajos',rn:['Eredivisie','Eerste Divisie'],rcup:'KNVB Beker',
  top:[['Eindhoven Lichtstad',79],['Ámsterdam Godenzonen',80],['Rotterdam Stadionclub',79],['Alkmaar Kaaskoppen',75],['Enschede Tukkers',73],['Utrecht Domstad',72],['Nijmegen Nijmegenaren',68],['Deventer Eagles',69],['Heerenveen Friesland',67],['Sparta Kasteel',66],['Sittard Fortuna',65],['Groningen Trots',67],['Zwolle Blauwvingers',65],['Almelo Heraclieden',65],['Breda Brabant',64],['Kralingen Excelsior',63],['Volendam Palingboeren',62],['Velsen Witte Leeuwen',61]],
  towns:['Tilburg','Kerkrade','Leeuwarden','La Haya','Arnhem','Emmen','Doetinchem','Den Bosch','Dordrecht','Helmond','Maastricht','Venlo','Almere','Oss','Waalwijk','Haarlem','Leiden','Apeldoorn','Zaandam','Hilversum']},
 {id:'IRL',n:'Irlanda',cul:'ie',suf:[' Town',' United',' Rovers',' Celtic',' Athletic'],
  lg:[['Primera irlandesa',10],['Segunda irlandesa',10]],
  cup:'Copa de Irlanda',rn:['Premier Division','First Division'],rcup:'FAI Cup',
  top:[['Tallaght Hoops',52],['Derry Candystripes',50],['Dublin Reds',49],['Dalymount Gypsies',49],['Inchicore Saints',48],['Drogheda Drogs',46],['Sligo Bit o\' Red',45],['Galway Tribesmen',46],['Waterford Blues',45],['Cork Rebels',45]],
  extra:{2:[['Dundalk Lilywhites',40],['Belfield Students',36],['Limerick Treaty',35],['Athlone Town',34],['Ballybofey Harps',35],['Wexford Youths',33],['Cobh Ramblers',32],['Bray Seagulls',34],['Longford Town',33],['Kerry Kingdom',31]]},
  towns:[]}
];

/* Selecciones. conf: E Europa, O resto del mundo. str: fuerza. cul: cultura de nombres. */
var NATIONS=[
 ['ESP','España','es','E',88],['FRA','Francia','fr','E',88],['ENG','Inglaterra','en','E',86],['GER','Alemania','de','E',84],['ITA','Italia','it','E',82],
 ['POR','Portugal','pt','E',84],['NED','Países Bajos','nl','E',82],['BEL','Bélgica','nl','E',80],['CRO','Croacia','sl','E',79],['DEN','Dinamarca','no','E',77],
 ['SUI','Suiza','de','E',76],['AUT','Austria','de','E',76],['SRB','Serbia','sl','E',74],['POL','Polonia','sl','E',74],['NOR','Noruega','no','E',77],
 ['SWE','Suecia','no','E',73],['SCO','Escocia','en','E',71],['WAL','Gales','en','E',69],['IRL','Irlanda','ie','E',68],
 ['ARG','Argentina','la','O',88],['BRA','Brasil','br','O',86],['URU','Uruguay','la','O',80],['COL','Colombia','la','O',79],['MEX','México','la','O',75],
 ['USA','Estados Unidos','en','O',74],['ECU','Ecuador','la','O',74],['MAR','Marruecos','af','O',80],['SEN','Senegal','af','O',77],['NGA','Nigeria','af','O',74],
 ['GHA','Ghana','af','O',70],['JPN','Japón','jp','O',77],['KOR','Corea del Sur','kr','O',74]
].map(function(a){return {id:a[0],n:a[1],cul:a[2],conf:a[3],str:a[4]};});

/* Nombres por cultura: [nombres, apellidos]. Se combinan al azar y pueden coincidir con personas reales. */
var NAMES={
 es:[['Marcos','Luis','Javier','Adrián','Pablo','Diego','Sergio','Iván','Rubén','Álvaro','Hugo','Mario','Óscar','Raúl','Gonzalo','Dani','Nacho','Borja','Tomás','Andrés','Lucas','Mateo','Bruno','Ismael','Fran','Héctor','Joel','Unai','Aitor','Cristian','Ángel','Rafa','Samuel','Víctor','Nico','Gael','Leo','Moisés','Emilio','Jonás'],
     ['Ruiz','Herrero','Navarro','Castaño','Ibáñez','Villalba','Soriano','Mendoza','Bermúdez','Cordero','Salgado','Lozano','Ferrer','Quintana','Montero','Arroyo','Paredes','Cisneros','Olmedo','Valverde','Zamora','Pardo','Calvo','Espinosa','Rivas','Beltrán','Carrasco','Nieto','Segura','Plaza','Roldán','Bustos','Tapia','Ledesma','Corral','Iglesias','Bravo','Trujillo','Santana','Maldonado','Orozco','Duarte','Ayala','Peña','Galindo','Cabrera','Pineda','Escudero','Lara','Cuesta']],
 en:[['Jack','Harry','Oliver','George','Charlie','James','Tom','Ben','Sam','Lewis','Ryan','Callum','Jordan','Kieran','Connor','Luke','Danny','Josh','Max','Alfie','Mason','Reece','Jamie','Owen','Liam'],
     ['Smith','Walker','Hughes','Turner','Barnes','Cooper','Ward','Price','Bennett','Wright','Hall','Clarke','Fletcher','Marsh','Doyle','Holt','Bishop','Parker','Shaw','Lowe','Harding','Knight','Stone','Webb','Fox','Morton','Lyons','Hart','Pearce','Elliott']],
 ie:[['Seán','Cian','Darragh','Conor','Oisín','Niall','Ciarán','Eoin','Ronan','Fionn','Dylan','Aaron','Shane','Pádraig','Kevin'],
     ['Murphy','Kelly','O\'Brien','Byrne','Ryan','O\'Connor','Walsh','McCarthy','Doyle','Gallagher','Brennan','Kavanagh','Nolan','Duffy','Quinn','Moran','Lynch','Keane','Daly','Foley']],
 it:[['Luca','Marco','Matteo','Alessandro','Lorenzo','Davide','Simone','Federico','Riccardo','Andrea','Gabriele','Nicolò','Tommaso','Stefano','Giacomo','Emanuele','Filippo','Pietro','Mattia','Samuele'],
     ['Rossi','Bianchi','Romano','Colombo','Greco','Bruno','Gallo','Conti','De Luca','Marino','Costa','Fontana','Rizzo','Moretti','Barbieri','Lombardi','Ferrara','Caruso','Mancini','Esposito','Galli','Ricci','Testa','Villa']],
 de:[['Lukas','Leon','Jonas','Felix','Maximilian','Niklas','Paul','Tim','Jan','Florian','Julian','Moritz','Tobias','Kevin','Marco','Fabian','Dennis','Lennart','Jannik','Robin'],
     ['Müller','Schmidt','Schneider','Fischer','Weber','Wagner','Becker','Hoffmann','Koch','Richter','Wolf','Krause','Neumann','Schwarz','Brandt','Vogel','Hartmann','Lange','Kraus','Busch','Engel','Winter','Seidel','Arnold']],
 fr:[['Hugo','Lucas','Théo','Mathis','Nathan','Enzo','Louis','Maxime','Antoine','Baptiste','Clément','Romain','Yanis','Rayan','Quentin','Adrien','Florian','Bastien','Jules','Malo'],
     ['Martin','Bernard','Dubois','Durand','Lefebvre','Moreau','Laurent','Simon','Michel','Roux','Fournier','Girard','Bonnet','Dupont','Lambert','Fontaine','Chevalier','Robin','Mercier','Blanc','Guérin','Faure','Rousseau','Perrin']],
 pt:[['João','Diogo','Rúben','Tiago','Gonçalo','Rafael','Bruno','Pedro','André','Nuno','Francisco','Rodrigo','Miguel','Duarte','Afonso','Bernardo','Vasco','Henrique'],
     ['Silva','Santos','Ferreira','Pereira','Oliveira','Costa','Rodrigues','Martins','Sousa','Fernandes','Gonçalves','Gomes','Lopes','Marques','Alves','Ribeiro','Pinto','Carvalho','Teixeira','Moreira','Correia','Mendes','Nunes','Vieira']],
 nl:[['Daan','Sem','Lars','Jesse','Bram','Thijs','Ruben','Stijn','Milan','Luuk','Joey','Kees','Bart','Niels','Wout','Teun','Sven','Tim','Koen','Jurriën'],
     ['de Jong','Jansen','de Vries','van Dijk','Bakker','Visser','Smit','Meijer','de Boer','Mulder','Bos','Vos','Peters','Hendriks','van Leeuwen','Dekker','Brouwer','de Wit','Dijkstra','Kok','Verhoeven','van Dam']],
 br:[['Gabriel','Lucas','Matheus','Felipe','Thiago','Guilherme','Caio','Igor','Bruno','Rafael','Danilo','Wesley','Everton','Júnior','Leandro','Douglas'],
     ['Souza','Silva','Santos','Oliveira','Lima','Pereira','Costa','Almeida','Nascimento','Barbosa','Rocha','Ribeiro','Cardoso','Moraes','Araújo','Freitas','Batista']],
 la:[['Santiago','Matías','Facundo','Nicolás','Joaquín','Agustín','Thiago','Juan','Franco','Emiliano','Tomás','Valentín','Brian','Kevin','Jhon','Jefferson'],
     ['González','Rodríguez','Fernández','López','Martínez','Gómez','Díaz','Pérez','Sosa','Romero','Acosta','Benítez','Medina','Herrera','Suárez','Aguirre','Molina','Castro','Ortiz','Ríos']],
 sl:[['Luka','Ivan','Marko','Petar','Nikola','Stefan','Josip','Filip','Mateo','Dušan','Milan','Jakub','Kamil','Piotr','Tomasz'],
     ['Kovač','Horvat','Babić','Jurić','Petrović','Jovanović','Nikolić','Marković','Novak','Kowalski','Nowak','Wiśniewski','Zieliński','Mazur','Pavlović','Ilić','Stanković']],
 no:[['Erik','Magnus','Oscar','Emil','William','Noah','Viktor','Mathias','Jonas','Sander','Kasper','Rasmus','Anders','Mikkel','Elias'],
     ['Hansen','Johansen','Andersen','Larsen','Nielsen','Olsen','Berg','Lindqvist','Karlsson','Nilsson','Eriksson','Lund','Dahl','Holm','Strand']],
 af:[['Moussa','Ibrahima','Mamadou','Cheikh','Youssef','Amine','Bilal','Samuel','Emmanuel','Victor','Kelechi','Kwame','Abdou','Ismaïla','Hamza'],
     ['Diallo','Traoré','Ndiaye','Diop','Sarr','Camara','Koné','Mensah','Okafor','Adeyemi','Boateng','Owusu','El Amrani','Benali','Ziani','Haddad','Okoro','Asante']],
 jp:[['Takumi','Daichi','Kaito','Ren','Yuto','Sota','Haruto','Kenta','Shota','Riku'],['Tanaka','Suzuki','Takahashi','Watanabe','Ito','Yamamoto','Nakamura','Kobayashi','Kato','Yoshida']],
 kr:[['Min-jun','Seo-jun','Ji-ho','Hyun-woo','Jae-won','Dong-hyun','Sung-min','Tae-yang'],['Kim','Lee','Park','Choi','Jung','Kang','Cho','Yoon','Jang','Lim']]
};

/* Marcas (ficticias). cat: categoría de patrocinio. tier 1 a 4: requisitos y pago. */
var BRANDS=[
 {id:'tri',n:'Tribanda',cat:'botas',tier:4},{id:'arco',n:'Arco',cat:'botas',tier:4},{id:'fel',n:'Felino',cat:'botas',tier:3},
 {id:'kai',n:'Kaizen',cat:'botas',tier:2},{id:'nor',n:'Nordika',cat:'botas',tier:2},{id:'leo',n:'Leona',cat:'botas',tier:1},
 {id:'iso',n:'Isoazul',cat:'bebida',tier:1},{id:'bra',n:'Bravío Energy',cat:'bebida',tier:3},{id:'agm',n:'Agua de Montaña',cat:'bebida',tier:2},
 {id:'ibm',n:'Ibérica Motors',cat:'coche',tier:2},{id:'bav',n:'Bávara Motors',cat:'coche',tier:4},{id:'tur',n:'Turín Motori',cat:'coche',tier:3},
 {id:'cro',n:'Cronos Suiza',cat:'reloj',tier:4},{id:'gin',n:'Ginebra Chrono',cat:'reloj',tier:3},
 {id:'mai',n:'Maison Lumière',cat:'moda',tier:4},{id:'mil',n:'Milano Stile',cat:'moda',tier:3},{id:'bar',n:'Barrio Urban',cat:'moda',tier:1},
 {id:'pix',n:'Pixel Arena',cat:'juego',tier:4},{id:'orb',n:'Orbital Telecom',cat:'tel',tier:3},
 {id:'bgol',n:'Burger Gol',cat:'comida',tier:1},{id:'pas',n:'Pasta Nonna',cat:'comida',tier:2}
];
var BCAT={botas:'Botas',bebida:'Bebida',coche:'Automóvil',reloj:'Relojes',moda:'Moda',juego:'Videojuego',tel:'Telefonía',comida:'Alimentación'};
/* requisitos y pago por nivel de marca: valoración, seguidores, pago semanal, publicaciones al mes */
var BTIER={1:{ov:38,fol:1500,w:1500,posts:1},2:{ov:55,fol:25000,w:6000,posts:2},3:{ov:68,fol:250000,w:25000,posts:2},4:{ov:78,fol:1200000,w:80000,posts:3}};

/* Representantes (ficticios). lvl 1 a 5. com: comisión sobre el salario. req: valoración mínima para que te acepten. */
var AGENTS=[
 {id:'a1',n:'Toni Barrios (tu primo)',lvl:1,com:.04,req:0,fol:0,fee:0},
 {id:'a2',n:'Ramón Gestiones Deportivas',lvl:2,com:.07,req:44,fol:3000,fee:15000},
 {id:'a3',n:'Duarte Sports Management',lvl:3,com:.09,req:57,fol:30000,fee:80000},
 {id:'a4',n:'Elite Talent Group',lvl:4,com:.11,req:69,fol:250000,fee:300000},
 {id:'a5',n:'Valeria Vega, superagente',lvl:5,com:.13,req:79,fol:1000000,fee:1000000}
];
/* Community managers. g: crecimiento extra de seguidores por jornada. pr: relación con la prensa por jornada. risk: probabilidad de polémica. */
var CMS=[
 {id:'c1',n:'Tu sobrino con el móvil',c:300,g:.002,pr:0,risk:.06,post:1},
 {id:'c2',n:'Freelance digital',c:2500,g:.005,pr:.1,risk:.03,post:1.4},
 {id:'c3',n:'Agencia Social Pro',c:10000,g:.01,pr:.3,risk:.015,post:2},
 {id:'c4',n:'Estudio Viral Global',c:30000,g:.018,pr:.5,risk:.005,post:3}
];

/* Material. Gamas: bonus por habilidad, precio y partidos que dura. */
var GAMAS=[{id:'b',n:'Básica',b:1,c:3000,dur:25},{id:'m',n:'Media',b:2,c:25000,dur:32},{id:'p',n:'Pro',b:3,c:120000,dur:40},{id:'e',n:'Élite',b:5,c:450000,dur:45}];
/* qué gamas fabrica cada marca de botas según su nivel */
var BRAND_GAMAS={1:['b','m'],2:['m','p'],3:['p','e'],4:['p','e']};
var BOOT_TYPES=[
 {id:'vel',n:'Velocidad',sk:['ace','vel']},{id:'tiro',n:'Precisión',sk:['tir','fin']},{id:'ctl',n:'Control',sk:['ctl','reg']},
 {id:'pase',n:'Pase',sk:['pas','pal']},{id:'agarre',n:'Agarre',sk:['ent','fue']}
];
var GK_BOOT_TYPES=[{id:'saque',n:'Saque',sk:['sac','pal']}];
var GLOVE_TYPES=[{id:'agarre',n:'Agarre',sk:['cap','ref']},{id:'reflejo',n:'Reflejos',sk:['ref','uno']},{id:'aereo',n:'Juego aéreo',sk:['aer','arr']}];
var KIT_TYPES=[{id:'compr',n:'Ropa de compresión',sk:['res','agi']},{id:'potencia',n:'Ropa de potencia',sk:['fue','sal']}];

var MONTHS=['Agosto','Septiembre','Octubre','Noviembre','Diciembre','Enero','Febrero','Marzo','Abril','Mayo','Junio'];
