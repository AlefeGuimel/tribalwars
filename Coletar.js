//VARIÁVEIS DO PROGRAMA


var contagem = 0;
var npassos = 200;
var trabalhador; // thread paralelo para cálculos
var has_archer = game_data.units.includes("archer");
var duração_fator, duração_expoente, duração_inicial_segundos;
if (parseFloat(game_data.majorVersion) < 8.177) {
    var scavengeInfo = JSON.parse($('html').find('script:contains("ScavengeScreen")').html().match(/\{.*\:\{.*\:.*\}\}/g)[0]);
    duração_fator = scavengeInfo[1].duração_fator;
    duration_exponent = scavengeInfo[1].duration_exponent;
    duration_initial_seconds = scavengeInfo[1].duration_initial_seconds;
}
outro {
    duration_factor = window.ScavengeScreen.village.options[1].base.duration_factor;
    duration_exponent = window.ScavengeScreen.village.options[1].base.duration_exponent;
    duration_initial_seconds = window.ScavengeScreen.village.options[1].base.duration_initial_seconds;
}
var horas = 6;
var max_spear = -1;
var max_sword = -1;
var max_axe = -1;
var max_archer = -1;
var max_light = -1;
var max_marcher = -1;
var max_heavy = -1;
var refresh_time = 60;

var haulsPerUnit = {"lança":25, "espada":15, "machado":10, "leve":80, "pesado":50, "arqueiro":10, "marchador":50, "cavaleiro":0};
var lootFactors = {0:0.1,1:0.25,2:0.5,3:0.75};


//VARIÁVEIS DO PROGRAMA


função assíncrona run_all()
{
    if (window.location.href.indexOf('screen=place&mode=scavenge') < 0) {
        window.location.assign(game_data.link_base_pure + "place&mode=scavenge");
    }
    criarInterface();
    startWorker();

    $.ajax({url:window.location.href.split("scavenge")[0] + "unidades", success:successfunc});

    setTimeout(function(){
        console.log("change_page");
        $("[class='arrowRight']").click();
        $("[class='grupoDireito']").click();

        setTimeout(function(){
            console.log("recarregando");
            location.reload();
       }, 2000)
    }, refresh_time*1000*(1 + 0.2*Math.random()));
}

function myconsolelog(arg)
{
    var mem = JSON.stringify(arg);
    console.log(mem);
}

função inputMemory()
{
    if ("ScavengeTime" em localStorage) {
        horas = parseFloat(localStorage.getItem("ScavengeTime"));
    }

    document.getElementById("horas").value = parseFloat(horas);

    if ("max_spear" em localStorage) {
        max_spear = parseInt(localStorage.getItem("max_spear"));
    }

    document.getElementById("max_spear").value = parseInt(max_spear);

    if ("max_sword" em localStorage) {
        max_sword = parseInt(localStorage.getItem("max_sword"));
    }

    document.getElementById("max_sword").value = parseInt(max_sword);


    if ("max_axe" em localStorage) {
        max_axe = parseInt(localStorage.getItem("max_axe"));
    }

    document.getElementById("max_axe").value = parseInt(max_axe);

    if(tem_arqueiro)
    {
        if ("max_archer" em localStorage) {
            max_archer = parseInt(localStorage.getItem("max_archer"));
        }
        document.getElementById("max_archer").value = parseInt(max_archer);
    }


    if ("max_light" em localStorage) {
        max_light = parseInt(localStorage.getItem("max_light"));
    }

    document.getElementById("max_light").value = parseInt(max_light);

    if(tem_arqueiro)
    {
        if ("max_marcher" em localStorage) {
            max_marcher = parseInt(localStorage.getItem("max_marcher"));
        }
        document.getElementById("max_marcher").value = parseInt(max_marcher);
    }



    if ("max_heavy" em localStorage) {
        max_heavy = parseInt(localStorage.getItem("max_heavy"));
    }

    document.getElementById("max_heavy").value = parseInt(max_heavy);

    if ("refresh_time" em localStorage) {
        refresh_time = parseFloat(localStorage.getItem("refresh_time"));
        refresh_time = refresh_time < 10? 10 :refresh_time;
    }

    document.getElementById("refresh_time").value = parseFloat(refresh_time);
}

