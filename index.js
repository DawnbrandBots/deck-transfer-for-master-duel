// Deck transfer for Yu-Gi-Oh! Master Duel and Neuron
// SPDX-FileCopyrightText: Copyright (C) 2023 Kevin Lu
// SPDX-Licence-Identifier: GPL-3.0-or-later
// ==UserScript==
// @name         Deck transfer for Yu-Gi-Oh! Master Duel and Neuron
// @description  Import Yu-Gi-Oh! decks in YDK format and YDKE URLs into Master Duel and Neuron via Konami's official card database.
// @namespace    https://github.com/DawnbrandBots
// @match        https://www.db.yugioh-card.com/yugiohdb/member_deck.action*
// @match        *://*.ygoprodeck.com/*
// @inject-into  content
// @version      0.1.0
// @updateURL    https://raw.githubusercontent.com/DawnbrandBots/storm-access/release/index.user.js
// ==/UserScript==

function createButton(id, label, orn) {
    const button = document.createElement("a");
    button.id = id;
    button.className = orn ? "btn hex orn" : "btn hex";
    const span = document.createElement("span");
    span.textContent = label;
    button.appendChild(span);
    return button;
}

function createDialog() {
    const dialog = document.createElement("dialog");
    const message = document.createElement("p");
    dialog.appendChild(message);
    const form = document.createElement("form");
    form.method = "dialog";
    const dialogCloseButton = document.createElement("button");
    dialogCloseButton.textContent = "OK";
    form.appendChild(dialogCloseButton);
    dialog.appendChild(form);
    document.body.appendChild(dialog);
    return function showModal(text) {
        message.textContent = text;
        dialog.showModal();
    }
}

