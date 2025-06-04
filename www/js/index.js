/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

// JavaScript extrait de index.html
// ... (voir contenu du <script> dans index.html)

// Variables globales
let timerInterval;
let currentTime = 0;
let isRunning = false;
let hiitInterval;
let hiitCurrentRound = 0;
let hiitPhase = 'work'; // 'work' ou 'rest'
let hiitTimeLeft = 0;

// Gestion des phases
function showPhase(phaseId) {
    // Masquer toutes les sections
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Activer la section sélectionnée
    document.getElementById(phaseId).classList.add('active');
    
    // Activer le bouton correspondant
    document.querySelector(`[onclick="showPhase('${phaseId}')"]`).classList.add('active');
    
    // Gestion spéciale pour la navigation bottom
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.onclick && item.onclick.toString().includes(phaseId)) {
            item.classList.add('active');
        }
    });
}

// Gestion des semaines
function toggleWeek(weekId) {
    const weekContent = document.getElementById(weekId);
    const weekHeader = weekContent.previousElementSibling;
    
    if (weekContent.classList.contains('active')) {
        weekContent.classList.remove('active');
        weekHeader.classList.remove('active');
    } else {
        weekContent.classList.add('active');
        weekHeader.classList.add('active');
    }
}

// Timer functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    document.getElementById('timerDisplay').textContent = formatTime(currentTime);
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            currentTime++;
            updateDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    currentTime = 0;
    updateDisplay();
}

function setTimer(seconds) {
    resetTimer();
    currentTime = seconds;
    updateDisplay();
}

function startHIIT() {
    const workTime = parseInt(document.getElementById('workTime').value);
    const restTime = parseInt(document.getElementById('restTime').value);
    const rounds = parseInt(document.getElementById('rounds').value);
    
    hiitCurrentRound = 1;
    hiitPhase = 'work';
    hiitTimeLeft = workTime;
    
    document.getElementById('hiitStatus').innerHTML = `Round ${hiitCurrentRound}/${rounds} - TRAVAIL`;
    
    hiitInterval = setInterval(() => {
        hiitTimeLeft--;
        document.getElementById('timerDisplay').textContent = formatTime(hiitTimeLeft);
        
        if (hiitTimeLeft <= 0) {
            if (hiitPhase === 'work') {
                hiitPhase = 'rest';
                hiitTimeLeft = restTime;
                document.getElementById('hiitStatus').innerHTML = `Round ${hiitCurrentRound}/${rounds} - REPOS`;
                // Son de notification (si supporté)
                if ('vibrate' in navigator) navigator.vibrate(200);
            } else {
                hiitCurrentRound++;
                if (hiitCurrentRound <= rounds) {
                    hiitPhase = 'work';
                    hiitTimeLeft = workTime;
                    document.getElementById('hiitStatus').innerHTML = `Round ${hiitCurrentRound}/${rounds} - TRAVAIL`;
                    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
                } else {
                    clearInterval(hiitInterval);
                    document.getElementById('hiitStatus').innerHTML = `🎉 HIIT TERMINÉ ! Excellent travail !`;
                    document.getElementById('timerDisplay').textContent = '00:00';
                    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 200]);
                }
            }
        }
    }, 1000);
}

function quickTimer() {
    setTimer(60);
    startTimer();
}

// Progress functions
function toggleGoal(element) {
    element.classList.toggle('checked');
    updateProgress();
}

function updateProgress() {
    const checkedGoals = document.querySelectorAll('.checkmark.checked').length;
    const totalGoals = document.querySelectorAll('.checkmark').length;
    const progress = Math.round((checkedGoals / totalGoals) * 100);
    
    document.getElementById('overallProgress').textContent = progress + '%';
    document.getElementById('overallProgressBar').style.width = progress + '%';
}

function savePerformance() {
    const sprint = document.getElementById('sprint10m').value;
    const squat = document.getElementById('squatMax').value;
    const bench = document.getElementById('benchMax').value;
    const jump = document.getElementById('verticalJump').value;
    
    // Dans une vraie app, on sauvegarderait dans localStorage ou une base de données
    alert('Performance sauvegardée ! 💪');
}