função aceitarConfigs()
{
    horas = parseFloat(document.getElementById("horas").value);
    localStorage.setItem("ScavengeTime", horas);
    
    max_spear = parseInt(document.getElementById("max_spear").value);    
    localStorage.setItem("max_spear", max_spear);
    
        
    max_sword = parseInt(document.getElementById("max_sword").value);
    localStorage.setItem("max_sword", max_sword);
    

    max_axe = parseInt(document.getElementById("max_axe").value);
    localStorage.setItem("max_axe", max_axe);
    
    if(tem_arqueiro)
    {
        max_archer = parseInt(document.getElementById("max_archer").value);
        localStorage.setItem("max_archer", max_archer);
    }
    

    max_light = parseInt(document.getElementById("max_light").value);
    localStorage.setItem("max_light", max_light);
    

    if(tem_arqueiro)
    {
        max_marcher = parseInt(document.getElementById("max_marcher").value);
        localStorage.setItem("max_marcher", max_marcher);
    }
    

    max_heavy = parseInt(document.getElementById("max_heavy").value);
    localStorage.setItem("max_heavy", max_heavy);

    refresh_time = parseFloat(document.getElementById("refresh_time").value);
    localStorage.setItem("refresh_time", refresh_time);
    refresh_time = refresh_time < 10? 10 :refresh_time;
}

função criarInterface()
{
    if ($('botão').comprimento == 0) {

        //cria interface e botão
        var haulCategory = 0;
        localStorage.setItem("haulCategory", haulCategory);
        var botão = document.createElement("botão");
        button.classList.add("btn-confirm-yes");
        button.innerHTML = "Ajustar tempo de eliminação";
        button.style.visibility = 'oculto';
        var body = document.getElementById("scavenge_screen");
        body.prepend(botão);
        var scavDiv = document.createElement('div');

        if (tem_arqueiro) {
            htmlString = '<div ID= scavTable >\
            <table class="scavengeTable" width="15%" style="border: 7px solid rgba(121,0,0,0.71); border-image-slice: 7 7 7 7; border-image-source: url(https://dsen.innogamescdn.com/asset/cf2959e7/graphic/border/frame-gold-red.png);" >\
                <corpo>\
                    <tr>\
                        <th style="text-align:center" colspan="13">Selecione os tipos de unidades para vasculhar</th>\
                    </tr>\
                    <tr>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png" title="Spear fighter" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_sword.png" title="Swordsman" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png" title="Axeman" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" cl ass="unit_link" data-unit="archer"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_archer.png" title="Archer" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png" title="Cavalaria leve" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="marcher"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_marcher.png" title="Mounted Archer" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png" title="Cavalaria pesada" alt="" class=""></a></th>\
                        <th style="text-align:center" nowrap width="120">Tempo máximo de execução</th>\
                        <th style="text-align:center" nowrap width="100">Tempo de atualização</th>\
                    </tr>\
                    <tr>\
                        <td align="center"><input type="checkbox" ID="spear" name="spear" marcada = "marcada" ></td>\
                        <td align="center"><input type="checkbox" ID="sword" name="sword" ></td>\
                        <td align="center"><input type="checkbox" ID="axe" name="axe" ></td>\
                        <td align="center"><input type="checkbox" ID="archer" name="archer" ></td>\
                        <td align="center"><input type="checkbox" ID="light" name="light" ></td>\
                        <td align="center"><input type="checkbox" ID="marcher" name="marcher" ></td>\
                        <td align="center"><input type="checkbox" ID="heavy" name="heavy" ></td>\
                        <td ID="runtime" align="center"><input type="text" ID="hours" name="hours" size="1" maxlength="2" align=left > horas</td>\
                        <td align="center"><input type="text" ID="refresh_time" name="refresh_time" size="1" maxlength="3" align=left > segundos</td>\
                    </tr>\
                    <tr>\
                        <th style="text-align:center" colspan="13">Insira o máximo de tropas para usar a coleta (-1 = ilimitado)</th>\
                    </tr>\
                    <tr>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_spear" value=-1 name="max_spear" marcada = "marcada" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_sword" value=-1 name="max_sword" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_axe" value=-1 name="max_axe" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_archer" value=-1 name="max_archer" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_light" value=-1 name="max_light" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_marcher" value=-1 name="max_marcher" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_heavy" value=-1 name="max_heavy" ></td>\
                        <td align ="center" colspan="2"><input class="btn" ID="btn-accept-configs" type="submit" value="Aceitar configs" tabindex="5" onclick="acceptConfigs()"> </td>\
                    </tr>\
               </tbody>\
            </tabela>\
         </div>\
         ';
        } outro {
            htmlString = '<div ID= scavTable >\
            <table class="scavengeTable" width="15%" style="border: 7px solid rgba(121,0,0,0.71); border-image-slice: 7 7 7 7; border-image-source: url(https://dsen.innogamescdn.com/asset/cf2959e7/graphic/border/frame-gold-red.png);" >\
                <corpo>\
                    <tr>\
                        <th style="text-align:center" colspan="13">Selecione os tipos de unidades para vasculhar</th>\
                    </tr>\
                    <tr>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png" title="Spear fighter" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_sword.png" title="Swordsman" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png" title="Axeman" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png" title="Cavalaria leve" alt="" class=""></a></th>\
                        <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png" title="Cavalaria pesada" alt="" class=""></a></th>\
                        <th style="text-align:center" nowrap width="120">Tempo de execução de destino</th>\
                        <th style="text-align:center" nowrap width="100">Tempo de atualização</th>\
                    </tr>\
                    <tr>\
                        <td align="center"><input type="checkbox" ID="spear" name="spear" marcada = "marcada" ></td>\
                        <td align="center"><input type="checkbox" ID="sword" name="sword" ></td>\
                        <td align="center"><input type="checkbox" ID="axe" name="axe" ></td>\
                        <td align="center"><input type="checkbox" ID="light" name="light" ></td>\
                        <td align="center"><input type="checkbox" ID="heavy" name="heavy" ></td>\
                        <td ID="runtime" align="center"><input type="text" ID="hours" name="hours" size="1" maxlength="2" align=left > horas</td>\
                        <td align="center"><input type="text" ID="refresh_time" name="refresh_time" size="1" maxlength="3" align=left > segundos</td>\
                    </tr>\
                    <tr>\
                        <th style="text-align:center" colspan="13">Insira o máximo de tropas para usar a coleta (-1 = ilimitado)</th>\
                    </tr>\
                    <tr>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_spear" value=-1 name="max_spear" marcada = "marcada" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_sword" value=-1 name="max_sword" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_axe" value=-1 name="max_axe" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_light" value=-1 name="max_light" ></td>\
                        <td align="center"><input type="text" size="1" maxlength="5" ID="max_heavy" value=-1 name="max_heavy" ></td>\
                        <td align ="center" colspan="2"><input class="btn" ID="btn-accept-configs" type="submit" value="Aceitar configs" tabindex="5" onclick="acceptConfigs()"> </td>\
                    </tr>\
               </tbody>\
            </tabela>\
         </div>\
         ';
        }

        scavDiv.innerHTML = htmlString;
        scavenge_screen.prepend(scavDiv.firstChild);

        entradaMemória();
    }

    if ($(".scavengeTable")[0]) {
        document.getElementById("horas").value = horas;
    }

    var checkboxValues ​​= JSON.parse(localStorage.getItem('checkboxValues')) || {}, $checkboxes = $("#scavTable :checkbox");
    $checkboxes.on("alterar", função () {
        $caixas de seleção.cada(função () {
            checkboxValues[this.id] = this.checked;
        });
        localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
    });

    $.each(checkboxValues, função (chave, valor) {
        $("#" + chave).prop('marcado', valor);
    });
}

