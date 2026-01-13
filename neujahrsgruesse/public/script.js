// ===========================
// INTERNATIONALIZATION (i18n)
// ===========================

const translations = window.uiTranslations || {};

let currentLanguage = 'de';

/**
 * Change the current language
 */
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    // Dispatch event for other modules
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    updateUILanguage();
}

/**
 * Update all UI elements with current language
 */
function updateUILanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            // Use innerHTML instead of textContent to support formatting like <strong>
            // We also trim to avoid any accidental whitespace issues
            const translationText = translations[currentLanguage][key].trim();
            el.innerHTML = translationText;
        }
    });

    // Update placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            el.placeholder = translations[currentLanguage][key];
        }
    });

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLanguage);
    });
}

// ===========================
// TEXT GENERATION LOGIC
// ===========================


/**
 * Main function to generate a personalized New Year message using the SECURE BACKEND
 */
async function generateNewYearMessage(name, relation, info, tone) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                relation,
                info,
                tone,
                lang: currentLanguage
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.warn('API Warning:', data.error || response.statusText);
            throw new Error('API Request failed');
        }

        // Clean up Markdown-style formatting (e.g. **bold**)
        let cleanText = data.text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

        // Remove generic signatures if AI adds them despite instructions
        cleanText = cleanText.replace(/\n\s*[-–]?\s*(Dein Name|Dein Absender|Ihr Name|Your Name|\[.*?\])\s*$/i, '').trim();

        // Save to History (if function exists)
        if (typeof saveToHistory === 'function') {
            saveToHistory(cleanText, name, currentLanguage);
        }

        return cleanText;
    } catch (error) {
        return getLocalFallbackMessage(name, relation, info, tone);
    }
}


/**
 * Fallback function using original local logic
 */
function getLocalFallbackMessage(name, relation, info, tone) {
    const message = {
        greeting: getGreeting(name, relation, tone),
        body: getMessageBody(relation, info, tone),
        wishes: getWishes(relation, tone),
        closing: getClosing(relation, tone)
    };
    return `${message.greeting}\n\n${message.body}\n\n${message.wishes}\n\n${message.closing}`;
}


// ===========================
// GREETING GENERATORS
// ===========================
function getGreeting(name, relation, tone) {
    const greetings = {
        warm: [
            `Liebe/r ${name},`,
            `Mein/e liebe/r ${name},`,
            `Hallo ${name}, mein/e Liebe/r,`
        ],
        funny: [
            `Hey ${name}, du Rakete! 🚀`,
            `Yo ${name}!`,
            `Na ${name}, bereit für 2026?`
        ],
        formal: [
            `Sehr geehrte/r ${name},`,
            `Liebe/r ${name},`,
            `Guten Tag ${name},`
        ],
        poetic: [
            `${name}, wie die Sterne am Himmelszelt,`,
            `An ${name}, mit den besten Wünschen der Welt,`,
            `Für ${name}, zum Jahreswechsel gedacht,`
        ],
        short: [
            `Hey ${name}!`,
            `Hi ${name},`,
            `${name}!`
        ]
    };

    return randomChoice(greetings[tone]);
}

