FROM microsoft/dotnet:sdk AS build-env
WORKDIR /app

ENV NODE_VERSION 10.15.1
ENV NODE_DOWNLOAD_SHA 2c2a3d854a13d42f99bce032ce7d2b814de15bd3ab00b44b961b68fd0f0ad1ff

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
FROM microsoft/dotnet:aspnetcore-runtime
WORKDIR /app
COPY --from=build-env /app/out .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet Project.dll
