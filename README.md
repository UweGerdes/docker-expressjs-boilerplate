# Docker with Express.js boilerplate

## Build the Docker image

If you have a proxy cache for apt-get you should build my baseimage and nodejs before building the image.

```bash
$ docker build -t uwegerdes/expressjs-boilerplate .
```

You may want to add `--build-arg NODE_ENV="production"` for a production server.

## Run the Docker container

Run the container with:

```bash
$ docker run -it --rm \
	-v $(pwd):/home/node/app \
	-p 28080:8080 \
	-p 28443:8443 \
	-p 28081:8081 \
	-e 'LIVERELOAD_PORT=28081' \
	--name expressjs-boilerplate \
	uwegerdes/expressjs-boilerplate \
	bash
```

You should start `npm start` or `npm run dev` and open localhost:28080 for the server, localhost:28443 is the https port.

To run tests use `npm test`, for coverage of application use `npm run coverage && sleep 1`, for development environment coverage use `npm run fullcoverage && sleep 1`

Or use the coverage tests it in a new container:

```bash
$ docker run -it --rm \
	-v $(pwd):/home/node/app \
	uwegerdes/expressjs-boilerplate \
	/bin/bash -c "npm run coverage && sleep 1"
```

If you run coverage on bigger project or on a Raspberry Pi add more time for the coverage report, `sleep 3` works on a Pi 3B, `sleep 8` for fullcoverage.

Restart it later with:

```bash
$ docker start -ai expressjs-boilerplate
```

## Using the boilerplate

This image is a base image for other projects. You only need the `modules/yourmodule`.

You should add your project in the modules subdirectory with html/ejs/pug templates, less, js, server and tests. See the sample in modules/boilerplate. You can also add a `gulp` directory to add / replace gulp tasks.

Other samples are in my projects docker-vcards, docker-rpi-nodejs-gpio (more to come).

`server.js` will load `module/[project]/server/index.js` - this should be your router. Routes are prepended with `[project]`.

### Templates: HTML / EJS / [Pug](https://pugjs.org/)

You may combine different template languages.

### Less / CSS

The project provides global styles so you should only add styles to your module that are specific for your module.

### ES6 / JavaScript

Scripts in `modules/[module]/js/` will be copied to `public/js/[module]/`.

### Iconfont

### Graphviz

### More Docker

#### e2e-workflow

Start the docker-e2e-workflow test dockers in your project directory (in another terminal to separate the boilerplate and e2e-workflow test output):

```bash
$ docker-compose -f docker-compose-e2e-workflow.yaml up
```

Open in your browser: `http://localhost:51287/` for the e2e-workflow server and `http://localhost:51285/` for the boilerplate server.

Start another terminal and attach to the `boilerplate-e2e-workflow` or `expressjs-boilerplate-e2e` docker (you might want to enter `rs[RETURN]` to trigger nodemon restart, CRTL-P + CRTL-Q to detach):

```bash
$ docker attach expressjs-boilerplate-e2e
```
## Build production server

Execute `gulp deploy` in development mode, the contents of the directory `deploy` are suitable for building a production server.

Please keep in mind that this boilerplate has not been tested for performance or security. Don't use it in a realy productive environment.

### Build the Docker image

```bash
$ docker build -t uwegerdes/expressjs-boilerplate-prod .
```

### Run the Docker container

```bash
$ docker run -d \
	-p 8080:8080 \
	--name expressjs-boilerplate-prod \
	uwegerdes/expressjs-boilerplate-prod
```

You may want to see the logs or open a shell in the container:

```bash
$ docker logs -f expressjs-boilerplate-prod
$ docker exec -it  expressjs-boilerplate-prod bash
```
