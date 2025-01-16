# Adventour App

Project in User Interface Design: Adventour

To deploy your new local changes to the hosted website
In your Terminal: npm run deploy

### BUT still use local host for developing and testing to save resources!

Find Login Data, Password provided by Smilla to you -> firebase (Link: https://console.firebase.google.com/project/adventour-3bde6 ), Reiter Firestore Database: Users Collection

## To Discuss

- Refine Prompt for Suggestions: Ai should also focus on time frame, Budget, ...The tags are very generic right now, It should always show citys, areas and never resorts/ hotels..
- Create Prompt for Perfect Match, What info do we need for the Trip Detail Page (see Prototype), give the Perplexity not only the swipes but also the initial prefrences to create a better perfect match
- For the saved swipe directions: maybe we should change using/saving the directions but instead like,dislike,superlike, indifferent? So its eser to develop and read th code and communicate with the api
- Image API Solution!
- Right now every Trip we create will be added to all the users we want manually -> for demo resons okay

## To Do - Must Dos

### - High Prio: Resize all images quality and Size! Right Now they are way too big and are ccosting a lot of firebase resources!

### - High Prio: For Api Cals use Databse Data

### - High Prio: Create perfect match and add it in the trip detail page

- Style LogIn Page
- Add own Profile Picture for each user!
- Add logout functionality when clicking on the profile
- Planning Page: Make input test black and not gray!
- Invite Page: Add Trip Name and TimeFrame and Max Budget to text. For this use the input from the planning page to generate this test every time based on this input
- Invite Page: - For better usability: Alert the user when the message got copied to clipboard
- Prefernces Page: When using a bigger Screen Size the dot count from the carousels are wrong and confusing
- Processing PopUp: Add background image
- Suggestions: Still al lot of styling is needed, better wait for the AI image functionality to do this
- Suggestions: The description is always about Barcelona -> add AI description here
- Suggestions: Animation for up and down swipe
- Thank you for your feedback pop up: Add a button with something like "got to homepage", right now this happens when clicking outside the popup but this is not so obvious
- Homepage: When all have swiped add a small note on the MyTrips tile saying somethin like "new perferct match"
- My Trips Page: All the Styling!
- My Trips Page: When all invited users gabe their prefrences there should be a button available saying something like "show me the perfect match" -> Only when clicking on it the API get fetched an the pefect match will be created -> the trip tile changes now as it gets a name of the destination -> Every user can now click on the trip and will be directed to the trip detail page
- Trip Detail Page: Needs to be Designed, wait until we have the API Data. See Figma Moblie Prototype for styling this (https://www.figma.com/design/qU0lZ1vktP1sJEH73d0tGk/Prototyp_1_Adventour?node-id=352-400&p=f&t=IqUqN6bJ5iiNxNE0-0)

## To Do - Nice to have

- Sign Up functionality
- make it possible to invite anyone, no matter if they have an account or not
- make it possible to stop anywhere in the process of planning and come back to the right page over the my trip menu

## To Do - Before handing it in

- write documentation
- comment everything!
- error handling!
- specify inputs and make it error resitent
