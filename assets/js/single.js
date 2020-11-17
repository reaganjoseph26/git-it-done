var issuesContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning")
var repoNameEl = document.querySelector("#repo-name")

var getRepoName = function () {
    //grab repo name from url query string
    var queryString = document.location.search;
    repoName = queryString.split("=")[1];

    //check if the repoName exsist/was retrieved correctly
    if (repoName) {
        //if exsist then display repoName to the page 
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    }
    else {
        document.location.replace("./index.html"); //user is rerouted back to homepage if condition isnt true
    }

};

var getRepoIssues = function (repo) {

    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // make a get request to URL 
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // pass the response data to dom function to be displayed on page 
                displayIssues(data);

                //check to see if api has paginated issues 

                if (response.headers.get("Link")) {
                    displayWarning(repo)
                }
            });
        } else {

            //if not successful, redirect 
            document.location.replace("./index.html");
        }
    });
}

var displayIssues = function (issues) {

    //check for no issues 
    if (issues.length === 0) {
        issuesContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for (i = 0; i < issues.length; i++) {
        //create a link element to take the user to the issue on github
        var issueEl = document.createElement("a")
        issueEl.classList = "list-item flex-row justify-space-between align-center"
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank")

        //create span element to hold issue title
        var titleEl = document.createElement("span")
        titleEl.textContent = issues[i].title;
        //appaned to container 
        issueEl.appendChild(titleEl)
        //create a type element
        var typeEl = document.createElement("span")

        // check if issues is an actual issue or a pull reequest
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        }
        else {
            typeEl.textContent = "(Issue)"
        }

        //append to container
        issueEl.appendChild(typeEl);

        issuesContainerEl.appendChild(issueEl);
    }


};

var displayWarning = function (repo) {
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    //create a link to github repo issues page for repos with more than 30 issues
    linkEl = document.createElement("a")
    linkEl.textContent = "See more issues on Github.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues")
    linkEl.setAttribute("target", "_blank")

    //append warning to container
    limitWarningEl.appendChild(linkEl)
};

getRepoName()
