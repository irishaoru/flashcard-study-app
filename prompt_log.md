# HW10 Prompt Log

## AI tools used
Codex in the IDE for learning Expo and React Native, implementing the app, reviewing for [FAIL] or [WARN] items (used a second agent for htis in a new session) and making follow-up changes.

## Learning Expo and React Native

```
*I'm brand new to React Native. Can you explain at a high level how these files create a working app?*
```

```
i'm still ocnfused. can you explain a bit more high level and then get into the technicals? i've never used expo go like at all or react
```

```
expo router? what is that compared to just expo? explain the different things under src/app/? react vs react native?
```

## Initial build prompt

```
Read SPEC.md in this project. Implement the full mobile app exactly as specified.\
This is an Expo project using Expo Router, so screens belong in src/app/.\
Check package.json for the exact Expo SDK version and write code for that version.\
Create all necessary files, components, and navigation. Make sure that appropriate data is persistent.\
Avoid security risks for sensitive data.  Include proper error handling.\
Make sure the app starts without errors and displays the home screen correctly.
```

## Build follow-ups

```
add the ability to edit decks like remove or add new cards. also brighten up the spirit of the UI a bit more and use something like quizlet for inspiration
```

```
maybe like some confetti when you complete the seesion or something fun like that
```

Second Agent:
## Review prompt to the second agent

```
Review the React Native/Expo code in this project against the spec in SPEC.md.
For each acceptance criterion in the spec, verify whether the code actually implements it correctly.
Also check for:
- Bugs or logic errors
- Missing error handling
- Code quality issues (unclear naming, repeated code, etc.)
- Best practices for React Native or other technologies

Format your review as a numbered list of findings, each marked as [PASS], [FAIL], or [WARN].
Be specific. Reference file names and line numbers.
Do not fix anything in this session. Report only.
Export the review as REVIEW.md at the root of the project.
```
## Follow Up Questions:
```
can you explain each WARN/FAIL?
```

```
wait yea if i edit the card, the paused progress should not save anymore and the app can give user's a warning message if they edit it while it is paused study sesh that it will reset their progress. maybe cap the title name at a max number of characters that feels reasonable. don't really understand the rest of hte warnings. ignore the fail it's kinda trivial
```

```
why would stored data become unreadable?
```

```
why do i not need to worry about that? what if i just dont't update my code? how would i even avoid this warning
```

## Manual interventions

- Scoped the app to manually created flashcards so the project could focus on the study and review flow.
- Revised parts of my spec such as explaining that Exit saves study progress and End session clears it or giving users the ability to edit their decks instead of just keeping it static once it's saved. 
- Tested the app in Expo Go on a physical iPhone to verify the behavior on the demo device.
- Decided on which FAIL and WARN I would focus on and which ones I felt I could just leave unresolved. 
