import Apresentacao from "../models/Apresentacao.js";

// module with fake dev app data

const APP_DATA = {};

APP_DATA[Apresentacao.LIST_NAME] = [
    new Apresentacao({
        titulo: "First",
        texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et tellus sed ipsum aliquet suscipit a at mi. Suspendisse lacus felis, consectetur in arcu non, elementum elementum odio. Nullam dictum risus nibh, et sodales nibh varius id. Nam tempor, tortor et sagittis porta, orci purus cursus ligula, ut ullamcorper risus nulla in tellus. Morbi maximus massa suscipit, scelerisque nisl in, tincidunt elit.",
        link_texto: "Conheça-nos",
        link_url: "#about",
        foto: "./assets/blank-slideshow.png"
    }).toJson(),
    new Apresentacao({
        titulo: "Second",
        foto: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200"
    }).toJson(),
    new Apresentacao({
        titulo: "Third",
        link_texto: "Leia mais",
        link_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200"
    }).toJson(),
    new Apresentacao({
        titulo: "Fourth"
    }).toJson()
];

export default APP_DATA;