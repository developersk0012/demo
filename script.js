// Global variables
let currentWatchFace = 'classic';
let alarmTime = null;
let alarmInterval = null;
let alarmSound = document.getElementById('alarmSound');
let alarmSet = false;
let alarmCount = 0;
let timerCount = 0;

// Timer variables
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let timerPaused = false;

// Stopwatch variables
let stopwatchInterval = null;
let stopwatchSeconds = 0;
let stopwatchRunning = false;
let stopwatchPaused = false;
let lapCount = 1;

// Usage tracking
let usageSeconds = 0;
let usageInterval = null;

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeWatchFaces();
    initializeAlarm();
    initializeTimer();
    initializeStopwatch();
    initializeUsage();
    updateCurrentTime();
    drawAnalogClock();
    
    // Start intervals
    setInterval(updateCurrentTime, 1000);
    setInterval(drawAnalogClock, 1000);
    
    // PDF download button
    document.getElementById('downloadPDF').addEventListener('click', generatePDF);
    
    // Logo click
    document.getElementById('logoLink').addEventListener('click', function(e) {
        window.open('https://skeducation.ct.ws', '_blank');
    });
});

// Initialize clock
function initializeClock() {
    // Set up watch face selection
    document.querySelectorAll('.watch-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.watch-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            let face = this.getAttribute('data-face');
            document.querySelectorAll('.watch-face').forEach(wf => wf.classList.remove('active'));
            document.getElementById(`watch-${face}`).classList.add('active');
            currentWatchFace = face;
        });
    });
}

// Update current time display
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('currentTime').textContent = timeString;
    
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    document.getElementById('currentDate').textContent = dateString;
    
    // Update digital watch if active
    if (currentWatchFace === 'digital') {
        document.querySelector('.digital-time').textContent = timeString;
        document.querySelector('.digital-date').textContent = dateString.toUpperCase();
        
        // Update steps and heart randomly for demo
        document.querySelector('.digital-steps').innerHTML = `❤️ STEPS: ${Math.floor(Math.random() * 5000 + 5000)}`;
        document.querySelector('.digital-heart').innerHTML = `💓 HEART: ${Math.floor(Math.random() * 20 + 70)} BPM`;
    }
    
    // Check alarm
    if (alarmSet && alarmTime) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const [alarmHour, alarmMinute] = alarmTime.split(':').map(Number);
        
        // Check if within 2 hours range
        const timeDiff = (currentHour * 60 + currentMinute) - (alarmHour * 60 + alarmMinute);
        if (Math.abs(timeDiff) <= 120 && timeDiff >= 0) {
            triggerAlarm();
        }
    }
}

