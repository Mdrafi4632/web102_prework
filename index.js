/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    for (let i = 0; i < games.length; i++) {
        const game = games[i];

        // Create a new div element for the game card
        const gameCard = document.createElement("div");

        // Add the class "game-card" to the div
        gameCard.classList.add("game-card");

        // Set the inner HTML using a template literal
        gameCard.innerHTML = `
            <img class="game-img" src="${game.img}" alt="${game.name}">
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p><strong>Backers:</strong> ${game.backers}</p>
            <p><strong>Pledged:</strong> $${game.pledged.toLocaleString()}</p>
        `;

        // Append the game card to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// Call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);



/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((accumulator, games) => {
    return accumulator + games.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = totalContributions.toLocaleString();

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// set inner HTML using template literal
const totalPledged = GAMES_JSON.reduce((accumulator, games) => {
    return accumulator + games.pledged;
}, 0);

raisedCard.innerHTML = `$${totalPledged.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames  = GAMES_JSON.length;

gamesCard.innerHTML = totalGames;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    // Filter games where pledged < goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // Log the count of unfunded games
    console.log(unfundedGames.length);

    // Clear existing content and add unfunded games to the page
    deleteChildElements(gamesContainer);
    addGamesToPage(unfundedGames);

    // Return the unfunded games array
    return unfundedGames;
}


// show only games that are fully funded
function filterFundedOnly() {
    // Filter games where pledged >= goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // Log the count of funded games
    console.log(fundedGames.length);

    // Clear existing content and add funded games to the page
    deleteChildElements(gamesContainer);
    addGamesToPage(fundedGames);

    // Return the funded games array
    return fundedGames;
}


// show all games
function showAllGames() {
    // Clear any existing content in the games-container
    deleteChildElements(gamesContainer);

    // Use the addGamesToPage function to display all games
    addGamesToPage(GAMES_JSON);
}


// Grab the buttons from the DOM
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// Add event listeners to the buttons
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-bar").value.toLowerCase();
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(query));
    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);
});

// Add event listener for the scroll-to-top button
const scrollToTopButton = document.getElementById("scroll-to-top");

window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        scrollToTopButton.style.display = "block";
    } else {
        scrollToTopButton.style.display = "none";
    }
});

scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// Grab the description container
const descriptionContainer = document.getElementById("description-container");

// Calculate total raised and unfunded games
const totalRaised = GAMES_JSON.reduce((sum, game) => sum + game.pledged, 0);
const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// Create a grammatically correct display string using a template literal
const displayStr = `
    A total of $${totalRaised.toLocaleString()} has been raised for ${GAMES_JSON.length} games.
    Currently, ${unfundedGames} game${unfundedGames === 1 ? '' : 's'} remain unfunded.
    We need your help to fund these amazing games!
`;

// Create a new DOM element containing the display string
const descriptionElement = document.createElement("p");
descriptionElement.innerHTML = displayStr;

// Append the new element to the description container
descriptionContainer.appendChild(descriptionElement);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

// Grab the top two games from the sortedGames array
const [mostFundedGame, secondMostFundedGame] = sortedGames;

// Create a new element for the most funded game
const firstGameElement = document.createElement("p");
firstGameElement.innerText = `Most Funded Game: ${mostFundedGame.name}`;

// Append this element to the firstGameContainer
firstGameContainer.appendChild(firstGameElement);

// Create a new element for the second most funded game
const secondGameElement = document.createElement("p");
secondGameElement.innerText = `Second Most Funded Game: ${secondMostFundedGame.name}`;

// Append this element to the secondGameContainer
secondGameContainer.appendChild(secondGameElement);
