#!/usr/bin/env node


const settings = {
    "Randomize Grid Items": true,

    "Randomize Map": false,
    "Randomize Talking Candy": false,
    "Randomize PLAY": false,

    "Prevent Pogo Stick from being inside Unicorn Horn chest": true,
    "Prevent Desert Fortress Key from being inside Desert Fortress": true,
}

const settingEffects = {
    
    "Randomize Talking Candy": () => gridItems.push(`TalkingCandy`),

    "Randomize Map": () => gridItems.push(`MainMap`),

    "Randomize PLAY": () => {
        gridItems.push(`P`);
        gridItems.push(`L`);
        gridItems.push(`A`);
        gridItems.push(`Y`);
    },
    
    "Randomize Grid Items": () => {
        for (let i = 0; i < 60; i++) {
            const j = random_item(gridItems);
            const k = random_item(gridItems);
            if (j == k)
                continue;
            replace_value(j, k);
        }
    },

    "Prevent Pogo Stick from being inside Unicorn Horn chest": () => {while (g.text.includes(`UnicornHorn("gridItemPossessedUnicornHorn","gridItemPogoStickName"`)) replace_value("UnicornHorn", k)},
    "Prevent Desert Fortress Key from being inside Desert Fortress": () => {
        while (g.text.includes(`UnicornHorn("gridItemPossessedUnicornHorn","gridItemFortressKeyName"`) ||
        g.text.includes(`XinopherydonClaw("gridItemPossessedXinopherydonClaw","gridItemFortressKeyName"`)) {
            replace_value("UnicornHorn", k);
            replace_value("XinopherydonClaw", k);
        }
    },

    
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
    readline.question(`${Object.keys(settings)[i]}? (${Object.values(settings)[i] ? 'Y/n' : 'y/N'}): `, input => {
        settings[Object.keys(settings)[i]] = input == 'Y' || input == 'y' || (input == '' && Object.values(settings)[i]);
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

function text_clean() {
    g.text = g.text.replace(`{if(Saving.loadBool("gridItemPossessedFeather")==false){this.getGame().getPlayer().jump(3)\n}else{this.getGame().getPlayer().jump(6)}`, `{if(Saving.loadBool("gridItemPossessedFeather")){this.getGame().getPlayer().jump(6)\n}else{this.getGame().getPlayer().jump(3)}`)
}

function main() {

    g.text = fs.readFileSync("./candybox2.js", "utf-8");
    if (!g.text)
        return console.log ("ERROR: Cannot find `./candybox2.js`.");

    console.log("Randomizing...")
    text_clean();
    Object.keys(settingEffects).forEach(e => { if (settings[e]) settingEffects[e]() });
    
    fs.writeFileSync("./candybox2randomized.js", g.text);
    fs.writeFileSync("./index_randomized.html",  fs.readFileSync("./index.html", "utf-8").replaceAll("candybox2.js", "candybox2randomized.js"));
    console.log("Randomized and written to `./candybox2randomized.js`, run `index_randomized.html` to open the game.")
}

ask(0);
