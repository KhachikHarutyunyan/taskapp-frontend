#!/bin/sh
envsubst < /usr/share/nginx/html/runtime-env.template.js > /usr/share/nginx/html/runtime-env.js

exec /docker-entrypoint.sh "$@"