import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const applyGlobalPolyfills = () => {
  const {
    polyfillGlobal,
  } = require("react-native/Libraries/Utilities/PolyfillFunctions");
  const { TextEncoder, TextDecoder } = require("text-encoding");
  const {
    fetch,
    Headers,
    Request,
    Response,
  } = require("react-native-fetch-api");
  const {
    ReadableStream,
    TransformStream,
  } = require("web-streams-polyfill/ponyfill/es6");
  const { TextDecoderStream } = require("@stardazed/streams-text-encoding");

  polyfillGlobal("TextEncoder", () => TextEncoder);
  polyfillGlobal("TextDecoder", () => TextDecoder);

  polyfillGlobal("fetch", () => fetch);
  polyfillGlobal("Headers", () => Headers);
  polyfillGlobal("Request", () => Request);
  polyfillGlobal("Response", () => Response);

  polyfillGlobal("ReadableStream", () => ReadableStream);
  polyfillGlobal("TransformStream", () => TransformStream);

  polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
};

applyGlobalPolyfills();

// Replace this URL with the URL of the server. Ngrok may be needed for the preview build.
const url = "http://10.0.2.2:3000";

export default function App() {
  const [headers, setHeaders] = React.useState("");
  const [body, setBody] = React.useState("");
  const [error, setError] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const startStream = async () => {
    try {
      const response = await fetch(url, {
        reactNative: { textStreaming: true },
      });
      setHeaders(
        JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)
      );
      const stream = response.body.pipeThrough(new TextDecoderStream());
      const reader = stream.getReader();
      let buffer = "";
      let readResult;
      do {
        readResult = await reader.read();
        buffer += readResult.value ?? "";
        setBody(buffer);
      } while (!readResult.done);
    } catch (error) {
      setError(error.toString());
    } finally {
      setIsStreaming(false);
    }
  };
  return (
    <View style={styles.container}>
      <Button
        title="Start Stream"
        onPress={() => {
          setHeaders("");
          setBody("");
          setError("");
          setIsStreaming(true);
          startStream();
        }}
        disabled={isStreaming}
      />
      <Text>Response Headers: {headers}</Text>
      <Text>Response Body: {body}</Text>
      <Text>Fetch Error: {error}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
