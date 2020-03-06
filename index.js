const Router = require('./router')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
function hello_world(request) {
  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
}

async function handleRequest(request) {
    const r = new Router()
    r.get('/hello_world', req => hello_world(req))
    r.get('.*', req => fetch(req)) // return the response from the origin

    const resp = await r.route(request)
    return resp
}