// Service Worker pour fonctionnement hors ligne
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:application/javascript;base64,Ly8gU2VydmljZSBXb3JrZXIgcG91ciBmb25jdGlvbm5lbWVudCBob3JzIGxpZ25lCmNvbnN0IENBQ0hFX05BTUUgPSAncnVnYnktdHJhaW5pbmctdjEnOwpjb25zdCB1cmxzVG9DYWNoZSA9IFsKICAnLycsCiAgJy9pbmRleC5odG1sJwpdOwoKLy8gSW5zdGFsbGF0aW9uIGR1IFNlcnZpY2UgV29ya2VyCnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsIGV2ZW50ID0+IHsKICBldmVudC53YWl0VW50aWwoCiAgICBjYWNoZXMub3BlbihDQUNIRV9OQU1FKQogICAgICAudGhlbihjYWNoZSA9PiB7CiAgICAgICAgcmV0dXJuIGNhY2hlLmFkZEFsbCh1cmxzVG9DYWNoZSk7CiAgICAgIH0pCiAgKTsKfSk7CgovLyBJbnRlcmNlcHRpb24gZGVzIHJlcXXDqnRlcwpzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2ZldGNoJywgZXZlbnQgPT4gewogIGV2ZW50LnJlc3BvbmRXaXRoKAogICAgY2FjaGVzLm1hdGNoKGV2ZW50LnJlcXVlc3QpCiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHsKICAgICAgICAvLyBSZXRvdXJuZSBsYSByZXNzb3VyY2UgZW4gY2FjaGUgc2kgZWxsZSBleGlzdGUKICAgICAgICBpZiAocmVzcG9uc2UpIHsKICAgICAgICAgIHJldHVybiByZXNwb25zZTsKICAgICAgICB9CiAgICAgICAgLy8gU2lub24sIGVzc2FpZSBkZSBsYSByZWNoYXJnZXIgZGVwdWlzIGxlIHLDqXNlYXUKICAgICAgICByZXR1cm4gZmV0Y2goZXZlbnQucmVxdWVzdCk7CiAgICAgIH0pCiAgKTsKfSk7')
        .then(() => console.log('Service Worker enregistré'))
        .catch(err => console.log('Erreur Service Worker:', err));
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    updateProgress();
});

// Gestion du swipe pour mobile
let startX, startY, distX, distY;
const threshold = 150;
const restraint = 100;

document.addEventListener('touchstart', function(e) {
    startX = e.changedTouches[0].pageX;
    startY = e.changedTouches[0].pageY;
});

document.addEventListener('touchend', function(e) {
    distX = e.changedTouches[0].pageX - startX;
    distY = e.changedTouches[0].pageY - startY;
    
    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        const phases = ['phase1', 'phase2', 'phase3', 'nutrition', 'timer', 'progress', 'bonus'];
        const currentPhase = document.querySelector('.content.active').id;
        const currentIndex = phases.indexOf(currentPhase);
        
        if (distX > 0 && currentIndex > 0) {
            // Swipe right - phase précédente
            showPhase(phases[currentIndex - 1]);
        } else if (distX < 0 && currentIndex < phases.length - 1) {
            // Swipe left - phase suivante
            showPhase(phases[currentIndex + 1]);
        }
    }
});

// --- AUTHENTIFICATION FIREBASE ---
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = '';
    document.querySelector('.header').style.display = '';
    document.querySelectorAll('.content, .bottom-nav, .quick-access').forEach(e => e.style.display = '');
  } else {
    document.getElementById('auth-section').style.display = '';
    document.getElementById('logout-btn').style.display = 'none';
    document.querySelector('.header').style.display = 'none';
    document.querySelectorAll('.content, .bottom-nav, .quick-access').forEach(e => e.style.display = 'none');
  }
});

window.login = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(e => document.getElementById('auth-error').innerText = e.message);
}

window.signup = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(e => document.getElementById('auth-error').innerText = e.message);
}
