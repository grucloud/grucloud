# ---- Base Node ----
FROM node:18-slim as base
ENV GIT_SSH_COMMAND "ssh -i ~/.ssh/id_ecdsa -o BatchMode=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"

# RUN apk update && apk upgrade && \
#     apk add --no-cache bash git openssh graphviz
RUN apt-get update \
    && apt-get install -y --no-install-recommends graphviz git ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

#COPY package-lock.json .
# Uncomment when the package.json contains dependencies fetched through private git repository.
#COPY git_private_key /tmp/git_private_key
#RUN mkdir -p /root/.ssh/ && \
#    chmod 0700 ~/.ssh && \
#    mv /tmp/git_private_key ~/.ssh/iid_rsa && \
#    chmod 0600 ~/.ssh/id_rsa 

# copy project file
COPY package.json .

#
# ---- Dependencies ----
FROM base AS dependencies
# install production node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --omit=dev
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install
COPY . .
#RUN npm run build
#
# ---- Test ----
# run linters, setup and tests
#FROM dependencies AS test
#RUN npm run setup && npm test

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
# copy app sources
COPY src .

RUN  mkdir /root/.aws && touch /root/.aws/credentials && touch /root/.aws/config
ENTRYPOINT ["/app/node_modules/.bin/gc-runner"]

