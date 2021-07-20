import { InsticatorSession } from './session'

function init () {
  (<any>window).insticator = new InsticatorSession()
}

init()