// ===========================
// MESSAGE BODY GENERATORS
// ===========================
function getMessageBody(relation, info, tone) {
    const bodies = {
        friend: {
            warm: [
                `Ein weiteres Jahr neigt sich dem Ende zu, und ich wollte Dir einfach sagen, wie dankbar ich bin, Dich in meinem Leben zu haben. ${info ? `Besonders ${info.toLowerCase()} wird mir immer in Erinnerung bleiben.` : 'Unsere Freundschaft bedeutet mir unglaublich viel.'} Auf ein fantastisches 2026 voller gemeinsamer Abenteuer!`,
                `Was für ein Jahr das war! ${info ? info + ' – ' : ''}Und ich bin so froh, dass wir es gemeinsam erlebt haben. Lass uns 2026 noch unvergesslicher machen!`
            ],
            funny: [
                `2025 ist vorbei, und wir haben es überlebt! 🎉 ${info ? `Vor allem ${info.toLowerCase()} war ja wild.` : 'Das allein ist schon ein Grund zum Feiern!'} Auf ein 2026, in dem wir noch mehr Unsinn zusammen anstellen!`,
                `Neues Jahr, neue Chancen, gleich tolle Freundschaft! ${info ? `${info} war legendär – ` : ''}Lass uns 2026 noch mehr Chaos und Spaß kreieren!`
            ],
            formal: [
                `Das Jahr 2025 geht zu Ende, und ich möchte die Gelegenheit nutzen, Dir für Deine Freundschaft zu danken. ${info ? info : 'Ich schätze unsere gemeinsame Zeit sehr.'} Auf ein erfolgreiches 2026!`
            ],
            poetic: [
                `Wie Funken im Silvesternacht-Wind, so tanzten unsere Wege durchs Jahr. ${info ? info + ' – ' : ''}Ein Leuchten, das niemals vergeht. Möge 2026 uns neue Sterne schenken.`,
                `In der Stille zwischen den Jahren, zwischen Gestern und Morgen, möchte ich Dir danken. ${info ? 'Für ' + info.toLowerCase() + ', ' : ''}Für Deine Freundschaft, für jeden Moment.`
            ],
            short: [
                `2025 war großartig mit Dir! ${info ? info : ''} Auf 2026! 🎊`,
                `Danke für 2025! ${info ? info + ' ' : ''}Freu mich auf 2026 mit Dir!`
            ]
        },
        romantic: {
            warm: [
                `Ein Jahr geht zu Ende, und mit Dir an meiner Seite war jeder Tag besonders. ${info ? info + ' – ' : ''}Du bist mein größtes Glück. Ich freue mich auf alles, was 2026 für uns bereithält.`,
                `365 Tage mit Dir, und jeder einzelne war ein Geschenk. ${info ? 'Besonders ' + info.toLowerCase() + ' zeigt mir immer wieder, ' : ''}Wie besonders Du bist. Auf unser gemeinsames 2026, mein Schatz!`
            ],
            funny: [
                `Ein Jahr älter, aber Du wirst nur besser! 😏 ${info ? info + ' ' : ''}2026 wird unser Jahr – mehr Liebe, mehr Lachen, mehr von uns!`,
                `Wir haben 2025 gemeistert! ${info ? info + ' – ' : ''}Und rate mal? 2026 wird noch besser, weil Du dabei bist!`
            ],
            formal: [
                `Zum Jahreswechsel möchte ich Dir von Herzen danken. ${info ? info : 'Unsere gemeinsame Zeit'} bedeutet mir mehr, als Worte ausdrücken können. Auf ein wundervolles 2026 zu zweit.`
            ],
            poetic: [
                `Die Sterne tanzen in der Silvesternacht, und mein Herz tanzt mit ihnen – für Dich. ${info ? info + ' – ' : ''}Wie ein Gedicht, das niemals endet. Möge 2026 unser schönstes Kapitel werden.`,
                `Zwischen Feuerwerk und Champagner, zwischen Wünschen und Träumen, bist Du mein größter. ${info ? 'Du schenktest mir ' + info.toLowerCase() + ', ' : ''}Du schenkst mir jeden Tag das Gefühl von Zuhause.`
            ],
            short: [
                `Mit Dir war 2025 perfekt! ${info ? info : ''} Ich liebe Dich! Auf 2026! ❤️`,
                `Mein Schatz, auf uns in 2026! ${info ? info + ' ' : ''}Love you! 💕`
            ]
        },
        family: {
            warm: [
                `Liebe Familie, ein weiteres Jahr geht zu Ende, und ich bin unendlich dankbar, Euch zu haben. ${info ? info : 'Unsere gemeinsamen Momente'} bedeuten mir die Welt. Auf ein gesundes, glückliches 2026 zusammen!`,
                `Das Jahr neigt sich dem Ende, und ich denke an all die schönen Augenblicke mit Euch. ${info ? 'Besonders ' + info.toLowerCase() + ' ' : ''}Familie ist das Wichtigste. Frohes neues Jahr!`
            ],
            funny: [
                `Wir sind ein Jahr älter, aber noch lange nicht erwachsen! 😄 ${info ? info + ' ' : ''}Auf ein 2026 mit noch mehr Familien-Action!`,
                `Überlebt! Wieder ein Jahr geschafft! ${info ? info + ' – ' : ''}2026, wir sind bereit für Dich!`
            ],
            formal: [
                `Zum Jahreswechsel möchte ich meiner Familie von Herzen danken. ${info ? info : 'Eure Unterstützung und Liebe'} sind unbezahlbar. Auf ein gesegnetes 2026!`
            ],
            poetic: [
                `Wie Wurzeln eines alten Baums, so tief verbunden sind wir. ${info ? info + ' – ' : ''}Durch Stürme und Sonnenschein. Möge 2026 uns noch mehr zusammenschweißen.`
            ],
            short: [
                `Danke für 2025, Familie! ${info ? info : ''} Auf 2026! 🎉`,
                `Familie ist alles! ${info ? info + ' ' : ''}Frohes neues Jahr! ❤️`
            ]
        },
        colleague: {
            warm: [
                `Liebe/r ${name}, ein arbeitsreiches Jahr liegt hinter uns. ${info ? info : 'Die Zusammenarbeit mit Dir'} war großartig. Auf ein erfolgreiches und angenehmes 2026!`,
                `Das Jahr neigt sich dem Ende, und ich wollte mich für die tolle Zusammenarbeit bedanken. ${info ? 'Besonders ' + info.toLowerCase() + ' ' : ''}Auf ein produktives 2026!`
            ],
            funny: [
                `Ein Jahr voller Meetings, Kaffee und Deadlines! 😅 ${info ? info + ' ' : ''}Aber mit Dir im Team macht's Spaß. Auf 2026 – hoffentlich mit mehr Kaffee!`,
                `Wir haben's geschafft! ${info ? info + ' – ' : ''}2026, hier kommen wir!`
            ],
            formal: [
                `Zum Jahreswechsel möchte ich mich für die hervorragende Zusammenarbeit bedanken. ${info ? info : 'Ihre Professionalität und Ihr Engagement'} schätze ich sehr. Auf ein erfolgreiches 2026!`
            ],
            poetic: [
                `Im gemeinsamen Schaffen wächst Vertrauen. ${info ? info + ' ' : ''}Jahr für Jahr, Erfolg für Erfolg. Möge 2026 uns neue Möglichkeiten eröffnen.`
            ],
            short: [
                `Danke für 2025! ${info ? info : ''} Auf ein gutes 2026! 💼`,
                `Super Jahr! ${info ? info + ' ' : ''}Frohes neues Jahr!`
            ]
        },
        boss: {
            warm: [
                `Sehr geehrte/r ${name}, ich möchte mich für Ihre Unterstützung im vergangenen Jahr bedanken. ${info ? info : 'Ihre Führung'} hat mich inspiriert. Auf ein erfolgreiches 2026!`
            ],
            funny: [
                `Chef/in, wir haben ein Jahr überlebt! 🎊 ${info ? info + ' ' : ''}Danke für die Geduld. Auf 2026!`
            ],
            formal: [
                `Zum Jahreswechsel möchte ich Ihnen für Ihre exzellente Führung danken. ${info ? info : 'Ihre Vision und Ihr Engagement'} sind beispielhaft. Ich freue mich auf ein erfolgreiches 2026 unter Ihrer Leitung.`
            ],
            poetic: [
                `Unter Ihrer Führung wachsen wir. ${info ? info + ' ' : ''}Jahr für Jahr, gemeinsam stark.`
            ],
            short: [
                `Vielen Dank für 2025! ${info ? info : ''} Frohes neues Jahr! 👔`
            ]
        },
        acquaintance: {
            warm: [
                `Hallo ${name}, zum Jahreswechsel wollte ich Dir einfach alles Gute wünschen. ${info ? info : 'Es war schön, Dich kennenzulernen.'} Auf ein tolles 2026!`
            ],
            funny: [
                `Hey ${name}! Neues Jahr, neue Möglichkeiten! ${info ? info + ' ' : ''}Lass uns 2026 rocken!`
            ],
            formal: [
                `Sehr geehrte/r ${name}, zum Jahreswechsel möchte ich Ihnen alles Gute wünschen. ${info ? info : ''} Auf ein erfolgreiches 2026!`
            ],
            poetic: [
                `Begegnungen wie Sternschnuppen am Himmel. ${info ? info + ' ' : ''}Kurz, aber leuchtend.`
            ],
            short: [
                `Hi ${name}! ${info ? info : ''} Frohes neues Jahr! 🎊`
            ]
        },
        mentor: {
            warm: [
                `Liebe/r ${name}, ich möchte mich für Ihre Mentorschaft und Unterstützung bedanken. ${info ? info : 'Ihre Weisheit und Geduld'} haben mir sehr geholfen. Auf ein inspirierendes 2026!`
            ],
            funny: [
                `Bester Mentor ever! ${info ? info + ' ' : ''}Danke für alles. Auf 2026! 🌟`
            ],
            formal: [
                `Sehr geehrte/r ${name}, zum Jahreswechsel möchte ich Ihnen für Ihre wertvolle Mentorschaft danken. ${info ? info : 'Ihre Anleitung'} war von unschätzbarem Wert. Auf ein erfolgreiches 2026!`
            ],
            poetic: [
                `Wie ein Leuchtturm im Sturm, so waren Sie für mich. ${info ? info + ' ' : ''}Dankbar folge ich Ihrem Licht ins neue Jahr.`
            ],
            short: [
                `Danke für alles, ${name}! ${info ? info : ''} Frohes neues Jahr! 🙏`
            ]
        }
    };

    const relationBodies = bodies[relation] || bodies.friend;
    const toneBodies = relationBodies[tone] || relationBodies.warm;

    return randomChoice(toneBodies).replace('${name}', name);
}

