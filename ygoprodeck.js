// Deck transfer for Yu-Gi-Oh! Master Duel and Neuron
// SPDX-FileCopyrightText: Copyright (C) 2023 Kevin Lu
// SPDX-Licence-Identifier: GPL-3.0-or-later
const signal = document.createElement("span");
signal.id = "access-integration";
signal.dataset.version = "1.1.0";
signal.style.display = "none";
document.body.appendChild(signal);

if (location.pathname === "/deckbuilder/") {
    const params = new URLSearchParams(location.search);
    const ydke = params.get("ydke");
    if (ydke) {
        const script = document.createElement("script");
        script.text = `
(function () {
    function inject() {
        const start = location.search.indexOf("ydke=") + 5;
        const end = location.search.indexOf("&", start);
        const ydke = end === -1 ? location.search.slice(start) : location.search.slice(start, end);
        const [main, extra, side, name] = ydke.split("!");
        yugiohDeckToolApplication.setDeck({
            name: decodeURIComponent(name),
            parts: {
                main: [...toPasscodes(main)].map(c => ({ passcode: c + "" })),
                extra: [...toPasscodes(extra)].map(c => ({ passcode: c + "" })),
                side: [...toPasscodes(side)].map(c => ({ passcode: c + "" }))
            }
        });
        function byte(c) { return c.charCodeAt(0); }
        function toPasscodes(base64) {
            return new Uint32Array(Uint8Array.from(atob(base64), byte).buffer)
        }
    }
    const vueRoot = document.getElementById("deckToolApplication");
    if (vueRoot) {
        const observer = new MutationObserver((mutations, invoker) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeName === "BUTTON") {
                            invoker.disconnect();
                            console.log("Storm Access: button mounted, Vue app API should be available, awaiting ready event");
                            yugiohDeckToolApplication.on("ready", inject);
                            return;
                        }
                    }
                }
            }
        });
        console.log("Storm Access: register MutationObserver");
        observer.observe(vueRoot.parentNode, { childList: true, subtree: true });
    } else {
        console.log("Storm Access: no #deckToolApplication, awaiting Vue app ready event");
        yugiohDeckToolApplication.on("ready", inject);
    }
})();`;
        document.body.append(script);
    }
}
