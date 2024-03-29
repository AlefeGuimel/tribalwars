var objetoTropas = [];
var altAldTempo = aleatorio(10000, 10000);

var lanca = true;
var espada = true;
var barbaro = false;
var explorador = true;
var cavalariaLeve = false;
var cavalariaPesada = false;
var catapulta = false;
var ariete = false;

var quantidadeRecrutar = 1;

var classEnum = Object.freeze({
    lanca: ".unit_sprite_smaller.spear",
    espada: ".unit_sprite_smaller.sword",
    barbaro: ".unit_sprite_smaller.axe",
    explorador: ".unit_sprite_smaller.spy",
    cavalariaLeve: ".unit_sprite_smaller.light",
    cavalariaPesada: ".unit_sprite_smaller.heavy",
    ariete: ".unit_sprite_smaller.ram",
    catapulta: ".unit_sprite_smaller.catapult"
});

function GerarObjeto() {
    objetoTropas = [
        {
            nomeUnidade: "spear",
            recrutar: lanca,
            cssClassSelector: classEnum.lanca,
            quantidade: quantidadeRecrutar
        },
        {
            nomeUnidade: "sword",
            recrutar: espada,
            cssClassSelector: classEnum.espada,
            quantidade: quantidadeRecrutar
        },
        {
            nomeUnidade: "axe",
            recrutar: barbaro,
            cssClassSelector: classEnum.barbaro,
            quantidade: quantidadeRecrutar
        },
        {
            nomeUnidade: "spy",
            recrutar: explorador,
            cssClassSelector: classEnum.explorador,
            quantidade: quantidadeRecrutar
        },
        {
            nomeUnidade: "light",
            recrutar: cavalariaLeve,
            cssClassSelector: classEnum.cavalariaLeve,
            quantidade: quantidadeRecrutar
        },
        {
            nomeUnidade: "heavy",
            recrutar: cavalariaPesada,
            cssClassSelector: classEnum.cavalariaPesada,
            quantidade: quantidadeRecrutar
        },
        {
            nomeUnidade: "ram",
            recrutar: ariete,
            cssClassSelector: classEnum.ariete,
            quantidade: quantidadeRecrutar
        },
        {
            nomeUnidade: "catapult",
            recrutar: catapulta,
            cssClassSelector: classEnum.catapulta,
            quantidade: quantidadeRecrutar
        }
    ];
}

$(document).ready(function () {
    GerarObjeto();

    var retorno = false;
    objetoTropas.forEach(element => {
        var response = validarPreencher(element);
        //se o retorno não tiver sido verdadeiro nos loops anteriores, seta com o valor da resposta atual
        //caso ja tenha sido, manter o valor como verdadeiro
        if (!retorno) {
            retorno = response;
        }
    });

    if (retorno) {
        $(".btn-recruit").click();
    }

    console.log(altAldTempo);
    setInterval(function () {
        console.log("recarrega");
        location.reload(true);
    }, altAldTempo);
});

function validarPreencher(singleObject) {
    if (singleObject.recrutar) {
        if ($(singleObject.cssClassSelector).length <= 0 && $("input[name=" + singleObject.nomeUnidade + "]").length > 0) {
            $("input[name=" + singleObject.nomeUnidade + "]").focus().val(singleObject.quantidade).blur();
            if ((parseInt($("input[name="+singleObject.nomeUnidade+"]").parents("tr").find("#"+singleObject.nomeUnidade+"_0_cost_wood").text())*singleObject.quantidade)>parseInt($("#wood").text()))
                return false;
            if ((parseInt($("input[name="+singleObject.nomeUnidade+"]").parents("tr").find("#"+singleObject.nomeUnidade+"_0_cost_stone").text())*singleObject.quantidade)>parseInt($("#stone").text()))
                return false;
            if ((parseInt($("input[name="+singleObject.nomeUnidade+"]").parents("tr").find("#"+singleObject.nomeUnidade+"_0_cost_iron").text())*singleObject.quantidade)>parseInt($("#iron").text()))
                return false;
            return true;
        }
    }
    return false;
}

function aleatorio(superior, inferior) {
    numPosibilidades = superior - inferior;
    aleat = Math.random() * numPosibilidades;
    return Math.round(parseInt(inferior) + aleat);
}


(function() {
    'use strict';

    // Define o tempo em milissegundos (5 minutos = 5 * 60 * 1000)
    var tempoAtualizacao = 1 * 60 * 1000;

    // Função para atualizar a página
    function atualizarPagina() {
        location.reload();
    }

    // Agendar a função para executar a cada 5 minutos
    setInterval(atualizarPagina, tempoAtualizacao);
})();
