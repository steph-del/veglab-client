# base image
FROM node:12.13.0 AS veglab_client_dev

# install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable gettext
RUN apt-get update && apt-get install -yq gettext

# set working directory
WORKDIR /client

# add `/app/node_modules/.bin` to $PATH
ENV PATH /client/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /client/package.json
COPY yarn.lock /client/yarn.lock
# RUN npm install --no-cache if there is problem about dependencies versions (sticked versions to docker npm cache)
#RUN npm install
#RUN npm install -g @angular/cli@7.3.4

# With Yarn (test)
RUN yarn install
RUN yarn global add @angular/cli@7.3.4

# get env var
ARG CLIENT_DEV_HOST
ARG API_HOST
ARG ES_HOST
ARG ELASTIC_PASSWORD
ARG ES_REPO_PASSWORD
ARG SSO_HOST
ARG SSO_URI
ARG SSO_CLIENT_ID
ARG SSO_LOGIN_ENDPOINT
ARG SSO_LOGOUT_ENDPOINT
ARG SSO_REFRESH_ENDPOINT
ARG SSO_REFRESH_INTERVAL

RUN echo $API_HOST
# add app
COPY . /client

# add environments vars and bind HOST
RUN envsubst < ./src/environments/environment.ts > /client/src/environments/environment.ts.tmp && mv /client/src/environments/environment.ts.tmp /client/src/environments/environment.ts
# start app
#CMD ng serve
CMD ng serve --host 0.0.0.0 --port 4200 --disableHostCheck
