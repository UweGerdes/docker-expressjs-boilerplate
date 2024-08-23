# Dockerfile for expressjs projects

ARG NODEIMAGE_VERSION=latest
FROM uwegerdes/nodejs:${NODEIMAGE_VERSION}

MAINTAINER Uwe Gerdes <entwicklung@uwegerdes.de>

ARG SERVER_PORT='8080'
ARG HTTPS_PORT='8443'
ARG LIVERELOAD_PORT='8081'

ENV SERVER_PORT=${SERVER_PORT}
ENV HTTPS_PORT=${HTTPS_PORT}
ENV LIVERELOAD_PORT=${LIVERELOAD_PORT}

USER root

RUN apt-get update && \
	apt-get dist-upgrade -y && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
	if [ "${NODE_ENV}" = "development" ] ; then \
		npm install -g --cache /tmp/root-cache \
					c8 \
					gulp-cli \
					mocha \
					nodemon ; \
	fi && \
	rm -r /tmp/*

COPY --chown=${USER_NAME}:${USER_NAME} . ${APP_HOME}
RUN chown ${USER_NAME}:${USER_NAME} ${APP_HOME}

COPY entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

COPY --chown=${USER_NAME}:${USER_NAME} package.json ${NODE_HOME}/

WORKDIR ${NODE_HOME}

USER ${USER_NAME}

RUN npm install --cache /tmp/node-cache && \
	chown ${USER_NAME}:${USER_NAME} ${NODE_HOME}/package-lock.json && \
	rm -r /tmp/*

RUN perl -i.bak -0pe 's/(.+prefer-regex-literals.+?:).+?\n.+?\n.+?\n/$1 1,\n/gms' \
		/home/node/node_modules/eslint-config-airbnb-base/rules/best-practices.js

WORKDIR ${APP_HOME}

EXPOSE ${SERVER_PORT} ${HTTPS_PORT} ${LIVERELOAD_PORT}

CMD [ "npm", "start" ]
