// Deck transfer for Yu-Gi-Oh! Master Duel and Neuron
// SPDX-FileCopyrightText: Copyright (C) 2023 Kevin Lu
// SPDX-Licence-Identifier: GPL-3.0-or-later

// Shared helpers
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
// End shared helpers

// Deck import section
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

// Edit deck page, only English supported currently, UI language affects the text fields
if (location.search.includes("ope=2") && document.body.classList.contains("en")) {
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
// End deck import section

// Deck export section
async function exportTypedDeck() {
    const imageSets = document.getElementsByClassName("image_set");
    const deckKonamiIds = { main: [], extra: [], side: [] };
    for (const imageSet of imageSets) {
        const key = imageSet.parentNode.id;
        for (const child of imageSet.children) {
            if (child.tagName === "A") {
                const urlParams = new URLSearchParams(child.search);
                const cid = parseInt(urlParams.get("cid"), 10);
                if (!isNaN(cid)) {
                    deckKonamiIds[key].push(cid);
                } else {
                    console.warn("Unexpected href for image_set child:", child);
                }
            } else {
                console.warn("Unexpected image_set child:", child);
            }
        }
    }
    console.log(deckKonamiIds);
    const ids = new Set([...deckKonamiIds.main, ...deckKonamiIds.extra, ...deckKonamiIds.side]);
    const parameter = [...ids].join(",");
    console.log(parameter);
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?utm_source=storm-access&misc=yes&konami_id=${parameter}`);
    const payload = await response.json();
    const cards = new Map();
    for (const card of payload.data) {
        cards.set(card.misc_info[0].konami_id, card.id);
    }
    const deckPasswords = {
        main: deckKonamiIds.main.map(kid => cards.get(kid)),
        extra: deckKonamiIds.extra.map(kid => cards.get(kid)),
        side: deckKonamiIds.side.map(kid => cards.get(kid))
    };
    console.log(deckPasswords);
    return deckPasswords;
}

// View deck page
if (location.search.includes("ope=1")  ) {
    (function () {
        const name = document.querySelector("#broad_title h1").firstChild.textContent.split("\t\t\t").pop();
        // Cache the deck representation so only one API request is needed and later button presses are more responsive
        let deck;

        const ydkButton = createButton("btn_ydk", "Export YDK", false);
        ydkButton.download = `${name}.ydk`;
        const ydkeButton = createButton("btn_ydke", "Export YDKE to clipboard", false);
        const ygoprodeckButton = createButton("btn_ygoprodeck", "Export to YGOPRODECK", false);
        ygoprodeckButton.target = "_blank";
        const row = document.getElementById("bottom_btn_set");
        row.style.flexWrap = "wrap";
        row.append(ydkButton, ydkeButton, ygoprodeckButton);

        const showModal = createDialog();

        // The first click constructs the data URL and later clicks do not need to run this event handler
        async function ydkOnClick(event) {
            event.preventDefault();
            if (!deck) {
                deck = await exportTypedDeck();
            }
            const { main, extra, side } = deck;
            const ydk = `# ${name}\n# ${location}\n#main\n${main.join("\n")}\n#extra\n${extra.join("\n")}\n!side\n${side.join("\n")}\n`;
            console.log(ydk);
            const blob = new Blob([ydk], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            ydkButton.href = url;
            ydkButton.removeEventListener("click", ydkOnClick);
            ydkButton.click();
        }

        // The first click sets up the hyperlink and later clicks do not need to run this event handler
        async function ygoprodeckOnClick(event) {
            event.preventDefault();
            if (!deck) {
                deck = await exportTypedDeck();
            }
            ygoprodeckButton.href = `https://ygoprodeck.com/deckbuilder/?utm_source=storm-access&ydke=${toBase64(deck.main)}!${toBase64(deck.extra)}!${toBase64(deck.side)}!${encodeURIComponent(name)}`;
            ygoprodeckButton.removeEventListener("click", ygoprodeckOnClick);
            ygoprodeckButton.click();
        }

        ydkButton.addEventListener("click", ydkOnClick);
        ydkeButton.addEventListener("click", async event => {
            event.preventDefault();
            if (!deck) {
                deck = await exportTypedDeck();
            }
            const url = `ydke://${toBase64(deck.main)}!${toBase64(deck.extra)}!${toBase64(deck.side)}!`;
            console.log(url);
            await navigator.clipboard.writeText(url);
            showModal("Deck copied to clipboard!")
        });
        ygoprodeckButton.addEventListener("click", ygoprodeckOnClick);
    })();
}
// End deck export section

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

function toBase64(array) {
    return btoa(String.fromCharCode(...new Uint8Array(new Uint32Array(array).buffer)));
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
