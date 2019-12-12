# CSCI-3308-Project
RAD Weather- 
A ColoRADo weather tracking web application featuring realtime weather data and interactivity, catered to Coloradoans and visitors of Colorado.

## Repo Organization/Structure
This repository served the main version control environment for the duration of our project. The master branch served as the main branch for already tested and working features, while the other branches were created for testing specific features that were in the process of implementation.

Within each branch, the structure is generally similar. Frontend files (.pug, .js files) settle in the main directory. Within the main directory, there are three directories- img, insertLocations, and node_modules- that house project resources and backend dependencies. The img directory stores the weather icons used for the interactive map. The insertLocations directory provides the files needed for initializing the database of locations and users. The node_modules folder provides all node.js dependencies needed for this project.
### Master Branch
This was the primary branch and parent of all other branches created during development. All files in the master branch (.pug, .js, etc) are the latest versions of working code for deployment. 
### herokumerging Branch
This branch was used for converting files from the master branch into heroku compatible files. Thus, database ports and some node.js configuration settings differ from those in the master. This branch allowed for group members to continue to test the master branch on their local machines.
### unitTests Branch
This branch added files used for unit testing our functions.

## How to Build/Run
The app can be found at: https://disastertrackerco.herokuapp.com/home 
### Building Locally 
Once all files are obtained, run the load.js module within the insertLocations directory TWICE. This will initialize the database needed for the app. Afterwards, run the server.js module. The app should now be hosted locally on port 8000. 


