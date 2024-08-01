export function displayDialogue(text, onDisplayEnd) {
    const dialogueUI = document.getElementById("textbox-container");
    const dialogue = document.getElementById("dialogue")};

    dialogueUI.style.display = "block";
    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
        if (index < text.length) {
        currentText += text[index];
        dialogueUI.innerHTML = currentText;
        index++;
        return;
        }
    
        clearInterval(intervalRef);
    }, 1);
