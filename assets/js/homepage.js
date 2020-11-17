var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonEl = document.querySelector("#language-buttons")

var formSubmitHandler = function (event) {
    event.preventDefault()
    /* prevents the browser from sending the form's input data to a URL, 
    as we'll handle what happens with the form input data ourselves in JavaScript.
    */

    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = ""; // clear out the inputs element value when on submit
    }
    else {
        alert("Please enter enter a Github username");
    }
    console.log(event);
};

var getUserRepos = function (user) {

    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos"

    //make a request to the url 
    fetch(apiUrl).then(function (response) {
        //control how the app reacts to user looking up a github user that does not exsist
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data, user) //when the response data is converted to JSON, it will be sent from getUserRepos to displayRepos.
                console.log(data);
            });

        }
        else {
            alert("Error: " + response.statusText);
        }
    })
     .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });
};

// function to display repos

var displayRepos = function (repos, searchTerm) {
    //check if api returned any arrays 
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // clear out old content 
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm

    //loop over repos 
    for (i = 0; i < repos.length; i++) {
        //format repo name 
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a link for each repo 
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName); // when repo is clicked, page will be rerouted 

        // create a span to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName

        // append to container 
        repoEl.appendChild(titleEl);

        // create a status element for the repo issues
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current issue has repos or not 
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container 
        repoEl.appendChild(statusEl)

        // append that container to DOM 
        repoContainerEl.appendChild(repoEl)
    }

    console.log(repos); // repos is the array or repos from that github user name
    console.log(searchTerm); // searhterm is github repo name inputed in input field


};

// Lesson 6 for featured repos with specific languages 

var getFeaturedRepos = function (language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language)
                console.log(data)
            });
            console.log(response)
        }
        else {
            alert("error: " + response.statusText)
        }
    });
};

var buttonClickHandler = function (event) {
    var language = event.target.getAttribute("data-language")

    if (language) {
        getFeaturedRepos(language)

        /*clear old content
        even though this is wirtten last, it will execute firt because get FeaturedRepos()...
        is asynchronous and will take longer to get a response from guthub api
        */
        repoContainerEl.textContent = ""; 
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonEl.addEventListener("click", buttonClickHandler);

displayRepos()



