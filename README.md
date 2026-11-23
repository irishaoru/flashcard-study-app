# Flashcard Study App

## What the app does and why I chose it:
It is an app where users manually create flashcard decks and can study using them. I chose it because it would be pretty useful for me as a study tool.

## Screens:
**Home Screen**: In this screen, users can view all of their existing decks. There is a button "Create new deck" so users can start/continue adding decks to the page.

**Deck Creator/Editor Screen**: In this screen, users create the actual flashcard deck. They pick a title (which must be 80 characters or less and cannot be blank to save it) and fill in the blanks for questions and answers for each card. Must have at least one card in the deck to save it. 

**Study Screen**: In this screen, users test their knowledge using the selected deck. The cards appear one by one and users tap it to reveal the answer once they think they know it. The card flips to reveal the answer and users need to self-assess whether they got it correct or not. Cards where the user gave missed/incorrect answers are placed into the "review pile" where in the next round, only those cards are tested. Once all the cards have been reviewed, you move to the next round. This cycle continues until the user has gotten all the cards correct. Then the screen will say "Session complete" with some confetti. 

## Setup and how to run it:

This project uses Expo SDK 58. I tested it on a physical iPhone using Expo Go.

1. Install Node.js 26 LTS, which includes npm.
2. Clone the repository and install its dependencies. If you already have the project, open a terminal in the `flashcard-study-app` folder and run `npm install`.

   ```bash
   git clone https://github.com/irishaoru/flashcard-study-app.git
   cd flashcard-study-app
   npm install
   ```

3. Install the free Expo Go app from the App Store. [Course setup instructions](https://www.cs.cmu.edu/~113/hw10.html)
4. Sign in to Expo on your computer and start the development server. Sign in to Expo Go on your iPhone with the same account.

   ```bash
   npx expo login
   npx expo start
   ```

5. Connect your computer and iPhone to the same Wi-Fi network. Scan the terminal QR code with your iPhone camera and open the link in Expo Go. Keep the terminal running while you use the app. If your phone can’t connect, stop the server with `Ctrl+C` and try `npx expo start --tunnel`. [Expo connection instructions](https://docs.expo.dev/get-started/start-developing/)

To try the app in a browser, run `npm run web` from the project folder.

## What surprised me:
I was surprised at how easy it was to set up Expo via the terminal and then connect that to my phone. It was also really cool how all the edits I made here in VS Code automatically updated on my phone since it was through the same Expo account. 

## Intentionally unresolved AI reviews:
9. [FAIL] **Study typography misses the design requirement** - Was kind of a trivial fail even though I did specify it in my spec. When I tested it, it didn't really affect the user experience or flow of the app so I didn't bother to change it. 

11. [WARN] **Malformed saved data can crash screens or block startup** - I didn't change it because if you keep using the app as it is, it will be fine. The specific risk discussed comes from a future update that changes the format of saved decks or study progress such as if a paused session saves the list of cards under something other than "queue" (that field gets renamed). 

14. [WARN] **The session save helper obscures two different actions** - AI flagged it because store(undefined, true) gives a reader no obvious clue that it deletes saved progress and returns Home. Was labeled as a warning because AI was asked to review code quality as well as behavior. Testing confirmed that both buttons work which is why I didn't resolve it. 

12. [WARN] **Large decks can slow editing and grading** - When testing it, I didn't see any noticeable lags even when I added upwards of 20 cards in a deck. It seems like for the average user right now, this isn't a huge issue which is why I left it alone.


