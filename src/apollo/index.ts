import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client/core";
import { getToken, clearAuthItems } from "@/router/middleware/auth";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

import router from "@/router";
import { EntitiesEnum } from "@/const/entities";

let apolloClient: ApolloClient<any>;

const parseHeaders = (rawHeaders: any) => {
  const headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
  preProcessedHeaders.split(/\r?\n/).forEach((line: any) => {
    const parts = line.split(":");
    const key = parts.shift().trim();
    if (key) {
      const value = parts.join(":").trim();
      headers.append(key, value);
    }
  });
  return headers;
};

export const uploadFetch = (url: string, options: any) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const opts: any = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || ""),
      };
      opts.url =
        "responseURL" in xhr
          ? xhr.responseURL
          : opts.headers.get("X-Request-URL");
      const body = "response" in xhr ? xhr.response : (xhr as any).responseText;
      resolve(new Response(body, opts));
    };
    xhr.onerror = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.ontimeout = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.open(options.method, url, true);

    Object.keys(options.headers).forEach((key) => {
      xhr.setRequestHeader(key, options.headers[key]);
    });

    if (xhr.upload) {
      xhr.upload.onprogress = options.onProgress;
    }

    options.onAbortPossible(() => {
      xhr.abort();
    });

    xhr.send(options.body);
  });

const customFetch = (uri: any, options: any) => {
  if (options.onProgress) {
    return uploadFetch(uri, options);
  }
  return fetch(uri, options);
};

// process.env.VUE_APP_API_URL

const httpLink = createUploadLink({
  uri: process.env.VUE_APP_BACKEND_API_URL,
  credentials: "same-origin",
  fetch: customFetch as any,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getToken();

  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
  }
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.extensions.category) {
        case "authentication":
          clearAuthItems();
          // router.push({ name: EntitiesEnum.Login });

          return forward(operation);
      }
    }
  }
});

const createApolloClient = () => {
  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
      },
      mutate: {
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
};

const initializeApollo = () => {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export default initializeApollo;
