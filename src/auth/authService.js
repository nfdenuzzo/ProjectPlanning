import DateUtil from '@/helper/dateUtil'

export default {
  // If a token exists and did not expire the token will simply be returned from the local storage.
  // Otherwise, a new token will be requested and stored in the local storage.
  // NOTE: Returns null if the token could not be retrieved for some reason.
  async getAccessToken () {
    // Token exists and not expired, so simply return it.
    if (!this.shouldRequestToken()) {
      const accessToken = JSON.parse(localStorage.getItem('access_token'))
      return accessToken.tokenString
    }

    // Need to request a new token
    const body = {
      username: window.username
    }

    const response = await fetch(`${window.baseAPIURL}auth/rosterauth`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const jsonResponse = await response.json()

    // The request was a success and the user was authenticated
    if (response.status === 200) {
      // Store the token in local storage
      localStorage.setItem('access_token', JSON.stringify(jsonResponse))
      return jsonResponse.tokenString
    } else {
      console.log('User could not be authenticated')
    }

    // For some reason a token could not be retrieved
    return null
  },
  shouldRequestToken () {
    const token = JSON.parse(localStorage.getItem('access_token'))
    // If the token does
    if (!token) {
      return true
    }
    // See if the token expired
    const tokenExpiryDate = DateUtil.helperDateParser(token.expires)
    if (DateUtil.helperisAfter(new Date(), tokenExpiryDate)) {
      return true
    }
    return false
  }
}