// ===========================
// WISHES GENERATORS
// ===========================
function getWishes(relation, tone) {
    const wishes = {
        warm: [
            `Ich wünsche Dir für 2026 von Herzen: Gesundheit, Glück und die Erfüllung all Deiner Träume. Möge das neue Jahr Dir viele wunderbare Momente schenken!`,
            `Für 2026 wünsche ich Dir alles erdenklich Gute. Mögen all Deine Wünsche in Erfüllung gehen und jeder Tag ein kleines Abenteuer sein!`,
            `Auf ein Jahr voller Freude, Erfolg und magischer Augenblicke. Möge 2026 Dir alles bringen, was Dein Herz begehrt!`
        ],
        funny: [
            `2026-Wünsche: Mehr Pizza, weniger Stress, gleich viel Spaß! Und vielleicht endlich dieses Fitness-Abo nutzen... oder auch nicht! 😄`,
            `Ich wünsche Dir für 2026: Schnelles WLAN, guten Kaffee und jede Menge gute Vibes! Und dass alle grünen Ampeln auf Dich warten!`,
            `Möge 2026 Dir bringen: Erfolg ohne Stress, Freude ohne Ende und Pizza immer dann, wenn Du sie brauchst! 🍕`
        ],
        formal: [
            `Für das Jahr 2026 wünsche ich Ihnen Gesundheit, beruflichen Erfolg und persönliches Glück. Möge das neue Jahr all Ihre Erwartungen erfüllen.`,
            `Ich wünsche Ihnen ein erfolgreiches und erfüllendes Jahr 2026. Mögen all Ihre Vorhaben gelingen.`,
            `Auf ein Jahr 2026 voller Erfolg, Zufriedenheit und positiver Entwicklungen.`
        ],
        poetic: [
            `Wie Feuerwerk am Nachthimmel erleuchtet, so möge 2026 Dein Leben erhellen. Mit jedem Funken ein neuer Traum, mit jedem Licht eine neue Hoffnung.`,
            `Das neue Jahr wie eine leere Leinwand, bereit für Deine Farben. Male es bunt, male es kühn, male es wie Du es träumst.`,
            `Mögen die Sterne Dir den Weg weisen, der Wind Dich tragen und das Jahr Dir schenken, was Dein Herz ersehnt.`
        ],
        short: [
            `Alles Gute für 2026! Gesundheit, Glück & Erfolg! ✨`,
            `Auf ein mega 2026 voller toller Momente! 🎉`,
            `2026 wird Dein Jahr! Glaub dran! 🌟`
        ]
    };

    return randomChoice(wishes[tone]);
}

