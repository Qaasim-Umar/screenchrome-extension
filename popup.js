document.addEventListener("DOMContentLoaded", () => {
  // Obtain references to button selectors
  const startVideoButton = document.querySelector("#start_video");
  const stopVideoButton = document.querySelector("#stop_video");

  // Adding event listeners for starting video recording
  startVideoButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "request_recording" },
          (response) => {
            if (!chrome.runtime.lastError) {
              console.log(response);
            } else {
              console.error("Error sending message:", chrome.runtime.lastError);
            }
          }
        );
      } else {
        console.error("No active tabs found.");
      }
    });
  });

  // Adding event listeners for stopping video recording
  stopVideoButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "stop_video" },
          (response) => {
            if (!chrome.runtime.lastError) {
              console.log(response);
            } else {
              console.error("Error sending message:", chrome.runtime.lastError);
            }
          }
        );
      } else {
        console.error("No active tabs found.");
      }
    });
  });
});
