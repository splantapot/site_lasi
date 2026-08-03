import { Membro } from "../shared/modules/Membro.js";
import { Projeto } from "../shared/modules/Projeto.js";
import { Apresentacao } from "../shared/modules/Apresentacao.js";

const M1 = new Membro({
    nome: 'João Victor',
    media: 'jvcr1007@gmail.com, https://instagram.com',
    foto: 'alaskalskalsmasnai'
});

const P1 = new Projeto({
    titulo: 'Um novo projeto',
    data: 'Uma nova data',
    texto: 'Um novo texto',
    fotos: "foto1, foto2; foto3",
    media: "instagram, facebook, etc"
});

const A1 = new Apresentacao({
    titulo: 'titulo novo',
    texto: 'apenas um texto'
})

console.log(M1);
console.log(P1);
console.log(A1);