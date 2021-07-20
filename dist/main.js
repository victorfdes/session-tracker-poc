/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

const SESSION_COOKIE_NAME = '_stp';
const SESSION_TIMEOUT = 30; // minutes
var SYSTEM_EVENTS;
(function (SYSTEM_EVENTS) {
    SYSTEM_EVENTS["PAGE_VIEW"] = "page view";
})(SYSTEM_EVENTS || (SYSTEM_EVENTS = {}));

function makeid(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789!@';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function formatDate(date) {
    const yyyy = (date.getFullYear() + '').padStart(4, '0');
    const mm = ((date.getMonth() + 1) + '').padStart(2, '0');
    const dd = (date.getDate() + '').padStart(2, '0');
    const hh = (date.getHours() + '').padStart(2, '0');
    const m = (date.getMinutes() + '').padStart(2, '0');
    const s = (date.getSeconds() + '').padStart(2, '0');
    const ms = (date.getMilliseconds() + '').padStart(3, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${m}:${s}:${ms}`;
}

class Encoder {
    static encode(value) {
        return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
    }
    static decode(value) {
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    }
}

const defaultCookieAttributes = {
    path: '/'
};
class Cookie {
    static get(key) {
        if (typeof document === 'undefined' || (key == null)) {
            return;
        }
        const cookies = document.cookie ? document.cookie.split('; ') : []; // prevent loop if no cookies
        const jar = {};
        for (const cookie of cookies) {
            const parts = cookie.split('=');
            let value = parts.slice(1).join('=');
            if (value[0] === '"' && value[value.length - 1] === '"') {
                value = value.slice(1, -1);
            }
            try {
                const currentKey = Encoder.decode(parts[0]);
                jar[currentKey] = Encoder.decode(value);
                if (currentKey === key) {
                    break;
                }
            }
            catch (e) { }
        }
        return jar[key] || null;
    }
    static set(key, value, attributes) {
        if (typeof document === 'undefined') {
            return;
        }
        let _attributes = attributes ? attributes : {};
        _attributes = Object.assign(Object.assign({}, defaultCookieAttributes), _attributes);
        if (_attributes && typeof _attributes.expires === 'number') {
            _attributes.expires = new Date(Date.now() + _attributes.expires);
        }
        if (_attributes.expires) {
            _attributes.expires = new Date(_attributes.expires).toUTCString();
        }
        const _key = Encoder.encode(key);
        const _value = Encoder.encode(value);
        let stringifiedAttributes = '';
        for (const attributeName in _attributes) {
            stringifiedAttributes += '; ' + attributeName;
            stringifiedAttributes += '=' + (_attributes[attributeName] + '');
        }
        return (document.cookie = _key + '=' + _value + stringifiedAttributes);
    }
    static remove(key, attributes) {
        const _attributes = attributes ? attributes : {};
        _attributes.expires = -1;
        Cookie.set(key, '', _attributes);
    }
}

var _InsticatorSession_accountId;
class InsticatorSession {
    constructor(accountId) {
        _InsticatorSession_accountId.set(this, null);
        this.init(accountId);
    }
    init(accountId) {
        if (accountId) {
            __classPrivateFieldSet(this, _InsticatorSession_accountId, accountId, "f");
            this.initSession();
            let previousUrl = '';
            const urlObserver = new MutationObserver((mutations) => {
                if (location.href !== previousUrl) {
                    previousUrl = location.href;
                    this.handlePageView();
                }
            });
            urlObserver.observe(document, { attributes: true, childList: true, subtree: true }); // Look for URL updates
            window.addEventListener('hashchange', () => {
                this.handlePageView();
            }, false);
        }
    }
    get sessionCookieKey() {
        if (!__classPrivateFieldGet(this, _InsticatorSession_accountId, "f")) {
            return '';
        }
        return __classPrivateFieldGet(this, _InsticatorSession_accountId, "f") + SESSION_COOKIE_NAME;
    }
    getSession() {
        if (!__classPrivateFieldGet(this, _InsticatorSession_accountId, "f")) {
            return null;
        }
        const existingCookie = Cookie.get(this.sessionCookieKey);
        return existingCookie && JSON.parse(existingCookie) || this.initSession();
    }
    pushEvent(eventName, params) {
        // TODO: handle logic to process event info
        this.initSession();
    }
    handlePageView() {
        console.log('Page view');
        this.pushEvent(SYSTEM_EVENTS.PAGE_VIEW);
    }
    initSession() {
        const existingCookie = Cookie.get(this.sessionCookieKey);
        let id = makeid(11);
        let existingReferrer = null;
        let existingCampaign = null;
        if (existingCookie) {
            const existingCookieParsed = JSON.parse(existingCookie);
            if (existingCookieParsed.id) {
                id = existingCookieParsed.id;
            }
            if (existingCookieParsed.referrer) {
                existingReferrer = existingCookieParsed.referrer;
            }
            if (existingCookieParsed.campaign) {
                existingCampaign = existingCookieParsed.campaign;
            }
        }
        let referrer = document.referrer;
        let campaign = InsticatorSession.getCampaignFromURL(window.location.href);
        if (!referrer) {
            referrer = existingReferrer;
        }
        if (!campaign) {
            campaign = existingCampaign;
        }
        if (campaign !== existingCampaign) {
            id = makeid(11);
        }
        const expiration = new Date(InsticatorSession.getSessionExpires());
        const session = {
            id,
            expiration: formatDate(expiration),
            referrer,
            campaign
        };
        Cookie.set(this.sessionCookieKey, JSON.stringify(session), {
            expires: expiration
        });
        return session;
    }
    static getSessionExpires() {
        const midnight = (new Date()).setHours(24, 0, 0, 0);
        const minExpiry = (new Date()).valueOf() + (SESSION_TIMEOUT * 6e4);
        return Math.min(midnight, minExpiry);
    }
    static getCampaignFromURL(urlString) {
        const _url = new URL(urlString);
        const campaign = _url.searchParams.get('campaign');
        return campaign || null;
    }
}
_InsticatorSession_accountId = new WeakMap();

function init() {
    window.insticator = new InsticatorSession();
}
init();
