// ============================================
// SENTINEL - VISHING DETECTION SYSTEM
// ============================================

// Configuration
const GEMINI_API_KEY = 'AIzaSyDhDKz8SBO1hwIJ1VGAL508C8iLdPg25QM';

// Scam Detection Patterns
const PATTERNS = {
    auth: {
        kw: ['rbi', 'income tax', 'irs', 'police', 'officer', 'government', 'bank manager', 'fraud department'],
        w: 30,
        m: '👮 Authority Impersonation'
    },
    urgent: {
        kw: ['immediately', 'urgent', 'emergency', 'deadline', 'hurry', 'act fast', 'right now'],
        w: 15,
        m: '⚡ Urgency Pressure'
    },
    creds: {
        kw: ['otp', 'pin', 'cvv', 'password', 'ssn', 'social security', 'card number', 'account number'],
        w: 40,
        m: '🔐 Credential Request'
    },
    threat: {
        kw: ['blocked', 'suspended', 'legal action', 'arrest', 'frozen', 'penalty', 'fine'],
        w: 25,
        m: '⚠️ Financial Threats'
    },
    payment: {
        kw: ['gift card', 'wire transfer', 'bitcoin', 'google pay', 'send money'],
        w: 35,
        m: '💳 Payment Request'
    },
    remote: {
        kw: ['teamviewer', 'anydesk', 'remote', 'download', 'screen share'],
        w: 35,
        m: '🖥️ Remote Access'
    }
};

// State Variables
let listening = false;
let startTime = null;
let interval = null;
let transcript = '';
let score = 0;
let recognition = null;
let alerts = [];
let aiTimeout = null;

// ============================================
// CORE DETECTION FUNCTION
// ============================================
function detectScam(text) {
    let totalScore = 0;
    let triggers = [];
    
    for (let pattern in PATTERNS) {
        const p = PATTERNS[pattern];
        if (p.kw.some(keyword => text.toLowerCase().includes(keyword))) {
            totalScore += p.w;
            triggers.push(p.m);
        }
    }
    
    totalScore = Math.min(100, totalScore);
    let verdict = totalScore >= 70 ? 'High Risk' : totalScore >= 35 ? 'Suspicious' : 'Safe';
    
    return {
        score: totalScore,
        verdict: verdict,
        triggers: [...new Set(triggers)]
    };
}

// ============================================
// UI UPDATE FUNCTION
// ============================================
function updateUI(result) {
    score = result.score;
    
    // Update risk display
    document.getElementById('riskPercent').textContent = result.score + '%';
    document.getElementById('verdict').textContent = result.verdict;
    document.getElementById('riskBar').style.width = result.score + '%';
    
    // Color coding
    let color, barGradient;
    if (result.score >= 70) {
        color = 'text-red-400';
        barGradient = 'from-red-500 to-red-600';
        document.getElementById('warning').classList.remove('hidden');
        document.getElementById('riskMeter').classList.add('danger-pulse');
        playAlert();
    } else if (result.score >= 35) {
        color = 'text-yellow-400';
        barGradient = 'from-yellow-500 to-yellow-600';
        document.getElementById('warning').classList.add('hidden');
        document.getElementById('riskMeter').classList.remove('danger-pulse');
    } else {
        color = 'text-green-400';
        barGradient = 'from-green-500 to-green-600';
        document.getElementById('warning').classList.add('hidden');
        document.getElementById('riskMeter').classList.remove('danger-pulse');
    }
    
    document.getElementById('riskPercent').className = 'text-3xl font-bold ' + color;
    document.getElementById('verdict').className = 'text-lg font-bold ' + color;
    document.getElementById('riskBar').className = 'h-full bg-gradient-to-r ' + barGradient + ' transition-all duration-500';
    
    // Update alerts
    if (result.triggers.length > 0) {
        document.getElementById('alertsBox').classList.remove('hidden');
        result.triggers.forEach(alert => {
            if (!alerts.includes(alert)) {
                alerts.push(alert);
                let div = document.createElement('div');
                div.className = 'bg-red-900/30 border border-red-500 rounded-lg p-3';
                div.innerHTML = '<p class="text-red-200 font-semibold">' + alert + '</p>';
                document.getElementById('alertsList').appendChild(div);
            }
        });
    }
}

