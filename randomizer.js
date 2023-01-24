#!/usr/bin/env node


const settings = {
    "Grid Items": true,

    "Map": false,
    "Talking Candy": false,
    "PLAY": false,

}

const settingEffects = {
    
    "Talking Candy": () => gridItems.push(`TalkingCandy`),

    "Map": () => gridItems.push(`MainMap`),

    "PLAY": () => {
        gridItems.push(`P`);
        gridItems.push(`L`);
        gridItems.push(`A`);
        gridItems.push(`Y`);
    },
    
    "Grid Items": randomizeGridItems,
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

const g = {text: ""};

function replace_value(from, to) {
    g.text = g.text .replaceAll(gridItemEffect(from), "REPLACESTRING")
                    .replaceAll(gridItemEffect(to), gridItemEffectOut(from))
                    .replaceAll("REPLACESTRING", gridItemEffectOut(to))
                    
                    .replaceAll(gridItemVisuals(from), "REPLACESTRING")
                    .replaceAll(gridItemVisuals(to), gridItemVisualOut(from))
                    .replaceAll("REPLACESTRING", gridItemVisualOut(to))
}


function randomizeGridItems() {
    for (let i = 0; i < 60; i++) {
        const j = random_item(gridItems);
        const k = random_item(gridItems);
        if (j == k)
            continue;
        if (settings["Grid Items"])
            replace_value(j, k);
    }
}

function main() {

    g.text = fs.readFileSync("./candybox2.js", "utf-8");
    if (!g.text)
        return console.log ("ERROR: Cannot find `./candybox2.js`.");

    console.log("Randomizing...")
    Object.keys(settingEffects).forEach(e => { if (settings[e]) settingEffects[e]() });
    
    fs.writeFileSync("./candybox2randomized.js", g.text);
    fs.writeFileSync("./index_randomized.html",  fs.readFileSync("./index.html", "utf-8").replaceAll("candybox2.js", "candybox2randomized.js"));
    console.log("Randomized and written to `./candybox2randomized.js`, run `index_randomized.html` to open the game.")
}

ask(0);
