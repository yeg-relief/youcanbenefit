### API SERVER

This is the `API` for the `YouCanBenefit` project.

# service dependencies
* [elasticsearch](https://www.elastic.co/products/elasticsearch)
* [install tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-elasticsearch-on-ubuntu-16-04)

# setup

### vm/npm

* `npm run prestart:prod`
* `npm run start:prod`
  * one should use a process management tool
* `http POST localhost:3000/data/init`
  * this will create and map required elasticsearch indices

---

### Docker

* `docker build -t youcanbenefit-api .`
* `docker run -p 3000:3000 youcanbenefit-api`

---

### Docker-Compose
**intended usage**

check [the deploy repository](https://github.com/yeg-relief/deploy)

# deets

It has three accessible routes:

* `/protected/...`
* `/api/...`
* `/data/...`

There is no authentication service provided.

Since this is a small single tenant application auth is very
straightforward. My implementation is a reverse proxy that
handles basic auth and forwards the request. See the `Caddyfile` in the deploy repo.

[src/modules/constants.readonly.ts](https://raw.githubusercontent.com/yeg-relief/api-server/master/src/modules/constants.readonly.ts)
is where the environment variables are interpreted.


