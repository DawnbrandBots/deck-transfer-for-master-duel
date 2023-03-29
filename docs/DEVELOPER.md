# Installing for developers

Make sure to disable any version of the extension installed from extension stores first.

## Testing on desktop Firefox

1. Use the cloned repository directory or download the ZIP and extract into a folder.
1. Load the temporary add-on into Firefox per https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing
1. Navigate to https://www.db.yugioh-card.com/yugiohdb/?request_locale=en, select "My Deck", then add a deck or edit any deck. You should be on the ope=2 page with all the text boxes to be filled out.
1. Put a ydke:// URL on your clipboard.
1. Hit the injected buttons on the edit deck page!

## Testing on Firefox for Android

Based on https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/

1. Follow the USB debugging requirements in about:debugging.
1. `adb devices`
1. `yarn web-ext run -t firefox-android --adb-device ADB-DEVICE-ID-LISTED --firefox-apk org.mozilla.firefox`
1. Connect to the device in about:debugging.
1. Put a ydke:// URL on your phone clipboard.
1. Hit the injected buttons on the edit deck page!

## Testing on desktop Chrome, Edge, Opera, and other Chromium browsers

Based on https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/

1. Use the cloned repository directory or download the ZIP and extract into a folder.
1. Go to the Extensions page chrome://extensions and enable developer mode.
1. Load the unpacked extension by selecting the directory.
1. Same testing steps as above.
