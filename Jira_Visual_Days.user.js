// ==UserScript==
// @name         Jira Visible Days
// @namespace    
// @version      0.3
// @description  dots to words. dots don't clearly convey information atlassian!
// @author       JackTreble
// @downloadURL  https://github.com/JackTreble/Jira-Visual-Days/raw/main/Jira_Visual_Days.user.js
// @updateURL    https://github.com/JackTreble/Jira-Visual-Days/raw/main/Jira_Visual_Days.user.js
// @match        https://*.atlassian.net/secure/RapidBoard.jspa?*
// @match        https://*.atlassian.net/jira/software/c/projects/*/boards/*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        none
// @run-at       document-end
// ==/UserScript==

//RELEASE NOTES
// 0.3
// - Simplify implementation

// 0.2
// - Known issues resolved
// - Debug logs added

// 0.1
// - replace dots on tickets with wordy days i.e. `3 days`
// How to enable Days in column:
// board > board settings > Card layout - enable `Days in column`
// Known issues:
// - may need to refresh when navigating between board and non board jira pages
// - should update when tickets are moved between columns

let dotsToDays = (daysDiv) => {
    let daysToolTip = daysDiv.getAttribute("data-tooltip")
    let daysStr = daysToolTip.match(/^\d+ days?/g)
    let daysNumberStr = daysStr[0].match(/^\d+/g)
    let daysNumber = parseInt(daysNumberStr, 10)
    let daysParent = daysDiv.parentNode
    daysParent.innerHTML = daysStr
    daysParent.style.fontWeight = 'bold'
}

let mainContentObserver = () => {
    let observer = new MutationObserver((mutationList) => {
        mutationList
            .filter(mutation => (mutation.target.className === 'ghx-wrap-issue' || mutation.target.id === 'ghx-pool'))
            .filter(mutation => mutation.previousSibling === null)
            .flatMap(mutation => Array.from(mutation.addedNodes))
            .flatMap(node => Array.from(node.getElementsByClassName("ghx-days")))
            .forEach(daysDiv => {
            dotsToDays(daysDiv)
        })
    })
    let config = { childList: true, subtree: true }
    let target = document.querySelector("#ak-main-content")
    observer.observe(target, config)
}


(function() {
    'use strict'
    mainContentObserver()
})()