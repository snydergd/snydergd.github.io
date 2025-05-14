---
layout: standalone
---

This is an editor for diagrams using the opensource drawio components [https://github.com/jgraph/drawio](https://github.com/jgraph/drawio).

Lots of pages don't have a way to view and edit diagrams, so this is a bookmarklet to make it easy to create and edit diagrams in an iframe - sending them back to the main page bookmarklet through messages.

<script src="https://unpkg.com/react@16.14.0/umd/react.development.js" integrity="sha384-ZHBAhj6mPF2wke1Ie6UN+ozxCHBXIuRrcszqkblgAqCrZtYGI3zZYn4SsU+ozss4" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@16.13.1/umd/react-dom.development.js" integrity="sha384-kaOkZyb5Zt3xjd+db4haVYVQCb1G7SF1nBLglYfcovj2yYb58gL0ntVd/oCqN1CE" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@excalidraw/excalidraw@0.11.0/dist/excalidraw.development.js" integrity="sha384-9CTmZ+infdr+2O1egmliAis/c+tHxjGQBN/Iw91EeNzlEz4d/IEmzTl9lTzmQimu" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js" integrity="sha384-UUy+D59sJs8EtAj6pQ9si7fDNBVqF5jt5bIhOOEyxJZ18OuWyEQzTi4Smtf03OK2" crossorigin="anonymous"></script>
<script src="https://unpkg.com/pngjs@7.0.0/browser.js" integrity="sha384-SE4yuklZ9OS9q7BL/rvRI0QuhPIWGQVY2j4lue8oxdfuVOxWgTvyS+6HPXRweutX" crossorigin="anonymous"></script>
<style>
    .excalidraw-wrapper {
        height: 800px;
        width: 100%;
        position: relative;
        border: 1px solid black;
    }
</style>

<img id="test" alt="stuff" />
<div id="root">Javascript is loading...</div>

<script id="bookmarklet" type="application/javascript+bookmarklet">
    (function () {
        var frame = window.open(`https://snydergd.gitHub.io/diagram-bookmarklet`, "_blank");
        window.stuff = frame;

        frame.addEventListener("load", function () {
            frame.postMessage(document.getElementById("test").src);
        });
        window.addEventListener("message", function (event) {
            console.log(event);
            if (event.data.type !== "diagram") return;
            document.getElementById("test").src = event.data.data;
        });
    })()
</script>

<script type="text/babel">
    const { useState, useEffect, useRef, useCallback } = React;

    function parseChunks(uint8) {
  const chunks = [];
  let offset = 8; // Skip PNG signature
  while (offset < uint8.length) {
    const length = new DataView(uint8.buffer).getUint32(offset);
    const type = String.fromCharCode(...uint8.slice(offset + 4, offset + 8));
    const data = uint8.slice(offset + 8, offset + 8 + length);
    const crc = uint8.slice(offset + 8 + length, offset + 12 + length);
    chunks.push({ type, data, length, crc });
    offset += 12 + length;
  }
  return chunks;
}

function createChunk(type, data) {
  const encoder = new TextEncoder();
  const typeBytes = encoder.encode(type);
  const lengthBytes = new Uint8Array(4);
  new DataView(lengthBytes.buffer).setUint32(0, data.length);

  const crcInput = new Uint8Array(typeBytes.length + data.length);
  crcInput.set(typeBytes);
  crcInput.set(data, typeBytes.length);
  const crc = crc32(crcInput);
  const crcBytes = new Uint8Array(4);
  new DataView(crcBytes.buffer).setUint32(0, crc);

  return new Uint8Array([...lengthBytes, ...typeBytes, ...data, ...crcBytes]);
}

function createTextChunk(keyword, text) {
  const keywordBytes = new TextEncoder("latin1").encode(keyword);
  const nullByte = new Uint8Array([0]);
  const textBytes = new TextEncoder("latin1").encode(text);
  const data = new Uint8Array(keywordBytes.length + 1 + textBytes.length);
  data.set(keywordBytes, 0);
  data.set(nullByte, keywordBytes.length);
  data.set(textBytes, keywordBytes.length + 1);
  return createChunk("tEXt", data);
}
function extractTextChunk(pngBytes, keyword) {
  const chunks = parseChunks(pngBytes);
  console.log("Length", chunks.length);
  for (const chunk of chunks) {
    if (chunk.type === "tEXt") {
      const nullIndex = chunk.data.indexOf(0);
      if (nullIndex === -1) continue;
      const chunkKey = new TextDecoder("latin1").decode(chunk.data.slice(0, nullIndex));
      const chunkValue = new TextDecoder("latin1").decode(chunk.data.slice(nullIndex + 1));
      console.log("key", chunkKey);
      if (chunkKey === keyword) {
        return chunkValue;
      }
    }
  }
  return null;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function embedTextIntoPNG(pngBytes, keyword, text) {
  const signature = pngBytes.slice(0, 8);
  const chunks = parseChunks(pngBytes);

  const newChunks = [];
  for (const chunk of chunks) {
    if (chunk.type === "IEND") {
      // Insert before IEND
      newChunks.push(createTextChunk(keyword, text));
    }
    newChunks.push(createChunk(chunk.type, chunk.data));
  }

  const totalLength = 8 + newChunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  result.set(signature, 0);
  let offset = 8;
  for (const chunk of newChunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}


        function addTextToPng(key, text, pngBlob) {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => {
                    const pngBytes = new Uint8Array(reader.result);
                    const modified = embedTextIntoPNG(pngBytes, key, text);
                    const blob = new Blob([modified], { type: "image/png" });
                    resolve(blob);
                };
                reader.readAsArrayBuffer(pngBlob);
            });
        }
        function getTextFromPng(key, pngBlob) {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => {
                    const pngBytes = new Uint8Array(reader.result);
                    const jsonText = extractTextChunk(pngBytes, key);
                    resolve(jsonText)
                };
                reader.readAsArrayBuffer(pngBlob);
            });
        }

    window.excalidrawLoadedBoolean = false;
    window.excalidrawLoaded = new Promise(resolve => {
        window.resolveExcalidraw = function () {
            if (!window.excalidrawLoadedBoolean) {
                resolve.apply(this, arguments);
                window.excalidrawLoadedBoolean = true;
            }
        }
    });

    function App({data}) {
        const excalidrawRef = useCallback(excalidraw => {
            console.log("Excalidraw", excalidraw);
            window.excalidraw = {current: excalidraw};
            if (excalidraw) {
                window.resolveExcalidraw(excalidraw);
            }
        }, []);
        const excalidrawWrapperRef = useRef(null);

        function blobToDataUrl(blob) {
            return new Promise(resolve => {
                var a = new FileReader();
                a.onload = function(e) {resolve(e.target.result);}
                a.readAsDataURL(blob);
            });
        }

        async function save() {
            const updatedPngBlob = await addTextToPng("excalidraw", JSON.stringify({
                elements: window.excalidraw.current.getSceneElements(),
                appState: window.excalidraw.current.getAppState(),
            }), await Excalidraw.exportToBlob({
                elements: window.excalidraw.current.getSceneElements(),
                appState: window.excalidraw.current.getAppState(),
            }));
            const data = await blobToDataUrl(updatedPngBlob);

            if (window.mainWindow) {
                window.mainWindow.postMessage({ type: "diagram", data});
            } else {
                console.log("no main window");
            }
        }

        let bookmarkletUrl = "javascript:window.isMainWindow = true;" + document.getElementById("bookmarklet").innerText.trim();
        if (window.location.hostname === "localhost") {
            bookmarkletUrl = bookmarkletUrl.replace("https://snydergd.gitHub.io", "");
        }

        return <>
            <button className="btn btn-primary" onClick={save}>Save</button>
            <a href={bookmarkletUrl} className="btn btn-primary">Open in new tab</a>
            <div ref={excalidrawWrapperRef} className="excalidraw-wrapper">
                <Excalidraw.default ref={excalidrawRef} width={200} height={200} />
            </div>
        </>
    }
    function dataUrlToBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }
    window.addEventListener("message", async event => {
        if (!window.isMainWindow) {
            window.mainWindow = event.source;
            console.log("received", event);
            window.excalidrawLoaded.then(async () => {
                console.log(event.data);
                const data = JSON.parse(await getTextFromPng("excalidraw", dataUrlToBlob(event.data)));
                console.log(data);
                data.appState.collaborators = [];
                window.excalidraw.current.updateScene(data);
            });
        }
    });

    function render(data) {
        ReactDOM.render(<App data={data} />, document.getElementById("root"));
    }
    render();
</script>