function checkboxStatus(unidades disponíveis) {
    if (document.getElementById("lança").checked == false) {
        disponíveisUnits["lança"] = 0;
    }
    if (document.getElementById("espada").checked == false) {
        unidadesdisponíveis["espada"] = 0;
    }
    if (document.getElementById("machado").checked == false) {
        unidadesdisponíveis["machado"] = 0;
    }
    if (document.getElementById("light").checked == false) {
        unidadesdisponíveis["leve"] = 0;
    }
    if (document.getElementById("heavy").checked == false) {
        disponivelUnits["pesado"] = 0;
    }
    if (tem_arqueiro) {
        if (document.getElementById("archer").checked == false) {
            unidadesdisponíveis["arqueiro"] = 0;
        }
    }
    if (tem_arqueiro) {
        if (document.getElementById("marcher").checked == false) {
            unidadesdisponíveis["marcha"] = 0;
        }
    }
    disponíveisUnits["cavaleiro"] = 0;
}


function getAvailableUnits() {
    var unidadesdisponíveis = {};
    $('.units-entry-all').each((i, e) => {
        const unitName = $(e).attr("data-unit");
        contagem const = $(e).text().replace(/[()]/, '');
        disponíveisUnits[unitName] = parseInt(count);
    });

    checkboxStatus(unidades disponíveis);

    retornar unidades disponíveis;
}

função calcularHaul(unidades)
{
    var unitHauls = $.map(units, function(obj, key){return obj*haulsPerUnit[key]})
    var totalHaul = 0
    $.each(unitHauls,function(){totalHaul+=this || 0;});
    return totalHaul;
}

duração da função(x)
{
    return ((100*x*x)**duration_expoente + duration_initial_seconds) * duration_factor
}

