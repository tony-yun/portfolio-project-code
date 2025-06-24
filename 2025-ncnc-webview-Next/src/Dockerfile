FROM node:18+...

WORKDIR ...

ARG GITHUB_PAT

# timezone
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG NEXT_PUBLIC_NODE_ENV=production
ARG NEXT_PUBLIC_..._URL=...
ARG NEXT_PUBLIC_..._URL=...

COPY . .

RUN yarn set version 4.9.1 \
  && yarn config set 'npmScopes["doublenc-inc"].npmRegistryServer' "https://npm.pkg.github.com" \
  && yarn config set 'npmScopes["doublenc-inc"].npmAlwaysAuth' "true" \
  && yarn config set 'npmScopes["doublenc-inc"].npmAuthToken' "$GITHUB_PAT" \
  && yarn \
  && yarn build

EXPOSE port

CMD [ "yarn", "start" ]