// ===========================
// CLOSING GENERATORS
// ===========================
function getClosing(relation, tone) {
    const closings = {
        friend: {
            warm: [`Mit den besten Wünschen und herzlichen Grüßen`, `Alles Liebe`, `Von Herzen`],
            funny: [`Dein/e verrückte/r Freund/in`, `Bis bald, Rakete! 🚀`, `Cheers!`],
            formal: [`Mit freundlichen Grüßen`, `Beste Grüße`],
            poetic: [`In Freundschaft verbunden`, `Mit leuchtenden Gedanken`],
            short: [`LG`, `Bis dann!`, `✌️`]
        },
        romantic: {
            warm: [`In Liebe, Dein/e...`, `Für immer Dein/e`, `Mit all meiner Liebe`],
            funny: [`Dein Schatz 💕`, `Forever yours! ❤️`],
            formal: [`Mit herzlichen Grüßen`],
            poetic: [`Bis die Sterne verblassen, Dein/e...`, `In ewiger Zuneigung`],
            short: [`Love you! ❤️`, `💕`]
        },
        family: {
            warm: [`Mit Liebe, Eure/r...`, `Von Herzen, Eure/r...`, `Alles Liebe`],
            funny: [`Euer verrücktes Familienmitglied`, `Family forever! 👨‍👩‍👧‍👦`],
            formal: [`Mit herzlichen Grüßen`],
            poetic: [`In Familienliebe verbunden`],
            short: [`LG Familie! ❤️`, `❤️`]
        },
        colleague: {
            warm: [`Mit kollegialen Grüßen`, `Beste Grüße`],
            funny: [`Dein Büro-Buddy`, `Bis Montag! 😅`],
            formal: [`Mit freundlichen Grüßen`, `Hochachtungsvoll`],
            poetic: [`Mit Wertschätzung`],
            short: [`Grüße!`, `👋`]
        },
        boss: {
            warm: [`Mit bestem Dank und freundlichen Grüßen`],
            funny: [`Ihr/e treue/r Mitarbeiter/in`],
            formal: [`Mit vorzüglicher Hochachtung`, `Mit freundlichen Grüßen`],
            poetic: [`Mit Respekt und Dankbarkeit`],
            short: [`Beste Grüße`]
        },
        acquaintance: {
            warm: [`Alles Gute`, `Beste Wünsche`],
            funny: [`Bis bald!`, `Cheers! 🎊`],
            formal: [`Mit freundlichen Grüßen`],
            poetic: [`Mit besten Gedanken`],
            short: [`LG`, `👋`]
        },
        mentor: {
            warm: [`Mit Dankbarkeit und besten Grüßen`],
            funny: [`Ihr dankbarer Schüler`],
            formal: [`Mit vorzüglicher Hochachtung`],
            poetic: [`In tiefer Wertschätzung`],
            short: [`Danke & LG! 🙏`]
        }
    };

    const relationClosings = closings[relation] || closings.friend;
    const toneClosings = relationClosings[tone] || relationClosings.warm;

    return randomChoice(toneClosings);
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ===========================
// INTERACTIVE CURSOR FIREWORKS
// ===========================
class CursorFirework {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.colors = ['#ffd700', '#ff006e', '#00d9ff', '#c77dff', '#ff9500', '#fff', '#ffe55c'];
        this.container = document.getElementById('fireworksContainer');
        this.lastEmit = 0;
        this.emitInterval = 30; // milliseconds between particle emissions

        this.init();
    }

    init() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            const now = Date.now();
            if (now - this.lastEmit > this.emitInterval) {
                this.createParticle(e.clientX, e.clientY);
                this.lastEmit = now;
            }
        });

        // Start animation loop
        this.animate();

        // Also create random ambient fireworks
        setInterval(() => this.createRandomBurst(), 1500);
    }

    createParticle(x, y) {
        const count = Math.random() * 3 + 2;
        for (let i = 0; i < count; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                life: 1,
                decay: Math.random() * 0.015 + 0.01,
                size: Math.random() * 4 + 2,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                element: this.createParticleElement()
            };

            this.particles.push(particle);
            this.container.appendChild(particle.element);
        }
    }

    createRandomBurst() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.6; // Upper part of screen

        const count = Math.random() * 20 + 15;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 3 + 2;

            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: Math.random() * 0.01 + 0.008,
                size: Math.random() * 3 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                element: this.createParticleElement()
            };

            this.particles.push(particle);
            this.container.appendChild(particle.element);
        }
    }

    createParticleElement() {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.borderRadius = '50%';
        el.style.pointerEvents = 'none';
        return el;
    }

    animate() {
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update physics
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // gravity
            p.vx *= 0.98; // air resistance
            p.life -= p.decay;

            // Update DOM
            if (p.life > 0) {
                p.element.style.left = p.x + 'px';
                p.element.style.top = p.y + 'px';
                p.element.style.width = p.size + 'px';
                p.element.style.height = p.size + 'px';
                p.element.style.backgroundColor = p.color;
                p.element.style.opacity = p.life;
                p.element.style.boxShadow = `0 0 ${p.size * 2}px ${p.color}`;
            } else {
                // Remove dead particles
                p.element.remove();
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ===========================
// SPARKLES ANIMATION
// ===========================
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.fontSize = Math.random() * 20 + 10 + 'px';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animation = 'sparkle-float 3s ease-in-out infinite';
    sparkle.style.opacity = '0';
    sparkle.style.pointerEvents = 'none';

    return sparkle;
}

function startSparkles() {
    const container = document.getElementById('sparkles');

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkle = createSparkle();
            container.appendChild(sparkle);
        }, i * 300);
    }
}

// ===========================
// HISTORY FUNCTIONALITY
// ===========================

const HISTORY_KEY = 'greeting_history';
const MAX_HISTORY_ITEMS = 5;

function loadHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    renderHistory(history);
}

function saveToHistory(text, name, lang) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

    // Add new item to the beginning
    history.unshift({
        text: text,
        name: name,
        lang: lang,
        date: new Date().toISOString()
    });

    // Limit to max items
    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory(history);
}

