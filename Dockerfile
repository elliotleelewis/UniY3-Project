FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

ENV NODE_VERSION 12.16.1
ENV NODE_DOWNLOAD_SHA b2d9787da97d6c0d5cbf24c69fdbbf376b19089f921432c5a61aa323bc070bea

# Install necessary utilities
RUN curl -SL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" --output nodejs.tar.gz \
	&& echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
	&& tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
	&& rm nodejs.tar.gz \
	&& ln -s /usr/local/bin/node /usr/local/bin/nodejs \
	&& npm i -g yarn

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=build-env /app/out .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet Project.dll