função resourceperhour(x, arrayalpha, arrayfactor)
{
    return arrayalpha.reduce((acc, curr, i)=> {
        let arg = x * curr*arrayfactor[i]/nsteps;
        return acc+ (arg)/duração(arg)}, 0)
}

função getAvailableScavanges()
{
    var disponívelScavanges = [3,2,1,0]

    availableScavanges = $.grep(availableScavanges, function(obj, index){return $("[class*='free_send_button']",$($("[class^='scavenge-option']")[obj])).length > 0})
    retornar disponívelScavanges;
}

função startWorker()
{
    let workerCode = `<script id="worker1" type="javascript/worker">
        // Este script não será analisado pelos mecanismos JS porque seu tipo é javascript/worker.
        função get_optimal_factors_math(haul, arrayfactor, worldSettings)
        {
            var npassos = 200;
            let [duration_factor, duration_exponent, duration_initial_seconds] = worldSettings;
            duração da função(x)
            {
                return ((100*x*x)**duration_expoente + duration_initial_seconds) * duration_factor
            }
            função recursos por hora(x, arrayalpha)
            {
                return arrayalpha.reduce((acc, curr, i)=> {
                    let arg = x * curr*arrayfactor[i]/nsteps;
                    return acc+ (arg)/duração(arg)}, 0)
            }
            function aRange(start, end, prefix, dim, last=false)
            {
                let length = end-start+ 1;
                let arr = Array(comprimento);
                se (último)
                {
                    let sum = prefix.reduce((a,b)=>a+b,0);
                    return Array.from(arr, (x, i) => [...prefix, start + i, dim-(start + i)-sum]);
                }
                outro
                    return Array.from(arr, (x, i) => [...prefixo, (start + i)]);
            }
            função oneDimSquareArrayConstructor(dim, profundidade){
                let dims = Array(profundidade).fill(dim);
                return dims.reduce(function(accumulator, curr, currDepth){
                    deixe novoAcumulador = [];
                    for(let i=0; i < acumulador.comprimento; i++)
                    {
                        deixe currAccum = acumulador[i];
                        let end = dim-currAccum.reduce((a,b)=>a+b,0);
                        if(fim>=0)
                            newAccumulator.push(...aRange(0, end, currAccum, dim, Math.max(0, currDepth-depth +2)));
                    }
                    return novoAcumulador;
                }, [[]])
            }
            deixe max = 0;
            let maxIndex = Array.from(arrayfactor,(x,i)=>0);
            let nDimarray = oneDimSquareArrayConstructor(nsteps, arrayfactor.length-1);
            for(i=0;i < nDimarray.length; i++)
            {
                deixe curr = nDimarray[i];
                let val = recursos por hora(lanço, corrente);
                if(val > max)
                {
                    máx = valor;
                    maxIndex = atual;
                }
            }
            let finalTime = performance.now();
            return [max, Array.from(maxIndex, (x)=>x/nsteps)];
        }
        onmessage = ({data:args}) =>{
            console.log('Mensagem recebida do script principal');
            let res = get_optimal_factors_math(...JSON.parse(args).args);
            console.log('Postando mensagem de volta ao script principal');
            postMessage({resultado:res, otherStuff:JSON.parse(args).otherStuff});
        };
    </script>`

    $("#contentContainer").eq(0).prepend(workerCode);


    var blob = new Blob([document.querySelector('#worker1').textContent], {tipo: "text/javascript"});

    // Observação: window.webkitURL.createObjectURL() no Chrome 10+.
    worker = new Worker(window.URL.createObjectURL(blob));
    worker.onmessage = ({data:output})=> {
        console.log('Mensagem recebida do trabalhador', saída);
        otimização_callBack(output.result, ...output.otherStuff)
    };
}

função get_optimal_factors(unidades, disponíveisScavanges)
{    
    var disponívelScavanges = getAvailableScavanges();
    if(escavanges disponíveis.comprimento == 1)
    {
        otimização_callBack([1,[1]], unidades, disponíveisScavanges);
        retornar
    }

    myconsolelog("Scavanges disponíveis:");
    myconsolelog(disponívelScavanges);
    var arrayfactor = $.map(availableScavanges, function(obj, key){return lootFactors[key]});
    myconsolelog("arrayfactor")
    myconsolelog(arrayfactor)
    myconsolelog("unidades");
    myconsolelog(unidades);
    var totalHaul = calculaHaul(unidades);
    myconsolelog("totalHaul");
    myconsolelog(totalHaul);
    worker.postMessage(JSON.stringify({args:[totalHaul, arrayfactor, [duration_factor, duration_exponent, duration_initial_seconds]], otherStuff: [units, availableScavanges]})); // Inicia o trabalhador.
}

