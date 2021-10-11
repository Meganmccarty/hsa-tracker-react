# HSA Tracker - React Frontend

This is the React frontend for the HSA Tracker app. This app enables record-keeping of Health Savings Account (HSA) expenses by creating records for receipts and attaching receipt images. HSA Tracker can not only be used for those who use HSAs in the traditional sense but also for those who plan to use them as alternative retirement accounts. The backend is built with Ruby on Rails. For the backend, see the repo https://github.com/Meganmccarty/hsa-tracker-rails

## Get your own copy
To create your own copy of this project:
1. Fork this repo
2. Click the green 'Code' button at the top right and copy the link
3. In your terminal, navigate to the directory in which to clone the repo
4. Type `git clone <copied-link>` and hit enter
5. Type `cd hsa-tracker-react` and hit enter
6. Run `npm install`
7. Run `npm start`

The website should open up in a new browser tab at `http://localhost:3001`

### Configure the backend (optional)
If you want to use a blank, local database, please see the README for the backend repo: https://github.com/Meganmccarty/hsa-tracker-rails

## Features
* Create a free account
* Ability to update your profile information and password
* Can receive a password reset email in the event you forgot your password
* Add a receipt record (with validations)
* Attach one (or many) images for each receipt added
* View all your receipts in a sortable, searchable table
* Filter your receipts by year
* View a breakdown of your expenses (qualified, reimbursed, etc.) for tax purposes (also filtered by year)
* See a detailed view of each receipt with all attached images
* Ability to edit and delete receipt records

## Resources Used
* Built with React JS
* [React Router DOM](https://reactrouter.com/web/guides/quick-start) for managing navigation
* [Redux Toolkit](https://redux-toolkit.js.org/) for state management
* [CSS modules](https://github.com/css-modules/css-modules) for style management
