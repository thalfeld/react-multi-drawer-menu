import initReactApp from "./app";

function InitApp() {
    const logMessage: string = "Up and running...";
    const message = document.createElement("p");
    message.innerHTML = logMessage;
    document.querySelector("body").append(message);
    console.log(logMessage);
}

//InitApp();

initReactApp();
