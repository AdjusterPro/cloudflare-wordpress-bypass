const Router = require('./router')
const Handler = require('./handler')

function register_routes(handler) {
  const r = new Router()

  r.get('^/canary$', req => handler.hello_world(req))
  r.get('/lms/.*', req => handler.bypass_cache(req)) // TODO remove this; was just a proof of concept

  r.get('.*', req => fetch(req))

  return r
}

async function handleRequest(request) {
  const router = await register_routes(new Handler())
  return await router.route(request)
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
