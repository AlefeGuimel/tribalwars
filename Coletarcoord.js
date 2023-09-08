// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Script Config
var scriptConfig = {
    scriptData: {
        prefix: 'mapCoordPicker',
        name: 'Map Coord Picker',
        version: 'v2.1.0',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/map-coords-picker.285565/',
    },
    translations: {
        en_DK: {
          'Map Coord Picker': 'Map Coordinate Picker',
          Help: 'Help',
          'Redirecting...': 'Redirecting...',
          Reset: 'Reset',
          Copy: 'Copy',
          'Copied!': 'Copied!',
          'Nothing to be copied!': 'Nothing to copy!',
          'Selection cleared!': 'Selection cleared!',
          'Selected villages:': 'Selected villages:',
          Highlight: 'Highlight',
          'Fill the coordinates field!': 'Fill in the coordinates field!',
          'Coordinates have been highlighted!': 'Coordinates have been highlighted!',
        },
        ro_RO: {
          'Map Coord Picker': 'Selecționare coordonate pe hartă',
          Help: 'Ajutor',
          'Redirecting...': 'Se redirecționează...',
          Reset: 'Resetare',
          Copy: 'Copiază',
          'Copied!': 'Copiat!',
          'Nothing to be copied!': 'Nimic de copiat!',
          'Selection cleared!': 'Selecție golită!',
          'Selected villages:': 'Sate selectate:',
          Highlight: 'Evidențiază',
          'Fill the coordinates field!': 'Completați câmpul cu coordonate!',
          'Coordinates have been highlighted!': 'Coordonatele au fost evidențiate!',
        },
        sk_SK: {
          'Map Coord Picker': 'Výber súradníc z mapy',
          Help: 'Pomoc',
          'Redirecting...': 'Presmerovanie...',
          Reset: 'Resetovať',
          Copy: 'Kopírovať',
          'Copied!': 'Skopírované!',
          'Nothing to be copied!': 'Nič na kopírovanie!',
          'Selection cleared!': 'Výber zmazaný!',
          'Selected villages:': 'Vybrané dediny:',
          Highlight: 'Zvýrazniť',
          'Fill the coordinates field!': 'Vyplňte pole súradníc!',
          'Coordinates have been highlighted!': 'Súradnice boli zvýraznené!',
        },
        pt_BR: {
          'Map Coord Picker': 'Selecionador de Coordenadas no Mapa',
          Help: 'Ajuda',
          'Redirecting...': 'Redirecionando...',
          Reset: 'Redefinir',
          Copy: 'Copiar',
          'Copied!': 'Copiado!',
          'Nothing to be copied!': 'Nada para copiar!',
          'Selection cleared!': 'Seleção limpa!',
          'Selected villages:': 'Aldeias selecionadas:',
          Highlight: 'Destacar',
          'Fill the coordinates field!': 'Preencha o campo de coordenadas!',
          'Coordinates have been highlighted!': 'As coordenadas foram destacadas!',
        },
        pt_PT: {
          'Map Coord Picker': 'Selecionador de Coordenadas no Mapa',
          Help: 'Ajuda',
          'Redirecting...': 'Redirecionando...',
          Reset: 'Repor',
          Copy: 'Copiar',
          'Copied!': 'Copiado!',
          'Nothing to be copied!': 'Nada para copiar!',
          'Selection cleared!': 'Seleção apagada!',
          'Selected villages:': 'Aldeias selecionadas:',
          Highlight: 'Realçar',
          'Fill the coordinates field!': 'Preencha o campo de coordenadas!',
          'Coordinates have been highlighted!': 'As coordenadas foram realçadas!',
        },
        it_IT: {
          'Map Coord Picker': 'Estrattore Coordinate dalla Mappa',
          Help: 'Aiuto',
          'Redirecting...': 'Redirezione...',
          Reset: 'Reimposta',
          Copy: 'Copia',
          'Copied!': 'Copiato!',
          'Nothing to be copied!': 'Niente da copiare!',
          'Selection cleared!': 'Selezione cancellata!',
          'Selected villages:': 'Villaggi selezionati:',
          Highlight: 'Evidenzia',
          'Fill the coordinates field!': 'Compila il campo delle coordinate!',
          'Coordinates have been highlighted!': 'Le coordinate sono state evidenziate!',
        },
        nl_NL: {
          'Map Coord Picker': 'Kaartcoördinaat Grijper',
          Help: 'Help',
          'Redirecting...': 'Doorverwijzen...',
          Reset: 'Resetten',
          Copy: 'Kopiëren',
          'Copied!': 'Gekopieerd!',
          'Nothing to be copied!': 'Niets te kopiëren!',
          'Selection cleared!': 'Selectie gewist!',
          'Selected villages:': 'Geselecteerde dorpen:',
          Highlight: 'Markeren',
          'Fill the coordinates field!': 'Vul het coördinatenveld in!',
          'Coordinates have been highlighted!': 'Coördinaten zijn gemarkeerd!',
        },
        fr_FR: {
          'Map Coord Picker': 'Sélectionner Coordonnées sur la carte',
          Help: 'Aide',
          'Redirecting...': 'Redirection...',
          Reset: 'Réinitialiser',
          Copy: 'Copier',
          'Copied!': 'Copié!',
          'Nothing to be copied!': 'Rien à copier!',
          'Selection cleared!': 'Sélection effacée!',
          'Selected villages:': 'Villages sélectionnés:',
          Highlight: 'Mettre en évidence',
          'Fill the coordinates field!': 'Remplissez le champ des coordonnées!',
          'Coordinates have been highlighted!': 'Les coordonnées ont été mises en évidence!',
        },
      },
    allowedMarkets: [],
    allowedScreens: ['map'],
    allowedModes: [],
    isDebug: DEBUG,
    enableCountApi: true,
};

