# ![Icon](./src/icon/48.png) Deck transfer for Yu-Gi-Oh! Master Duel and Neuron

[
    ![Get the Firefox add-on](https://extensionworkshop.com/assets/img/documentation/publish/get-the-addon-178x60px.dad84b42.png)
](https://addons.mozilla.org/firefox/addon/deck-transfer-for-master-duel/?utm_source=github&utm_campaign=readme "Get the Firefox add-on")
[
    ![Available in the Chrome Web Store](https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png)
](https://chrome.google.com/webstore/detail/lgcpomfflpfipndmldmgblhpbnnfidgk?utm_source=github&utm_campaign=readme "Get the Chromium add-on")
<a href="https://addons.opera.com/extensions/details/deck-transfer-for-yu-gi-oh-master-duel-and-neuron/?utm_source=github&utm_campaign=readme" title="Get the Opera add-on">
    <img height="58" src="https://dev.opera.com/extensions/branding-guidelines/addons_206x58_en@2x.png" alt="Get it from Opera add-ons" />
</a>


<a href="https://chrome.google.com/webstore/detail/lgcpomfflpfipndmldmgblhpbnnfidgk?utm_source=github&utm_campaign=readme-edge" title="Install for Microsoft Edge from the Chrome Web Store">
    <img height="64" src="https://raw.githubusercontent.com/MicrosoftEdge/Demos/9e91627ea7f13d7275b9c11d94322ecfaf5d6d28/shared/img/logo1024.png" alt="Microsoft Edge" />
</a>
&nbsp;
<a href="#installing-on-safari" title="Install on Safari">
    <img height="64" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Safari_browser_logo.svg/234px-Safari_browser_logo.svg.png" alt="Safari" />
</a>
&nbsp;
<a href="#installing-on-android" title="Install on Android">
    <img height="64" src="https://developer.android.com/static/images/brand/Android_Robot.png" alt="Android" />
</a>

[Import](#importing) and [export](#exporting) Yu-Gi-Oh! decks from Master Duel and Neuron in YDK format and YDKE URLs via Konami's official card database.
Directly import decks from [YGOPRODECK](https://ygoprodeck.com) and other communities.

Konami's official products have never interoperated with community resources,
but now with this browser extension, you can bring your decks in commonly-used
deck formats directly into the official [Yu-Gi-Oh! Master Duel](https://www.konami.com/yugioh/masterduel/) video game
and [Neuron duel assistant phone app](https://www.konami.com/yugioh/neuron/en/).
You can also [download any deck](#downloading-public-decks) from the official card database, including your
Master Duel and Neuron decks, and share directly to YGOPRODECK.

**Note**: Opera approves extension updates slower than the Chrome Web Store so far. Opera users may receive new features
and fixes faster by installing from the Chrome Web Store instead.

[![Lint WebExtension](https://github.com/DawnbrandBots/deck-transfer-for-master-duel/actions/workflows/lint.yml/badge.svg)](https://github.com/DawnbrandBots/deck-transfer-for-master-duel/actions/workflows/lint.yml)
[![Test WebExtension](https://github.com/DawnbrandBots/deck-transfer-for-master-duel/actions/workflows/test.yml/badge.svg)](https://github.com/DawnbrandBots/deck-transfer-for-master-duel/actions/workflows/test.yml)

## Importing

<a href="https://www.youtube.com/watch?v=ImBRD6fM5Og&utm_source=github" title="Video demonstration">
    <img width="100%" src="https://markdown-videos.deta.dev/youtube/ImBRD6fM5Og" alt="Video demonstration" />
</a>

<!-- alternative thumbnail: https://yt-embed.live/embed?v=ImBRD6fM5Og -->

1. Install this extension for your browser of choice with the links above. [Check if it is working on YGOPRODECK](https://ygoprodeck.com/decks/transfer-tool/?utm_source=github&utm_campaign=readme).
1. Link your Master Duel account or Neuron app to a Konami ID. You should be able to export your decks to your official database account in the view deck screen. [See below for further explanation.](#linking-master-duel-to-the-official-database)
1. Log into the [English official card database](https://www.db.yugioh-card.com/yugiohdb/?request_locale=en).
1. Select "My Deck", then add a deck or edit any deck. On the deck editor page, you should see four new buttons injected by this extension:
   ![Screenshot of edit deck page with new buttons](./listing/demo-import.png "Four new buttons injected in the bottom row")
1. Export a deck from [YGOPRODECK](https://ygoprodeck.com) or other sources as a YDKE URL or a YDK file.
1. Use the buttons to import your deck and save.
1. Check in-game for your database decks and copy to your in-game decks! <!-- Screenshot of where the import button is? -->

## Downloading public decks

1. Install this extension for your browser of choice with the links above. [Check if it is working on YGOPRODECK](https://ygoprodeck.com/decks/transfer-tool/?utm_source=github&utm_campaign=readme).
1. Browse ["Deck Search"](https://www.db.yugioh-card.com/yugiohdb/deck_search.action?request_locale=en) on the official database in any language.
1. When you choose a deck, you should see three new buttons injected by this extension: ![Screenshot of view deck page with new buttons](./listing/demo-export.png "Three new export buttons, available even if not logged in")
1. Use the buttons to export and download the deck.

Note: if you choose a deck containing cards not yet released in the current language region (e.g. OCG-only cards while viewing in English),
those cards will be missing from the display and the exports. In this case, try switching the database language using the
language select is in the top-right corner (e.g. switch to Japanese for OCG-only cards).

## Exporting

1. Install this extension for your browser of choice with the links above. [Check if it is working on YGOPRODECK](https://ygoprodeck.com/decks/transfer-tool/?utm_source=github&utm_campaign=readme).
1. Link your Master Duel account or Neuron app to a Konami ID. [See below for further explanation.](#linking-master-duel-to-the-official-database)
1. Export your Master Duel deck to your official database account in the view deck screen.
   ![Screenshot of view deck screen](./docs/view-deck-screen.jpg "View deck screen on PlayStation 5. Export button is enabled")
   ![Screenshot of export deck prompt](./docs/view-deck-screen-export-prompt.jpg "Prompt when export button is pressed")
1. Log into the [official card database](https://www.db.yugioh-card.com/yugiohdb/?request_locale=en) in any language.
1. Select "My Deck" and find the exported Master Duel deck. On its page, you should see three new buttons injected by this extension, like with [public decks](#downloading-public-decks).
1. Use the buttons to export and download the deck.

Note: if your deck contains cards not yet released in the current language region (e.g. cards that debut internationally in Master Duel),
those cards will be missing from the display and the exports. In this case, try switching the database language using the
language select is in the top-right corner (e.g. switch to Japanese).

## Linking Master Duel to the official database

Link your Master Duel account to a Konami ID via the data transfer feature.
This is found in the hamburger menu as "Data Transfer", or "Data Transfer" in the title screen.

![Title screen](./docs/title-screen.jpg "Title screen on PlayStation 5")

![Menu item](./docs/data-transfer-menu.jpg "Menu item on PlayStation 5")

Follow the instructions to create or log in with your Konami ID.
Your Konami ID must be associated with a Card Game ID.

After data transfer is set up, the card database button in the top-right of the deck screen should show the decks from your official database account.
Furthermore, you should see the export button become available when you view your decks.
Make sure you can log into [Konami's official card database](https://www.db.yugioh-card.com/yugiohdb/?request_locale=en)
and access "My Deck" on the website.

If your Konami ID does not have a Card Game ID, you can try logging into your Konami ID in Neuron.

## Installing on Safari

Compatible with both macOS and iOS, if Userscripts is supported!

1. Install [Userscripts](https://apps.apple.com/app/apple-store/id1463298887) from the App Store.
1. [Enable Userscripts](https://github.com/quoid/userscripts/#usage) (iOS) following its instructions.
1. [Download our userscript](https://dawnbrandbots.github.io/deck-transfer-for-master-duel/storm-access.user.js) to your folder for userscripts.
1. [Check if it is working on YGOPRODECK](https://ygoprodeck.com/decks/transfer-tool/?utm_source=github&utm_campaign=readme).

## Installing on Android

Unfortunately, most Android browsers do not support extensions.

Firefox Beta supports installing extensions beyond the recommended list. If you are interested,
you can follow the same instructions as [Indie Wiki Buddy](https://getindie.wiki/firefox-mobile/?utm_source=dawnbrand)
to set up. You can either create your own collection or use
collection owner [`17816848`](https://addons.mozilla.org/en-CA/firefox/collections/17816848/deck-transfer-for-master-duel/)
and collection name `deck-transfer-for-master-duel`.

Kiwi Browser supports Chrome extensions, but I have not tested or used this browser.

## Privacy

See [PRIVACY.md](./PRIVACY.md).

## Licence

Copyright (C) 2023–2024 Kevin Lu. See [COPYING](./COPYING) for more details.

```
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

Icon copyright (C) 2023 WolfOfWolves, used with permission.
Icon is NOT covered under the GPL terms. All rights reserved.

## Disclaimer

Yu-Gi-Oh! is (C) 2020 Studio Dice/SHUEISHA, TV TOKYO, KONAMI.
Master Duel and Neuron are produced by Konami Digital Entertainment.
This project is not produced by, endorsed by, supported by, or affiliated with any of them.
