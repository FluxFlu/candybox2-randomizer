#!/usr/bin/env node



const settings = {
    "gridItems": true,

    "map": false,
    "talking": false,
    "PLAY": false,

}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
function ask(i) {
    if (i == Object.keys(settings).length) {
        main();
        readline.close();
    } else
    readline.question(`Randomize ${Object.keys(settings)[i]}? (${Object.values(settings)[i] ? 'Y/n' : 'y/N'}): `, input => {
        settings[Object.keys(settings)[i]] = input == 'Y' || (input == '' && Object.values(settings)[i]);
        ask(i + 1);
    });
}

const fs = require("fs");

const gridItemEffect = (name) => eval(`/Saving\\.loadBool\\("gridItemPossessed${name}"\\)(?!==false)/g`);
const gridItemEffectOut = (name) => `Saving.loadBool("gridItemPossessed${name}")`;
const gridItemVisuals = (name) => eval(`/\\(new (GridItem|XinopherydonClaw|UnicornHorn|Feather)\\("gridItemPossessed${name}",/g`);
const gridItemVisualOut = (name) => `(new ${gridItemExceptions[name] ? name : "GridItem"}("gridItemPossessed${name}",`;

const gridItemExceptions = {
    "XinopherydonClaw": true,
    "UnicornHorn": true,
    "Feather": true,
}

const gridItems = [
    `RedSharkFin`,
    `GreenSharkFin`,
    `PurpleSharkFin`,
    `Feather`,
    `BeginnersGrimoire`,
    `AdvancedGrimoire`,
    `BlackMagicGrimoire`,
    `HeartPlug`,
    `HeartPendant`,
    `TimeRing`,
    `PogoStick`,
    `Sponge`,
    `ShellPowder`,
    `Pitchfork`,
    `XinopherydonClaw`,
    `UnicornHorn`,
    `FortressKey`,
    `ThirdHouseKey`,
];

function random_item(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function replace_value(text, from, to) {
    return text .replaceAll(gridItemEffect(from), "REPLACESTRING")
                .replaceAll(gridItemEffect(to), gridItemEffectOut(from))
                .replaceAll("REPLACESTRING", gridItemEffectOut(to))
                
                .replaceAll(gridItemVisuals(from), "REPLACESTRING")
                .replaceAll(gridItemVisuals(to), gridItemVisualOut(from))
                .replaceAll("REPLACESTRING", gridItemVisualOut(to))
}

function main() {

    if (settings.map)
        gridItems.push(`MainMap`);
    
    if (settings.talking)
        gridItems.push(`TalkingCandy`);
    
    if (settings.PLAY) {
        gridItems.push(`P`);
        gridItems.push(`L`);
        gridItems.push(`A`);
        gridItems.push(`Y`);
    }

    let text = fs.readFileSync("./candybox2.js", "utf-8");
    if (!text)
        return console.log ("ERROR: Cannot find `./candybox2.js`.");

    console.log("Randomizing...")
    for (let i = 0; i < 60; i++) {
        const j = random_item(gridItems);
        const k = random_item(gridItems);
        if (j == k)
            continue;
        if (settings.gridItems)
            text = replace_value(text, j, k);

    }
    
    fs.writeFileSync("./candybox2randomized.js", text);
    fs.writeFileSync("./index_randomized.html",  fs.readFileSync("./index.html", "utf-8").replaceAll("candybox2.js", "candybox2randomized.js"));
    console.log("Randomized and written to `./candybox2randomized.js`, run `index_randomized.html` to open the game.")
}

ask(0);
