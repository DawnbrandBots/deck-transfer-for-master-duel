// Deck transfer for Yu-Gi-Oh! Master Duel and Neuron
// SPDX-FileCopyrightText: Copyright (C) 2023–2024 Kevin Lu
// SPDX-Licence-Identifier: GPL-3.0-or-later
const signal = document.createElement("span");
signal.id = "access-integration";
signal.dataset.version = "1.2.0";
signal.style.display = "none";
document.body.appendChild(signal);

if (location.pathname.startsWith("/deck/")) {
    const script = document.createElement("script");
    script.text = `
window.addEventListener("load", () => {
    const exportButton = document.getElementById("dropdownMenuButton").nextElementSibling.children[4];
    exportButton.onclick = null;
    exportButton.rel = "noopener";
    exportButton.target = "_blank";
    exportButton.href = "https://www.db.yugioh-card.com/yugiohdb/member_deck.action#storm-access=" + encodeURIComponent(createYdkeUri().slice(7));
});`;
    document.body.append(script);
}
