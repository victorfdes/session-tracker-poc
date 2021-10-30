import { SessionatorSession } from './session'

function init () {
  (<any>window).sessionator = new SessionatorSession()
}

init()
