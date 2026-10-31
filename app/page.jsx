'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Key Target & Milestone Dates
const TARGET_DATE = new Date('2026-11-03T00:00:00+07:00').getTime();
const START_DATE = new Date('2025-11-03T00:00:00+07:00').getTime();
const CORRECT_PASSCODE = '2025-10-10';

// Romantic Music Box Melody Frequencies (Cmaj7 -> Am9 -> Fmaj7 -> Gsus4)
const MUSIC_BOX_MELODY = [
  523.25, 659.25, 783.99, 987.77, 1046.50, 783.99, 659.25, 587.33,
  440.00, 523.25, 659.25, 783.99, 880.00, 659.25, 523.25, 493.88,
  349.23, 440.00, 523.25, 659.25, 698.46, 523.25, 440.00, 392.00,
  392.00, 587.33, 783.99, 880.00, 987.77, 783.99, 587.33, 523.25,
];

const BASS_ROOTS = [261.63, 220.00, 174.61, 196.00];

const CHAPTER_NAMES = [
  'Prolog: 3 November',
  'Bab 1: 10 Oktober 2025',
  'Bab 2: 3 November 2025',
  'Bab 3: 1 Desember 2025',
  'Bab 4: Rasi Bintang Kita',
  'Bab 5: Setahun Bersama',
  'Bab 6: Pesan Khusus',
  'Bab 7: Surat Untukmu',
  'Bab 8: Harapan & Janji',
];



const LETTER_TEXT = `Sayangku,

Kalau aku boleh meminta satu hal pada waktu, aku ingin 3 November berhenti sedikit lebih lama. Di tanggal inilah dunia mendapatkanmu, dan setahun lalu, di tanggal yang sama, hatiku diam-diam mulai berpihak padamu.

Aku tidak pandai merangkai kata, tapi aku ingat semuanya. Balon di jalan yang macet. Tanganku yang gemetar saat meminta izin pada ibu. Hujan yang turun tepat saat aku memberanikan diri merangkulmu. Dan semua tawa yang membuat hari biasa terasa seperti hadiah.

Terima kasih sudah menjadi tempatku pulang. Bersamamu, aku belajar bahwa bahagia itu sederhana: cukup ada kamu.

Di umurmu yang ke-26, aku tidak meminta langit. Aku hanya berjanji akan terus berusaha menjadi orang yang pantas kamu banggakan, hari ini, dan di setiap 3 November berikutnya.

Selamat ulang tahun, cintaku. Aku mencintaimu, lebih dari yang bisa kutulis.

Selamanya milikmu,
Andika 🤍`;

