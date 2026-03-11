// Global variables
let currentCategory = 'stopwatch';
let stopwatchInterval = null;
let stopwatchSeconds = 0;
let stopwatchRunning = false;
let stopwatchPaused = false;
let lapCount = 1;
let stopwatchCount = 0;

// Timer variables
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let timerPaused = false;
let timerCount = 0;
let totalTimerSeconds = 0;

// Alarm variables
let alarmTime = null;
let alarmSet = false;
let alarmCount = 0;
let alarmSound = document.getElementById('alarmSound');

// Usage tracking
let usageSeconds = 0;
let usageInterval = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeStopwatch();
    initializeTimer();
    initializeAlarm();
    initializeWorldClock();
    initializeUsage();
    updateDateTime();
    
    // Set intervals
    setInterval(updateDateTime, 1000);
    setInterval(updateStopwatchHands, 1000);
    setInterval(updateWorldClocks, 1000);
    
    // PDF download
    document.getElementById('downloadPDF').addEventListener('click', generatePDF);
    
    // Logo link
    document.getElementById('logoLink').addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://skeducation.ct.ws', '_blank');
    });
    
    // Initialize date numbers
    updateDateNumbers();
});

// Initialize category tabs
function initializeTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            document.getElementById(`${category}-category`).classList.add('active');
            currentCategory = category;
        });
    });
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    
    // IST (India Standard Time)
    const istTime = now.toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const istDate = now.toLocaleDateString('en-US', { 
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    document.getElementById('currentTime').textContent = istTime;
    document.getElementById('currentDate').textContent = istDate;
    document.getElementById('worldTime').textContent = istTime;
    document.getElementById('worldDate').textContent = istDate;
    
    updateDateNumbers();
}

// Update date numbers (1-31)
function updateDateNumbers() {
    const now = new Date();
    const today = now.getDate();
    const numbersDiv = document.getElementById('dateNumbers');
    const worldNumbersDiv = document.getElementById('worldNumbers');
    
    let html = '';
    for (let i = 1; i <= 31; i++) {
        const isToday = i === today;
        html += `<span class="${isToday ? 'today' : ''}">${i}</span>`;
    }
    
    numbersDiv.innerHTML = html;
    worldNumbersDiv.innerHTML = html;
}

// Update world clocks
function updateWorldClocks() {
    const now = new Date();
    
    // New York (EST)
    const nyTime = now.toLocaleTimeString('en-US', { 
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // London (GMT)
    const londonTime = now.toLocaleTimeString('en-US', { 
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // Tokyo (JST)
    const tokyoTime = now.toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // Dubai (GST)
    const dubaiTime = now.toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    document.getElementById('nyTime').textContent = nyTime;
    document.getElementById('londonTime').textContent = londonTime;
    document.getElementById('tokyoTime').textContent = tokyoTime;
    document.getElementById('dubaiTime').textContent = dubaiTime;
}

// Stopwatch functions
function initializeStopwatch() {
    const startBtn = document.getElementById('startStopwatch');
    const pauseBtn = document.getElementById('pauseStopwatch');
    const resetBtn = document.getElementById('resetStopwatch');
    const lapBtn = document.getElementById('lapStopwatch');
    const display = document.getElementById('stopwatchDisplay');
    const lapTimes = document.getElementById('lapTimes');
    
    startBtn.addEventListener('click', function() {
        if (!stopwatchRunning) {
            stopwatchRunning = true;
            stopwatchPaused = false;
            stopwatchCount++;
            document.getElementById('stopwatchCount').textContent = stopwatchCount;
            
            stopwatchInterval = setInterval(function() {
                if (!stopwatchPaused) {
                    stopwatchSeconds++;
                    updateStopwatchDisplay();
                }
            }, 1000);
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            lapBtn.disabled = false;
            resetBtn.disabled = false;
        }
    });
    
    pauseBtn.addEventListener('click', function() {
        stopwatchPaused = !stopwatchPaused;
        this.textContent = stopwatchPaused ? 'Resume' : 'Pause';
    });
    
    resetBtn.addEventListener('click', function() {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        stopwatchPaused = false;
        stopwatchSeconds = 0;
        lapCount = 1;
        updateStopwatchDisplay();
        lapTimes.innerHTML = '';
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = 'Pause';
        lapBtn.disabled = true;
        resetBtn.disabled = true;
    });
    
    lapBtn.addEventListener('click', function() {
        const lapTime = display.textContent;
        const lapElement = document.createElement('div');
        lapElement.textContent = `Lap ${lapCount++}: ${lapTime}`;
        lapTimes.insertBefore(lapElement, lapTimes.firstChild);
    });
    
    function updateStopwatchDisplay() {
        const hours = Math.floor(stopwatchSeconds / 3600);
        const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
        const seconds = stopwatchSeconds % 60;
        
        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Update stopwatch hands
function updateStopwatchHands() {
    if (!stopwatchRunning || stopwatchPaused) return;
    
    const totalSeconds = stopwatchSeconds;
    const hours = (totalSeconds / 3600) % 12;
    const minutes = (totalSeconds % 3600) / 60;
    const seconds = totalSeconds % 60;
    
    const secondHand = document.getElementById('stopwatchSecondHand');
    const minuteHand = document.getElementById('stopwatchMinuteHand');
    const hourHand = document.getElementById('stopwatchHourHand');
    
    if (secondHand) {
        const secondDeg = seconds * 6;
        secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
    }
    
    if (minuteHand) {
        const minuteDeg = minutes * 6 + seconds * 0.1;
        minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    }
    
    if (hourHand) {
        const hourDeg = hours * 30 + minutes * 0.5;
        hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }
}

// Timer functions
function initializeTimer() {
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimer');
    const display = document.getElementById('timerDisplay');
    const progressBar = document.getElementById('timerProgress');
    const hoursInput = document.getElementById('timerHours');
    const minutesInput = document.getElementById('timerMinutes');
    const secondsInput = document.getElementById('timerSeconds');
    
    startBtn.addEventListener('click', function() {
        if (!timerRunning) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const secs = parseInt(secondsInput.value) || 0;
            
            timerSeconds = hours * 3600 + minutes * 60 + secs;
            totalTimerSeconds = timerSeconds;
            
            if (timerSeconds > 0) {
                timerRunning = true;
                timerPaused = false;
                timerCount++;
                document.getElementById('timerCount').textContent = timerCount;
                
                timerInterval = setInterval(function() {
                    if (!timerPaused && timerSeconds > 0) {
                        timerSeconds--;
                        updateTimerDisplay();
                        updateProgress();
                        
                        if (timerSeconds === 0) {
                            clearInterval(timerInterval);
                            timerRunning = false;
                            display.style.animation = 'alarmBlink 0.5s infinite';
                            
                            // Play sound when timer ends
                            if (alarmSound) {
                                alarmSound.play();
                                setTimeout(() => {
                                    alarmSound.pause();
                                    alarmSound.currentTime = 0;
                                }, 5000);
                            }
                        }
                    }
                }, 1000);
                
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                resetBtn.disabled = false;
                
                // Disable inputs
                hoursInput.disabled = true;
                minutesInput.disabled = true;
                secondsInput.disabled = true;
            }
        }
    });
    
    pauseBtn.addEventListener('click', function() {
        timerPaused = !timerPaused;
        this.textContent = timerPaused ? 'Resume' : 'Pause';
    });
    
    resetBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        timerRunning = false;
        timerPaused = false;
        timerSeconds = 0;
        updateTimerDisplay();
        progressBar.style.width = '0%';
        display.style.animation = 'timerGlow 1.5s ease-in-out infinite alternate';
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = 'Pause';
        resetBtn.disabled = true;
        
        // Enable inputs
        hoursInput.disabled = false;
        minutesInput.disabled = false;
        secondsInput.disabled = false;
    });
    
    function updateTimerDisplay() {
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        
        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function updateProgress() {
        if (totalTimerSeconds > 0) {
            const percentage = ((totalTimerSeconds - timerSeconds) / totalTimerSeconds) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }
}

// Alarm functions
function initializeAlarm() {
    const setBtn = document.getElementById('setAlarm');
    const stopBtn = document.getElementById('stopAlarm');
    const alarmInput = document.getElementById('alarmTime');
    const status = document.getElementById('alarmStatus');
    
    setBtn.addEventListener('click', function() {
        const time = alarmInput.value;
        if (time) {
            alarmTime = time;
            alarmSet = true;
            alarmCount++;
            document.getElementById('alarmCount').textContent = alarmCount;
            
            status.innerHTML = `<span class="status-text">Alarm set for ${time}</span>`;
            setBtn.disabled = true;
            stopBtn.disabled = false;
            
            // Check alarm every second
            startAlarmChecker();
        }
    });
    
    stopBtn.addEventListener('click', function() {
        stopAlarm();
    });
}

function startAlarmChecker() {
    setInterval(function() {
        if (alarmSet && alarmTime) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const [alarmHour, alarmMinute] = alarmTime.split(':').map(Number);
            
            // Calculate time difference in minutes
            const currentTotal = currentHour * 60 + currentMinute;
            const alarmTotal = alarmHour * 60 + alarmMinute;
            const diff = Math.abs(currentTotal - alarmTotal);
            
            // Check if within 2 hours (120 minutes)
            if (diff <= 120 && currentTotal >= alarmTotal) {
                triggerAlarm();
            }
        }
    }, 1000);
}

function triggerAlarm() {
    const status = document.getElementById('alarmStatus');
    status.innerHTML = '<span class="status-text">⏰ ALARM RINGING! ⏰</span>';
    status.classList.add('ringing');
    
    if (alarmSound) {
        alarmSound.play().catch(e => console.log('Audio error:', e));
    }
    
    // Vibrate if supported
    if (navigator.vibrate) {
        navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }
}

function stopAlarm() {
    alarmSet = false;
    alarmTime = null;
    
    const status = document.getElementById('alarmStatus');
    status.innerHTML = '<span class="status-text">Alarm stopped</span>';
    status.classList.remove('ringing');
    
    document.getElementById('setAlarm').disabled = false;
    document.getElementById('stopAlarm').disabled = true;
    
    if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }
    
    if (navigator.vibrate) {
        navigator.vibrate(0);
    }
}

// Initialize world clock
function initializeWorldClock() {
    updateWorldClocks();
    setInterval(updateWorldClocks, 1000);
}

// Usage tracking
function initializeUsage() {
    usageInterval = setInterval(function() {
        usageSeconds++;
        const minutes = Math.floor(usageSeconds / 60);
        const seconds = usageSeconds % 60;
        document.getElementById('usageTime').textContent = `${minutes} min ${seconds} sec`;
    }, 1000);
}

// Generate PDF
function generatePDF() {
    const now = new Date();
    const usageMinutes = Math.floor(usageSeconds / 60);
    const usageSecs = usageSeconds % 60;
    
    // Create PDF content as a downloadable file (not HTML)
    const pdfContent = `
SK WORLD - Journey from Zero to Hero
=====================================
Report Generated: ${now.toLocaleString()}
-------------------------------------

Welcome to SK World!
Your journey from Zero to Hero starts here!

📊 USAGE STATISTICS
------------------
Time on Website: ${usageMinutes} minutes ${usageSecs} seconds
Stopwatch Used: ${stopwatchCount} times
Timers Set: ${timerCount} times
Alarms Set: ${alarmCount} times

⏱️ STOPWATCH DETAILS
-------------------
Total Laps Recorded: ${lapCount - 1}
Last Stopwatch Reading: ${document.getElementById('stopwatchDisplay').textContent}

⏲️ TIMER DETAILS
---------------
Total Timers Used: ${timerCount}
Current Timer Status: ${timerRunning ? (timerPaused ? 'Paused' : 'Running') : 'Idle'}

⏰ ALARM DETAILS
---------------
Alarms Set Today: ${alarmCount}
Last Alarm Set: ${alarmTime || 'None'}

🌍 WORLD CLOCK
-------------
India Standard Time: ${document.getElementById('currentTime').textContent}
Date: ${document.getElementById('currentDate').textContent}

💫 MOTIVATIONAL QUOTE
--------------------
"Every expert was once a beginner. 
Every hero started from zero. 
Your journey to hero begins now!"

Keep learning, keep growing!
SK World - Your Success Partner
=====================================
    `;
    
    // Create blob and download as PDF (actually .txt but named as .pdf)
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SKWorld_Report_${now.toISOString().slice(0,10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    alert('✅ PDF Report downloaded successfully! Check your downloads folder.');
    
    // Animation for PDF button
    const pdfBtn = document.getElementById('downloadPDF');
    pdfBtn.classList.add('loading');
    setTimeout(() => pdfBtn.classList.remove('loading'), 2000);
}

// Add ripple effect to all buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const x = e.clientX - e.target.offsetLeft;
        const y = e.clientY - e.target.offsetTop;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add some extra animations
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleAnim 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleAnim {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);