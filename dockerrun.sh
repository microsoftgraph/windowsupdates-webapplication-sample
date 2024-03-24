#!/bin/bash
# Check that the environment variables are set
if [ -z "$CLIENT_ID" ]; then
    echo "CLIENT_ID is not set"
    exit 1
fi

if [ -z "$TENANT_ID" ]; then
    echo "TENANT_ID is not set"
    exit 1
fi

if [ -z "$REDIRECT_URI" ]; then
    echo "REDIRECT_URI is not set"
    exit 1
fi

# use sed to replace the placeholder values in the config file with the environment variables
# hacky way to replace the placeholder values in the config file with the environment variables
sed -i "s|CLIENT ID|$CLIENT_ID|g" /usr/share/nginx/html/index_bundle.js
sed -i "s|https://login.windows.net/TENANT_ID|https://login.windows.net/$TENANT_ID|g" /usr/share/nginx/html/index_bundle.js
sed -i "s|http://localhost:3000|$REDIRECT_URI|g" /usr/share/nginx/html/index_bundle.js

nginx -g 'daemon off;'