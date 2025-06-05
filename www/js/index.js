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

const MAIN_COLORS = [
  '#ff4757', '#1e90ff', '#00b894', '#fdcb6e', '#6c5ce7', '#e17055', '#636e72', '#00cec9'
];
const SECONDARY_COLORS = [
  '#ffc312', '#0984e3', '#00b894', '#fab1a0', '#a29bfe', '#fd79a8', '#b2bec3', '#81ecec'
];

const LANGS = {
  fr: {
    appName: 'RugbyPrep',
    loginTitle: 'Connexion',
    email: 'Email',
    password: 'Mot de passe',
    login: 'Connexion',
    signup: 'Créer un compte',
    error: 'Erreur de connexion',
  },
  en: {
    appName: 'RugbyPrep',
    loginTitle: 'Sign in',
    email: 'Email',
    password: 'Password',
    login: 'Sign in',
    signup: 'Create account',
    error: 'Login error',
  }
};

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
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) {
        timerEl.textContent = formatTime(currentTime);
    }
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
  // Patch sécurité : masquer tout le programme par défaut
  document.querySelectorAll('.content, .header, .bottom-nav, .quick-access, .phase-selector').forEach(e => {
    if (e) e.style.display = 'none';
  });
  // Appliquer la couleur personnalisée si présente
  const color = localStorage.getItem('mainColor');
  const secondaryColor = localStorage.getItem('secondaryColor');
  const textColor = localStorage.getItem('mainTextColor');
  if (color) {
    document.documentElement.style.setProperty('--main-color', color);
  }
  if (secondaryColor) {
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  }
  if (textColor) {
    document.documentElement.style.setProperty('--main-text-color', textColor);
  }
  updateDisplay();
  updateProgress();

  // Palette de couleurs personnalisées
  createColorPalette('main-color-palette', MAIN_COLORS, 'main-color');
  createColorPalette('secondary-color-palette', SECONDARY_COLORS, 'secondary-color');

  // Langue
  let lang = localStorage.getItem('lang') || 'fr';
  applyLang(lang);
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
  const authSection = document.getElementById('auth-section');
  const logoutBtn = document.getElementById('logout-btn');
  const header = document.querySelector('.header');
  const contents = document.querySelectorAll('.content, .bottom-nav, .quick-access, .phase-selector');
  const langSwitch = document.getElementById('lang-switch');
  const customizeSection = document.getElementById('customize-section');
  const uid = user ? user.uid : null;
  if (user) {
    if (uid && !localStorage.getItem('profileSet_' + uid)) {
      // Afficher uniquement le formulaire de personnalisation
      if (authSection) authSection.style.display = 'none';
      if (customizeSection) customizeSection.style.display = '';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (header) header.style.display = 'none';
      contents.forEach(e => { if (e) e.style.display = 'none'; });
      if (langSwitch) langSwitch.style.display = 'none';
    } else {
      // Afficher l'app principale
      if (authSection) authSection.style.display = 'none';
      if (customizeSection) customizeSection.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = '';
      if (header) header.style.display = '';
      contents.forEach(e => { if (e) e.style.display = ''; });
      if (langSwitch) langSwitch.style.display = 'none';
    }
  } else {
    // Afficher uniquement le formulaire d'auth
    if (authSection) authSection.style.display = '';
    if (customizeSection) customizeSection.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (header) header.style.display = 'none';
    contents.forEach(e => { if (e) e.style.display = 'none'; });
    if (langSwitch) langSwitch.style.display = '';
  }
});

window.login = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('auth-section').style.display = 'none';
    })
    .catch(e => document.getElementById('auth-error').innerText = e.message);
}

window.signup = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      // On ne fait rien ici, on laisse onAuthStateChanged gérer l'affichage
    })
    .catch(e => document.getElementById('auth-error').innerText = e.message);
}

function getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace('#', '');
    if (hexcolor.length === 3) {
        hexcolor = hexcolor.split('').map(x => x + x).join('');
    }
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#111' : '#fff';
}