função run(buscas disponíveis, unitsToUse) {
    myconsolelog("unidades iniciais a usar");
    myconsolelog(unidadesToUse);
    var unidades = {...unidadesToUse};
    get_optimal_factors(unidades, disponíveisScavanges);
}

função otimização_callBack(otimização, unidades, disponíveisScavanges)
{
    scavangeType = disponívelScavanges.shift();
    let btn = $("[class*='free_send_button']",$($("[class^='scavenge-option']")[scavangeType]))[0];
    console.log(btn)
    var unitsToUse = {...unidades};
    myconsolelog("transporte de otimização");
    myconsolelog(otimização[0]);
    myconsolelog("fatores de otimização");
    myconsolelog(otimização[1]);
    var leftest_optimal = otimização[1].pop();
    myconsolelog("leftest_optimal");    
    myconsolelog(leftest_optimal);

    $.each(unidades, função(chave, val){unidades[chave] = parseInt(leftest_optimal*val)})
    var predHaul =lootFactors[scavangeType] * calculaHaul(unidades);

    var tempo = horas * 3600;
    var maxhaul = ((time / duration_factor - duration_initial_seconds) ** (1 / (duration_exponent)) / 100) ** (1 / 2);

    if(predHaul > maxhaul)
        $.each(unidades, função(chave, val){unidades[chave] = maxhaul/predHaul *val});

    myconsolelog("unitsToUse antes de subtrair")
    myconsolelog(unidadesToUse);
    let unitsPopulation ={"spear":1, "sword":1, "axe":1, "archer":1, "spy":2, "light":4, "marcher":5, "heavy":6, "knight": 10};
    deixe unidadesToUsePopulation = 0;
    $.each(unidades, função(chave, obj){
        unitsToUsePopulation += obj * unitsPopulation[chave];
    });

    console.log(unitsToUsePopulation)

    if(unidadesToUsePopulation > 10){
        $.each(unidades,função(chave,obj){
            unitsToUse[chave] -= obj;
            $(`input.unitsInput[name='${key}']`).val(obj).trigger("change");
        });
        myconsolelog("unitsToUse depois de subtrair");
        myconsolelog(unidadesToUse);
        btn.click();
    }
    
    setTimeout(function(){
        if(escavanges disponíveis.comprimento > 0)
            run(availableScavanges, unitsToUse)
    }, 500*(1+0.2*Math.random()));
}

função sucessofunc(dados)
{
    var unitNamesArray;
    if(tem_arqueiro)
        unitNamesArray = ["lança", "espada", "machado", "arqueiro", "leve", "pesado", "marchador"];
    outro
        unitNamesArray = ["lança", "espada", "machado", "leve", "pesado"];

    var unitsToUse = {};
    var scavanging_units = {};
    var documento = $(dados);
    //Pode quebrar o script
    var scavTable = $("#content_value > table:nth-child(10)", doc)[0];
    $.each(unitNamesArray, function(index, val){
        scavanging_units[val] = scavTable? parseInt($("[class^='item-unidade item-unidade-" + val +"']", scavTable).last()[0].innerText):0;
    });

    var max_units;

    if(tem_arqueiro)
        max_units={"spear":max_spear, "sword":max_sword, "axe":max_axe, "archer":max_archer, "light":max_light, "heavy":max_heavy, "marcher":max_marcher};
    outro
        max_units={"spear":max_spear, "sword":max_sword, "axe":max_axe, "light":max_light, "heavy":max_heavy};

    varDisponibleUnits = getAvailableUnits();
    myconsolelog("Unidades disponíveis");
    myconsolelog(unidades disponíveis);
    $.each(unidades disponíveis, função(chave, obj){
        if (max_units[chave] == -1)
        {
            unitsToUse[chave] = obj
            retornar
        }

        if(max_units[chave] < obj + scavanging_units[chave])
        {
            unitsToUse[chave] = Math.max(max_units[chave] - scavanging_units[chave], 0);
        }
        outro
            unitsToUse[chave] = obj;
    })
    myconsolelog("unitsToUse");
    myconsolelog(unidadesToUse);
    
    var disponívelScavanges = getAvailableScavanges();
    
    if(escavanges disponíveis.comprimento > 0)
        run(availableScavanges, unitsToUse)
}


run_all();

function altAldeia() {
$('.arrowRight').click();
$('.groupRight').click();
}

setInterval(altAldeia, 14000);
