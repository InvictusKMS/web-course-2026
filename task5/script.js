document.addEventListener("DOMContentLoaded", function () {
    const sectors = document.querySelectorAll(".sector");
    const startButton = document.querySelector("#startButton");
    const level = document.querySelector("#level");
    const message = document.querySelector("#message");

    let sequence = [];
    let playerIndex = 0;
    let playing = false;
    let showing = false;
    let timerId = null;
    let messageText = "Нажми «Старт», чтобы начать.";

    function render() {
        level.textContent = "Уровень: " + sequence.length;
        message.textContent = messageText;

        sectors.forEach(function (sector) {
            sector.disabled = !playing || showing;
        });
    }

    function clearLights() {
        sectors.forEach(function (sector) {
            sector.classList.remove("active");
        });
    }

    function startGame() {
        clearTimeout(timerId);
        timerId = null;
        clearLights();

        sequence = [];
        playerIndex = 0;
        playing = true;
        showing = true;

        nextRound();
    }

    function nextRound() {
        const randomColor = Math.floor(Math.random() * 4);

        sequence.push(randomColor);
        playerIndex = 0;
        showing = true;
        messageText = "Запоминай последовательность.";

        render();

        timerId = setTimeout(function () {
            showStep(0);
        }, 500);
    }

    function showStep(index) {
        timerId = null;

        if (index === sequence.length) {
            showing = false;
            messageText = "Теперь твоя очередь!";
            render();
            return;
        }

        const color = sequence[index];
        sectors[color].classList.add("active");

        timerId = setTimeout(function () {
            sectors[color].classList.remove("active");

            timerId = setTimeout(function () {
                showStep(index + 1);
            }, 300);
        }, 500);
    }

    function checkAnswer(color) {
        if (!playing || showing) {
            return;
        }

        if (color !== sequence[playerIndex]) {
            finishGame();
            return;
        }

        playerIndex++;

        if (playerIndex === sequence.length) {
            showing = true;
            messageText = "Верно! Готовься к следующему уровню.";

            render();

            timerId = setTimeout(function () {
                nextRound();
            }, 800);
        }
    }

    function finishGame() {
        clearTimeout(timerId);
        timerId = null;
        clearLights();

        playing = false;
        showing = false;

        messageText =
            "Ошибка! Вы дошли до уровня " +
            sequence.length +
            ". Нажмите «Старт», чтобы попробовать снова.";

        render();
    }

    sectors.forEach(function (sector, index) {
        sector.addEventListener("click", function () {
            checkAnswer(index);
        });
    });

    startButton.addEventListener("click", startGame);

    render();
});