window.validateCustomization = function() {
  const username = document.getElementById('username').value;
  const age = parseInt(document.getElementById('age').value, 10);
  const height = parseInt(document.getElementById('height').value, 10);
  const weight = parseInt(document.getElementById('weight').value, 10);
  const position = document.getElementById('position').value;
  const level = document.getElementById('level').value;
  const goal = document.getElementById('goal').value;
  const color = document.getElementById('main-color').value;
  const secondaryColor = document.getElementById('secondary-color').value;
  const textColor = getContrastYIQ(color);

  // Calcul des sous-scores
  let profil = {
    force: 0,
    puissance: 0,
    vitesse: 0,
    endurance: 0,
    mobilite: 0,
    prevention: 0
  };
  // Niveau
  if (level === 'Pro') {
    profil.force += 3; profil.puissance += 3; profil.vitesse += 3; profil.endurance += 2;
  } else if (level === 'Nationale') {
    profil.force += 2; profil.puissance += 2; profil.vitesse += 2; profil.endurance += 2;
  } else if (level === 'Fédérale') {
    profil.force += 2; profil.puissance += 1; profil.vitesse += 1; profil.endurance += 2;
  } else if (level === 'Régionale') {
    profil.force += 1; profil.puissance += 1; profil.vitesse += 1; profil.endurance += 1;
  }
  // Poste
  if (position === 'pilier' || position === 'talonneur') {
    profil.force += 2; profil.puissance += 1; profil.mobilite -= 1; profil.prevention += 1;
  } else if (position === '2e ligne') {
    profil.force += 1; profil.puissance += 2; profil.endurance += 1;
  } else if (position === '3e ligne') {
    profil.endurance += 2; profil.vitesse += 1; profil.puissance += 1; profil.mobilite += 1;
  } else if (position === 'mêlée' || position === 'ouvreur') {
    profil.vitesse += 2; profil.mobilite += 1;
  } else if (position === 'centre') {
    profil.puissance += 2; profil.vitesse += 1;
  } else if (position === 'ailier' || position === 'arrière') {
    profil.vitesse += 2; profil.endurance += 1;
  }
  // Age
  if (age >= 30) {
    profil.prevention += 2; profil.mobilite -= 1;
  } else if (age < 20) {
    profil.mobilite += 1; profil.puissance += 1;
  }
  // Poids
  if (weight < 80) {
    profil.force -= 1; profil.puissance -= 1;
  } else if (weight > 100) {
    profil.mobilite -= 1; profil.prevention += 1;
  }
  // Objectif principal
  if (goal === 'force') profil.force += 2;
  if (goal === 'puissance') profil.puissance += 2;
  if (goal === 'vitesse') profil.vitesse += 2;
  if (goal === 'endurance') profil.endurance += 2;
  if (goal === 'polyvalence') { profil.force += 1; profil.puissance += 1; profil.vitesse += 1; profil.endurance += 1; profil.mobilite += 1; }

  // Stockage local (à remplacer par Firestore plus tard)
  localStorage.setItem('username', username);
  localStorage.setItem('age', age);
  localStorage.setItem('height', height);
  localStorage.setItem('weight', weight);
  localStorage.setItem('position', position);
  localStorage.setItem('level', level);
  localStorage.setItem('goal', goal);
  localStorage.setItem('mainColor', color);
  localStorage.setItem('secondaryColor', secondaryColor);
  localStorage.setItem('mainTextColor', textColor);
  localStorage.setItem('profilScores', JSON.stringify(profil));
  const user = firebase.auth().currentUser;
  if (user) {
    localStorage.setItem('profileSet_' + user.uid, '1');
  }
  // Appliquer la couleur principale et la couleur de texte
  document.documentElement.style.setProperty('--main-color', color);
  document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  document.documentElement.style.setProperty('--main-text-color', textColor);
  // Masquer la personnalisation et afficher l'app principale
  document.getElementById('customize-section').style.display = 'none';
  document.querySelector('.header').style.display = '';
  document.querySelectorAll('.content, .bottom-nav, .quick-access').forEach(e => e.style.display = '');
}

function getProfilAxeFaible() {
  const profil = JSON.parse(localStorage.getItem('profilScores') || '{}');
  let min = Infinity;
  let axe = 'force';
  for (const k in profil) {
    if (profil[k] < min) { min = profil[k]; axe = k; }
  }
  return axe;
}

function createColorPalette(paletteId, colors, selectedId) {
  const palette = document.getElementById(paletteId);
  if (!palette) return;
  palette.innerHTML = '';
  colors.forEach((color, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.style.background = color;
    btn.style.width = '36px';
    btn.style.height = '36px';
    btn.style.border = '2px solid #fff';
    btn.style.borderRadius = '50%';
    btn.style.cursor = 'pointer';
    btn.style.outline = 'none';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    btn.setAttribute('data-color', color);
    btn.setAttribute('aria-label', color);
    btn.onclick = function() {
      document.querySelectorAll(`#${paletteId} button`).forEach(b => b.style.border = '2px solid #fff');
      btn.style.border = '3px solid #222';
      document.getElementById(selectedId).value = color;
      // Aperçu couleur en temps réel
      if (selectedId === 'main-color') {
        document.documentElement.style.setProperty('--main-color', color);
        document.documentElement.style.setProperty('--main-text-color', getContrastYIQ(color));
      } else if (selectedId === 'secondary-color') {
        document.documentElement.style.setProperty('--secondary-color', color);
      }
    };
    if (idx === 0) btn.style.border = '3px solid #222';
    palette.appendChild(btn);
  });
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyLang(lang);
}