function renderHistory(history) {
    const historyList = document.getElementById('historyList');
    const sidebar = document.getElementById('historySidebar');

    if (!historyList || !sidebar) return;

    if (history.length === 0) {
        const emptyMsg = translations[currentLanguage]['history-empty'] || 'Noch keine Grüße erstellt.';
        historyList.innerHTML = `<p class="empty-history" data-i18n="history-empty">${emptyMsg}</p>`;
        sidebar.classList.remove('hidden');
        return;
    }

    sidebar.classList.remove('hidden');
    sidebar.classList.add('fade-in');

    historyList.innerHTML = '';

    history.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'history-item';

        const flagUrl = getFlagForLang(item.lang);

        div.innerHTML = `
            <div class="history-header">
                <span class="history-name">${item.name}</span>
                <img src="${flagUrl}" width="16" height="12" style="border-radius: 2px;">
            </div>
            <div class="history-text" style="font-family: inherit;">${item.text}</div>
        `;

        div.addEventListener('click', () => {
            const messageContainer = document.querySelector('.message-text');
            messageContainer.innerText = item.text;
            document.getElementById('recipientName').value = item.name;

            document.getElementById('outputSection').style.display = 'block';
            document.getElementById('outputSection').classList.remove('hidden');
            document.getElementById('inputSection').style.display = 'none';
            document.getElementById('inputSection').classList.add('hidden');

            // Scroll to result on mobile
            document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
        });

        historyList.appendChild(div);
    });
}

function getFlagForLang(langCode) {
    const map = {
        'de': 'de', 'en': 'gb', 'tr': 'tr', 'es': 'es', 'fr': 'fr', 'it': 'it', 'bg': 'bg'
    };
    return `https://flagcdn.com/w20/${map[langCode] || 'de'}.png`;
}

