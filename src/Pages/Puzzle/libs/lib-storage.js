
import BlocklyGames from "./lib-games";
import BlocklyDialogs from "./lib-dialogs";

const BlocklyStorage = () => {


    const getCode = null;

    const setCode = null;

    const startCode = null;

    const link = function () {
        const code = getCode();
        makeRequest('/storage', 'xml=' + encodeURIComponent(code),
            handleLinkResponse_);
    };


    const retrieveXml = function (key) {
        makeRequest('/storage', 'key=' + encodeURIComponent(key),
            handleRetrieveXmlResponse_);
    };


    const xhrs_ = new Map();


    const makeRequest =
        function (url, data, opt_onSuccess, opt_onFailure, method = 'POST') {
            if (xhrs_.has(url)) {
                // AJAX call is in-flight.
                xhrs_.get(url).abort();
            }
            const xhr = new XMLHttpRequest();
            xhrs_.set(url, xhr);
            xhr.onload = function () {
                if (this.status === 200) {
                    opt_onSuccess && opt_onSuccess.call(xhr);
                } else if (opt_onFailure) {
                    opt_onFailure.call(xhr);
                } else {
                    alert_(BlocklyGames.getMsg('Games.httpRequestError', false) +
                        '\nXHR status: ' + xhr.status);
                }
                xhrs_.delete(url);
            };
            xhr.open(method, url);
            if (method === 'POST') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            xhr.send(data);
        };

    const handleLinkResponse_ = function () {
        const data = this.responseText.trim();
        window.location.hash = data;
        alert_(BlocklyGames.getMsg('Games.linkAlert', false).replace('%1',
            window.location.href));
        startCode = getCode();
    };

    const handleRetrieveXmlResponse_ = function () {
        let data = this.responseText.trim();
        if (!data.length) {
            alert_(BlocklyGames.getMsg('Games.hashError', false)
                .replace('%1', window.location.hash));
        } else {
            // Remove poison line to prevent raw content from being served.
            data = data.replace(/^\{\[\(\< UNTRUSTED CONTENT \>\)\]\}\n/, '');
            setCode(data);
        }
        startCode = getCode();
    };

    const alert_ = function (message) {
        // Try to use a nice dialog.
        // Fall back to browser's alert() if BlocklyDialogs is not part of build.
        if (typeof BlocklyDialogs === 'object') {
            const linkButton = BlocklyGames.getElementById('linkButton');
            BlocklyDialogs.storageAlert(linkButton, message);
        } else {
            alert(message);
        }
    };
};
export default BlocklyStorage;