function applyLang(lang) {
  const t = LANGS[lang] || LANGS.fr;
  const authSection = document.getElementById('auth-section');
  if (!authSection) return;
  authSection.querySelector('h1').textContent = t.appName;
  authSection.querySelector('h2').textContent = t.loginTitle;
  document.getElementById('email').placeholder = t.email;
  document.getElementById('password').placeholder = t.password;
  const btns = authSection.querySelectorAll('button');
  if (btns[0]) btns[0].textContent = t.login;
  if (btns[1]) btns[1].textContent = t.signup;
}

// --- LOGIQUE FORMULAIRE DE PERSONNALISATION ---
function showCustomizeForm() {
  document.getElementById('customize-section').style.display = '';
  if (document.querySelector('.header')) document.querySelector('.header').style.display = 'none';
  document.querySelectorAll('.content, .bottom-nav, .quick-access, .phase-selector').forEach(e => e.style.display = 'none');
  // Masquer le formulaire d'inscription/connexion
  if (document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
  // Masquer les drapeaux de langue
  if (document.getElementById('lang-switch')) document.getElementById('lang-switch').style.display = 'none';
}

function hideCustomizeForm() {
  document.getElementById('customize-section').style.display = 'none';
  if (document.querySelector('.header')) document.querySelector('.header').style.display = '';
  document.querySelectorAll('.content, .bottom-nav, .quick-access, .phase-selector').forEach(e => e.style.display = '');
  // Afficher les drapeaux de langue uniquement si pas connecté (géré dans onAuthStateChanged)
}

function applyProfileColors() {
  const color = localStorage.getItem('mainColor');
  const secondaryColor = localStorage.getItem('secondaryColor');
  const textColor = localStorage.getItem('mainTextColor');
  if (color) document.documentElement.style.setProperty('--main-color', color);
  if (secondaryColor) document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  if (textColor) document.documentElement.style.setProperty('--main-text-color', textColor);
}

// À la connexion, applique les couleurs si déjà personnalisées
window.addEventListener('DOMContentLoaded', function() {
  applyProfileColors();
  // Génère les palettes si le formulaire est visible au chargement
  if (document.getElementById('customize-section').style.display !== 'none') {
    createColorPalette('main-color-palette', MAIN_COLORS, 'main-color');
    createColorPalette('secondary-color-palette', SECONDARY_COLORS, 'secondary-color');
  }
});

// (Optionnel) Fonction pour réinitialiser le profil
window.resetProfile = function() {
  localStorage.removeItem('profileSet');
  // Tu peux aussi retirer les autres infos si besoin
  showCustomizeForm();
};

function getProfileSummary() {
  const username = localStorage.getItem('username') || '';
  const age = parseInt(localStorage.getItem('age') || '0', 10);
  const height = parseInt(localStorage.getItem('height') || '0', 10);
  const weight = parseInt(localStorage.getItem('weight') || '0', 10);
  const position = localStorage.getItem('position') || '';
  const level = localStorage.getItem('level') || '';
  let focus = [];
  let recommandations = [];

  // Logique d'adaptation
  // Niveau
  if (level === 'Pro') {
    focus.push('Performance maximale', 'Optimisation de la récupération', 'Prévention des blessures avancée');
    recommandations.push('Volume et intensité élevés, suivi précis de la charge, individualisation fine.');
  } else if (level === 'Nationale') {
    focus.push('Développement de la puissance', 'Endurance spécifique', 'Technique avancée');
    recommandations.push('3-4 séances S&C/semaine, accent sur la polyvalence et la récupération.');
  } else if (level === 'Fédérale') {
    focus.push('Force fonctionnelle', 'Prévention des blessures', 'Endurance générale');
    recommandations.push('2-3 séances S&C/semaine, accent sur la technique et la mobilité.');
  } else if (level === 'Régionale') {
    focus.push('Condition physique générale', 'Sécurité et technique', 'Progression régulière');
    recommandations.push('1-2 séances S&C/semaine, accent sur la régularité et la sécurité.');
  }

  // Âge
  if (age >= 30) {
    focus.push('Récupération', 'Mobilité', 'Prévention des blessures');
    recommandations.push('Privilégier la qualité à la quantité, bien gérer la récupération.');
  } else if (age < 20) {
    focus.push('Développement global', 'Apprentissage technique');
    recommandations.push('Accent sur la progression, éviter la spécialisation précoce.');
  }

  // Poids/taille pour 3e ligne
  if (position === '3e ligne') {
    if (weight < 90) {
      focus.push('Prise de force/masse', 'Puissance');
      recommandations.push('Inclure des exercices de force max, alimentation adaptée.');
    } else if (weight > 100) {
      focus.push('Mobilité', 'Vitesse');
      recommandations.push('Accent sur la mobilité, la vitesse et la prévention des blessures.');
    } else {
      focus.push('Polyvalence', 'Endurance spécifique');
      recommandations.push('Maintenir un bon équilibre force/vitesse/endurance.');
    }
  }

  // Poste
  if (position === 'pilier' || position === 'talonneur') {
    focus.push('Force maximale', 'Stabilité', 'Prévention blessures épaules/cou');
  } else if (position === '2e ligne') {
    focus.push('Puissance', 'Sauts', 'Endurance');
  } else if (position === 'mêlée' || position === 'ouvreur') {
    focus.push('Vitesse d\'exécution', 'Agilité', 'Prise de décision');
  } else if (position === 'centre') {
    focus.push('Puissance', 'Vitesse', 'Défense individuelle');
  } else if (position === 'ailier' || position === 'arrière') {
    focus.push('Vitesse pure', 'Agilité', 'Relances');
  }

  // Message personnalisé avec contraste lisible
  let msg = '<div class="profile-summary" style="background:#fff9c4;border:1px solid #ffe082;padding:14px 20px;border-radius:10px;margin-bottom:18px;color:#222;font-size:1.05em;box-shadow:0 2px 8px rgba(0,0,0,0.04);">' +
    '<b>Profil détecté :</b> ' + (username ? username + ', ' : '') + (age ? age + ' ans, ' : '') + (height ? height + 'cm, ' : '') + (weight ? weight + 'kg, ' : '') + (position ? position + ', ' : '') + level + '<br>' +
    '<b>Focus du programme :</b> ' + focus.join(', ') + '<br>' +
    '<b>Recommandations :</b> ' + recommandations.join(' ') +
    '</div>';
  return msg;
}

function adaptProgrammeToProfile() {
  const axe = getProfilAxeFaible();
  const jours = [
    'lundi-lower-body',
    'mardi-mental',
    'mercredi-upper-body',
    'jeudi-recup',
    'vendredi-skills'
  ];
  jours.forEach(jourId => {
    const card = document.getElementById(jourId);
    if (!card) return;
    // Masquer toutes les variantes
    card.querySelectorAll('.exercise-item.variante-force, .exercise-item.variante-puissance, .exercise-item.variante-vitesse, .exercise-item.variante-endurance, .exercise-item.variante-mobilite, .exercise-item.variante-prevention').forEach(item => {
      item.style.display = 'none';
    });
    // Afficher la bonne variante selon l'axe faible
    const variante = card.querySelector('.variante-' + axe);
    if (variante) variante.style.display = '';
    // Afficher les autres exercices du jour
    card.querySelectorAll('.exercise-item:not(.variante-force):not(.variante-puissance):not(.variante-vitesse):not(.variante-endurance):not(.variante-mobilite):not(.variante-prevention)').forEach(item => {
      item.style.display = '';
    });
  });
}

function displayProfileSummary() {
  const header = document.querySelector('.header');
  if (!header) return;
  // Supprime l'ancien résumé s'il existe
  const old = document.querySelector('.profile-summary');
  if (old) old.remove();
  // Ajoute le nouveau résumé
  header.insertAdjacentHTML('afterend', getProfileSummary());
  // Adapte le programme selon le profil
  adaptProgrammeToProfile();
}

// Affiche le résumé à chaque affichage de l'app principale
firebase.auth().onAuthStateChanged(function(user) {
  const uid = user ? user.uid : null;
  if (user) {
    if (!(uid && !localStorage.getItem('profileSet_' + uid))) {
      // Afficher l'app principale
      setTimeout(displayProfileSummary, 200); // Laisse le temps au DOM d'afficher le header
    }
  }
});
