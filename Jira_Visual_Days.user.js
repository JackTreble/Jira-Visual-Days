// ==UserScript==
// @name         Jira Visible Days
// @namespace    
// @version      0.1
// @description  dots don't clearly convay information atlassian!
// @downloadURL  https://github.com/JackTreble/Jira-Visual-Days/raw/main/Jira_Visual_Days.user.js
// @updateURL    https://github.com/JackTreble/Jira-Visual-Days/raw/main/Jira_Visual_Days.user.js
// @match        https://*.atlassian.net/secure/RapidBoard.jspa?*
// @match        https://*.atlassian.net/jira/software/c/projects/*/boards/*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        none
// ==/UserScript==

//RELEASE NOTES
// 0.1
// - replace dots on tickets with wordy days i.e. `3 days`
// How to enable Days in column:
// board > board settings > Card layout - enable `Days in column`
// Known issues:
// - may need to refresh when navigating between board and non board jira pages
// - should update when tickets are moved between columns


let visualDays = () => {
    Array.from(document.getElementsByClassName("ghx-days")).forEach(daysDiv => {
        let daysToolTip = daysDiv.getAttribute("data-tooltip")
        let daysStr = daysToolTip.match(/^\d+ days?/g)
        let daysNumberStr = daysStr[0].match(/^\d+/g)
        let daysNumber = parseInt(daysNumberStr, 10)

        let daysParent = daysDiv.parentNode
        daysParent.innerHTML = daysStr
        switch (daysNumber) {
            case 1:
            case 2:
                daysParent.style.color = "green"
                break;
            case 3:
                daysParent.style.color = "orange"
                break;
            default:
                daysParent.style.color = "red"
        }
    }
                                                                   )
}


let poolColumnObserver = () => {
    let observer = new MutationObserver(visualDays);
    let config = { attributes: true, childList: true, subtree: true }
    let target = document.querySelector("#ghx-pool-column")
    observer.observe(target, config)
}

let mainContentObserver = () => {
    let observer = new MutationObserver((_, me) => {
        let pools = document.querySelector("#ghx-pool-column")
        if (pools) {
            poolColumnObserver()
            me.disconnect();
            return;
        }
    })
    let config = { childList: true, subtree: true }
    let target = document.querySelector("#ak-main-content")
    observer.observe(target, config)
}

(function() {
    'use strict';
    mainContentObserver()
})();