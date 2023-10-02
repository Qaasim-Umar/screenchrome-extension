let recorderInstance = null;
let capturedChunks = [];

function processChunksLocally(chunk) {
  if (chunk.length > 0) {
    const videoBlob = new Blob(capturedChunks, {
      type: chunk[0]?.type,
    });
    const formData = new FormData();
    formData.append("blob", videoBlob);
    formData.append("videoId", videoId);

    // Instead of an API call, handle formData locally

    console.log(`Local processing ready with FormData.`);
  } else {
    console.info(`Captured chunk is empty.`);
  }
}

function handleAccessApproval(stream) {
  recorderInstance = new MediaRecorder(stream);

  recorderInstance.start();

  recorderInstance.onstop = async function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
    // Process the captured chunks locally
    await processChunksLocally();
  };

  recorderInstance.ondataavailable = async function (event) {
    console.log(event);
    if (event.data.size > 0) {
      capturedChunks.push(event.data);
    }
    // Process and store chunks locally
    const chunk = [event.data];
    await processChunksLocally(chunk);
    console.log({ chunk }, "chunks");
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("Initiating recording request");

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 1280,
          height: 720,
        },
      })
      .then((stream) => {
        handleAccessApproval(stream);
      });
  }

  if (message.action === "stopvideo") {
    console.log("Stopping video recording");
    sendResponse(`processed: ${message.action}`);
    if (!recorderInstance) return console.log("No recorder instance available");

    recorderInstance.stop();
  }
});
