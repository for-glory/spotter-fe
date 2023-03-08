FROM node:16.16-alpine3.15

RUN apk update \
  && apk upgrade \
  && apk add ca-certificates \
  && update-ca-certificates \
  && apk add --update coreutils && rm -rf /var/cache/apk/* \
  && apk add --update openjdk11 tzdata wget curl unzip libc6-compat libgcc libbsd libbsd-dev \
  && rm -rf /var/cache/apk/*

RUN mkdir /android-sdk \
    && cd /android-sdk \
    && curl -s https://developer.android.com/studio\#command-tools | grep -Eo 'https://dl.google.com/android/repository/commandlinetools-linux-[0-9]*_latest.zip' | head -n 1 | xargs wget \
    && unzip *.zip

RUN npm install --location=global @ionic/cli

ENV ANDROID_HOME="/android-sdk/cmdline-tools"
ENV PATH="$PATH:$ANDROID_HOME/bin"
ENV JAVA_HOME='/usr/lib/jvm/java-11-openjdk/'

RUN sdkmanager "platforms;android-32" "build-tools;32.0.0" "extras;google;m2repository" "extras;android;m2repository" --sdk_root=$ANDROID_HOME
RUN yes | sdkmanager --licenses --sdk_root=$ANDROID_HOME
RUN ln -s /android-sdk/cmdline-tools/lib/licenses $ANDROID_HOME/licenses
