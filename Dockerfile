FROM node:18-alpine
ADD . /app
WORKDIR /app
ENV CLIENT_ID=YOUR_CLIENT_ID
ENV TENANT_ID=YOUR_TENANT_ID
ENV REDIRECT_URI=http://localhost:3000/
RUN sed -i "s|\"CLIENT_ID\"|process.env.CLIENT_ID|g" /app/src/config/AuthConfig.js
RUN sed -i "s|TENANT_ID\"|\" + process.env.TENANT_ID|g" /app/src/config/AuthConfig.js
RUN sed -i "s|\"localhost:3000/\"|process.env.REDIRECT_URI|g" /app/src/config/AuthConfig.js
RUN npm install 
EXPOSE 3000
CMD ["npm", "start"]