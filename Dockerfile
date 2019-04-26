FROM ubuntu:16.04

# -----------------------------------------------------------------------------
# Environment variables
# -----------------------------------------------------------------------------

ARG NODE_VERSION=10.2.1
ARG NPM_VERSION=5.6.0
ARG IONIC_VERSION=3.20.0
ARG CORDOVA_VERSION=8.0.0

# ARG GRADLE_VERSION=3.5
# ARG ANDROID_BUILD_TOOLS_VERSION=25.0.3
# ARG ANDROID_PLATFORMS="android-16 android-17 android-18 android-19 android-20 android-21 android-22 android-23 android-24 android-25"

# ENV ANDROID_HOME /opt/android-sdk-linux
# ENV GRADLE_HOME /opt/gradle
# ENV PATH ${PATH}:${GRADLE_HOME}/bin:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/platform-tools

# -----------------------------------------------------------------------------
# Pre-install
# -----------------------------------------------------------------------------
RUN \
  dpkg --add-architecture i386 \
  && apt-get update -y \
  && apt-get install -y \

    # tools
    curl \
    wget \
    zip \

    # android-sdk dependencies
    libc6-i386 \
    lib32stdc++6 \
    lib32gcc1 \
    lib32ncurses5 \
    lib32z1 \
    qemu-kvm \
    kmod


# Install Node and NPM
RUN \
  apt-get update -qqy \
  && curl --retry 3 -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz" \
  && npm install -g npm@"$NPM_VERSION" \
  && npm install -g cordova@"$CORDOVA_VERSION" ionic@"$IONIC_VERSION"


WORKDIR /project
EXPOSE 8100 35729 53703
CMD ionic serve

# -----------------------------------------------------------------------------
# Clean up
# -----------------------------------------------------------------------------
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

