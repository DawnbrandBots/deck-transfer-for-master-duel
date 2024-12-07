// Deck transfer for Yu-Gi-Oh! Master Duel and Neuron
// SPDX-FileCopyrightText: Copyright (C) 2023–2024 Kevin Lu
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
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?utm_source=storm-access&misc=yes&id=${parameter}`);
    const payload = await response.json();
    const cards = new Map();
    for (const card of payload.data) {
        cards.set(card.id, card);
    }
    const deck = {
        monster: {},
        spell: {},
        trap: {},
        extra: {},
        side: {}
    };
    const deckKonamiIds = {
        monster: {},
        spell: {},
        trap: {},
        extra: {},
        side: {}
    };
    for (const password of main) {
        const name = cards.get(password).name;
        const type = cards.get(password).type;
        let konamiId = cards.get(password).misc_info[0].konami_id;
        if (!konamiId) {
            // This is the authenticated API called on the page when you type into a text box
            const response = await fetch("https://www.db.yugioh-card.com/yugiohdb/member_deck_card_search.action", {
                method: "POST",
                body: `srclang=en&keyword=${encodeURIComponent(name)}`,
                headers: {
                    // Required to get JSON behaviour from this endpoint
                    "X-Requested-With": "XMLHttpRequest"
                }
            });
            const data = await response.json();
            if (data.result && data.list.length) {
                konamiId = data.list[0].card_id;
            }
        }
        if (type === "Spell Card") {
            deck.spell[name] = (deck.spell[name] || 0) + 1;
            deckKonamiIds.spell[name] = konamiId;
        } else if (type === "Trap Card") {
            deck.trap[name] = (deck.trap[name] || 0) + 1;
            deckKonamiIds.trap[name] = konamiId;
        } else {
            deck.monster[name] = (deck.monster[name] || 0) + 1;
            deckKonamiIds.monster[name] = konamiId;
        }
    }
    for (const password of extra) {
        const name = cards.get(password).name;
        const konamiId =  cards.get(password).misc_info[0].konami_id;
        deck.extra[name] = (deck.extra[name] || 0) + 1;
        deckKonamiIds.extra[name] = konamiId;
    }
    for (const password of side) {
        const name = cards.get(password).name;
        const konamiId =  cards.get(password).misc_info[0].konami_id;
        deck.side[name] = (deck.side[name] || 0) + 1;
        deckKonamiIds.side[name] = konamiId;
    }
    console.log(deck);
    console.log(deckKonamiIds);
    function load(key) {
        const prefix = key.slice(0, 2);
        let i = 1;
        for (const name in deck[key]) {
            document.getElementById(`${prefix}nm_${i}`).value = name;
            document.getElementById(`${prefix}num_${i}`).value = deck[key][name];
            const konamiId = deckKonamiIds[key][name];
            if (konamiId) {
                document.getElementsByName(`${key}CardId`)[i - 1].value = deckKonamiIds[key][name];
                document.getElementById(`imgs_${prefix}_${i}`).value = `${deckKonamiIds[key][name]}_1_1_1`;
            }
            i++;
        }
        let max = key === "extra" || key === "side" ? 20 : 65;
        while (i <= max) {
            document.getElementById(`${prefix}nm_${i}`).value = "";
            document.getElementById(`${prefix}num_${i}`).value = "";
            document.getElementsByName(`${key}CardId`)[i - 1].value = "";
            document.getElementById(`imgs_${prefix}_${i}`).value = "null_null_null_null";
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

    // Final step of automatic import workflow. Load in the form fields and let the user evaluate whether to save.
    if (location.hash.includes("storm-access")) {
        (async () => {
            try {
                const parameter = decodeURIComponent(location.hash.split("#storm-access=")[1]);
                console.log(parameter);
                const { main, extra, side } = parseURL(`ydke://${parameter}`);
                console.log(main);
                console.log(extra);
                console.log(side);
                await loadTypedDeck(main, extra, side);
                location.hash = "#" + ydkeButton.id;
            } catch(e) {
                console.error(e);
                showModal(e.message);
            }
        })();
    }
}

// Automatic import workflow
if (location.hash.includes("storm-access")) {
    // Home page
    if (document.head.querySelector("link[rel='alternate']")) {
        const myDeckHref = document.body.querySelector("a.menu_my_decks").href;
        if (myDeckHref.includes("cgid=")) {
            location.href = myDeckHref + location.hash;
        } else {
            createDialog()("You are not logged into Konami's official database. Please log in first and then try exporting again.");
        }
    }
    // My Deck / Select Your Deck page
    if (location.search.includes("ope=4")) {
        const addDeckHref = document.getElementById("deck_recipe").nextElementSibling.href;
        location.href = addDeckHref + location.hash;
    }
    // My Deck / Select Your Deck page, after adding a new deck
    if (location.search.includes("ope=6")) {
        const newDeck = new URL(document.getElementsByClassName("link_value")[0].value, location.origin);
        newDeck.hash = location.hash;
        newDeck.searchParams.set("request_locale", "en");
        // Convert view deck URL to edit deck
        newDeck.searchParams.set("ope", 2);
        // Not required, but does not break if present
        newDeck.searchParams.delete("ytkn");
        location.href = newDeck;
    }
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
        main: deckKonamiIds.main.map(kid => cards.get(kid)).filter(password => !!password),
        extra: deckKonamiIds.extra.map(kid => cards.get(kid)).filter(password => !!password),
        side: deckKonamiIds.side.map(kid => cards.get(kid)).filter(password => !!password)
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
        let row = document.getElementById("bottom_btn_set");
        if (!row) {
            // Not logged in, so the copy button is unavailable and the whole button row is not present
            row = document.createElement("div");
            row.id = "bottom_btn_set";
            document.getElementById("deck_header").append(row);
        }
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
            // https://github.com/FelixRilling/yugioh-deck-tool/issues/137#issuecomment-1697889917
            const url = encodeURIComponent(`${toBase64(deck.main)}!${toBase64(deck.extra)}!${toBase64(deck.side)}!${name}`);
            ygoprodeckButton.href = `https://ygoprodeck.com/deckbuilder/?utm_source=storm-access&y=${url}`;
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
