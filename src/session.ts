import {
  SESSION_TIMEOUT,
  SESSION_COOKIE_NAME,
  SYSTEM_EVENTS
} from './config'
import {
  makeid,
  formatDate
} from './utils'
import { Cookie } from './storage'

interface SessionObject {
  id: string
  expiration: string
  referrer: string | null
  campaign: string | null
}

export class SessionatorSession {
  #accountId: string | null = null
  constructor (accountId?: string) {
    this.init(accountId)
  }

  init (accountId?: string) {
    if (accountId) {
      this.#accountId = accountId
      this.initSession()

      let previousUrl: string = ''
      const urlObserver = new MutationObserver((mutations) => {
        if (location.href !== previousUrl) {
          previousUrl = location.href
          this.handlePageView()
        }
      })
      urlObserver.observe(document, { attributes: true, childList: true, subtree: true }) // Look for URL updates
  
      window.addEventListener('hashchange', () => {
        this.handlePageView()
      }, false)
    }
  }

  get sessionCookieKey (): string {
    if (!this.#accountId) {
      return ''
    }
    return this.#accountId + SESSION_COOKIE_NAME
  }

  getSession () {
    if (!this.#accountId) {
      return null
    }
    const existingCookie = Cookie.get(this.sessionCookieKey)
    return existingCookie && JSON.parse(existingCookie) || this.initSession()
  }

  pushEvent (eventName: string, params?: Object) {
    // TODO: handle logic to process event info
    this.initSession()
  }

  handlePageView () {
    console.log('Page view')
    this.pushEvent(SYSTEM_EVENTS.PAGE_VIEW)
  }

  initSession (): SessionObject {
    const existingCookie = Cookie.get(this.sessionCookieKey)
    let id: string = makeid(11)
    let existingReferrer = null
    let existingCampaign = null
    if (existingCookie) {
      const existingCookieParsed = JSON.parse(existingCookie)
      if (existingCookieParsed.id) {
        id = existingCookieParsed.id
      }
      if (existingCookieParsed.referrer) {
        existingReferrer = existingCookieParsed.referrer
      }
      if (existingCookieParsed.campaign) {
        existingCampaign = existingCookieParsed.campaign
      }
    }
    let referrer = document.referrer
    let campaign = SessionatorSession.getCampaignFromURL(window.location.href)
    if (!referrer) {
      referrer = existingReferrer
    }
    if (!campaign) {
      campaign = existingCampaign
    }
    if (campaign !== existingCampaign) {
      id = makeid(11)
    }
    const expiration = new Date(SessionatorSession.getSessionExpires())
    const session = {
      id,
      expiration: formatDate(expiration),
      referrer,
      campaign
    }
    Cookie.set(this.sessionCookieKey, JSON.stringify(session), {
      expires: expiration
    })
    return session
  }

  static getSessionExpires (): number {
    const midnight = (new Date()).setHours(24,0,0,0)
    const minExpiry = (new Date()).valueOf() + (SESSION_TIMEOUT * 6e4)
    return Math.min(midnight, minExpiry)
  }

  static getCampaignFromURL (urlString: string): string | null {
    const _url = new URL(urlString)
    const campaign = _url.searchParams.get('campaign')
    return campaign || null
  }
}
