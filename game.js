const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load background image
const backgroundImage = new Image();
backgroundImage.src = 'backgroun-img.avif';

// Load the Peppa Pig theme song
const themeSong = new Audio('intro.mp3');

// Function to play the Peppa Pig theme song
function playThemeSong() {
    themeSong.loop = true; // Loop the theme song
    themeSong.play(); // Start playing the theme song
}

// Function to stop the Peppa Pig theme song
function stopThemeSong() {
    themeSong.pause(); // Pause the theme song
}

// Function to reset the game...
// Event listener for the spacebar and up arrow keys...
// Function to show the opening screen...

// Function to start the game...

let peppa = {
    x: 50,
    y: canvas.height - 60,
    width: 60, // Adjust width if needed
    height: 60, // Adjust height if needed
    dy: 0,
    gravity: 0.8,
    jumpPower: -15,
    grounded: false
};

let cactus = {
    x: canvas.width,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 6
};

let score = 0;
let highScore = 0;
let gameOver = false;
let specialMessage = '';

const messages = [
    "Peppa loves jumping in muddy puddles!",
    "Oink! Oink! Peppa is on a roll!",
    "Peppa's adventures are the best!",
    "You're as clever as Peppa!",
    "Peppa and George love to jump!",
    "You're a Peppa Pig pro!",
    "Peppa Pig is proud of you!",
    "Peppa Pig says: Keep going!",
    "Peppa loves playing with friends!",
    "Fantastic! Just like Peppa!"
];

// Function to reset the game
function resetGame() {
    peppa.x = 50;
    peppa.y = canvas.height - 60;
    peppa.dy = 0;
    peppa.grounded = false;
    cactus.x = canvas.width;
    score = 0;
    gameOver = false;
    cactus.speed = 6; // Reset speed
}

// Event listener for the spacebar and up arrow keys
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameOver) {
            resetGame();
            stopThemeSong(); // Stop theme song on game restart
            startGame();
        } else if (peppa.grounded) {
            peppa.dy = peppa.jumpPower;
            peppa.grounded = false;
        }
    }
});

function showOpeningScreen() {
    const openingScreen = document.getElementById('opening');
    const openingText = document.getElementById('opening-text');
    const logo = document.getElementById('logo');

    playThemeSong(); // Play theme song on opening screen

    setTimeout(() => {
        openingText.textContent = 'Introducing Puddle Jumper';
    }, 5000);

    setTimeout(() => {
        openingText.textContent = 'Brought to you by Ariel Games, Inc.';
    }, 10000);

    setTimeout(() => {
        openingText.style.display = 'none';
        logo.style.display = 'block';
        logo.style.width = '300px'; // Make the logo bigger
    }, 11500);

    setTimeout(() => {
        openingScreen.style.display = 'none';
        stopThemeSong(); // Stop theme song on game start
        startGame();
    }, 13500); // 2 seconds for the logo
}

function startGame() {
    stopThemeSong(); // Stop theme song
    playThemeSong(); // Play theme song

    function update() {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background image
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            // Update Peppa
            peppa.y += peppa.dy;
            peppa.dy += peppa.gravity;

            if (peppa.y + peppa.height > canvas.height - 20) {
                peppa.y = canvas.height - peppa.height - 20;
                peppa.dy = 0;
                peppa.grounded = true;
            }

            // Update Cactus
            cactus.x -= cactus.speed;
            if (cactus.x + cactus.width < 0) {
                cactus.x = canvas.width;
                score++;
                cactus.speed += 0.1; // Increase speed as the game progresses

                // Display special message every 15 points
                if (score % 15 === 0) {
                    specialMessage = messages[Math.floor(Math.random() * messages.length)];
                    setTimeout(() => {
                        specialMessage = ''; // Clear message after 3 seconds
                    }, 3000);
                }
            }

            // Check collision
            if (
                peppa.x < cactus.x + cactus.width &&
                peppa.x + peppa.width > cactus.x &&
                peppa.y < cactus.y + cactus.height &&
                peppa.y + peppa.height > cactus.y
            ) {
                gameOver = true;
                if (score > highScore) {
                    highScore = score;
                }
                ctx.fillStyle = 'red';
                ctx.font = '48px Arial';
                ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2 - 50);
                ctx.fillStyle = 'white';
                ctx.font = '24px Arial';
                ctx.fillText('Press Spacebar or Up Arrow to start again', canvas.width / 2 - 220, canvas.height / 2);
                ctx.fillText(`Score: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 30); // Show score
                playThemeSong(); // Play theme song on game over
                return;
            }

            // Draw Peppa
            const peppaImage = new Image();
            peppaImage.src = 'cringe.png';
            ctx.drawImage(peppaImage, peppa.x, peppa.y, peppa.width, peppa.height);

            // Draw Cactus
            const cactusImage = new Image();
            cactusImage.src = 'obst.png';
            ctx.drawImage(cactusImage, cactus.x, cactus.y, cactus.width, cactus.height);

            // Draw Score and High Score
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.fillText(`Score: ${score}`, 10, 30);
            ctx.fillText(`High Score: ${highScore}`, 10, 60);

            // Draw Special Message
            if (specialMessage) {
                ctx.fillStyle = 'yellow';
                ctx.font = '24px Arial';
                ctx.fillText(specialMessage, canvas.width / 2 - 150, 50);
            }

            requestAnimationFrame(update);
        }
    }

    update();
}

showOpeningScreen();