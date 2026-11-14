/* Vídeos 3D de los platos: copia el archivo a assets/video/ (p. ej. p01.mp4) y añade  video: "p01"  al plato.
   Carta de Maxó — datos tomados de su carta digital en Gustto (noviembre 2026),
   con el texto adaptado al español de España. Editar aquí para actualizar la web. */
window.CARTA = {
  menu: {
    precio: 15,
    nota: "Cada día elegimos cinco de estos platos para el menú de 15 €.",
    platos: [
      { n: "Aguachile de gambón", d: "Gambón en aguachile sobre crema de melocotón, con mejillones escabechados y cebolla morada. Fresco, intenso y equilibrado.", img: "p01" },
      { n: "Huevos rotos de pato y jamón", d: "Patatas caseras con muslo de pato confitado a baja temperatura, jamón crujiente y huevo frito de corral con la yema bien naranja.", img: "p02" },
      { n: "Crema fría de pepino, yogur y menta", d: "Tan sencilla como espectacular. Sabe a mojito, pero sin alcohol ni azúcar.", img: "p03" },
      { n: "Chuletas de cordero recental", d: "Producto que nunca falla, hecho a la brasa. Suplemento de 1,25 € por chuleta.", img: "p04", extra: "+1,25 €/ud." },
      { n: "Espaguetis a la boloñesa", d: "Un clásico con truco: el tomate lo freímos nosotros y la carne es de calidad.", img: "p05" },
      { n: "Berenjena rellena de carne y queso gratinado", d: "Sofreímos la pulpa de la berenjena con magro de cerdo Duroc y la gratinamos con mozzarella.", img: "p06" },
      { n: "Gazpacho andaluz", d: "Como el de las abuelas, con ingredientes frescos y ecológicos.", img: "p07" },
      { n: "Sopa castellana", d: "Caldo casero, pan asentado, ajo dorado, pimiento y huevo. Un plato humilde y lleno de historia.", img: "p08" },
      { n: "Timbal de verduras con rulo de cabra", d: "Capas de verduras ecológicas asadas despacio, coronadas con queso de cabra gratinado y reducción de Pedro Ximénez.", img: "p09" },
      { n: "Canelón de aguacate tatemado", d: "Relleno de fuet ibérico y queso roquefort, sobre una crema suave de boniato asado.", img: "p10" },
      { n: "Ssam de ventresca de atún rojo", d: "Atún rojo de almadraba sobre cogollo ecológico, con mayonesa trufada y alga wakame.", img: "p11" },
      { n: "Pan bao de carne mechada", d: "Pan bao al vapor con carne mechada jugosa y mayonesa de ajo negro.", img: "p12" },
      { n: "Ensalada de ventresca, mango y aguacate", d: "Ventresca de atún, mango y aguacate con una reducción de Pedro Ximénez.", img: "p13" },
      { n: "Alubias blancas con sepia, gambas y almejas", d: "Guiso de los de siempre, hecho despacio a la leña, con todo el sabor del mar.", img: "p14", lena: true },
      { n: "Solomillo de cerdo empanado al roquefort", d: "Solomillo empanado y crujiente con salsa de roquefort y patatas fritas caseras.", img: "p15" },
      { n: "Secreto ibérico a la parrilla", d: "Jugoso y con ese aroma ahumado de la parrilla. Con patatas fritas caseras.", img: "p16", lena: true },
      { n: "Cachopo de carne", d: "Filete premium cortado a cuchillo, relleno de queso edam fundido, con pimientos del piquillo asados.", img: "p17" },
      { n: "Carrilleras de cerdo ibérico", d: "Horas de cocción hasta que se deshacen, con verduras de temporada y parmentier de patata.", img: "p18" },
      { n: "Carpaccio de melón, jamón y queso curado", d: "Frescura del melón, intensidad del jamón y carácter del queso curado.", img: "p19" },
      { n: "Salmorejo de frutos rojos", d: "El salmorejo de siempre, reinterpretado con frutos rojos. Fresco y ligeramente dulce.", img: "p20" },
      { n: "Pluma ibérica a la parrilla", d: "Uno de los cortes más nobles del ibérico, muy jugoso, hecho a la parrilla.", img: "p21", lena: true }
    ]
  },
  vinos: [
    { grupo: "Tintos de La Mancha", tipo: "tinto", items: [
      ["Prisma Almansa", "Garnacha tintorera y monastrell", 15, 3],
      ["Peñahueca", "Cencibel", 15, 3],
      ["Quinta de Aves Syrah", "Syrah", 17],
      ["Casa de La Nava", "Tempranillo", 25],
      ["Dehesa del Carrizal Cabernet", "Cabernet", 26],
      ["El Linze", "Tinta velasco y syrah", 27],
      ["Gran Luna", "Cabernet, syrah, graciano y tempranillo", 29]
    ]},
    { grupo: "Tintos D.O. Ribera del Duero", tipo: "tinto", items: [
      ["La Planta", "Tempranillo", 17, 3],
      ["Nobbis", "Tempranillo", 20],
      ["Parada de Atauta", "Tempranillo", 28],
      ["Arzuaga Crianza", "Tempranillo, cabernet sauvignon, malbec, garnacha y albillo", 30],
      ["Matarromera Crianza", "Tempranillo", 32],
      ["La Hormiga de Antídoto", "Tempranillo", 37]
    ]},
    { grupo: "Tintos D.O. Jumilla", tipo: "tinto", items: [
      ["Paco Mulero Veinte Meses", "Monastrell, cabernet y syrah", 32]
    ]},
    { grupo: "Tintos D.O. Toro", tipo: "tinto", items: [
      ["Almirez", "Tinta de Toro", 29],
      ["San Román", "Tinta de Toro", 39]
    ]},
    { grupo: "Tintos IGP Castilla y León", tipo: "tinto", items: [
      ["Mauro", "", 44],
      ["Mauro VS", "", 74]
    ]},
    { grupo: "Blancos de La Mancha", tipo: "blanco", items: [
      ["Dehesa de Luna Blanco", "Garnacha blanca, viognier y chardonnay", 17, 3],
      ["Quinta de Aves Chardonnay", "Chardonnay", 17, 3],
      ["Media Legua", "Airén", 21],
      ["Blas Muñoz", "Chardonnay", 23]
    ]},
    { grupo: "Blancos D.O. Rías Baixas", tipo: "blanco", items: [
      ["Antonio Montero Albariño", "Albariño", 18, 3.5],
      ["Nora da Neve", "Albariño", 29],
      ["Pazo Rubianes", "Albariño", 29]
    ]},
    { grupo: "Blancos D.O. Rueda", tipo: "blanco", items: [
      ["Carrasviñas", "Verdejo", 15],
      ["Nisia Las Suertes", "Verdejo", 31]
    ]},
    { grupo: "Blancos del Bierzo", tipo: "blanco", items: [
      ["Godello Paluezas", "Godello", 20, 4],
      ["Pago de los Abuelos Godello Barreiros", "Godello", 33]
    ]},
    { grupo: "Blancos D.O. Ribeiro", tipo: "blanco", items: [
      ["Ramón do Casar", "Albariño, godello y treixadura", 20]
    ]},
    { grupo: "Rosados", tipo: "rosado", items: [
      ["Quinta de Aves Rosado", "Cabernet franc y graciano", 17]
    ]},
    { grupo: "Champán y cava", tipo: "burbuja", items: [
      ["Blason Rouge", "Crémant. Chardonnay, chenin, mauzac y pinot noir", 24],
      ["Recaredo Terrers Brut Nature", "Corpinnat. Xarel·lo, macabeo, parellada y monastrell", 36],
      ["Philipponnat Réserve Royale Brut", "Champán. Pinot noir, chardonnay y meunier", 62],
      ["Billecart-Salmon Brut", "Champán. Pinot noir, chardonnay y pinot meunier", 68],
      ["Billecart-Salmon Rosé", "Champán. Chardonnay, pinot noir y pinot meunier", 98]
    ]},
    { grupo: "Vermut", tipo: "dulce", items: [
      ["61 Vermut Verdejo", "Vermut de verdejo", null, 4],
      ["Vermú de Garaje by Curro", "Vermut artesano", null, 4],
      ["Lucendo", "Vermut", null, 4]
    ]},
    { grupo: "Vinos dulces", tipo: "dulce", items: [
      ["Don PX", "Pedro Ximénez", null, 4],
      ["Nº2 Victoria", "Vino dulce", null, 5]
    ]}
  ]
};