async function loadTypedDeck(main, extra, side) {
    const passwords = new Set([...main, ...extra, ...side]);
    const parameter = [...passwords].join(",");
    console.log(parameter);
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?utm_source=storm-access&id=${parameter}`);
    const payload = await response.json();
    const cards = new Map();
    const types = new Map();
    for (const card of payload.data) {
        cards.set(card.id, card.name);
        types.set(card.id, card.type);
    }
    const deck = {
        monster: {},
        spell: {},
        trap: {},
        extra: {},
        side: {}
    };
    for (const password of main) {
        const name = cards.get(password);
        const type = types.get(password);
        if (type === "Spell Card") {
            deck.spell[name] = (deck.spell[name] || 0) + 1;
        } else if (type === "Trap Card") {
            deck.trap[name] = (deck.trap[name] || 0) + 1;
        } else {
            deck.monster[name] = (deck.monster[name] || 0) + 1;
        }
    }
    for (const password of extra) {
        const name = cards.get(password);
        deck.extra[name] = (deck.extra[name] || 0) + 1;
    }
    for (const password of side) {
        const name = cards.get(password);
        deck.side[name] = (deck.side[name] || 0) + 1;
    }
    console.log(deck);
    function load(key) {
        const prefix = key.slice(0, 2);
        let i = 1;
        for (const name in deck[key]) {
            document.getElementById(`${prefix}nm_${i}`).value = name;
            document.getElementById(`${prefix}num_${i}`).value = deck[key][name];
            i++;
        }
        let max = key === "extra" || key === "side" ? 20 : 65;
        while (i <= max) {
            document.getElementById(`${prefix}nm_${i}`).value = "";
            document.getElementById(`${prefix}num_${i}`).value = "";
            i++;
        }
    }
    load("monster");
    load("spell");
    load("trap");
    load("extra");
    load("side");
}

function createYdkeOnClick(save, showModal) {
    return async function(event) {
        event.preventDefault();
        const text = await navigator.clipboard.readText();
        console.log(text);
        try {
            const { main, extra, side } = parseURL(text);
            console.log(main);
            console.log(extra);
            console.log(side);
            await loadTypedDeck(main, extra, side);
            if (save) {
                document.getElementById("btn_regist").click();
            }
        } catch(e) {
            console.error(e);
            showModal(e.message);
        }
    }
}

if (
    location.hostname.endsWith("db.yugioh-card.com")  // Official database, branch for userscript
    && location.search.includes("ope=2")  // Edit deck page
    && document.body.classList.contains("en")  // Only English supported currently, UI language affects the text fields
) {
    const ydkeButton = createButton("btn_ydke", "Import YDKE from clipboard", false);
    const ydkeSaveButton = createButton("btn_ydke_save", "Import clipboard and save", true);
    const ydkButton = createButton("btn_ydk", "Import YDK file", false);
    const ydkSaveButton = createButton("btn_ydk_save", "Import YDK and save", true);
    const row = document.getElementById("bottom_btn_set");
    row.style.flexWrap = "wrap";
    row.prepend(ydkeButton, ydkeSaveButton, ydkButton, ydkSaveButton);

    const showModal = createDialog();

    const ydkUpload = document.createElement("input");
    ydkUpload.type = "file";
    ydkUpload.accept = ".ydk";
    let ydkSave = false;

    ydkeButton.addEventListener("click", createYdkeOnClick(false, showModal));
    ydkeSaveButton.addEventListener("click", createYdkeOnClick(true, showModal));
    ydkButton.addEventListener("click", event => {
        event.preventDefault();
        ydkSave = false;
        ydkUpload.click();
    });
    ydkSaveButton.addEventListener("click", event => {
        event.preventDefault();
        ydkSave = true;
        ydkUpload.click();
    })
    ydkUpload.addEventListener("change", async function () {
        const contents = await this.files[0].text();
        try {
            const { main, extra, side } = ydkToTypedDeck(contents);
            console.log(main);
            console.log(extra);
            console.log(side);
            await loadTypedDeck(main, extra, side);
            if (ydkSave) {
                document.getElementById("btn_regist").click();
            }
        } catch(e) {
            console.error(e);
            showModal(e.message);
        }
    });
}

// ydke.js for web
function byte(c) { return c.charCodeAt(0); }

function toPasscodes(base64) {
    return new Uint32Array(Uint8Array.from(atob(base64), byte).buffer)
}

function parseURL(ydke) {
    if (!ydke.startsWith("ydke://")) {
        // Unrecognized URL protocol
        throw new Error("No YDKE URL on clipboard");
    }
    const components = ydke.slice("ydke://".length).split("!");
    if (components.length < 3) {
        // Missing ydke URL component
        throw new Error("Invalid YDKE URL: missing deck component");
    }
    return {
        main: toPasscodes(components[0]),
        extra: toPasscodes(components[1]),
        side: toPasscodes(components[2])
    };
}
// end ydke.js

// Copyright (C) 2020–2021 Luna Brand, Kevin Lu
// Modified from https://github.com/DawnbrandBots/ydeck/blob/main/src/ydk.ts to be JavaScript-only
class YDKParseError extends Error {
	constructor(message) {
		super(`Error in YDK format: ${message}.`);
	}
}

function ydkIndexOf(deck, heading) {
	const index = deck.indexOf(heading);
	if (index < 0) {
		throw new YDKParseError(`missing section ${heading}`);
	}
	return index;
}

function parseYdkSection(deck, begin, end) {
	const numbers = [];
	// begin is the line with the heading, so we start at the next one
	for (let i = begin + 1, line = deck[i]; i < end; line = deck[++i]) {
		if (!line) {
			continue; // Skip blank lines
		}
		const decimalInteger = parseInt(line, 10);
		if (isNaN(decimalInteger)) {
			throw new YDKParseError(`unexpected value on line ${i + 1}; ${line}`);
		}
		numbers.push(decimalInteger);
	}
	return Uint32Array.from(numbers);
}

function ydkToTypedDeck(ydk) {
	const deck = ydk.split("\n").map(s => s.trim());
	const mainIndex = ydkIndexOf(deck, "#main");
	const extraIndex = ydkIndexOf(deck, "#extra");
	const sideIndex = ydkIndexOf(deck, "!side");
	if (!(mainIndex < extraIndex && extraIndex < sideIndex)) {
		throw new YDKParseError("invalid section ordering; expected #main, #extra, !side");
	}
	return {
		main: parseYdkSection(deck, mainIndex, extraIndex),
		extra: parseYdkSection(deck, extraIndex, sideIndex),
		side: parseYdkSection(deck, sideIndex, deck.length)
	};
}
// end ydk.js

// Basically the same as ./integration.js but for userscript only
if (location.hostname.endsWith("ygoprodeck.com")) {
    const signal = document.createElement("span");
    signal.id = "access-integration";
    signal.dataset.version = "0.0.1-safari";
    signal.style.display = "none";
    document.body.appendChild(signal);
}
