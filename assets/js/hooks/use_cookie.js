const defaultOptions = {
  expires: 400,
  suffix: true
}

function camelize (value) {
  return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase())
}

const useCookie = (controller, options = {}) => {
  const { expires, suffix } = Object.assign({}, defaultOptions, options)
  const getCookieName = (cookieName) => {
    return camelize(cookieName)
  }
  const getAccessorName = (cookieName) => {
    return suffix ? `${camelize(cookieName)}Cookie` : camelize(cookieName)
  }

  const defineCookieAccessors = (rawCookieName) => {
    const cookieName = getCookieName(rawCookieName)
    const accesorName = getAccessorName(rawCookieName)

    Object.defineProperty(controller, accesorName, {
      get () {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim())
        const matchingCookie = cookies.find(c => c.startsWith(cookieName + '='))
        return matchingCookie ? matchingCookie.split('=')[1] : undefined
      },
      set (newValue) {
        if (newValue === null) {
          return clearCookie(cookieName)
        }

        const cookieValue = typeof newValue === 'string' ? newValue : newValue.value
        const cookie = parseCookieString(cookieName + '=' + cookieValue)
        saveCookie(cookie, expires)
      }
    })
  }

  const constructor = controller.constructor
  constructor.cookieNames?.forEach((cookieName) => {
    defineCookieAccessors(cookieName)
  })
}

function parseCookieString (nameValue) {
  const [cookieName, cookieValue] = nameValue.split('=')
  return {
    name: cookieName,
    value: cookieValue
  }
}

function saveCookie (cookie, daysToExpire) {
  const { name, value, expires = daysToExpire } = cookie

  const date = new Date(new Date().getTime() + expires * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${value};expires=${date};`
}

function clearCookie (cookieName) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
}

export default useCookie
