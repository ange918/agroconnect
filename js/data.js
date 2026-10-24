// Catalogue d'exemple : produits fictifs servant de maquette. À remplacer par le catalogue validé par MAFOYA.
window.MAFOYA_DATA = {
  // Photos : déposer les fichiers dans images/ et renseigner les chemins (ex. "images/hero.jpg").
  // Tant qu'un chemin est vide, un motif de substitution est affiché.
  images: { hero: "", homme: "", femme: "", teint: "", kanvo: "", story: "", creator: "" },
  categories: [
    { id: "homme", fr: "Homme", en: "Men" },
    { id: "femme", fr: "Femme", en: "Women" },
  ],
  fabricFamilies: [
    { id: "teint", fr: "Tissus teints à la main", en: "Hand-dyed fabrics" },
    { id: "kanvo", fr: "Pagnes tissés / Kanvo", en: "Woven pagnes / Kanvo" },
    { id: "melange", fr: "Mélanges", en: "Blends" },
  ],
  collections: [
    { id: "nouveautes", fr: "Nouveautés", en: "New arrivals" },
    { id: "capsule", fr: "Capsule indigo", en: "Indigo capsule" },
  ],
  products: [
    {
      id: "tunique-indigo", type: "garment", cat: "femme", collection: "capsule", pattern: "batik-indigo", price: 45000, sku: "MF-TU-001", status: "available",
      name: { fr: "Tunique Indigo", en: "Indigo Tunic" },
      desc: { fr: "Tunique ample en tissu teint à la main, coupe fluide et contemporaine.", en: "Loose tunic in hand-dyed fabric, with a fluid, contemporary cut." },
      colors: ["Indigo"], sizes: { S: 3, M: 5, L: 4, XL: 2 },
    },
    {
      id: "chemise-kanvo", type: "garment", cat: "homme", collection: "nouveautes", pattern: "kanvo", price: 38000, sku: "MF-CH-002", status: "available",
      name: { fr: "Chemise Kanvo", en: "Kanvo Shirt" },
      desc: { fr: "Chemise associant pagne tissé et coupe moderne.", en: "Shirt pairing woven pagne with a modern cut." },
      colors: ["Terre cuite"], sizes: { S: 2, M: 4, L: 4, XL: 0 },
    },
    {
      id: "veste-olive", type: "garment", cat: "homme", collection: "nouveautes", pattern: "olive", price: 62000, sku: "MF-VE-003", status: "available",
      name: { fr: "Veste Olive", en: "Olive Jacket" },
      desc: { fr: "Veste structurée en lin, teinte olive naturelle.", en: "Structured linen jacket in a natural olive shade." },
      colors: ["Olive"], sizes: { M: 3, L: 3, XL: 1 },
    },
    {
      id: "robe-terre", type: "garment", cat: "femme", collection: "nouveautes", pattern: "terracotta", price: 55000, sku: "MF-RO-004", status: "soon",
      name: { fr: "Robe Terre", en: "Earth Dress" },
      desc: { fr: "Robe longue teinte terre cuite.", en: "Long dress in a terracotta dye." },
      colors: ["Terre cuite"], sizes: { S: 0, M: 0, L: 0 },
    },
    {
      id: "teint-indigo", type: "fabric", family: "teint", pattern: "batik-indigo", price: 9000, sku: "TS-TE-001", status: "available",
      name: { fr: "Tissu teint indigo", en: "Indigo dyed fabric" },
      desc: { fr: "Tissu teint à la main. Les nuances et motifs peuvent varier d'un lot à l'autre.", en: "Hand-dyed fabric. Shades and patterns may vary from one batch to another." },
      color: "Indigo", width: "", unit: "m", min: 0.5, step: 0.5, stock: 40,
    },
    {
      id: "kanvo-sable", type: "fabric", family: "kanvo", pattern: "kanvo", price: 15000, sku: "TS-KA-002", status: "available",
      name: { fr: "Kanvo sable & terre", en: "Sand & earth Kanvo" },
      desc: { fr: "Pagne tissé traditionnel. Variations de lot possibles.", en: "Traditional woven pagne. Batch variations possible." },
      color: "Sable / Terre cuite", width: "", unit: "m", min: 1, step: 0.5, stock: 25,
    },
    {
      id: "melange-olive", type: "fabric", family: "melange", pattern: "olive", price: 11000, sku: "TS-ME-003", status: "available",
      name: { fr: "Mélange olive", en: "Olive blend" },
      desc: { fr: "Mélange de matières, teinte olive.", en: "Blended fibres in an olive shade." },
      color: "Olive", width: "", unit: "m", min: 0.5, step: 0.5, stock: 0,
    },
  ],
};
