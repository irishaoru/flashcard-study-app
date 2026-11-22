# App Specification

## Overview

It is a flashcard studying app where users create a deck, typing a question and answer for each card. Users can study with by going through each and tapping on it to flip the card and reveal the answer. Missed cards will be reviewed and brought back in a second round to trigger active recall. 

## Core Features

<!-- List the main features of the app. -->
1. Ability to create a new flashcard deck by clicking "Create new deck"
2. Typing in questions and answers for each card and being able to click "Add" to make more cards - no limit to the amount of cards you can make in a deck. Users can also create titles for each deck. 
3. Running through the flashcard deck where users tap the card to flip it and if they got it right, there will be an option to click "Got it!" or "Put back in the review pile." 
4. Additional rounds of flashcard review with the incorrect/missed cards. Once all the cards have been studied once, the new incorrect/missed ones will be put into another round. This keeps going until the user was able to get all cards correct.
5. Ability to pause the study session by exiting and coming back to it later. 
6. Ability to end of the study session midway to restart. 
-

## Screens & Navigation

<!-- Describe the main screens and how users navigate between them. -->

### Home screen

- **Purpose** — Shows you all the flashcard decks you've made
- **Navigation** — If you click on one of the decks, it will be like a pop up and there will be a button that says "start studying" if you have previously completed a study session or have not studied it yet or "resume studying" if you were in the middle of studying the deck. Click on it and it brings you to the actual screen where you start going through all the cards

### Studying screen

- **Purpose** — This is where you run thorugh all the flashcards you've made in a particular deck and test yourself.
- **Navigation** — To exit early, there will be a button that says "exit this study session". It wil save your current progress though and navigate you back ot the home screen. When you resume, it will show the card that you left on before. If you have finished your study session, you will click on the "complete session" button to take you back to the home screen. 

### Creating a new flashcard set

- **Purpose** — Allows you to build out a new deck. First, users must give the deck a name. Then, there will be blank cards with two lines on them that say: Question:____________ and Answer:______________ where users need to type in what those will be. You can click "add card" to add more cards.
- **Navigation** — Once you're finished, press "save this new set" and it will take you back to the home screen.

## Data Model

<!-- Define the key entities and their relationships. -->

### Entities

**Deck**: A unique ID, a title, and an ordered list of flashcards. One deck can contain many cards. The ID lets the app identify a specific deck. Two decks can't have the same title.
**Flashcard**: A unique ID, a question, and an answer. Each card belongs to one deck. The ID helps the app put the exact missed card back in the review pile.
**Study Session**: Is defined by which deck is being studied and the user's progres across its review rounds. Which cards are in the current round, which card the user is on, and which cards they’ve missed in that round are the information the app needs to save so users can continue where they left off.

## Relationships:
Deck --> Flashcards — A deck can contain many flashcards. Each flashcard belongs to one deck.
Study session --> Deck — A study session is for one deck. Its review pile contains cards from that same deck.

## API & Backend

N/A

## Design & Branding

- **Color palette:** warm off-white background, white cards, black for flashcard text, deep blue and purple for navigation and buttons.  
- **Typography:** Use the device’s default font. Give screen headings and deck titles a heavier weight, and make the question and answer the largest text on the Study screen.
- **Style direction:** On the Home screen, list out all the decks with just their titles and the number of cards it contains (list by time of creation). On the creation screen, group each question and answer together. On the Study screen, show one large card at a time and give it a clear tap-to-reveal cue. After the answer appears, use a green button for "Got it!" and an red button for "Put back in the review pile" so the actions are easy to tell apart.

## Platform Targets

- [ ] iOS (physical iPhone using Expo Go)

## Acceptance criteria 
1. Create and save: Creat a named deck with just two cards, save it, and check that it appears on the Home screen. 
2. When a deck can't be saved: This should happen when the deck has no cards in it, if a question or answer to a card is blank, or when the title isn't unique/is blank. In this case, the app should give the user the appropriate error message based on what it is that they missed and not allow them to save it. They can choose to cancel and just return to Home scree nwithout the new deck. 
3. Reveal an answer: When users start studying, check that the question appears first and they can tap the card to reveal the answer.
4. Retry a missed card: Mark one card correct and one missed. Check that only the missed card appears in the next round. Mark it as correct and verify that the study session ends there.
5. Make sure the data saves: Close and reopn the app to check that the cards in the saved deck on still there. 
6. Verify resuming the study session: Exit before you finish studying a set and then reopen it. Verify that their progress was saved. (Ex: study a three-card deck. Miss the first card and get the second right before exiting Reopen the deck and check that the third card appears and the first card is queued for review.) This should work even after fully closing the app. 
7. Verify ending the study session midway: Press "end study session" before you finish studying a set and then reopen it. Verify that the set restarts in that it goes back to the first card and has nothing saved about correctness or missed cards for review. 

## Offline Behavior

<!-- How the app should behave without network connectivity. -->
Decks, cards, and paused study sessions are saved on the device. Early ended sessions clear that deck's study progress. Once the app is running, users can create decks, study, and resume without internet.


## Constraints & Non-Goals

<!-- Known limitations, things explicitly out of scope, or technical constraints. -->
1. Flashcard generation from class materials: Right now it's just manual. Users has to write the questions and answers themselves rather than importing files and having something like an AI generate cards based on those.
2. Detecting verbatim: Right now, users need to decide whether the answer they thought of or said is correct with the answer. There is no automatic detection of correctness. Would require semantic meaning detection if the user types in their response and it's not word for word but still correct. 
3. User accounts: No sign in or authentication feature. 
4. Syncing across devices: Decks and study progress are stored on the device. Cross-device sync is out of scope.

