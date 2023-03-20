# ![Icon](./icon/48.png) Deck transfer for Yu-Gi-Oh! Master Duel and Neuron

[
    ![Get the Firefox add-on](https://extensionworkshop.com/assets/img/documentation/publish/get-the-addon-178x60px.dad84b42.png)
](https://addons.mozilla.org/firefox/addon/deck-transfer-for-master-duel/?utm_source=github&utm_campaign=readme "Get the Firefox add-on")
<!--
<a href="https://addons.opera.com/extensions/details/deck-transfer-for-yu-gi-oh-master-duel-and-neuron/?utm_source=github&utm_campaign=readme" title="Get the Opera add-on">
    <img height="58" src="https://dev.opera.com/extensions/branding-guidelines/addons_206x58_en@2x.png" alt="Get it from Opera add-ons" />
</a>
-->
&nbsp;
<a href="#installing-on-safari" title="Install on Safari">
    <img height="64" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Safari_browser_logo.svg/234px-Safari_browser_logo.svg.png" alt="Safari" />
</a>
&nbsp;
<a href="#installing-on-android" title="Install on Android">
    <img height="64" src="https://developer.android.com/static/images/brand/Android_Robot.png" alt="Android" />
</a>

Import Yu-Gi-Oh! decks in YDK format and YDKE URLs into Master Duel and Neuron via
Konami's official card database. Directly import decks from [YGOPRODECK](https://ygoprodeck.com) and other communities.

**Chrome Web Store**: pending review. **Opera add-ons**: pending review, [available for Beta/Developer](https://addons.opera.com/extensions/details/deck-transfer-for-yu-gi-oh-master-duel-and-neuron/?utm_source=github&utm_campaign=readme).

Konami's official products have never interoperated with community resources,
but now with this browser extension, you can bring your decks in commonly-used
deck formats directly into the official [Yu-Gi-Oh! Master Duel](https://www.konami.com/yugioh/masterduel/) video game
and [Neuron duel assistant phone app](https://www.konami.com/yugioh/neuron/en/).

<a href="https://www.youtube.com/watch?v=ImBRD6fM5Og&utm_source=github" title="Video demonstration">
    <img width="100%" src="https://markdown-videos.deta.dev/youtube/ImBRD6fM5Og" alt="Video demonstration" />
</a>

<!-- alternative thumbnail: https://yt-embed.live/embed?v=ImBRD6fM5Og -->

1. Install this extension for your browser of choice with the links above.
1. Link your Master Duel account or Neuron app to a Konami ID. You should be able to export your decks to your official database account in the view deck screen. [See below for further explanation.](#linking-master-duel-to-the-official-database)
1. Log into the [English official card database](https://www.db.yugioh-card.com/yugiohdb/?request_locale=en).
1. Select "My Deck", then add a deck or edit any deck. On the deck editor page, you should see four new buttons injected by this extension:
   ![Screenshot of edit deck page with new buttons](./listing/demo.png "Four new buttons injected in the bottom row")
1. Export a deck from [YGOPRODECK](https://ygoprodeck.com) or other sources as a YDKE URL or a YDK file.
1. Use the buttons to import your deck and save.
1. Check in-game for your database decks and copy to your in-game decks! [Screenshot of where the import button is?]

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
1. Check if it is working on YGOPRODECK (dedicated guide page TBD).

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

Copyright (C) 2023 Kevin Lu. See [COPYING](./COPYING) for more details.

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
