/**
 * The Handler handles determines which handler is matched given the
 * conditions present for each request.
 */
class Handler {
  constructor() {
  }

  hello_world(request) {
    return new Response('Hello worker!', {
      headers: { 'content-type': 'text/plain' },
    })
  }

  async bypass_cache(request) {
    // based on https://github.com/pmeenan/cf-workers/tree/master/cache-bypass-on-cookie
    console.log('attempting to bypass cache for ' + request.url) 

    // Clone the request so we can add a no-cache, no-store Cache-Control request header.
    let init = {
      method: request.method,
      headers: [...request.headers],
      redirect: "manual",
      body: request.body,
      cf: { cacheTtl: 0 }
    }

    let new_request = new Request(await this.uniqify(request), init)
    new_request.headers.set('Cache-Control', 'no-cache, no-store')

    // For debugging, clone the response and add some debug headers
    let response = await fetch(new_request)
    let modified_response = new Response(response.body, response)
    modified_response.headers.set('X-Bypass-Cache', 'Bypassed')

    return modified_response
  }

  async uniqify(request) {
    let url = request.url
    let random = new Uint32Array(1)
    await crypto.getRandomValues(random)

    let unique = random[0] + "." + Date.now()
    console.log("unique: " + unique)

    url.indexOf('?') >= 0 ? url += '&' : url += '?';
    return url + 'cf_cache_bust=' + unique
  }
}

module.exports = Handler
