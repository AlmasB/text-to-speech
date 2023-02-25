const synth = window.speechSynthesis;
const voices = synth.getVoices();

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");


// set up web socket
const socket = new WebSocket('ws://localhost:55556');

socket.addEventListener('open', function (event) {
    console.log("Connection to server open!");
});

socket.addEventListener('message', function (event) {
    console.log("Message from server ", event.data);
    speak(event.data);
});

function speak(text) {
    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }

    if (text !== "") {
        const utterThis = new SpeechSynthesisUtterance(text);

        utterThis.onend = function (event) {
            console.log("SpeechSynthesisUtterance.onend");
        };

        utterThis.onerror = function (event) {
            console.log(`An error has occurred with the speech synthesis: ${event.error}`);
        };

        const selectedOption = "Google UK English Male";

        for (let i = 0; i < voices.length; i++) {
            if (voices[i].name === selectedOption) {
                utterThis.voice = voices[i];
                break;
            }
        }
        
        utterThis.pitch = 1.0;
        utterThis.rate = 1.0;
        synth.speak(utterThis);
    }
}

inputForm.onsubmit = function (event) {
    event.preventDefault();

    speak(inputTxt.value);

    inputTxt.blur();
};
