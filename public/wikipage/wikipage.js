window.addEventListener('load', function load(event) {
    /* =================== Loading wikipedia page ==================== */
    const wikipediaPageTitle = document.getElementById("firstHeading");
    const wikipediaPageContent = document.getElementById("mw-content-text");

    function stringToHtml(string) {
        var e = document.createElement('div');
        e.innerHTML = string;
        var htmlConvertedIntoDom = e.lastChild;
        var copy = htmlConvertedIntoDom.cloneNode(true);
        return copy;
    }

    function replaceRelative(text) {
        text = text.replace(/\/\/upload.wikimedia.org\//g, "https://upload.wikimedia.org/");

        const regex = /"(\/[^"]*)+?"/g;
        const matches = text.match(regex);
        for (var match of matches) {
            matchNoQuote = match.substring(1, match.length - 1);
            // Replacing match with quotes, to prevent issues if string matches again later
            if (matchNoQuote.startsWith("//upload.wikimedia.org")) {
                text = text.replace(match, "\"https:" + matchNoQuote + "\"");
            } else {
                text = text.replace(match, "\"https://fr.wikipedia.org" + matchNoQuote + "\"");
            }
        }
        return text;
    }

    function removeEdit(html) {
        // Modify on each article section
        html.querySelectorAll(".mw-editsection").forEach(e => {
            if (e.parentNode.tagName == "H2") e.remove()
        });

        // Modify under the right hand infobox
        var infobox = html.getElementsByClassName("infobox_v2")[0];
        if (infobox) {
            if (infobox.tagName == "TABLE") {
                const rowCount = infobox.rows.length;
                if (infobox.rows[rowCount - 1].textContent.includes("modifier"))
                    infobox.deleteRow(rowCount - 1);
            }
        } else {
            infobox = html.getElementsByClassName("infobox infobox_v3")[0];
            if (infobox) {
                for (var node of infobox.childNodes) {
                    if (node.innerText && node.innerText.includes("modifier")) {
                        node.remove();
                    }
                }
            }
        }
    }

    function removeFooter(html) {
        html.querySelectorAll("#bandeau-portail").forEach(e => {
            e.remove()
        });
        html.querySelectorAll("#catlinks").forEach(e => {
            e.remove()
        });
        html.querySelectorAll(".autres-projets").forEach(e => {
            e.remove()
        });
    }

    function replaceLinks(html) {
        const wikiBase = "https://fr.wikipedia.org/wiki/"
        const ignore = ["Fichier:", "Aide:", "Projet:", "index.php"];
        const ignoreRegex = new RegExp(ignore.join("|"));
        const links = html.getElementsByTagName("a");
        var pageUrlTitle;
        for (var link of links) {
            if (link.href.startsWith(wikiBase) && !ignoreRegex.test(link.href)) {
                pageUrlTitle = link.href.substring(wikiBase.length);
                // IIFE to have unique url
                (function (url) {
                    link.addEventListener("click", function () {
                        linkClicked(url)
                    });
                })(pageUrlTitle);
            }
            if (!link.href.includes("#")) {
                link.removeAttribute("href");
            }
        }
    }

    function loadCss(pageUrlTitle, linkClicked) {
        const url = "https://fr.wikipedia.org/w/api.php?action=parse&prop=headhtml&format=json&origin=*&page=";

        fetch(url + pageUrlTitle)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                const text = response.parse.headhtml["*"];
                const stylesheets = text.match(/<link rel=\"stylesheet\" href=(.*?)\/>/g);

                const head = document.getElementsByTagName('head')[0];
                // Remove old ones
                const links = head.getElementsByTagName('link');
                for (var link of links) {
                    if (link.rel == "stylesheet" && !link.className.includes("custom")) {
                        link.remove();
                    }
                }

                // Add new
                var stylesheetHtml;
                for (var stylesheet of stylesheets) {
                    stylesheet = replaceRelative(stylesheet);
                    stylesheetHtml = stringToHtml(stylesheet);
                    head.appendChild(
                        stylesheetHtml
                    );
                };

                // Send message
                if (linkClicked) {
                    window.parent.postMessage({
                            eventId: "loadedPage",
                            pageId: response.parse.pageid
                        },
                        location.origin.startsWith("http") ? location.origin : "*"
                    );
                }
            })
    }

    function loagPageTitle(pageUrlTitle, title = undefined) {
        if (title) {
            wikipediaPageTitle.innerText = title;
        } else {
            const url = "https://fr.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=";

            fetch(url + pageUrlTitle)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    const pages = response.query.pages;
                    const firstPage = pages[Object.keys(pages)[0]];
                    wikipediaPageTitle.innerText = firstPage.title;
                })
        }
    }

    function setWikipediaPageContent(htmlString) {
        wikipediaPageContent.innerHtml = "";
        const lastChild = wikipediaPageContent.lastElementChild;
        if (lastChild) wikipediaPageContent.removeChild(lastChild);
        wikipediaPageContent.appendChild(
            new DOMParser().parseFromString(htmlString, 'text/html').body.childNodes[0]
        );
    }

    function loadPageContent(pageUrlTitle) {
        return new Promise((resolve, reject) => {
            const url = 'https://fr.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=';
            fetch(url + pageUrlTitle)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    var text = response.parse.text["*"];
                    text = replaceRelative(text);

                    setWikipediaPageContent(text);
                    removeEdit(wikipediaPageContent);
                    removeFooter(wikipediaPageContent);
                    replaceLinks(wikipediaPageContent);

                    resolve();
                })
        });
    }

    function checkRedirect(pageUrlTitle, linkClicked) {
        const url = "https://fr.wikipedia.org/w/api.php?action=query&redirects&format=json&origin=*&titles=";

        fetch(url + pageUrlTitle)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                var title, to;
                // Get title if available
                try {
                    const pages = response.query.pages;
                    const firstPage = pages[Object.keys(pages)[0]];
                    title = firstPage.title;
                } catch {
                    title = undefined;
                }
                // Get redirect if exists
                try {
                    to = response.query.redirects[0].to;
                } catch {
                    to = pageUrlTitle;
                }
                loadPage(to, false, title, linkClicked);
            })
    }

    function loadPage(pageUrlTitle, checkRedirectBool = true, title = undefined, linkClicked = false) {
        if (checkRedirectBool) {
            checkRedirect(pageUrlTitle, linkClicked);
        } else {
            loadCss(pageUrlTitle, linkClicked);
            setWikipediaPageContent(
                "<p>Chargement...</p>"
            );
            loagPageTitle(pageUrlTitle, title);
            loadPageContent(pageUrlTitle);
        }
    }

    /* =================== Handling game events ==================== */
    function linkClicked(pageUrlTitle) {
        loadPage(pageUrlTitle, true, undefined, true);
    }

    window.addEventListener('message', handleMessage, false);

    function handleMessage(event) {
        if (event.origin != location.origin) return;

        switch (event.data.eventId) {
            case "loadPage":
                loadPage(event.data.pageUrlTitle);
                break;
        }
    }

})