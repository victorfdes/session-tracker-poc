import { Encoder } from './encoder'

interface CookieAttributes extends Object {
  [key: string]: boolean | object | undefined | string | Date | number
  secure?: boolean
  domain?: string
  path?: string
  httpOnly?: boolean
  expires?: number | Date | string
}

const defaultCookieAttributes: CookieAttributes = {
  path: '/'
}

export class Cookie {
  static get (key: string): string | void | null {
    if (typeof document === 'undefined' || (key == null)) {
      return
    }

    const cookies: Array<string> = document.cookie ? document.cookie.split('; ') : [] // prevent loop if no cookies
    const jar: { [key: string]: string } = {}
    for (const cookie of cookies) {
      const parts: Array<string> = cookie.split('=')
      let value: string = parts.slice(1).join('=')

      if (value[0] === '"' && value[value.length - 1] === '"') {
        value = value.slice(1, -1)
      }

      try {
        const currentKey: string = Encoder.decode(parts[0])
        jar[currentKey] = Encoder.decode(value)

        if (currentKey === key) {
          break
        }
      } catch (e) {}
    }

    return jar[key] || null
  }

  static set (key: string, value: string, attributes?: CookieAttributes): string | void {
    if (typeof document === 'undefined') {
      return
    }
    let _attributes = attributes ? attributes : {}
    _attributes = {
      ...defaultCookieAttributes,
      ..._attributes
    }
    if (_attributes && typeof _attributes.expires === 'number') {
      _attributes.expires = new Date(Date.now() + _attributes.expires)
    }
    if (_attributes.expires) {
      _attributes.expires = new Date(_attributes.expires).toUTCString()
    }

    const _key: string = Encoder.encode(key)
    const _value: string = Encoder.encode(value)

    let stringifiedAttributes = ''
    for (const attributeName in _attributes) {
      stringifiedAttributes += '; ' + attributeName
      stringifiedAttributes += '=' + (_attributes[attributeName] + '')
    }

    return (document.cookie = _key + '=' + _value + stringifiedAttributes)
  }

  static remove (key: string, attributes?: CookieAttributes): void {
    const _attributes = attributes ? attributes : {}
    _attributes.expires = -1
    Cookie.set(key, '', _attributes)
  }
}
