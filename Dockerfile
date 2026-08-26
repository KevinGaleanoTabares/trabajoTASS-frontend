ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS build
ARG FRONTEND_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration=${FRONTEND_ENV}

FROM node:${NODE_VERSION} AS runtime
WORKDIR /app
ENV NODE_ENV=development
ENV PORT=11001

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist

USER node
EXPOSE 11001
CMD ["npm", "run", "serve:ssr:trabajoTASSfrontend"]
