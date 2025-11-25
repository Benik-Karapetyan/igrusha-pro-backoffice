#!/usr/bin/env sh

trap 'kill -TERM $PID' TERM INT
nginx -g "daemon off;" "$@" > /var/log/containerd/$SERVICE_NAME.log 2>&1 &
PID=$!
tail -f /var/log/containerd/$SERVICE_NAME.log &
wait $PID
trap - TERM INT
wait $PID
EXIT_STATUS=$?