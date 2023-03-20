# Test cases

For Safari users, "the extension" refers to the userscript instead.

The **official database edit deck page** can be found by logging into https://www.db.yugioh-card.com, navigating to My Deck,
selecting an existing deck or clicking "Add a Deck", and then clicking the "Edit" button.
The URL starts with https://www.db.yugioh-card.com/yugiohdb/member_deck.action?ope=2
and the page contains text boxes to fill out with card names.

Please make sure you use the English official database. Language select is in the top-right corner.

## Smoke tests

1. **Given** the extension is disabled or NOT installed

   **When** I navigate to the _TBD YGOPRODECK PAGE FOR THE EXTENSION_

   **Then** the page says the extension is NOT detected

1. **Given** the extension is disabled or NOT installed AND I am logged in to https://www.db.yugioh-card.com

   **When** I navigate to an official database edit deck page

   **Then** there is only the one "Save" button in the bar containing the "Save" button

1. **Given** the extension or userscript is installed and enabled

   **When** I navigate to the _YGOPRODECK PAGE FOR THE EXTENSION_

   **Then** the page says the extension is detected

1. **Given** the extension or userscript is installed and enabled AND I am logged in to https://www.db.yugioh-card.com

   **When** I navigate to an official database edit deck page

   **Then** in the bar containing the "Save" button, there are four additional buttons preceding the "Save" button, in this order:

   1. Import YDKE from clipboard (different colour from "Save")
   1. Import from clipboard and save (same colour as "Save")
   1. Import YDK file (different colour from "Save")
   1. Import YDK and save (same colour as "Save")

## Import YDKE URL functional tests

The extension should be installed and enabled.

1. **Given** I copied a valid `ydke://` URL to my clipboard, such as from a deck page on YGOPRODECK

   **When** I click "Import YDKE from clipboard" on an official database edit deck page

   **Then** the text boxes on the page are filled out with the contents of the deck on my clipboard AND I can freely edit or save the deck, and the saved deck is accurate to what is filled out on the page

1. **Given** I copied a valid `ydke://` URL to my clipboard, such as from a deck page on YGOPRODECK

   **When** I click "Import clipboard and save" on an official database edit deck page

   **Then** the browser navigates to the view deck page (URL contains "ope=1") showing the contents of the deck on my clipboard AND I can see the imported deck in my linked Neuron app or Master Duel video game

1. **Given** I do not have a valid `ydke://` URL on my clipboard (e.g. empty, copy random text)

   **When** I click "Import YDKE from clipboard" OR "Import clipboard and save" on an official database edit deck page

   **Then** the text boxes on the page are unchanged AND a pop-up appears saying "No YDKE URL on clipboard", which can be closed by clicking "OK"

1. **Given** I have text on my clipboard the begins with `ydke://` but is not a valid deck URL (e.g. `ydke://bad!deck`)

   **When** I click "Import YDKE from clipboard" OR "Import clipboard and save" on an official database edit deck page

   **Then** the text boxes on the page are unchanged AND a pop-up appears saying "Invalid YDKE URL: missing deck component", which can be closed by clicking "OK"

## Import YDK file functional tests

The extension should be installed and enabled.

1. **Given** I am on an official database edit deck page

   **When** I click "Import YDK file" OR "Import YDKE and save"

   **Then** a file upload prompt for my platform appears, which prefers selecting `*.ydk` files

1. **Given** I have a valid YDK file on my device, such as a deck download from YGOPRODECK

   **When** I click "Import YDK file" on an official database edit deck page and upload my YDK file

   **Then** the text boxes on the page are filled out with the contents of the deck on my clipboard AND I can freely edit or save the deck, and the saved deck is accurate to what is filled out on the page

1. **Given** I have a valid YDK file on my device, such as a deck download from YGOPRODECK

   **When** I click "Import YDK and save" on an official database edit deck page and upload my YDK file

   **Then** the browser navigates to the view deck page (URL contains "ope=1") showing the contents of the deck on my clipboard AND I can see the imported deck in my linked Neuron app or Master Duel video game

1. **Given** I have an invalid YDK file on my device (e.g. random image, arbitrary text file)

   **When** I click "Import YDK file" OR "Import YDK and save" on an official database edit deck page and upload that file

   **Then** the text boxes on the page are unchanged AND a pop-up appears with an error message, which can be closed by clicking "OK"