// ===========================
// FORM HANDLING
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('greetingForm');
    const inputSection = document.getElementById('inputSection');
    const outputSection = document.getElementById('outputSection');
    const generatedMessage = document.getElementById('generatedMessage');
    const copyBtn = document.getElementById('copyBtn');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const emailBtn = document.getElementById('emailBtn');
    const newGreetingBtn = document.getElementById('newGreetingBtn');

    let currentMessage = '';

    // Start interactive animations
    new CursorFirework();
    startSparkles();
    initCountdown();
    initSparkleCursor();
    initParallax();
    initThemes();
    initParticles();
    initSoundEffects();
    initViralLoop();
    initExportStyles();
    initNewsletterModal();

    // Initialize language from localStorage or default to 'de'
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'de';
    currentLanguage = savedLanguage;
    updateUILanguage();

    // Language switcher event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // ===========================
    // SPEECH & EMOJI FEATURES
    // ===========================

    // 1. Speech-to-Text (STT)
    const micBtn = document.getElementById('micBtn');
    const additionalInfo = document.getElementById('additionalInfo');

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        micBtn.addEventListener('click', () => {
            if (micBtn.classList.contains('recording')) {
                recognition.stop();
            } else {
                recognition.lang = currentLanguage === 'de' ? 'de-DE' : 'en-US';
                recognition.start();
                micBtn.classList.add('recording');
                showToast(currentLanguage === 'de' ? 'Ich höre zu... 🎤' : 'Listening... 🎤');
            }
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            additionalInfo.value += (additionalInfo.value ? ' ' : '') + transcript;
            micBtn.classList.remove('recording');
        };

        recognition.onerror = () => {
            micBtn.classList.remove('recording');
            showToast(currentLanguage === 'de' ? 'Fehler bei der Erkennung.' : 'Recognition error.');
        };

        recognition.onend = () => micBtn.classList.remove('recording');
    } else {
        micBtn.style.display = 'none';
    }

    // 2. Text-to-Speech (TTS)
    const ttsBtn = document.getElementById('ttsBtn');
    ttsBtn.addEventListener('click', () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            return;
        }

        const msg = new SpeechSynthesisUtterance(currentMessage);

        // Find best voice for language
        const voices = window.speechSynthesis.getVoices();
        const targetLang = currentLanguage === 'de' ? 'de-DE' : 'en-US';
        msg.voice = voices.find(v => v.lang.includes(targetLang)) || voices[0];
        msg.rate = 1.0;

        window.speechSynthesis.speak(msg);
        showToast(currentLanguage === 'de' ? 'Lese vor... 🔊' : 'Speaking... 🔊');
    });

    // 3. Emoji Shortcuts
    document.querySelectorAll('.emoji-tap').forEach(emoji => {
        emoji.addEventListener('click', () => {
            additionalInfo.value += emoji.textContent;
            additionalInfo.focus();
        });
    });


    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('recipientName').value.trim();
        const relationship = document.getElementById('relationship').value;
        const additionalInfo = document.getElementById('additionalInfo').value.trim();
        const tone = document.getElementById('tone').value;

        // Visual loading state
        const originalBtnText = document.querySelector('.btn-text').textContent;
        const submitBtn = document.getElementById('generateBtn');
        const formCard = document.querySelector('.card');

        submitBtn.disabled = true;
        formCard.classList.add('thinking-glow');

        // Play Magic Sound
        playMagicSound();

        const btnTextEl = document.querySelector('.btn-text');
        const thinkingMessages = [
            translations[currentLanguage]['thinking-1'] || '🪄 ...',
            translations[currentLanguage]['thinking-2'] || '✨ ...',
            translations[currentLanguage]['thinking-3'] || '🌟 ...',
            translations[currentLanguage]['thinking-4'] || '🎆 ...'
        ];

        let msgIndex = 0;
        btnTextEl.textContent = thinkingMessages[0];
        const thinkingInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % thinkingMessages.length;
            btnTextEl.textContent = thinkingMessages[msgIndex];
        }, 2000);

        try {
            // Generate message with AI
            currentMessage = await generateNewYearMessage(name, relationship, additionalInfo, tone);

            // Display message
            generatedMessage.textContent = currentMessage;

            // Show output section with animation
            inputSection.style.display = 'none';
            outputSection.style.display = 'block';
            outputSection.classList.remove('hidden');

            // Scroll to output
            outputSection.scrollIntoView({ behavior: 'smooth' });

            // Show Newsletter Modal after a short delay (Greet & Popup)
            setTimeout(() => {
                if (typeof showNewsletterModal === 'function') showNewsletterModal();
            }, 2500);
        } catch (err) {
            alert('Ups! Etwas ist schief gelaufen. Bitte versuch es nochmal.');
        } finally {
            // Restore button
            clearInterval(thinkingInterval);
            submitBtn.disabled = false;
            formCard.classList.remove('thinking-glow');
            document.querySelector('.btn-text').textContent = originalBtnText;
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(currentMessage);
            showToast(currentLanguage === 'de' ? 'Kopiert! ✅' : 'Copied! ✅');
        } catch (err) {
            alert('Fehler beim Kopieren. Bitte manuell kopieren.');
        }
    });

    // Share via WhatsApp
    whatsappBtn.addEventListener('click', () => {
        const encodedMessage = encodeURIComponent(currentMessage);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    });

    // Share via Email
    emailBtn.addEventListener('click', () => {
        const subject = encodeURIComponent('Neujahrsgrüße 2026 🎉');
        const body = encodeURIComponent(currentMessage);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });

    // Download as Image (Robust "Ghost Container" Method)
    document.getElementById('downloadBtn').addEventListener('click', async () => {
        await exportAsImage('standard');
    });

    // PDF Export
    document.getElementById('downloadPdfBtn').addEventListener('click', async () => {
        await exportAsPDF();
    });

    // Instagram Story Format (9:16)
    document.getElementById('downloadStoryBtn').addEventListener('click', async () => {
        await exportAsImage('story');
    });

    // ===========================
    // EXPORT HELPER FUNCTIONS
    // ===========================

    async function exportAsImage(format = 'standard') {
        let messageText = document.getElementById('generatedMessage').innerText;
        const currentStyle = document.querySelector('.export-style-btn.active')?.dataset.style || 'classic';

        // Play Download Sound
        playSuccessSound();

        // AGGRESSIVE CLEANER: Kill typical placeholders before image generation
        const badEndings = [
            /Dein Name\s*$/i, /\[Dein Name\]\s*$/i, /Ihr Name\s*$/i, /\[Ihr Name\]\s*$/i,
            /Your Name\s*$/i, /\[Your Name\]\s*$/i, /Name\s*$/i, /\[Name\]\s*$/i, /Dein Absender\s*$/i
        ];
        badEndings.forEach(regex => { messageText = messageText.replace(regex, ''); });
        messageText = messageText.replace(/[\n\r\s]+[-–]*[\n\r\s]*$/, '').trim();

        const btnId = format === 'story' ? '#downloadStoryBtn' : '#downloadBtn';
        const btnText = document.querySelector(`${btnId} span[data-i18n]`);
        const originalText = btnText ? btnText.textContent : 'Als Bild speichern';
        if (btnText) btnText.textContent = '🎨 ...';

        const exportContainer = document.createElement('div');
        exportContainer.style.position = 'fixed';
        exportContainer.style.left = '-9999px';

        // Format-specific dimensions
        if (format === 'story') {
            // Instagram Story: 1080x1920 (9:16 ratio)
            exportContainer.style.width = '1080px';
            exportContainer.style.height = '1920px';
            exportContainer.style.padding = '120px 80px';
        } else {
            // Standard: Square-ish format
            exportContainer.style.width = '1000px';
            exportContainer.style.padding = '100px 80px';
        }

        exportContainer.style.borderRadius = '40px';
        exportContainer.style.display = 'flex';
        exportContainer.style.flexDirection = 'column';
        exportContainer.style.alignItems = 'center';
        exportContainer.style.justifyContent = 'center';
        exportContainer.style.color = '#ffffff';
        exportContainer.style.fontFamily = "'Outfit', sans-serif";
        exportContainer.style.textAlign = 'center';
        exportContainer.style.boxShadow = '0 30px 80px rgba(0,0,0,0.6)';

        // STYLE LOGIC
        if (currentStyle === 'elegant') {
            exportContainer.style.background = 'radial-gradient(circle at center, #1c252e 0%, #000000 100%)';
            exportContainer.style.border = '4px solid #ffffff';
        } else if (currentStyle === 'playful') {
            exportContainer.style.background = 'radial-gradient(circle at center, #ff006e 0%, #2a0000 100%)';
            exportContainer.style.border = '6px dashed #ffd700';
        } else {
            // Classic
            exportContainer.style.background = 'radial-gradient(circle at center, #4a0a69 0%, #240046 50%, #120024 100%)';
            exportContainer.style.border = '6px solid #ffd700';
        }

        const titleSize = format === 'story' ? '64px' : '48px';
        const messageSize = messageText.length > 400 ? (format === 'story' ? '36px' : '24px') : (format === 'story' ? '48px' : '32px');
        const qrSize = format === 'story' ? '120' : '100';

        exportContainer.innerHTML = `
            <div style="font-size: ${titleSize}; margin-bottom: 50px; color: ${currentStyle === 'elegant' ? '#fff' : '#ffd700'}; text-shadow: 0 0 25px rgba(255, 215, 0, 0.6); font-weight: bold;">
                🎆 ✨ Neujahrsgruß 2026 ✨ 🎆
            </div>
            <div style="font-size: ${messageSize}; line-height: 1.6; text-shadow: 0 2px 5px rgba(0,0,0,0.4); margin-bottom: 60px; white-space: pre-wrap; width: 100%;">
                ${messageText}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 30px; margin-top: auto;">
                <div style="text-align: left;">
                    <span style="font-size: ${format === 'story' ? '24px' : '18px'}; color: rgba(255, 255, 255, 0.9); text-transform: uppercase; letter-spacing: 4px; font-weight: 600; display: block;">
                        ✨ neujahrsgruss2026.de ✨
                    </span>
                    <span style="font-size: ${format === 'story' ? '16px' : '12px'}; opacity: 0.6; display: block; margin-top: 5px;">
                        Alexander Rheindorf
                    </span>
                </div>
                <div style="background: white; padding: 12px; border-radius: 16px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://neujahrsgruss2026.de&bgcolor=ffffff&color=000000&margin=10&qzone=2" 
                         style="width: ${qrSize}px; height: ${qrSize}px; display: block;" crossorigin="anonymous">
                </div>
            </div>
        `;

        document.body.appendChild(exportContainer);

        try {
            // Higher quality: scale 3 instead of 2
            const canvas = await html2canvas(exportContainer, {
                scale: 3,
                backgroundColor: null,
                useCORS: true,
                logging: false,
                allowTaint: false
            });

            const link = document.createElement('a');
            const formatSuffix = format === 'story' ? '-story' : '';
            link.download = `neujahrsgruss-2026-${currentStyle}${formatSuffix}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();

            showToast(currentLanguage === 'de' ? 'Bild gespeichert! 📸' : 'Image saved! 📸');
        } catch (err) {
            console.error('Export failed:', err);
            showToast(currentLanguage === 'de' ? 'Export fehlgeschlagen 😔' : 'Export failed 😔');
        } finally {
            if (document.body.contains(exportContainer)) {
                document.body.removeChild(exportContainer);
            }
            if (btnText) btnText.textContent = originalText;

            // Also show newsletter modal after image download
            setTimeout(() => {
                if (typeof showNewsletterModal === 'function') showNewsletterModal();
            }, 1000);
        }
    }

    async function exportAsPDF() {
        let messageText = document.getElementById('generatedMessage').innerText;
        const currentStyle = document.querySelector('.export-style-btn.active')?.dataset.style || 'classic';

        playSuccessSound();

        // Clean text
        const badEndings = [
            /Dein Name\s*$/i, /\[Dein Name\]\s*$/i, /Ihr Name\s*$/i, /\[Ihr Name\]\s*$/i,
            /Your Name\s*$/i, /\[Your Name\]\s*$/i
        ];
        badEndings.forEach(regex => { messageText = messageText.replace(regex, ''); });
        messageText = messageText.trim();

        const btnText = document.querySelector('#downloadPdfBtn span[data-i18n]');
        const originalText = btnText ? btnText.textContent : 'Als PDF';
        if (btnText) btnText.textContent = '📄 ...';

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Set background color based on style
            let bgColor, textColor, accentColor;
            if (currentStyle === 'elegant') {
                bgColor = [28, 37, 46];
                textColor = [255, 255, 255];
                accentColor = [255, 255, 255];
            } else if (currentStyle === 'playful') {
                bgColor = [255, 0, 110];
                textColor = [255, 255, 255];
                accentColor = [255, 215, 0];
            } else {
                bgColor = [74, 10, 105];
                textColor = [255, 255, 255];
                accentColor = [255, 215, 0];
            }

            // Background
            doc.setFillColor(...bgColor);
            doc.rect(0, 0, 210, 297, 'F');

            // Title
            doc.setFontSize(28);
            doc.setTextColor(...accentColor);
            doc.setFont('helvetica', 'bold');
            doc.text('🎆 Neujahrsgruß 2026 🎆', 105, 40, { align: 'center' });

            // Message
            doc.setFontSize(14);
            doc.setTextColor(...textColor);
            doc.setFont('helvetica', 'normal');

            const lines = doc.splitTextToSize(messageText, 160);
            doc.text(lines, 105, 70, { align: 'center', maxWidth: 160 });

            // Footer
            doc.setFontSize(10);
            doc.setTextColor(200, 200, 200);
            doc.text('✨ neujahrsgruss2026.de ✨', 105, 270, { align: 'center' });
            doc.setFontSize(8);
            doc.text('Alexander Rheindorf', 105, 277, { align: 'center' });

            // Add QR Code
            const qrImg = new Image();
            qrImg.crossOrigin = 'anonymous';
            qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://neujahrsgruss2026.de&bgcolor=ffffff&color=000000&margin=10';

            qrImg.onload = () => {
                doc.addImage(qrImg, 'PNG', 85, 245, 40, 40);
                doc.save(`neujahrsgruss-2026-${currentStyle}.pdf`);
                showToast(currentLanguage === 'de' ? 'PDF gespeichert! 📄' : 'PDF saved! 📄');
                if (btnText) btnText.textContent = originalText;
            };

            qrImg.onerror = () => {
                // Save without QR if loading fails
                doc.save(`neujahrsgruss-2026-${currentStyle}.pdf`);
                showToast(currentLanguage === 'de' ? 'PDF gespeichert! 📄' : 'PDF saved! 📄');
                if (btnText) btnText.textContent = originalText;
            };

        } catch (err) {
            console.error('PDF export failed:', err);
            showToast(currentLanguage === 'de' ? 'PDF-Export fehlgeschlagen 😔' : 'PDF export failed 😔');
            if (btnText) btnText.textContent = originalText;
        }
    }


    // ===========================
    // HISTORY FUNCTIONALITY
    // ===========================

    // Initial Load
    loadHistory();

    // Clear History Button Logic
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            const confirmMsg = currentLanguage === 'de' ? 'Wirklich den gesamten Verlauf löschen?' : 'Clear all history?';
            if (confirm(confirmMsg)) {
                localStorage.removeItem(HISTORY_KEY);
                renderHistory([]); // Clear UI
            }
        });
    }
    // Create new greeting
    newGreetingBtn.addEventListener('click', () => {
        outputSection.classList.add('hidden');
        inputSection.style.display = 'block';
        form.reset();
        inputSection.scrollIntoView({ behavior: 'smooth' });
    });

    // ===========================
    // NEWSLETTER HANDLING (MOCK)
    // ===========================
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value;

            const btn = newsletterForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = '<span class="sparkle">⏳</span> ...';

            try {
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.error || 'Subscription failed');

                newsletterForm.style.display = 'none';
                newsletterSuccess.classList.remove('hidden');
                localStorage.setItem('newsletter_subscribed', 'true');
                showToast(currentLanguage === 'de' ? 'Erfolgreich eingetragen! 💌' : 'Successfully subscribed! 💌');
            } catch (err) {
                alert('Ups! Das hat nicht geklappt. Bitte versuche es später noch einmal.');
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }

    function initNewsletterModal() {
        const modal = document.getElementById('newsletterModal');
        const closeBtn = document.getElementById('closeModal');
        const modalForm = document.getElementById('modalNewsletterForm');
        const modalSuccess = document.getElementById('modalNewsletterSuccess');

        if (!modal) return;

        // Close modal listeners
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });

        // Modal Form Handling
        if (modalForm) {
            modalForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('modalNewsletterEmail').value;

                const btn = modalForm.querySelector('button');
                const originalText = btn.innerHTML;

                btn.disabled = true;
                btn.innerHTML = '<span class="sparkle">⏳</span> ...';

                try {
                    const response = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });

                    const data = await response.json();

                    if (!response.ok) throw new Error(data.error || 'Subscription failed');

                    modalForm.style.display = 'none';
                    modalSuccess.classList.remove('hidden');
                    localStorage.setItem('newsletter_subscribed', 'true');
                    showToast(currentLanguage === 'de' ? 'Erfolgreich eingetragen! 💌' : 'Successfully subscribed! 💌');

                    // Close modal after success after a short delay
                    setTimeout(() => {
                        modal.classList.add('hidden');
                    }, 3000);

                } catch (err) {
                    alert('Ups! Das hat nicht geklappt. Bitte versuche es später noch einmal.');
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }
            });
        }
    }

    function showNewsletterModal() {
        // Show the modal every time after generation/download as long as the user hasn't subscribed yet
        if (localStorage.getItem('newsletter_subscribed') === 'true') return;

        const modal = document.getElementById('newsletterModal');
        if (modal) {
            modal.classList.remove('hidden');
            if (typeof playMagicSound === 'function') playMagicSound();
        }
    }

    // Make it available globally if needed
    window.showNewsletterModal = showNewsletterModal;

    // ===========================
    // UI POLISH FUNCTIONS
    // ===========================

    function initCountdown() {
        const countdownEl = document.getElementById('newYearCountdown');
        if (!countdownEl) return;

        function update() {
            const now = new Date();
            const year = now.getFullYear();
            const nextYear = 2026;
            const target = new Date(`January 1, ${nextYear} 00:00:00`);
            const diff = target - now;

            if (diff <= 0) {
                countdownEl.innerHTML = currentLanguage === 'de' ? "🎉 FROHES NEUES JAHR 2026! 🥂" : "🎉 HAPPY NEW YEAR 2026! 🥂";
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            countdownEl.innerHTML = (currentLanguage === 'de' ? "Noch " : "Only ") +
                `${hours}h ${mins}m ${secs}s ` +
                (currentLanguage === 'de' ? "bis 2026! 🎆" : "until 2026! 🎆");

            countdownEl.classList.remove('hidden');
        }

        update();
        setInterval(update, 1000);
    }

    function initSparkleCursor() {
        document.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.1) { // Create sparkle occasionally
                const sparkle = document.createElement('div');
                sparkle.className = 'cursor-sparkle';
                sparkle.style.left = e.clientX + 'px';
                sparkle.style.top = e.clientY + 'px';

                // Random size and rotation
                const size = Math.random() * 10 + 5;
                sparkle.style.width = size + 'px';
                sparkle.style.height = size + 'px';
                sparkle.style.transform = `rotate(${Math.random() * 360}deg)`;

                document.body.appendChild(sparkle);

                setTimeout(() => {
                    sparkle.style.opacity = '0';
                    sparkle.style.transform += ' translate(0, 20px) scale(0)';
                    setTimeout(() => sparkle.remove(), 500);
                }, 100);
            }
        });
    }

    function initParallax() {
        const bg = document.querySelector('.fireworks-bg');
        if (!bg) return;

        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            bg.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    function initThemes() {
        const dots = document.querySelectorAll('.theme-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const theme = dot.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                localStorage.setItem('user-theme', theme);
                showToast(currentLanguage === 'de' ? `Theme gewechselt: ${theme}` : `Theme changed: ${theme}`);
            });
        });

        // Restore
        const saved = localStorage.getItem('user-theme');
        if (saved) {
            const dot = document.querySelector(`.theme-dot[data-theme="${saved}"]`);
            if (dot) dot.click();
        }
    }

    function initExportStyles() {
        const btns = document.querySelectorAll('.export-style-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    function initViralLoop() {
        const viralBtn = document.getElementById('viralBtn');
        viralBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'Neujahrsgrüße 2026',
                text: 'Schau mal, hier kannst du KI-generierte Neujahrsgrüße erstellen!',
                url: 'https://neujahrsgruss2026.de'
            };

            if (navigator.share) {
                try { await navigator.share(shareData); } catch (e) { }
            } else {
                await navigator.clipboard.writeText(shareData.url);
                showToast(currentLanguage === 'de' ? 'Link kopiert! 🚀' : 'Link copied! 🚀');
            }
        });
    }

    // --- Particle System ---
    function initParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
                this.alpha = Math.random();
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.fillStyle = `rgba(255, 215, 0, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 100; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- Sound System ---
    let audioCtx;
    function initSoundEffects() {
        document.addEventListener('click', () => {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }, { once: true });
    }

    window.playMagicSound = () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    };

    window.playSuccessSound = () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    };

    window.showToast = function (message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>✨</span> ${message}`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
});