export default function BirthdayPage() {
  // Navigation & Screen States: 'gate' | 'countdown' | 'start' | 'stage'
  const [screen, setScreen] = useState('gate');
  const [testMode, setTestMode] = useState(true);

  // Audio Engine States
  const [isMusicOn, setIsMusicOn] = useState(false);
  const bgMusicRef = useRef(null);
  const audioCtxRef = useRef(null);
  const noteIndexRef = useRef(0);
  const musicTimerRef = useRef(null);
  const isMusicOnRef = useRef(false);

  // Rain Ambient Audio Generator
  const rainNodeRef = useRef(null);
  const [isRainPlaying, setIsRainPlaying] = useState(false);

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Gatekeeper State
  const [inputDate, setInputDate] = useState('');
  const [gateError, setGateError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showGateHint, setShowGateHint] = useState(false);

  // Countdown State
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [secretTapCount, setSecretTapCount] = useState(0);

  // Slide & Stage States
  const [curSlide, setCurSlide] = useState(0);
  const [stepIndices, setStepIndices] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Slide 0: Hero State
  const [isHeroRevealed, setIsHeroRevealed] = useState(false);
  const [dayCounter, setDayCounter] = useState(0);
  const heroTimerRef = useRef(null);

  // Slide 1 Polaroid Stack
  const [stack1, setStack1] = useState([
    {
      id: 'day1',
      src: '/photos/day1/day1.jpg',
      badge: 'Dreezel Coffee',
      label: 'Hari Pertama Kita ☕',
      desc: 'Secangkir kopi hangat di Lembang saat awal kita bertemu.',
    },
    {
      id: 'img114',
      src: '/photos/day1/IMG_0114.jpg',
      badge: 'Lembang',
      label: '10 Oktober 2025',
      desc: 'Nongkrong bareng anak-anak Murangkalih.',
    },
    {
      id: 'img117',
      src: '/photos/day1/IMG_0117.jpg',
      badge: 'Bareng Anak-anak',
      label: 'Nongkrong Murangkalih',
      desc: 'Belum tahu kalau ini awal dari segalanya.',
    },
    {
      id: 'balon',
      emoji: '🎈',
      badge: 'Subang - Bandung',
      label: 'Balon di Jalanan Macet',
      desc: 'Kubelikan balon merah muda untuk membuatmu tersenyum.',
    },
    {
      id: 'trobel',
      emoji: '🚗',
      badge: 'Kenangan Lucu',
      label: 'Mobil Trobel Tapi Bahagia',
      desc: 'Malu-maluin banget waktu itu, tapi jadi awal cerita indah kita.',
    },
  ]);
  const [flying1, setFlying1] = useState(null);

  // Slide 2 Polaroid Stack
  const [stack2] = useState([
    {
      id: '3nov',
      src: '/photos/3nov/3nov.jpg',
      badge: '3 Nov 2025',
      label: 'Ulang Tahun Sayangku 🎂',
      desc: 'Aku rayain ultahmu dari jauh, tapi sepenuh hati.',
    },
    {
      id: 'roblox',
      emoji: '🎮',
      badge: 'Roblox',
      label: 'Main Bareng di Roblox',
      desc: 'Nge-game bareng jadi cara kita dekat sebelum ketemu.',
    },
    {
      id: 'website',
      emoji: '💻',
      badge: 'Website',
      label: 'Website Pertama Buatmu',
      desc: 'Aku coding semalaman cuma buat lihat kamu senyum.',
    },
  ]);

  // Slide 4 Constellation
  const [litStars, setLitStars] = useState([false, false, false, false, false]);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [constellationCaption, setConstellationCaption] = useState('Sentuh bintang kenangan kita satu per satu ✨');
  const [litLines, setLitLines] = useState([false, false, false, false]);

  // Slide 5 Memories Polaroid Stack
  const [stack5, setStack5] = useState([
    { id: 'm01', src: '/photos/1taun/mem01.jpg', badge: 'Kenangan', label: 'Momen Bersama #1' },
    { id: 'm02', src: '/photos/1taun/mem02.jpg', badge: 'Kenangan', label: 'Momen Bersama #2' },
    { id: 'm03', src: '/photos/1taun/mem03.jpg', badge: 'Kenangan', label: 'Momen Bersama #3' },
    { id: 'm04', src: '/photos/1taun/mem04.jpg', badge: 'Kenangan', label: 'Momen Bersama #4' },
    { id: 'm05', src: '/photos/1taun/mem05.jpg', badge: 'Kenangan', label: 'Momen Bersama #5' },
    { id: 'm06', src: '/photos/1taun/mem06.jpg', badge: 'Kenangan', label: 'Momen Bersama #6' },
    { id: 'm07', src: '/photos/1taun/mem07.jpg', badge: 'Kenangan', label: 'Momen Bersama #7' },
    { id: 'm08', src: '/photos/1taun/mem08.jpg', badge: 'Kenangan', label: 'Momen Bersama #8' },
    { id: 'm09', src: '/photos/1taun/mem09.jpg', badge: 'Kenangan', label: 'Momen Bersama #9' },
    { id: 'm10', src: '/photos/1taun/mem10.jpg', badge: 'Kenangan', label: 'Momen Bersama #10' },
    { id: 'm11', src: '/photos/1taun/mem11.jpg', badge: 'Kenangan', label: 'Momen Bersama #11' },
    { id: 'm12', src: '/photos/1taun/mem12.jpg', badge: 'Kenangan', label: 'Momen Bersama #12' },
    { id: 'm13', src: '/photos/1taun/mem13.jpg', badge: 'Kenangan', label: 'Momen Bersama #13' },
    { id: 'm14', src: '/photos/1taun/mem14.jpg', badge: 'Kenangan', label: 'Momen Bersama #14' },
    { id: 'm15', src: '/photos/1taun/mem15.jpg', badge: 'Kenangan', label: 'Momen Bersama #15' },
    { id: 'm16', src: '/photos/1taun/mem16.jpg', badge: 'Kenangan', label: 'Momen Bersama #16' },
    { id: 'm17', src: '/photos/1taun/mem17.jpg', badge: 'Kenangan', label: 'Momen Bersama #17' },
    { id: 'm18', src: '/photos/1taun/mem18.jpg', badge: 'Kenangan', label: 'Momen Bersama #18' },
    { id: 'm19', src: '/photos/1taun/mem19.jpg', badge: 'Kenangan', label: 'Momen Bersama #19' },
    { id: 'm20', src: '/photos/1taun/mem20.jpg', badge: 'Kenangan', label: 'Momen Bersama #20' },
    { id: 'm21', src: '/photos/1taun/mem21.jpg', badge: 'Kenangan', label: 'Momen Bersama #21' },
    { id: 'm22', src: '/photos/1taun/mem22.jpg', badge: 'Kenangan', label: 'Momen Bersama #22' },
    { id: 'm23', src: '/photos/1taun/mem23.jpg', badge: 'Kenangan', label: 'Momen Bersama #23' },
    { id: 'm24', src: '/photos/1taun/mem24.jpg', badge: 'Kenangan', label: 'Momen Bersama #24' },
    { id: 'm25', src: '/photos/1taun/mem25.jpg', badge: 'Kenangan', label: 'Momen Bersama #25' },
    { id: 'm26', src: '/photos/1taun/mem26.jpg', badge: 'Kenangan', label: 'Momen Bersama #26' },
    { id: 'm27', src: '/photos/1taun/mem27.jpg', badge: 'Kenangan', label: 'Momen Bersama #27' },
  ]);
  const [flying5, setFlying5] = useState(null);
  const [stack5Pos, setStack5Pos] = useState(1); // current photo number (1-based)

  // Slide 6 Video State
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Slide 7 Typewriter State
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const hasTypedRef = useRef(false);
  const skipTypingRef = useRef(false);

  // Slide 8 Cake, Candles & Proposal
  const [candlesLit, setCandlesLit] = useState([true, true, true]);
  const [isBlown, setIsBlown] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);

  // Touch tracking
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const lastSwipeTimeRef = useRef(0);

  // Canvas ref for Confetti / Fireworks
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const isCanvasRunningRef = useRef(false);

  // Toast Helper
  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMsg(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 2400);
  }, []);

  // ===================== SOUND SYNTHESIS & SFX =====================
  const initAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Rich Music Box chime tone generator
  const playMusicBoxNote = useCallback((freq, time, volume = 0.08) => {
    if (!audioCtxRef.current) return;
    try {
      const ac = audioCtxRef.current;
      // Pure sine fundamental
      const osc1 = ac.createOscillator();
      const gain1 = ac.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, time);

      // Triangle overtone for metallic music-box resonance
      const osc2 = ac.createOscillator();
      const gain2 = ac.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, time);

      // Warm low-pass filter
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, time);
      filter.frequency.exponentialRampToValueAtTime(600, time + 1.8);

      // Envelope
      gain1.gain.setValueAtTime(0, time);
      gain1.gain.linearRampToValueAtTime(volume, time + 0.006);
      gain1.gain.exponentialRampToValueAtTime(0.0001, time + 2.0);

      gain2.gain.setValueAtTime(0, time);
      gain2.gain.linearRampToValueAtTime(volume * 0.3, time + 0.004);
      gain2.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(ac.destination);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 2.1);
      osc2.stop(time + 2.1);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Crystalline chime sound effect (for stars, wishes, reveals)
  const playChimeSFX = useCallback((customFreq = 1046.50) => {
    initAudio();
    if (!audioCtxRef.current) return;
    try {
      const ac = audioCtxRef.current;
      const t = ac.currentTime + 0.02;
      const freqs = [customFreq, customFreq * 1.25, customFreq * 1.5];
      freqs.forEach((f, idx) => {
        playMusicBoxNote(f, t + idx * 0.08, 0.12);
      });
    } catch (e) {
      console.error(e);
    }
  }, [initAudio, playMusicBoxNote]);

  // Gentle flip sound
  const playFlipSFX = useCallback(() => {
    initAudio();
    if (!audioCtxRef.current) return;
    try {
      const ac = audioCtxRef.current;
      const t = ac.currentTime + 0.01;
      playMusicBoxNote(783.99, t, 0.04);
    } catch (e) {
      console.error(e);
    }
  }, [initAudio, playMusicBoxNote]);

  // Rain ambience synthesis (gentle bandpass noise)
  const toggleRainSound = useCallback(() => {
    initAudio();
    if (!audioCtxRef.current) return;
    const ac = audioCtxRef.current;

    if (isRainPlaying) {
      if (rainNodeRef.current) {
        try {
          rainNodeRef.current.stop();
          rainNodeRef.current.disconnect();
        } catch (e) { }
        rainNodeRef.current = null;
      }
      setIsRainPlaying(false);
      showToast('Suara hujan dimatikan 🌧️');
    } else {
      try {
        const bufferSize = 2 * ac.sampleRate;
        const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
          b6 = white * 0.115926;
        }

        const whiteNoise = ac.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ac.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;

        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.06, ac.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ac.destination);

        whiteNoise.start();
        rainNodeRef.current = whiteNoise;
        setIsRainPlaying(true);
        showToast('Suara hujan dinyalakan 🌧️');
      } catch (e) {
        console.error(e);
      }
    }
  }, [initAudio, isRainPlaying, showToast]);

  // Melodic background music step
  const musicStep = useCallback(() => {
    if (!isMusicOnRef.current || !audioCtxRef.current) return;
    const ac = audioCtxRef.current;
    const t = ac.currentTime + 0.04;
    const i = noteIndexRef.current;

    // Melody note
    const note = MUSIC_BOX_MELODY[i % MUSIC_BOX_MELODY.length];
    playMusicBoxNote(note, t, 0.075);

    // Warm bass root note every 4 beats
    if (i % 4 === 0) {
      const root = BASS_ROOTS[Math.floor(i / 8) % BASS_ROOTS.length];
      playMusicBoxNote(root, t, 0.06);
    }

    noteIndexRef.current = i + 1;
    musicTimerRef.current = setTimeout(musicStep, 460);
  }, [playMusicBoxNote]);

  const toggleMusic = useCallback(
    (turnOn) => {
      initAudio();
      const audio = bgMusicRef.current;
      const nextState = turnOn !== undefined ? turnOn : !isMusicOnRef.current;
      isMusicOnRef.current = nextState;
      setIsMusicOn(nextState);

      if (audio) {
        if (nextState) {
          audio.play().catch((err) => {
            console.warn('Audio play was prevented:', err);
          });
        } else {
          audio.pause();
        }
      }
    },
    [initAudio]
  );

  // ===================== CANVAS PARTICLES & FIREWORKS =====================
  const randomBetween = (min, max) => min + Math.random() * (max - min);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter(
      (p) => p.y < canvas.height + 20 && p.l > 0
    );

    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.o ? 0.05 : 0.28;
      p.vx *= 0.99;
      p.r += 0.18;
      if (p.o) p.l -= 0.014;

      ctx.globalAlpha = Math.max(p.l, 0);
      ctx.fillStyle = p.c;

      if (p.o) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s / 1.5, 0, 6.28);
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.6);
        ctx.restore();
      }
    });

    ctx.globalAlpha = 1;
    if (particlesRef.current.length > 0) {
      requestAnimationFrame(drawParticles);
    } else {
      isCanvasRunningRef.current = false;
    }
  }, []);

  const boom = useCallback(
    (x, y, count = 40, isSpark = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const colors = ['#fed079', '#ff8fb1', '#ffffff', '#ffd1e1', '#ff527b', '#fce38a'];
      const targetX = x ?? window.innerWidth / 2;
      const targetY = y ?? window.innerHeight * 0.58;

      for (let i = 0; i < count; i++) {
        const angle = randomBetween(0, 6.28);
        const speed = isSpark ? randomBetween(2, 9) : 0;
        particlesRef.current.push({
          x: targetX,
          y: targetY,
          vx: isSpark ? Math.cos(angle) * speed : randomBetween(-8, 8),
          vy: isSpark ? Math.sin(angle) * speed : randomBetween(-16, -3),
          s: isSpark ? 3.5 : randomBetween(4, 11),
          c: colors[i % colors.length],
          r: randomBetween(0, 6),
          o: isSpark,
          l: 1,
        });
      }

      if (!isCanvasRunningRef.current) {
        isCanvasRunningRef.current = true;
        drawParticles();
      }
    },
    [drawParticles]
  );

  const fireworks = useCallback(
    (count = 5) => {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          boom(
            randomBetween(0.15, 0.85) * window.innerWidth,
            randomBetween(0.15, 0.45) * window.innerHeight,
            65,
            true
          );
        }, i * 550);
      }
    },
    [boom]
  );

  // Floating heart effect on tap
  const spawnHeart = (x, y) => {
    const heart = document.createElement('b');
    heart.className = 'ht';
    const emojis = ['💗', '💖', '🌸', '✨', '🤍'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);
    setTimeout(() => {
      heart.remove();
    }, 1300);
  };

  // Rising elements (roses & hearts)
  const spawnRising = useCallback((count = 12) => {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('b');
      el.className = 'rh';
      el.textContent = i % 2 ? '💗' : '🌹';
      el.style.left = `${randomBetween(2, 94)}%`;
      el.style.fontSize = `${randomBetween(20, 36)}px`;
      el.style.animationDelay = `${randomBetween(0, 2)}s`;
      el.style.animationDuration = `${randomBetween(4, 7)}s`;
      document.body.appendChild(el);
      setTimeout(() => {
        el.remove();
      }, 9000);
    }
  }, []);

  // Relationship Day counter animation
  const startDayCount = useCallback(() => {
    const totalDays = Math.floor((Math.max(Date.now(), TARGET_DATE) - START_DATE) / 864e5);
    let current = 0;
    const stepInterval = () => {
      current = Math.min(totalDays, current + Math.ceil(totalDays / 60));
      setDayCounter(current);
      if (current < totalDays) {
        setTimeout(stepInterval, 28);
      }
    };
    setTimeout(stepInterval, 1800);
  }, []);

  // Hero Reveal action
  const triggerReveal = useCallback(() => {
    if (isHeroRevealed) return;
    if (heroTimerRef.current) clearTimeout(heroTimerRef.current);
    setIsHeroRevealed(true);
    fireworks(6);
    spawnRising(16);
    playChimeSFX(1046.50);
    startDayCount();
  }, [isHeroRevealed, fireworks, spawnRising, playChimeSFX, startDayCount]);

  // Typewriter effect for Slide 7 Love Letter
  const runTypewriter = useCallback(() => {
    if (hasTypedRef.current) return;
    hasTypedRef.current = true;
    setIsTyping(true);

    let idx = 0;
    const step = () => {
      if (skipTypingRef.current) {
        setTypedText(LETTER_TEXT);
        setIsTyping(false);
        return;
      }
      idx++;
      setTypedText(LETTER_TEXT.slice(0, idx));
      if (idx < LETTER_TEXT.length) {
        const delay = LETTER_TEXT[idx - 1] === '\n' ? 180 : 22;
        setTimeout(step, delay);
      } else {
        setIsTyping(false);
      }
    };
    step();
  }, []);

  // Slide Step Lengths
  const slideStepLengths = [
    1, // Slide 0: hero
    5, // Slide 1: 5 steps
    4, // Slide 2: 4 steps
    8, // Slide 3: 8 concert cards
    1, // Slide 4: constellation
    1, // Slide 5: memories
    1, // Slide 6: video
    1, // Slide 7: letter
    1, // Slide 8: cake & proposal
  ];

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (curSlide === 0 && !isHeroRevealed) {
      triggerReveal();
      return;
    }
    if (curSlide === 7 && isTyping) {
      skipTypingRef.current = true;
      return;
    }

    const curSteps = slideStepLengths[curSlide];
    const currentStepIndex = stepIndices[curSlide];

    if (currentStepIndex < curSteps - 1) {
      setStepIndices((prev) => {
        const copy = [...prev];
        copy[curSlide] = currentStepIndex + 1;
        return copy;
      });
      playFlipSFX();
    } else if (curSlide < 8) {
      const nextSlide = curSlide + 1;
      setCurSlide(nextSlide);
      setStepIndices((prev) => {
        const copy = [...prev];
        copy[nextSlide] = 0;
        return copy;
      });
      playFlipSFX();
      if (nextSlide === 7) {
        runTypewriter();
      }
    }
  }, [curSlide, isHeroRevealed, isTyping, stepIndices, triggerReveal, playFlipSFX, runTypewriter, slideStepLengths]);

  const handlePrev = useCallback(() => {
    const currentStepIndex = stepIndices[curSlide];

    if (currentStepIndex > 0) {
      setStepIndices((prev) => {
        const copy = [...prev];
        copy[curSlide] = currentStepIndex - 1;
        return copy;
      });
      playFlipSFX();
    } else if (curSlide > 0) {
      const prevSlide = curSlide - 1;
      const prevSlideLastStep = Math.max(0, slideStepLengths[prevSlide] - 1);
      setCurSlide(prevSlide);
      setStepIndices((prev) => {
        const copy = [...prev];
        copy[prevSlide] = prevSlideLastStep;
        return copy;
      });
      playFlipSFX();
    }
  }, [curSlide, stepIndices, playFlipSFX, slideStepLengths]);

  // Stage click handler (spawns heart & navigates if not clicking interactive UI)
  const handleStageClick = (e) => {
    spawnHeart(e.clientX, e.clientY);

    if (Date.now() - lastSwipeTimeRef.current < 500) return;
    if (e.target.closest('button, .polaroid-card, .proposal-box, video, input, a, .ticket-wrapper, .parchment-letter')) {
      return;
    }

    if (e.clientX < window.innerWidth * 0.28) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (screen !== 'stage') return;
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, handleNext, handlePrev]);

  // Countdown timer effect
  useEffect(() => {
    if (screen !== 'countdown') return;
    const interval = setInterval(() => {
      const diff = TARGET_DATE - Date.now();
      if (diff <= 0) {
        setScreen('start');
        clearInterval(interval);
      } else {
        setCountdown({
          d: Math.floor(diff / 864e5),
          h: Math.floor(diff / 36e5) % 24,
          m: Math.floor(diff / 6e4) % 60,
          s: Math.floor(diff / 1e3) % 60,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [screen]);

  // Passcode gate submit
  const handleGateSubmit = () => {
    initAudio();
    if (inputDate === CORRECT_PASSCODE) {
      playChimeSFX(1318.51);
      fireworks(2);
      if (!testMode && Date.now() < TARGET_DATE) {
        setScreen('countdown');
      } else {
        setScreen('start');
      }
    } else {
      setGateError('Hmm, kayaknya kamu lupa deh 😜 Coba ingat: kopi di Lembang, balon, dan mobil yang trobel!');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Start button action
  const handleStartExperience = () => {
    setScreen('stage');
    toggleMusic(true);
    heroTimerRef.current = setTimeout(triggerReveal, 12000);
  };

  // Star click action in Slide 4
  const STAR_CAPTIONS = [
    '<b>10 Oktober 2025</b>Pertama kali kita bertemu di Lembang. Ada balon, mobil yang trobel, dan awal dari segalanya.',
    '<b>3 November 2025</b>Hatiku diam-diam mulai berpihak padamu. Tanpa tahu kita akan melangkah sejauh ini.',
    '<b>1 Desember 2025</b>Konser pertama kita di bawah hujan. Saat aku memberanikan diri merangkulmu.',
    '<b>Satu Tahun Bersama</b>Dari kenalan sampai jadi pasangan. Perjalanan yang paling kusyukuri.',
    '<b>3 November 2026 ★</b>Kamu. Bintang paling terang di langitku. Selamat ulang tahun, sayangku.',
  ];

  const handleStarClick = (index) => {
    // Star 4 (index 4) requires all others lit first
    if (index === 4) {
      const litCount = litStars.filter(Boolean).length;
      if (litCount < 4) {
        showToast('Nyalakan semua bintang kenangan dulu ya ✨');
        return;
      }
    }
    if (litStars[index]) return;

    const newLit = [...litStars];
    newLit[index] = true;
    setLitStars(newLit);
    setConstellationCaption(STAR_CAPTIONS[index]);

    // Light the connecting line after this star
    if (index < 4) {
      setTimeout(() => {
        setLitLines(prev => {
          const n = [...prev];
          n[index] = true;
          return n;
        });
      }, 400);
    }

    playChimeSFX(660 + index * 110);

    const starEls = document.querySelectorAll('.star-btn');
    if (starEls[index]) {
      const rect = starEls[index].getBoundingClientRect();
      boom(rect.x + 26, rect.y + 26, 28, true);
    }

    // All stars lit celebration
    if (newLit.filter(Boolean).length === 5) {
      setTimeout(() => {
        setConstellationCaption('Rasi bintang kita lengkap. Kamu adalah bintang yang paling terang di hidupku. 🌟');
        fireworks(5);
        spawnRising(16);
      }, 2600);
    }
  };

  // Polaroid fling in Slide 1
  const handleStack1Click = (item) => {
    if (stack1[0]?.id !== item.id) return;
    setFlying1(item.id);
    playFlipSFX();
    setTimeout(() => {
      setStack1((prev) => {
        const copy = [...prev];
        const top = copy.shift();
        copy.push(top);
        return copy;
      });
      setFlying1(null);
    }, 350);
  };

  // Polaroid fling in Slide 5
  const handleStack5Click = (item) => {
    if (stack5[0]?.id !== item.id) return;
    setFlying5(item.id);
    playFlipSFX();
    setTimeout(() => {
      setStack5((prev) => {
        const copy = [...prev];
        const top = copy.shift();
        copy.push(top);
        return copy;
      });
      setStack5Pos((p) => (p % 27) + 1);
      setFlying5(null);
    }, 350);
  };

  // Video ↔ Music sync: mute music while video plays, restore when paused/ended
  // Run whenever curSlide changes so the ref is guaranteed to be mounted
  useEffect(() => {
    const video = videoRef.current;
    const audio = bgMusicRef.current;
    if (!video || !audio) return;

    const onPlay  = () => { audio.muted = true;  };
    const onPause = () => { audio.muted = false; };
    const onEnded = () => { audio.muted = false; setIsVideoPlaying(false); };

    video.addEventListener('play',  onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('play',  onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
    };
  }, [curSlide]);

  // Video play button
  const handlePlayVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.controls = true;
      video.play();
      setIsVideoPlaying(true);
    }
  };

  // Blow candle action
  const handleBlowCandle = () => {
    setCandlesLit([false, false, false]);
    setIsBlown(true);
    playChimeSFX(1567.98);
    fireworks(8);
    spawnRising(22);
    boom(null, null, 140);
  };

  // Individual candle tap
  const handleCandleTap = (idx) => {
    if (!candlesLit[idx]) return;
    const newLit = [...candlesLit];
    newLit[idx] = false;
    setCandlesLit(newLit);
    playChimeSFX(1046.50 + idx * 200);
    boom(null, null, 25, true);

    if (newLit.every((c) => !c)) {
      setIsBlown(true);
      fireworks(7);
      spawnRising(20);
    }
  };

  // Proposal acceptance
  const handleAcceptProposal = () => {
    setIsAgreed(true);
    playChimeSFX(1760.00);
    fireworks(6);
    spawnRising(24);
    boom(null, null, 160);
  };

  // Playful dodging button
  const handleDodge = () => {
    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);
    if (nextCount === 1) {
      showToast('Eits, yakin mau mikir-mikir dulu? 😜');
    } else if (nextCount === 2) {
      showToast('Nggak ada tombol nolak yaa! 🙈');
    } else {
      // Limit reached — auto accept
      showToast('Oke, aku anggap MAU BANGET! 💍✨');
      handleAcceptProposal();
    }
  };

  return (
    <>
      {/* Background Audio Player */}
      <audio ref={bgMusicRef} src="/musik.mp3" loop preload="auto" />

      {/* Fullscreen Canvas for Fireworks and Confetti */}
      <canvas ref={canvasRef} id="cf" />

      {/* Ambient Floating Sakura & Hearts */}
      <div id="amb">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 6.25) % 100}%`,
              fontSize: `${14 + (i % 5) * 3}px`,
              animationDuration: `${8 + (i % 8)}s`,
              animationDelay: `-${(i * 1.3) % 12}s`,
            }}
          >
            {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '💗' : '✨'}
          </span>
        ))}
      </div>

      {/* Top Header Bar: Story Progress Bar + Music Toggle */}
      <header id="top-bar">
        {screen === 'stage' && (
          <div id="pb">
            {Array.from({ length: 9 }).map((_, i) => (
              <i
                key={i}
                className={i <= curSlide ? 'd' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurSlide(i);
                  playFlipSFX();
                  if (i === 7) runTypewriter();
                }}
                title={CHAPTER_NAMES[i]}
              />
            ))}
          </div>
        )}

        <button
          className={`music-bar ${isMusicOn ? 'playing' : ''}`}
          onClick={() => toggleMusic()}
          aria-label={isMusicOn ? 'Matikan Musik' : 'Nyalakan Musik'}
          title={isMusicOn ? 'Musik Menyala' : 'Musik Mati'}
        >
          {isMusicOn ? (
            <div className="music-eq">
              <span className="eq-bar bar1" />
              <span className="eq-bar bar2" />
              <span className="eq-bar bar3" />
            </div>
          ) : (
            <svg
              className="music-muted-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.25" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </header>

      {/* Toast Notification */}
      {toastMsg && <div className="ts"><span>💌</span> {toastMsg}</div>}

      {/* ===================== SCREEN 1: GATE ===================== */}
      <section className={`scr ${screen !== 'gate' ? 'off' : ''}`} id="gate">
        <div className={`envelope-card ${isShaking ? 'shk' : ''}`}>
          <div className="wax-seal">💌</div>
          <h2 className="envelope-title">Untuk Sayangku</h2>
          <p className="envelope-subtitle">
            Halaman kenangan ini terkunci. Masukkan tanggal pertama kali kita bertemu untuk membukanya.
          </p>

          <div className="clue-box">
            <span>💡</span>
            <span>Kopi hangat di Lembang, balon, dan mobil yang trobel.</span>
          </div>

          <div className="date-input-wrap">
            <input
              type="date"
              id="ans"
              aria-label="Tanggal pertama kali bertemu"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGateSubmit();
              }}
            />
          </div>

          <button className="btn" id="go" onClick={handleGateSubmit}>
            <span>Buka Amplop Kenangan</span> 🔑
          </button>

          {!showGateHint ? (
            <button
              className="quick-answer-pill"
              onClick={() => {
                setInputDate('2025-10-10');
                setShowGateHint(true);
              }}
            >
              Lupa tanggalnya? Klik di sini untuk isi otomatis
            </button>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--gold)' }}>
              ✓ Tanggal 10 Oktober 2025 telah diisi. Silakan klik Buka!
            </span>
          )}

          {gateError && <div className="error-badge">{gateError}</div>}
        </div>
      </section>

      {/* ===================== SCREEN 2: COUNTDOWN ===================== */}
      <section className={`scr ${screen !== 'countdown' ? 'off' : ''}`} id="cnt">
        <div className="countdown-box">
          <div className="countdown-badge">✨ HITUNG MUNDUR SPESIAL</div>
          <h2
            className="envelope-title"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const nextCount = secretTapCount + 1;
              setSecretTapCount(nextCount);
              if (nextCount >= 5) {
                setScreen('start');
                showToast('Mode rahasia terbuka! ✨');
              }
            }}
          >
            Sabar ya, Sayangku 🤍
          </h2>
          <p className="envelope-subtitle">
            Hadiah ini disiapkan khusus untuk menyambut hari ulang tahunmu pada 3 November 2026.
          </p>

          <div className="countdown-digits">
            <div className="countdown-col">
              <b>{String(countdown.d).padStart(2, '0')}</b>
              <small>Hari</small>
            </div>
            <div className="countdown-col">
              <b>{String(countdown.h).padStart(2, '0')}</b>
              <small>Jam</small>
            </div>
            <div className="countdown-col">
              <b>{String(countdown.m).padStart(2, '0')}</b>
              <small>Menit</small>
            </div>
            <div className="countdown-col">
              <b>{String(countdown.s).padStart(2, '0')}</b>
              <small>Detik</small>
            </div>
          </div>

          <button
            className="secret-unlock"
            onClick={() => {
              setScreen('start');
              showToast('Membuka pratinjau spesial 🎁');
            }}
          >
            Buka Sekarang (Mode Pratinjau Spesial) →
          </button>
        </div>
      </section>

      {/* ===================== SCREEN 3: START ===================== */}
      <section className={`scr ${screen !== 'start' ? 'off' : ''}`} id="st">
        <div className="start-card">
          <div className="start-icon">✨</div>
          <h2 className="envelope-title" style={{ fontSize: 'clamp(28px, 8vw, 38px)' }}>
            Duduk yang nyaman,
            <br />
            dan nyalakan suaramu
          </h2>
          <p className="envelope-subtitle" style={{ maxWidth: '34ch' }}>
            Ada perjalanan satu tahun yang ingin kubagikan kembali bersamamu malam ini.
          </p>

          <div className="start-guide-pills">
            <div className="start-pill">
              <span>🎵</span>
              <span>Nyalakan volume agar melodi kotaknya terdengar hangat.</span>
            </div>
            <div className="start-pill">
              <span>👆</span>
              <span>Ketuk sisi kanan layar untuk lanjut, sisi kiri untuk kembali.</span>
            </div>
            <div className="start-pill">
              <span>💌</span>
              <span>Sentuh bintang dan geser foto kenangan di setiap babak.</span>
            </div>
          </div>

          <button className="btn" id="sb" onClick={handleStartExperience} style={{ width: '100%' }}>
            <span>Mulai Perjalanan Kenangan</span> ✨
          </button>
        </div>
      </section>

      {/* ===================== SCREEN 4: STAGE ===================== */}
      <div
        id="stage"
        className={screen === 'stage' ? 'show' : ''}
        onClick={handleStageClick}
        onTouchStart={(e) => {
          touchStartXRef.current = e.touches[0].clientX;
          touchStartYRef.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
          const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
          // Dominant horizontal swipe detection (prevents accidental skips while scrolling vertically)
          if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
            lastSwipeTimeRef.current = Date.now();
            if (deltaX < 0) {
              handleNext();
            } else {
              handlePrev();
            }
          }
        }}
      >
        {/* ===================== SLIDE 0: HERO REVEAL ===================== */}
        <section className={`sl ${curSlide === 0 ? 'act' : ''} ${isHeroRevealed ? 'rv' : ''}`} id="s0">
          <div className="lns">
            <p className="ln" style={{ '--d': '0.4s' }}>
              Ada satu tanggal yang diam-diam mengubah seluruh hidupku.
            </p>
            <p className="ln" style={{ '--d': '3.2s' }}>
              3 November 2000. Dunia kedatangan seseorang yang kelak akan kucintai sepenuh hati.
            </p>
            <p className="ln" style={{ '--d': '6.2s' }}>
              Dua puluh enam tahun kemudian, dia berdiri indah di sampingku.
            </p>
            <p className="ln" style={{ '--d': '9.0s' }}>
              Maka malam ini, izinkan aku mengucapkannya untukmu.
            </p>
          </div>

          <div className="fin">
            <div className="glow-aura" />
            <small className="a" style={{ color: 'var(--soft)', fontSize: '20px' }}>
              Selamat ulang tahun,
            </small>
            <h1 className="gold-title a" style={{ '--i': 2 }}>
              Sayangku
            </h1>
            <div className="full-name a" style={{ '--i': 4 }}>
              Dennysha Priecilla Aulia Nur’Izmha
            </div>
            <div className="date-badge a" style={{ '--i': 5 }}>
              3 November 2000 → 3 November 2026
            </div>
            <p className="vow-quote a" style={{ '--i': 7 }}>
              Dua puluh enam tahun dunia memilikimu. Satu tahun ini, aku jadi orang paling beruntung di dunia.
            </p>

            <div className="counter-card a" style={{ '--i': 9 }}>
              <b>Hari ini bukan cuma ulang tahunmu. Hari ini kita genap setahun.</b>
              <span className="days-count">
                <em>{dayCounter}</em> hari sejak aku mulai jatuh hati padamu 🤍
              </span>
            </div>

            <p className="hint a" style={{ '--i': 11 }}>
              Ketuk layar untuk memulai cerita kita →
            </p>
          </div>
        </section>

        {/* ===================== SLIDE 1: 10 OKTOBER 2025 ===================== */}
        <section className={`sl ${curSlide === 1 ? 'act' : ''}`} id="s1">
          <h2 className="chd a">10 Oktober 2025</h2>
          <div className="chs a" style={{ '--i': 1 }}>
            Dreezel Coffee, Lembang
          </div>

          <div className="story-text-container a" style={{ '--i': 2 }}>
            <div className={`story-card-item ${stepIndices[1] >= 0 ? 'on' : ''} ${stepIndices[1] === 0 ? 'cur' : ''}`}>
              <p>
                Waktu itu aku sama Ner jemput kamu di Subang. Yang paling kuingat cuma mobil yang sempat trobel di jalan, malu-maluin banget, hahaha.
              </p>
            </div>
            <div className={`story-card-item ${stepIndices[1] >= 1 ? 'on' : ''} ${stepIndices[1] === 1 ? 'cur' : ''}`}>
              <p>
                Lalu kita kumpul bareng yang lain buat jemput Syifa. Jalanan macet, dan kebetulan ada tukang balon, jadi kubelikan balon buat kamu sama Syifa 🎈
              </p>
            </div>
            <div className={`story-card-item ${stepIndices[1] >= 2 ? 'on' : ''} ${stepIndices[1] === 2 ? 'cur' : ''}`}>
              <p>
                Waktu nongkrong sama anak-anak Murangkalih, belum ada perasaan apa-apa. Aku nggak nyangka kita bakal sedekat ini. Tapi hari itu aku senang banget.
              </p>
            </div>
            <div className={`story-card-item ${stepIndices[1] >= 3 ? 'on' : ''} ${stepIndices[1] === 3 ? 'cur' : ''}`}>
              <p>
                Saat itu ada moment yang selalu aku inget. saat main bilyard kamu pesen domino untuk orang rumah. itu dikenang banget dan jadi khas jokes khusus buat kamu. Hahahah 🎱
              </p>
            </div>
            <div className={`story-card-item highlight-quote ${stepIndices[1] >= 4 ? 'on' : ''} ${stepIndices[1] === 4 ? 'cur' : ''}`}>
              <p>
                Hari itu aku belum tahu, ternyata itulah langkah pertama dari seluruh kebahagiaanku.
              </p>
            </div>
          </div>

          <div className="stack-wrap a" style={{ '--i': 3 }}>
            {stack1.map((item, idx) => (
              <div
                key={item.id}
                className={`polaroid-card ${flying1 === item.id ? 'fly' : ''}`}
                style={{ '--k': idx }}
                onClick={() => handleStack1Click(item)}
              >
                <div className="polaroid-photo">
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px', display: 'block' }}
                    />
                  ) : (
                    <div className="polaroid-art">
                      <span className="polaroid-emoji">{item.emoji}</span>
                      <span className="polaroid-badge">{item.badge}</span>
                    </div>
                  )}
                </div>
                <span className="polaroid-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="hint">Ketuk foto Polaroid untuk menggeser ke foto berikutnya</div>
        </section>

        {/* ===================== SLIDE 2: 3 NOVEMBER 2025 ===================== */}
        <section className={`sl ${curSlide === 2 ? 'act' : ''}`} id="s2">
          <h2 className="chd a">3 November 2025</h2>
          <div className="chs a" style={{ '--i': 1 }}>
            Hari Aku Mulai Jatuh Hati
          </div>

          <div className="chat-container a" style={{ '--i': 2 }}>
            <div className={`chat-bubble ${stepIndices[2] >= 0 ? 'on' : ''}`}>
              <span>Setelah hari itu kita jadi lebih sering chatan dan main Roblox bareng 🎮 Setiap hari ada aja yang bisa kita obrolin.</span>
              <small>03 Nov 2025 · Delivered</small>
            </div>
            <div className={`chat-bubble mine ${stepIndices[2] >= 1 ? 'on' : ''}`}>
              <span>Dan waktu ulang tahunmu tahun lalu, aku buatin website khusus buat kamu, dengerin musik bareng, dan merayakannya di Roblox. Meskipun dari jauh, aku mau kamu tahu aku peduli. 🎂💻</span>
              <small>03 Nov 2025 · Read 🤍</small>
            </div>
            <div className={`chat-bubble ${stepIndices[2] >= 2 ? 'on' : ''}`}>
              <span>Dan tepat di tanggal ini, entah kenapa, aku mulai sadar kalau aku tertarik sama sosokmu, sayangku.</span>
              <small>03 Nov 2025 · Awal Rasa</small>
            </div>
            <div className={`chat-bubble mine ${stepIndices[2] >= 3 ? 'on' : ''}`}>
              <span>Aku belum tahu apa-apa soal akhirnya. Yang kutahu, aku selalu menunggu kabarmu setiap saat. 🤍</span>
              <small>Setahun lalu · Awal Rasa</small>
            </div>
          </div>

          <div className="stack-wrap a" style={{ '--i': 3 }}>
            {stack2.map((item, idx) => (
              <div key={item.id} className="polaroid-card" style={{ '--k': idx }}>
                <div className="polaroid-photo">
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px', display: 'block' }}
                    />
                  ) : (
                    <div className="polaroid-art" style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
                      <span className="polaroid-emoji">{item.emoji}</span>
                      <span className="polaroid-badge" style={{ color: '#0d47a1' }}>{item.badge}</span>
                    </div>
                  )}
                </div>
                <span className="polaroid-label">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="hint">Ketuk foto untuk melihat kenangan berikutnya</div>
        </section>

        {/* ===================== SLIDE 3: 1 DESEMBER 2025 (KONSER & HUJAN) ===================== */}
        <section className={`sl ${curSlide === 3 ? 'act' : ''}`} id="s3">
          {/* Falling Rain Particle Layer */}
          <div className="rain">
            {Array.from({ length: 48 }).map((_, i) => (
              <i
                key={i}
                style={{
                  left: `${(i * 2.08) % 100}%`,
                  animationDuration: `${0.75 + (i % 8) * 0.08}s`,
                  animationDelay: `-${(i * 0.12) % 2}s`,
                }}
              />
            ))}
          </div>

          <h2 className="chd a" style={{ position: 'relative', zIndex: 2 }}>
            1 Desember 2025
          </h2>
          <div className="chs a" style={{ '--i': 1, position: 'relative', zIndex: 2 }}>
            Konser Pertama Kita di Bawah Hujan
          </div>

          <div className="ticket-wrapper a" style={{ '--i': 2 }}>
            <div className="ticket-header">
              <span className="ticket-badge">VIP CONCERT PASS 🎟️</span>
              <button
                className="btn-secondary"
                style={{ padding: '4px 12px', minHeight: 'auto', fontSize: '11px', borderRadius: '999px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRainSound();
                }}
              >
                {isRainPlaying ? '🌧️ Hujan: Nyala' : '🌧️ Suara Hujan'}
              </button>
            </div>

            <div className="concert-card-content">
              {[
                { emoji: '🎟️', text: 'Kamu ngajak aku nonton konser. Rasanya campur aduk antara senang dan grogi banget.' },
                { emoji: '🤝', text: 'Aku ijin ke ibu sambil tangan gemetar, lalu memberanikan diri minta ijin buat bawa kamu nonton.' },
                { emoji: '💌', text: 'Pesan ibu yang selalu kuingat: “Titip neng. Neng nggak pernah main ke mana-mana selain konser K-pop sama temannya.”' },
                { emoji: '😅', text: 'Di awal masih canggung banget. Bingung mau bahas apa, mau bercanda gimana.' },
                { emoji: '🌧️', text: 'Lalu hujan turun, suasana mencair, dan aku ijin merangkulmu sambil dengerin Alamak-nya Rizky Febrian.' },
                { emoji: '🎶', text: 'Pas For Revenge tampil, lagu-lagu itu jadi punya arti baru. Sampai sekarang, setiap dengar lagunya, aku selalu ingat kamu.' },
                { emoji: '🍛', text: 'Nasi goreng yang ternyata super pedas, nunggu antre toilet berjam-jam, dan pulang dengan mobil penuh embun. Hahaha.' },
                { emoji: '✨', text: 'Masih banyak lagi momen manis yang nggak muat ditulis. Intinya... malam itu aku bahagia sekali.' },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{ display: stepIndices[3] === i ? 'block' : 'none' }}
                >
                  <div className="concert-card-emoji">{card.emoji}</div>
                  <p className="concert-card-text">{card.text}</p>
                </div>
              ))}
            </div>

            <div className="ticket-footer">
              <span>Kartu Cerita {stepIndices[3] + 1} dari 8</span>
              <span>For Revenge · Rizky Febrian</span>
            </div>
          </div>
        </section>

        {/* ===================== SLIDE 4: RASI BINTANG KITA ===================== */}
        <section className={`sl ${curSlide === 4 ? 'act' : ''}`} id="s4">
          <h2 className="chd a">Rasi Bintang Kita</h2>
          <div className="chs a" style={{ '--i': 1 }}>
            Nyalakan setiap bintang kenangan kita ✨
          </div>

          {/* Starfield background */}
          <div className="starfield a" style={{ '--i': 1 }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <span
                key={i}
                className="sf-star"
                style={{
                  left: `${(i * 17.3 + 3) % 100}%`,
                  top: `${(i * 13.7 + 5) % 100}%`,
                  animationDelay: `${(i * 0.23) % 3}s`,
                  animationDuration: `${1.8 + (i % 5) * 0.4}s`,
                  width: `${1 + (i % 3)}px`,
                  height: `${1 + (i % 3)}px`,
                  opacity: 0.3 + (i % 4) * 0.15,
                }}
              />
            ))}
          </div>

          {/* Constellation SVG + Stars */}
          <div className={`sky-container a ${litStars.every(Boolean) ? 'all' : ''}`} style={{ '--i': 2 }}>
            <svg viewBox="0 0 320 220" preserveAspectRatio="none">
              {/* Lines between stars: 0→1, 1→2, 2→3, 3→4 */}
              {[
                { x1: 58, y1: 158, x2: 134, y2: 83 },
                { x1: 134, y1: 83, x2: 224, y2: 140 },
                { x1: 224, y1: 140, x2: 269, y2: 35 },
                { x1: 160, y1: 110, x2: 269, y2: 35 },
              ].map((seg, i) => (
                <line
                  key={i}
                  x1={seg.x1} y1={seg.y1}
                  x2={seg.x2} y2={seg.y2}
                  className={`const-line ${litLines[i] ? 'lit' : ''}`}
                />
              ))}
              {/* Center glow circle when all lit */}
              {litStars.every(Boolean) && (
                <circle cx="160" cy="110" r="38" className="center-aura" />
              )}
            </svg>

            {/* Stars: left-bottom, left-top, right-mid, right-top, center-special */}
            {[
              { label: '10 Okt 2025', sub: 'Lembang', x: '18%', y: '72%', size: 30 },
              { label: '3 Nov 2025', sub: 'Jatuh Hati', x: '42%', y: '38%', size: 30 },
              { label: '1 Des 2025', sub: 'Konser Hujan', x: '70%', y: '64%', size: 30 },
              { label: 'Satu Tahun', sub: 'Bersama', x: '84%', y: '16%', size: 30 },
              { label: 'Sayangku ★', sub: '3 Nov 2026', x: '50%', y: '50%', size: 44, special: true },
            ].map((star, i) => (
              <button
                key={i}
                className={`star-btn ${litStars[i] ? 'lit' : ''} ${star.special ? 'star-special' : ''}`}
                style={{ left: star.x, top: star.y, fontSize: `${star.size}px` }}
                onClick={() => handleStarClick(i)}
                onMouseEnter={() => setHoveredStar(i)}
                onMouseLeave={() => setHoveredStar(null)}
                aria-label={star.label}
              >
                {star.special ? '✦' : '★'}
                {/* Tooltip */}
                <span className={`star-tooltip ${hoveredStar === i || litStars[i] ? 'show' : ''}`}>
                  <strong>{star.label}</strong>
                  <em>{star.sub}</em>
                </span>
                {/* Ring pulse when lit */}
                {litStars[i] && <span className="star-ring" />}
              </button>
            ))}
          </div>

          {/* Caption */}
          <div
            className="constellation-caption a"
            style={{ '--i': 3 }}
            dangerouslySetInnerHTML={{ __html: constellationCaption }}
          />

          {/* Progress dots */}
          <div className="star-progress a" style={{ '--i': 4 }}>
            {litStars.map((lit, i) => (
              <span key={i} className={`star-dot ${lit ? 'lit' : ''}`} />
            ))}
          </div>
        </section>

        {/* ===================== SLIDE 5: SETAHUN YANG KUINGAT ===================== */}
        <section className={`sl ${curSlide === 5 ? 'act' : ''}`} id="s5">
          <h2 className="chd a">Setahun yang Kuingat</h2>
          <div className="chs a" style={{ '--i': 1 }}>
            Ketuk foto Polaroid teratas untuk melihat lembaran berikutnya
          </div>

          <div className="stack-wrap a" style={{ '--i': 2, width: '220px', height: '280px' }}>
            {stack5.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                className={`polaroid-card ${flying5 === item.id ? 'fly' : ''}`}
                style={{ '--k': idx, width: '210px' }}
                onClick={() => handleStack5Click(item)}
              >
                <div className="polaroid-photo">
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px', display: 'block' }}
                    />
                  ) : (
                    <div className="polaroid-art">
                      <span className="polaroid-emoji">{item.emoji}</span>
                      <span className="polaroid-badge">{item.badge}</span>
                    </div>
                  )}
                </div>
                {idx === 0 && (
                  <>
                    <span className="polaroid-label">{item.label}</span>
                    <small className="polaroid-counter">{stack5Pos} / 27</small>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="hint">Ketuk foto untuk melihat kenangan berikutnya 🤍</div>
        </section>

        {/* ===================== SLIDE 6: SATU PESAN LAGI (VIDEO) ===================== */}
        <section className={`sl ${curSlide === 6 ? 'act' : ''}`} id="s6">
          <h2 className="chd a">Satu Pesan Lagi</h2>
          <div className="chs a" style={{ '--i': 1 }}>
            Rekaman khusus buat kamu
          </div>

          <div className="video-card a" style={{ '--i': 2 }}>
            <video ref={videoRef} id="v" src="/videos/video.mp4" playsInline preload="metadata" />
            {!isVideoPlaying && (
              <div className="cassette-mockup">
                <div style={{ fontSize: '48px' }}>📼</div>
                <div className="cassette-title">MIXTAPE CINTA UNTUK SAYANGKU</div>
                <button
                  className="play-circle-btn"
                  id="pl"
                  aria-label="Putar Pesan"
                  onClick={handlePlayVideo}
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ===================== SLIDE 7: SURAT UNTUKMU ===================== */}
        <section className={`sl ${curSlide === 7 ? 'act' : ''}`} id="s7">
          <h2 className="chd a" style={{ marginBottom: '12px' }}>
            Surat Untukmu
          </h2>

          <div className="parchment-letter a" style={{ '--i': 1 }}>
            <div className="parchment-stamp">💌</div>
            <p className={`letter-content ${isTyping ? 'typing' : ''}`} id="lt">
              {typedText}
            </p>
          </div>

          {isTyping && (
            <button
              className="skip-typing-btn a"
              style={{ '--i': 2 }}
              onClick={() => {
                skipTypingRef.current = true;
              }}
            >
              Baca Seluruh Surat Langsung 🌸
            </button>
          )}
        </section>

        {/* ===================== SLIDE 8: KUE, HARAPAN & PROPOSAL ===================== */}
        <section className={`sl ${curSlide === 8 ? 'act' : ''}`} id="s8">
          <h2 className="chd a">Make a Wish, Sayangku 🎂</h2>

          {/* Detailed SVG Birthday Cake */}
          <div className={`cake-container a ${isBlown ? 'out' : ''}`} onClick={handleBlowCandle}>
            <svg viewBox="0 0 240 200" width="260" role="img" aria-label="Kue Ulang Tahun">
              {/* Flames & Glow */}
              <g fill="#ffb347">
                <ellipse className="candle-flame" cx="80" cy="42" rx="7" ry="14" style={{ display: candlesLit[0] ? 'block' : 'none' }} />
                <ellipse className="candle-flame" cx="120" cy="36" rx="8" ry="16" style={{ display: candlesLit[1] ? 'block' : 'none' }} />
                <ellipse className="candle-flame" cx="160" cy="42" rx="7" ry="14" style={{ display: candlesLit[2] ? 'block' : 'none' }} />
              </g>

              {/* Smoke puffs when blown */}
              <g fill="#ffffff" className="smoke-puff">
                <circle cx="80" cy="35" r="8" opacity="0.6" />
                <circle cx="120" cy="28" r="10" opacity="0.7" />
                <circle cx="160" cy="35" r="8" opacity="0.6" />
              </g>

              {/* Candle sticks */}
              <g fill="#ffd580">
                <rect x="76" y="56" width="8" height="34" rx="3" onClick={(e) => { e.stopPropagation(); handleCandleTap(0); }} />
                <rect x="116" y="50" width="8" height="40" rx="3" onClick={(e) => { e.stopPropagation(); handleCandleTap(1); }} />
                <rect x="156" y="56" width="8" height="34" rx="3" onClick={(e) => { e.stopPropagation(); handleCandleTap(2); }} />
              </g>

              {/* Top Cake Layer with Icing */}
              <rect x="50" y="90" width="140" height="40" rx="12" fill="#fff5f8" />
              <path
                d="M50 98 Q60 114 70 98 T90 98 T110 98 T130 98 T150 98 T170 98 T190 98"
                fill="none"
                stroke="#ff7597"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Strawberries on top layer */}
              <circle cx="70" cy="90" r="5" fill="#ff4071" />
              <circle cx="120" cy="88" r="6" fill="#ff4071" />
              <circle cx="170" cy="90" r="5" fill="#ff4071" />

              {/* Bottom Cake Layer */}
              <rect x="30" y="130" width="180" height="48" rx="14" fill="#e0457b" />
              <path
                d="M30 140 Q45 158 60 140 T90 140 T120 140 T150 140 T180 140 T210 140"
                fill="none"
                stroke="#fff5f8"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Cake Plate */}
              <rect x="15" y="176" width="210" height="10" rx="5" fill="#ffd580" />
            </svg>
          </div>

          {!isBlown ? (
            <>
              <p className="a" style={{ '--i': 1, margin: '8px 0 14px', color: 'var(--soft)' }}>
                Pejamkan mata, panjatkan doamu dalam hati, lalu tiup lilinnya 🤍
              </p>
              <button className="btn a" style={{ '--i': 2 }} onClick={handleBlowCandle}>
                <span>Tiup Lilin Ulang Tahun</span> 🎂
              </button>
            </>
          ) : (
            <div className="proposal-box">
              <h2 className="chd" style={{ fontSize: 'clamp(26px, 7.5vw, 36px)', margin: '0 0 6px' }}>
                Selamat Ulang Tahun, Cintaku!
              </h2>
              <p style={{ margin: '0 0 16px', color: '#ffe4ee', fontSize: '15px' }}>
                Semoga semua yang kamu semogakan menjadi nyata dan berkah selamanya.
              </p>

              {!showProposal ? (
                <button
                  className="btn"
                  onClick={() => {
                    setShowProposal(true);
                    playChimeSFX(1318.51);
                    setTimeout(() => {
                      const slideEl = document.getElementById('s8');
                      if (slideEl) slideEl.scrollTo({ top: 999, behavior: 'smooth' });
                    }, 60);
                  }}
                >
                  <span>Ada satu hal lagi untukmu…</span> 💍
                </button>
              ) : (
                <>
                  <div style={{ margin: '14px 0' }}>
                    <h3>Maukah kamu merayakan setiap 3 November bersamaku, selamanya?</h3>
                    <div className="proposal-btn-row">
                      <button
                        className="btn"
                        onClick={handleAcceptProposal}
                        style={dodgeCount > 0 ? { transform: `scale(${1 + dodgeCount * 0.08})`, transition: 'transform 0.3s' } : {}}
                      >
                        <span>Mau Banget!</span> 💖
                      </button>
                      {!isAgreed && (
                        <button
                          className="btn btn-secondary"
                          onClick={handleDodge}
                          style={{
                            transform: `scale(${Math.max(0.5, 1 - dodgeCount * 0.22)})`,
                            opacity: Math.max(0.3, 1 - dodgeCount * 0.3),
                            transition: 'all 0.35s ease',
                            pointerEvents: dodgeCount >= 2 ? 'none' : 'auto',
                          }}
                        >
                          <span>
                            {dodgeCount === 0 && 'Pikir-pikir dulu... 😜'}
                            {dodgeCount === 1 && 'Hmm, bentar ya... 🙈'}
                            {dodgeCount >= 2 && 'Oke fiiiine... 😅'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {isAgreed && (
                    <div className="date-voucher">
                      <div className="voucher-ribbon">VIP DATE PASS 🎟️</div>
                      <h4 className="voucher-title">Tiket Kencan & Dinner Romantis</h4>
                      <p className="voucher-desc">
                        Voucher ini berlaku seumur hidup untuk 1x Dinner Romantis Ulang Tahun, pelukan hangat tanpa batas, dan es krim favoritmu!
                      </p>
                      <a
                        className="whatsapp-btn"
                        href="https://wa.me/?text=Halo%20Andika!%20Aku%20udah%20buka%20hadiah%20webnya...%20dan%20jawabannya:%20MAU%20BANGET!%20Yuk%20kapan%20kita%20dinner%20berdua?%20%F0%9F%92%96%E2%9C%A8"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Konfirmasi Jawaban ke Andika 📲</span>
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <p className="hint" style={{ marginTop: '20px' }}>
            Dibuat dengan segenap cinta oleh Andika · 3 November 2026
          </p>
        </section>
      </div>

      {/* Floating Bottom Navigation */}
      {screen === 'stage' && (
        <nav id="nv">
          <button id="pv" aria-label="Sebelumnya" onClick={handlePrev}>
            ‹
          </button>
          <div className="chapter-pill">{CHAPTER_NAMES[curSlide]}</div>
          <button id="nx" aria-label="Berikutnya" onClick={handleNext}>
            ›
          </button>
        </nav>
      )}
    </>
  );
}