$.getScript('https://twscripts.dev/scripts/twSDK.js', async function () {
    // Initialize Library
    await twSDK.init(scriptConfig);
    const isValidScreen = twSDK.checkValidLocation('screen');

    // Globals
    var mapOverlay;
    var selectedVillages = [];
    if ('TWMap' in window) mapOverlay = TWMap;

    // Entry point
    (function () {
        if (isValidScreen) {
            // build user interface
            buildUI();

            mapOverlay.mapHandler._spawnSector =
                mapOverlay.mapHandler.spawnSector;
            TWMap.mapHandler.spawnSector = spawnSectorReplacer;
            mapOverlay.map._DShandleClick = mapOverlay.map._handleClick;

            // register action handlers
            handleReset();
            handleCopy();
            handleMapClick();
            handleHighlight();
        } else {
            UI.InfoMessage(twSDK.tt('Redirecting...'));
            twSDK.redirectTo('map');
        }
    })();

    // Build UI
    function buildUI() {
        const content = `
            <div class="ra-mb15">
                <label for="villageList" class="ra-label">
                    ${twSDK.tt(
                        'Selected villages:'
                    )} <span id="countSelectedVillages">0</span>
                </label>
                <textarea id="villageList" class="ra-textarea"></textarea>
            </div>
            <div class="ra-mb15">
                <a href="javascript:void(0);" class="btn" id="raResetBtn">
                    ${twSDK.tt('Reset')}
                </a>
                <a href="javascript:void(0);" class="btn" id="raCopyBtn">
                    ${twSDK.tt('Copy')}
                </a>
                <a href="javascript:void(0);" class="btn" id="raHighlightBtn">
                    ${twSDK.tt('Highlight')}
                </a>
            </div>
        `;

        const customStyle = `
            .ra-label { display: block; margin-bottom: 5px; font-weight: 600; }
        `;

        twSDK.renderFixedWidget(
            content,
            scriptConfig.scriptData.prefix,
            'ra-map-coord-picker',
            customStyle
        );
    }

    // Action Handler: Reset
    function handleReset() {
        jQuery('#raResetBtn').on('click', function (e) {
            e.preventDefault();

            selectedVillages = [];
            jQuery('#villageList').val(selectedVillages.join(','));
            jQuery('#countSelectedVillages').text(selectedVillages.length);
            TWMap.reload();
            UI.SuccessMessage(twSDK.tt('Selection cleared!'));
        });
    }

    // Action Handler: Copy selected coords
    function handleCopy() {
        jQuery('#raCopyBtn').on('click', function (e) {
            e.preventDefault();

            const coords = jQuery('#villageList').val().trim();
            if (coords.length !== 0) {
                jQuery('#villageList').select();
                document.execCommand('copy');
                UI.SuccessMessage(twSDK.tt('Copied!'), 4000);
            } else {
                UI.ErrorMessage(twSDK.tt('Nothing to be copied!'), 4000);
            }
        });
    }

    // Action Handler: Handle map click
    function handleMapClick() {
        TWMap.map._handleClick = function (e) {
            let currentCoords = jQuery('#villageList').val();
            let pos = this.coordByEvent(e);
            let coord = pos.join('|');
            let village = TWMap.villages[pos[0] * 1000 + pos[1]];
            if (village && village.id) {
                if (!currentCoords.includes(coord)) {
                    jQuery(`[id="map_village_${village.id}"]`).css({
                        filter: 'brightness(200%) grayscale(100%)',
                    });
                    if (village && village.id) {
                        const idCoord = `${village.id}&${coord}`;
                        if (!currentCoords.includes(idCoord)) {
                            jQuery(`[id="map_village_${village.id}"]`).css({
                                filter: 'brightness(200%) grayscale(100%)',
                            });
                            selectedVillages.push(idCoord);
                            jQuery('#villageList').val(selectedVillages.join(','));
                            jQuery('#countSelectedVillages').text(selectedVillages.length);
                        } else {
                            selectedVillages = selectedVillages.filter((item) => item !== idCoord);
                            jQuery('#villageList').val(selectedVillages.join(','));
                            jQuery(`[id="map_village_${village.id}"]`).css({
                                filter: 'none',
                            });
                            jQuery('#countSelectedVillages').text(selectedVillages.length);
                        }
                    }


                    jQuery('#villageList').val(selectedVillages.join(','));
                    jQuery('#countSelectedVillages').text(
                        selectedVillages.length
                    );
                } else {
                    selectedVillages = selectedVillages.filter(
                        (village) => village !== coord
                    );
                    jQuery('#villageList').val(selectedVillages.join(','));
                    jQuery(`[id="map_village_${village.id}"]`).css({
                        filter: 'none',
                    });
                    jQuery('#countSelectedVillages').text(
                        selectedVillages.length
                    );
                }
            }
            return false;
        };
    }

    // Action Handler: Handle highlight coords on map
    function handleHighlight() {
        jQuery('#raHighlightBtn').on('click', function (e) {
            e.preventDefault();

            const chosenCoords = jQuery('#villageList').val().trim();

            if (chosenCoords.length !== 0) {
                const coordsArray = chosenCoords.split(',');
                updateMap(coordsArray);
                UI.SuccessMessage(
                    twSDK.tt('Coordinates have been highlighted!')
                );
            } else {
                UI.ErrorMessage(twSDK.tt('Fill the coordinates field!'));
            }
        });
    }

    // Helper: Update the map UI
    function updateMap(villageCoords) {
        // Show wall level of barbarian villages on the Map
        if (mapOverlay.mapHandler._spawnSector) {
            //exists already, don't recreate
        } else {
            //doesn't exist yet
            mapOverlay.mapHandler._spawnSector =
                mapOverlay.mapHandler.spawnSector;
        }

        TWMap.mapHandler.spawnSector = function (data, sector) {
            // Override Map Sector Spawn
            mapOverlay.mapHandler._spawnSector(data, sector);
            var beginX = sector.x - data.x;
            var endX = beginX + mapOverlay.mapSubSectorSize;
            var beginY = sector.y - data.y;
            var endY = beginY + mapOverlay.mapSubSectorSize;

            for (var x in data.tiles) {
                var x = parseInt(x, 10);
                if (x < beginX || x >= endX) {
                    continue;
                }
                for (var y in data.tiles[x]) {
                    var y = parseInt(y, 10);

                    if (y < beginY || y >= endY) {
                        continue;
                    }
                    var xCoord = data.x + x;
                    var yCoord = data.y + y;
                    var v = mapOverlay.villages[xCoord * 1000 + yCoord];
                    if (v) {
                        var vXY = '' + v.xy;
                        var vCoords = vXY.slice(0, 3) + '|' + vXY.slice(3, 6);
                        if (villageCoords.includes(vCoords)) {
                            const eleDIV = $('<div></div>')
                                .css({
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '2px',
                                    padding: '1px',
                                    backgroundColor: 'rgba(187, 255, 0, 0.7)',
                                    color: '#fff',
                                    width: '50px',
                                    height: '35px',
                                    zIndex: '10',
                                    fontSize: '10px',
                                })
                                .attr('id', 'dsm' + v.id);

                            sector.appendElement(
                                eleDIV[0],
                                data.x + x - sector.x,
                                data.y + y - sector.y
                            );
                        }
                    }
                }
            }
        };

        mapOverlay.reload();
    }

    // Override Map Sector Spawn
    function spawnSectorReplacer(data, sector) {
        mapOverlay.mapHandler._spawnSector(data, sector);
        var beginX = sector.x - data.x;
        var endX = beginX + mapOverlay.mapSubSectorSize;
        var beginY = sector.y - data.y;
        var endY = beginY + mapOverlay.mapSubSectorSize;
        for (var x in data.tiles) {
            var x = parseInt(x, 10);
            if (x < beginX || x >= endX) {
                continue;
            }
            for (var y in data.tiles[x]) {
                var y = parseInt(y, 10);

                if (y < beginY || y >= endY) {
                    continue;
                }
                var xCoord = data.x + x;
                var yCoord = data.y + y;
                var v = mapOverlay.villages[xCoord * 1000 + yCoord];
                if (v) {
                    if (selectedVillages.length > 0) {
                        var vXY = '' + v.xy;
                        var vCoords = vXY.slice(0, 3) + '|' + vXY.slice(3, 6);
                        if (selectedVillages.includes(vCoords)) {
                            jQuery(`[id="map_village_${v.id}"]`).css({
                                filter: 'brightness(200%) grayscale(100%)',
                            });
                        }
                    }
                }
            }
        }
    }
});
