document.addEventListener("DOMContentLoaded", function() {
    const cmdInput = document.getElementById('cmdInput');
    const output = document.getElementById('output');
    const runButton = document.getElementById('runButton');
    const fileUpload = document.getElementById('file-upload');

    cmdInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            executeCommand();
        }
    });

    runButton.addEventListener('click', function() {
        executeCommand();
    });

    fileUpload.addEventListener('change', function() {
        const file = fileUpload.files[0];
        if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension === 'bat' || fileExtension === 'sh') {
                readFileAndRun(file, fileName);
            } else {
                appendToOutput(`Unsupported file type: ${fileExtension}`);
            }
        }
    });

    function executeCommand() {
        const command = cmdInput.value.trim();
        if (command) {
            runCommand(command);
        }
        cmdInput.value = '';
    }

    function readFileAndRun(file, fileName) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            appendToOutput(`Running ${fileName}...\n${fileContent}`);
            simulateExecution(fileContent);
        };
        reader.readAsText(file);
    }

    function simulateExecution(fileContent) {
        const commands = fileContent.split(/\r?\n/);
        for (const command of commands) {
            if (command.trim()) {
                appendToOutput(`Executing: ${command}`);
            }
        }
    }

    async function runCommand(command) {
        appendToOutput(`<div>C:\\Users\\ClassicCMD> ${command}</div>`);
        try {
            const response = await fetch('http://localhost:3000/run-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command })
            });
            const data = await response.json();
            appendToOutput(`<div>${data.output}</div>`);
        } catch (error) {
            appendToOutput(`<div>Failed to execute command.</div>`);
        }
    }

    function appendToOutput(text) {
        output.innerHTML += `<div>${text}</div>`;
        output.scrollTop = output.scrollHeight;
    }
});