// ============================================
// GEMINI AI ANALYSIS
// ============================================
async function analyzeWithAI(text) {
    if (!GEMINI_API_KEY || text.length < 50) return;
    
    try {
        document.getElementById('aiAnalyzing').classList.remove('hidden');
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze this phone conversation for vishing scam indicators. Brief analysis under 100 words: "${text}"`
                        }]
                    }]
                })
            }
        );
        
        if (response.ok) {
            const data = await response.json();
            const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'N/A';
            document.getElementById('aiBox').classList.remove('hidden');
            document.getElementById('aiContent').textContent = analysis;
        }
    } catch (error) {
        console.error('AI analysis failed:', error);
    } finally {
        document.getElementById('aiAnalyzing').classList.add('hidden');
    }
}

// ============================================
// SPEECH RECOGNITION
// ============================================
function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert('Speech recognition not supported. Use Chrome or Edge.');
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        listening = true;
        startTime = Date.now();
        
        // Update duration every second
        interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('duration').textContent = 
                `Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
        
        // Update UI
        document.getElementById('statusDot').className = 'w-4 h-4 rounded-full bg-green-500 animate-pulse';
        document.getElementById('statusText').textContent = 'Listening...';
        document.getElementById('micStatus').textContent = '🎤 Monitoring';
        document.getElementById('emergencyBtn').disabled = false;
    };
    
    recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            }
        }
        
        if (finalTranscript) {
            transcript += finalTranscript;
            document.getElementById('transcript').textContent = transcript;
            document.getElementById('transcript').className = 'text-slate-300';
            
            // Analyze in real-time
            const result = detectScam(transcript);
            updateUI(result);
            
            // Trigger AI analysis (debounced)
            if (transcript.length >= 50) {
                clearTimeout(aiTimeout);
                aiTimeout = setTimeout(() => analyzeWithAI(transcript), 5000);
            }
        }
    };
    
    recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
            document.getElementById('micStatus').textContent = `⚠️ Error: ${event.error}`;
        }
    };
    
    recognition.onend = () => {
        if (listening) recognition.start();
    };
    
    recognition.start();
}

function stopRecording() {
    if (recognition) {
        listening = false;
        recognition.stop();
        recognition = null;
    }
    
    clearInterval(interval);
    clearTimeout(aiTimeout);
    
    document.getElementById('statusDot').className = 'w-4 h-4 rounded-full bg-gray-500';
    document.getElementById('statusText').textContent = 'Not listening';
    document.getElementById('micStatus').textContent = 'Click Start';
    document.getElementById('emergencyBtn').disabled = true;
    
    showSummary();
}

// ============================================
// CALL SUMMARY
// ============================================
function showSummary() {
    const duration = document.getElementById('duration').textContent.replace('Duration: ', '');
    
    document.getElementById('sumDur').textContent = duration;
    document.getElementById('sumThreats').textContent = alerts.length;
    
    let riskLevel = 'Low';
    let riskColor = 'text-green-400';
    let recommendation = 'No immediate threats detected.';
    
    if (score >= 60) {
        riskLevel = 'High';
        riskColor = 'text-red-400';
        recommendation = '⚠️ MULTIPLE SCAM INDICATORS. Do not provide information or payment.';
    } else if (score >= 30) {
        riskLevel = 'Medium';
        riskColor = 'text-yellow-400';
        recommendation = 'Some suspicious patterns. Verify caller through official channels.';
    }
    
    document.getElementById('sumRisk').textContent = riskLevel;
    document.getElementById('sumRisk').className = 'text-2xl font-bold ' + riskColor;
    document.getElementById('sumRec').textContent = recommendation;
    
    document.getElementById('summaryBox').classList.remove('hidden');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function playAlert() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.value = 0.3;
    
    osc.start();
    setTimeout(() => osc.stop(), 200);
}

function reset() {
    transcript = '';
    score = 0;
    alerts = [];
    
    document.getElementById('transcript').innerHTML = '<p class="text-slate-500 italic">Click Start</p>';
    document.getElementById('alertsList').innerHTML = '';
    document.getElementById('alertsBox').classList.add('hidden');
    document.getElementById('riskBar').style.width = '0%';
    document.getElementById('riskPercent').textContent = '0%';
    document.getElementById('verdict').textContent = 'Safe';
    document.getElementById('warning').classList.add('hidden');
    document.getElementById('aiBox').classList.add('hidden');
    document.getElementById('summaryBox').classList.add('hidden');
    document.getElementById('riskMeter').classList.remove('danger-pulse');
}

// ============================================
// EVENT LISTENERS
// ============================================
document.getElementById('toggleBtn').onclick = function() {
    if (this.textContent.includes('Start')) {
        startRecording();
        this.textContent = '🔇 Stop';
        this.className = 'flex-1 py-8 rounded-xl font-bold text-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800';
    } else {
        stopRecording();
        this.textContent = '🎤 Start';
        this.className = 'flex-1 py-8 rounded-xl font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800';
    }
};

document.getElementById('resetBtn').onclick = reset;

document.getElementById('demoBtn').onclick = () => {
    document.getElementById('demoSection').classList.toggle('hidden');
};

document.querySelectorAll('.demo').forEach(btn => {
    btn.onclick = () => {
        transcript = btn.dataset.text;
        document.getElementById('transcript').textContent = transcript;
        document.getElementById('transcript').className = 'text-slate-300';
        document.getElementById('demoSection').classList.add('hidden');
        
        const result = detectScam(transcript);
        updateUI(result);
        analyzeWithAI(transcript);
    };
});

document.getElementById('emergencyBtn').onclick = () => {
    const btn = document.getElementById('emergencyBtn');
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 500);
    
    if (confirm('🚨 End call and get help?')) {
        stopRecording();
        alert('✅ Call ended. Report to FTC.gov');
    }
};

document.getElementById('downloadBtn').onclick = () => {
    const report = `SENTINEL CALL ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY
Duration: ${document.getElementById('sumDur').textContent}
Threats: ${document.getElementById('sumThreats').textContent}
Risk: ${document.getElementById('sumRisk').textContent}

RECOMMENDATION
${document.getElementById('sumRec').textContent}

TRANSCRIPT
${transcript}

THREATS DETECTED
${alerts.join('\n')}

---
Sentinel - AI-Powered Call Protection`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
};