// Draw analog clock
function drawAnalogClock() {
    const canvas = document.getElementById('analogCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Clear canvas
    ctx.clearRect(0, 0, 300, 300);
    
    // Draw clock face
    ctx.beginPath();
    ctx.arc(150, 150, 140, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Draw hour markers
    for (let i = 1; i <= 12; i++) {
        let angle = i * 30 * Math.PI / 180 - Math.PI/2;
        let x = 150 + Math.cos(angle) * 120;
        let y = 150 + Math.sin(angle) * 120;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i.toString(), x, y);
    }
    
    // Draw hour hand
    let hourAngle = (hours * 30 + minutes * 0.5) * Math.PI / 180 - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.lineTo(150 + Math.cos(hourAngle) * 70, 150 + Math.sin(hourAngle) * 70);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // Draw minute hand
    let minuteAngle = (minutes * 6 + seconds * 0.1) * Math.PI / 180 - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.lineTo(150 + Math.cos(minuteAngle) * 100, 150 + Math.sin(minuteAngle) * 100);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#666';
    ctx.stroke();
    
    // Draw second hand
    let secondAngle = seconds * 6 * Math.PI / 180 - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.lineTo(150 + Math.cos(secondAngle) * 110, 150 + Math.sin(secondAngle) * 110);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
    
    // Draw center dot
    ctx.beginPath();
    ctx.arc(150, 150, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

// Initialize alarm
function initializeAlarm() {
    document.getElementById('setAlarm').addEventListener('click', function() {
        const alarmTimeInput = document.getElementById('alarmTime').value;
        if (alarmTimeInput) {
            alarmTime = alarmTimeInput;
            alarmSet = true;
            alarmCount++;
            document.getElementById('alarmCount').textContent = alarmCount;
            document.getElementById('alarmStatus').textContent = `Alarm set for ${alarmTime}`;
            document.getElementById('setAlarm').disabled = true;
            document.getElementById('stopAlarm').disabled = false;
        }
    });
    
    document.getElementById('stopAlarm').addEventListener('click', function() {
        stopAlarm();
    });
}

// Trigger alarm
function triggerAlarm() {
    if (alarmSound) {
        alarmSound.play().catch(e => console.log('Audio play failed:', e));
        document.getElementById('alarmStatus').textContent = '⏰ ALARM RINGING! ⏰';
        document.getElementById('alarmStatus').style.animation = 'blink 1s infinite';
        
        // Vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate([1000, 500, 1000]);
        }
    }
}

// Stop alarm
function stopAlarm() {
    if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }
    alarmSet = false;
    alarmTime = null;
    document.getElementById('setAlarm').disabled = false;
    document.getElementById('stopAlarm').disabled = true;
    document.getElementById('alarmStatus').textContent = 'Alarm stopped';
    document.getElementById('alarmStatus').style.animation = 'none';
    
    if (navigator.vibrate) {
        navigator.vibrate(0);
    }
}

// Initialize timer
function initializeTimer() {
    const hoursInput = document.getElementById('timerHours');
    const minutesInput = document.getElementById('timerMinutes');
    const secondsInput = document.getElementById('timerSeconds');
    const timerDisplay = document.getElementById('timerDisplay');
    
    document.getElementById('startTimer').addEventListener('click', function() {
        if (!timerRunning) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const secs = parseInt(secondsInput.value) || 0;
            
            timerSeconds = hours * 3600 + minutes * 60 + secs;
            
            if (timerSeconds > 0) {
                timerRunning = true;
                timerPaused = false;
                timerCount++;
                document.getElementById('timerCount').textContent = timerCount;
                
                timerInterval = setInterval(function() {
                    if (!timerPaused && timerSeconds > 0) {
                        timerSeconds--;
                        updateTimerDisplay();
                        
                        if (timerSeconds === 0) {
                            clearInterval(timerInterval);
                            timerRunning = false;
                            timerDisplay.style.animation = 'blink 1s infinite';
                            
                            // Play sound when timer ends
                            if (alarmSound) {
                                alarmSound.play();
                                setTimeout(() => alarmSound.pause(), 3000);
                            }
                        }
                    }
                }, 1000);
                
                document.getElementById('startTimer').disabled = true;
                document.getElementById('pauseTimer').disabled = false;
                document.getElementById('resetTimer').disabled = false;
            }
        }
    });
    
    document.getElementById('pauseTimer').addEventListener('click', function() {
        timerPaused = !timerPaused;
        this.textContent = timerPaused ? 'Resume' : 'Pause';
    });
    
    document.getElementById('resetTimer').addEventListener('click', function() {
        clearInterval(timerInterval);
        timerRunning = false;
        timerPaused = false;
        timerSeconds = 0;
        updateTimerDisplay();
        timerDisplay.style.animation = 'none';
        
        document.getElementById('startTimer').disabled = false;
        document.getElementById('pauseTimer').disabled = true;
        document.getElementById('pauseTimer').textContent = 'Pause';
        
        hoursInput.value = 0;
        minutesInput.value = 0;
        secondsInput.value = 0;
    });
    
    function updateTimerDisplay() {
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Initialize stopwatch
function initializeStopwatch() {
    const stopwatchDisplay = document.getElementById('stopwatchDisplay');
    const lapTimes = document.getElementById('lapTimes');
    
    document.getElementById('startStopwatch').addEventListener('click', function() {
        if (!stopwatchRunning) {
            stopwatchRunning = true;
            stopwatchPaused = false;
            
            stopwatchInterval = setInterval(function() {
                if (!stopwatchPaused) {
                    stopwatchSeconds++;
                    updateStopwatchDisplay();
                }
            }, 1000);
            
            document.getElementById('startStopwatch').disabled = true;
            document.getElementById('pauseStopwatch').disabled = false;
            document.getElementById('lapStopwatch').disabled = false;
            document.getElementById('resetStopwatch').disabled = false;
        }
    });
    
    document.getElementById('pauseStopwatch').addEventListener('click', function() {
        stopwatchPaused = !stopwatchPaused;
        this.textContent = stopwatchPaused ? 'Resume' : 'Pause';
    });
    
    document.getElementById('resetStopwatch').addEventListener('click', function() {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        stopwatchPaused = false;
        stopwatchSeconds = 0;
        lapCount = 1;
        updateStopwatchDisplay();
        lapTimes.innerHTML = '';
        
        document.getElementById('startStopwatch').disabled = false;
        document.getElementById('pauseStopwatch').disabled = true;
        document.getElementById('pauseStopwatch').textContent = 'Pause';
        document.getElementById('lapStopwatch').disabled = true;
        document.getElementById('resetStopwatch').disabled = true;
    });
    
    document.getElementById('lapStopwatch').addEventListener('click', function() {
        const lapTime = stopwatchDisplay.textContent;
        const lapElement = document.createElement('div');
        lapElement.textContent = `Lap ${lapCount++}: ${lapTime}`;
        lapElement.style.padding = '5px';
        lapElement.style.borderBottom = '1px solid #eee';
        lapTimes.appendChild(lapElement);
        lapTimes.scrollTop = lapTimes.scrollHeight;
    });
    
    function updateStopwatchDisplay() {
        const hours = Math.floor(stopwatchSeconds / 3600);
        const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
        const seconds = stopwatchSeconds % 60;
        
        stopwatchDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Initialize usage tracking
function initializeUsage() {
    usageInterval = setInterval(function() {
        usageSeconds++;
        const minutes = Math.floor(usageSeconds / 60);
        document.getElementById('usageTime').textContent = `${minutes} min ${usageSeconds % 60} sec`;
    }, 1000);
}

// Generate PDF
function generatePDF() {
    const now = new Date();
    const usageMinutes = Math.floor(usageSeconds / 60);
    const usageSeconds_remainder = usageSeconds % 60;
    
    // Create PDF content
    const pdfContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    padding: 40px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    min-height: 100vh;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: rgba(255,255,255,0.95);
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    color: #333;
                }
                h1 {
                    color: #667eea;
                    text-align: center;
                    font-size: 2.5em;
                    margin-bottom: 10px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                }
                h2 {
                    color: #764ba2;
                    text-align: center;
                    margin-bottom: 30px;
                    font-style: italic;
                }
                .stats {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    padding: 20px;
                    border-radius: 15px;
                    margin: 20px 0;
                }
                .stat-item {
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                    font-size: 1.2em;
                }
                .stat-item:last-child {
                    border-bottom: none;
                }
                .label {
                    font-weight: bold;
                    color: #667eea;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 2px solid #667eea;
                    color: #666;
                }
                .hero-quote {
                    text-align: center;
                    font-size: 1.5em;
                    color: #764ba2;
                    margin: 20px 0;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to SK World</h1>
                <h2>Journey from Zero to Hero</h2>
                
                <div class="hero-quote">
                    "Every expert was once a beginner"
                </div>
                
                <div class="stats">
                    <div class="stat-item">
                        <span class="label">Report Generated:</span> ${now.toLocaleString()}
                    </div>
                    <div class="stat-item">
                        <span class="label">Time on Website:</span> ${usageMinutes} minutes ${usageSeconds_remainder} seconds
                    </div>
                    <div class="stat-item">
                        <span class="label">Alarms Set Today:</span> ${alarmCount}
                    </div>
                    <div class="stat-item">
                        <span class="label">Timer Used:</span> ${timerCount} times
                    </div>
                    <div class="stat-item">
                        <span class="label">Current Watch Face:</span> ${currentWatchFace.charAt(0).toUpperCase() + currentWatchFace.slice(1)}
                    </div>
                </div>
                
                <div class="footer">
                    <p>SK World - Your Journey Starts Here</p>
                    <p>✨ Keep Learning, Keep Growing ✨</p>
                    <p>From Zero to Hero - One Step at a Time</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SKWorld_Usage_${now.toISOString().slice(0,10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    alert('PDF report generated successfully! Check your downloads folder.');
}

// Initialize watch faces
function initializeWatchFaces() {
    // Add Roman numerals
    const romanMarkers = document.querySelector('.roman-markers');
    if (romanMarkers) {
        const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        romanMarkers.innerHTML = numerals.map(num => `<span>${num}</span>`).join('');
    }
    
    // Add modern markers
    const modernMarkers = document.querySelector('.modern-markers');
    if (modernMarkers) {
        const markers = [60, 55, 5, 25, 50, 10, 20, 15, 45, 40, 35, 30];
        modernMarkers.innerHTML = markers.map(marker => `<div class="marker">${marker}</div>`).join('');
    }
}

// Add blink animation
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0% { opacity: 1; background-color: #ff6b6b; }
        50% { opacity: 0.5; background-color: #ff4757; }
        100% { opacity: 1; background-color: #ff6b6b; }
    }
`;
document.head.appendChild(style);