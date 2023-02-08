"use strict"

const fs = require('fs');
const prompt = require('prompt-sync')();
const random = require('random');

//EX01////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

class Palavra {
    palavra;
    dica;

    constructor(palavra, dica) {
        this.palavra = palavra;
        this.dica = dica;
    }
}

function readFile() {
    return JSON.parse(fs.readFileSync("palavras.json"), function reviver(prop, val) {
        if (prop  == "palavra" && prop == "dica") {
            return new Map(val);
        }
        return val;
    });
}

function cadPalavra(palavra, dica) {
    let lista = readFile();
    palavra = palavra.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    if (lista.findIndex(element => element.palavra == palavra) == -1) {
        lista.push(new Palavra(palavra, dica));
        console.log("\nPalavra Cadastrada com sucesso!");
        return fs.writeFileSync("palavras.json", JSON.stringify(lista, null, 2));
    } else {
        console.log("\nPalavra já existente. Tente novamente!");
        return;
    }
} 


function printPalavras() {
    let listaPalavras = readFile();
    console.log("|--------------|Palavras Cadastradas|--------------|\n")
    for (let palavra of listaPalavras) {
        console.log(palavra.palavra);
    }
    return;
}

function deletePalavra(palavra) {
    let listaPalavras = readFile();
    let listaFiltrada = [];
    for (let palavraLista of listaPalavras) {
        if (palavraLista.palavra.localeCompare(palavra, "br", {sensitivity: "base"}) == 0) {
            continue;
        }
        listaFiltrada.push(palavraLista);
    }
    if (listaFiltrada.length == listaPalavras.length) {
        console.log("A palavra", palavra, "não foi encontrada para ser removida. Tente novamente!");
        return;
    } else {
        console.log("A palavra", palavra, "foi removida com sucesso!");
        return fs.writeFileSync("palavras.json", JSON.stringify(listaFiltrada, null, 2));
    }
}


function mainex01() {
    console.log("Lista de Palavras -", String(readFile().length),"palavras cadastradas.");
    console.log("1 - Cadastrar Nova Palavra;\n2 - Listar Palavras;\n3 - Remover Palavra;\n4 - Sair.\n");
    let op = 0;
    do {
        op = Number(prompt("O que você deseja fazer? "));
        switch (op) {
            case 1:
                let palavra = String(prompt("Digite a Palavra: ")).toLocaleLowerCase();
                let dica = String(prompt("Digite a dica: ")).toLocaleLowerCase();
                if (palavra.length < 2 || dica.length < 2 ) {
                    console.log("Entradas Incorretas, tente novamente!");
                } else {
                    cadPalavra(palavra, dica);
                }            
                break;
            case 2:
                printPalavras();
                break;
            case 3:
                let palavraDelete = String(prompt("Digite a Palavra que deseja remover: "));
                deletePalavra(palavraDelete);
                break;
            case 4: 
                return;
            default:
                console.log("Opção Inválida, Tente novamente!");
                break;
        }
    }  while (op != 4);
}

//EX02////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

function sortPalavra() {
    //estou usando a função já feita no exercício anterior.
    let listaPalavras = readFile();
    return (listaPalavras[random.int(0, listaPalavras.length - 1)]);
}

function ocultarPalavra(palavra){
    let palavraOculta = [];
    for (let i = 0; i < palavra.length; i++) {
        palavraOculta.push("*");
    }
    return palavraOculta
}

function rodada(palavraSorteada, palavraOculta, chutesFeitos) { 
    console.log("\nDica: A palavra é um(a)", palavraSorteada.dica);
    console.log("Letras Descobertas:", String(palavraOculta).replace(/,/g, ""));
    console.log("Letras Digitadas:", String(chutesFeitos).replace(/,/g, " "));
    let chute = prompt("Qual o seu palpite? ");
    while (isNaN(chute) == false) {
        chute = prompt("Qual o seu palpite? ");
    } 
    if (chutesFeitos.includes(chute)) {
        console.log(`A letra ${chute} já foi digitada, Tente outra!`);
        rodada(palavraSorteada, palavraOculta, chutesFeitos);
    }
    return chute;
}

function verifChute(chute, palavraSorteada, palavraOculta) {
    let j = 0;
    for (let i = 0; i < palavraSorteada.length; i++) {
        if (palavraSorteada[i] == chute) {
            palavraOculta[i] = chute;
            j++;
        }
    }
    if (j == 0) {
        return(false);
    } else {
        return palavraOculta;
    }
}

function mainex02() {
    const palavraSorteada = sortPalavra()
    let chutesFeitos = [];
    const palavra = palavraSorteada.palavra;
    let palavraOculta = ocultarPalavra(palavraSorteada.palavra);
    for (let i = 0; i < 5; i++) {
        let chute = rodada(palavraSorteada, palavraOculta, chutesFeitos);
        let parameter = verifChute(chute, palavra, palavraOculta);
        chutesFeitos.push(chute);
        if (parameter == false) {
            console.log(`\n- 1 Chance: A letra ${chute} digitada não existe na palavra!\n`);
            continue;
        }
        else if (String(palavraOculta).replace(/,/g, "") == palavra) {
            console.log(`\nVocê ganhou! A palavra é ${palavra}.\n`);
            let op = Number(prompt("\nQuer jogar Novamente (1- Sim, 2- Não)? "));
            while (op != 1 || op != 2) {
                console.log("Opção Inválida. Tente Novamente!");
                op = Number(prompt("\nQuer jogar Novamente (1- Sim, 2- Não)? "));
            }
            return op;
        }
        else {
            console.log(`Isso ae! A palavra possui a letra ${chute}.`);
            palavraOculta = parameter;
            i--;
        }
    }
    console.log(`Você Perdeu! A palavra era ${palavra}`);
    let op = Number(prompt("Você gostaria de jogar Novamente (1- Sim, 2- Não)? "));
    while (op != 1 || op != 2) {
        console.log("Opção Inválida. Tente Novamente!");
        op = Number(prompt("\nQuer jogar Novamente (1- Sim, 2- Não)? "));
    }
    return op;
}

function mainAux() {
    console.log("BEM VINDO AO JOGO DA FORCA. VAMOS COMEÇAR:\n");
    let vezes = 1;
    let recorde = 0;
    for (let i = 0; i < vezes; i++) {
        let parameter = mainex02();
        if (parameter == 2) {
            console.log(`Seu recorde é de ${recorde} acertos!`);
            return;
        } else {
            vezes++;
        }
        recorde++;
    }
    console.log(`Seu recorde é de ${recorde} acertos!`);
    return;
}

mainAux()