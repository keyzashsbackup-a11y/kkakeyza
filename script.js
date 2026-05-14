console.log("script.js BERHASIL TERBACA!")
//api nya question
const GROQ_API_KEY = "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";


//HALAMANNNNNNN QUESTION

async function sendMessage() {
  const input    = document.getElementById('userInput');
  const chatBox  = document.getElementById('chatBox');
  const text     = input.value.trim();

  //kl, stop
  if (!text) return;

  //pesan USER
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerHTML = `
    <span class="avatar">🧑</span>
    <div class="bubble-text">${text}</div>
  `;
  chatBox.appendChild(userBubble);
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  //"sedang mengetik..."
  const typingBubble = document.createElement('div');
  typingBubble.className = 'chat-bubble bot';
  typingBubble.id = 'typingIndicator';
  typingBubble.innerHTML = `
    <span class="avatar">💕</span>
    <div class="bubble-text" style="color:var(--text-mid); font-style:italic;">
      Sedang mengetik...
    </div>
  `;
  chatBox.appendChild(typingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  //kirim ke AI
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Kamu adalah asisten romantis bernama "Lani" dari website Peduli Wanitamu.
Tugasmu membantu pengguna memahami wanita dan memberikan saran hubungan.
Jawab dalam Bahasa Indonesia yang hangat dan penuh empati.
Gunakan emoji secukupnya. Jawaban maksimal 3 kalimat, padat dan langsung ke inti.`
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 300,
        temperature: 0.8
      })
    });

    const data = await response.json();

    //hps indikator mengetik
    const typingEl = document.getElementById('typingIndicator');
    if (typingEl) typingEl.remove();

    //apakah Groq mengembalikan jawaban
    if (data.choices && data.choices[0]) {
      const botReply = data.choices[0].message.content;

      const botBubble = document.createElement('div');
      botBubble.className = 'chat-bubble bot';
      botBubble.innerHTML = `
        <span class="avatar">💕</span>
        <div class="bubble-text">${botReply}</div>
      `;
      chatBox.appendChild(botBubble);

    } else {
      throw new Error("Groq tidak mengembalikan jawaban: " + JSON.stringify(data));
    }

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.error("Detail error Groq:", error);

    const typingEl = document.getElementById('typingIndicator');
    if (typingEl) typingEl.remove();

    const errorBubble = document.createElement('div');
    errorBubble.className = 'chat-bubble bot';
    errorBubble.innerHTML = `
      <span class="avatar">💕</span>
      <div class="bubble-text" style="color:var(--pink-deep);">
        Aduh, terjadi kesalahan. Cek Console F12 untuk detail ya! 🙏
      </div>
    `;
    chatBox.appendChild(errorBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}



//HALAMANNNNNNNNNNNNNNNN ACTIVITIES

const activitiesData = [
  { maxBudget: 30000,   icon: "🌸", title: "Jalan Sore ke Taman",     desc: "Jalan-jalan sore di taman kota. Nikmati udara segar dan obrolan santai.",           tips: "Bawa air minum dari rumah biar hemat!",                               tag: "Gratis - Rp 30.000"  },
  { maxBudget: 50000,   icon: "🧺", title: "Picnic Sederhana",         desc: "Gelar tikar di taman, bawa makanan ringan buatan sendiri.",                            tips: "Beli buah segar + roti. Total bisa di bawah 50k!",                    tag: "≤ Rp 50.000"         },
  { maxBudget: 100000,  icon: "☕", title: "Cafe Date",                 desc: "Kunjungi cafe aesthetic terdekat, pesan minuman favorit dan ngobrol berdua.",          tips: "Cari cafe yang ada promo 2 minuman sekaligus!",                       tag: "≤ Rp 100.000"        },
  { maxBudget: 150000,  icon: "🎬", title: "Nonton Bioskop",           desc: "Nonton film bareng — kencan klasik yang selalu menyenangkan.",                         tips: "Tanya dulu film apa yang ingin dia tonton!",                          tag: "≤ Rp 150.000"        },
  { maxBudget: 200000,  icon: "🍜", title: "Makan Malam Romantis",     desc: "Kunjungi restoran spesial, atau lebih romantis lagi — masak bareng di rumah!",         tips: "Masak bareng jauh lebih intim daripada ke restoran.",                 tag: "≤ Rp 200.000"        },
  { maxBudget: 300000,  icon: "🏖️", title: "Day Trip ke Alam",        desc: "Pergi ke wisata alam terdekat — pantai, air terjun, atau kebun teh.",                  tips: "Siapkan sunscreen, kamera, dan playlist favoritnya!",                 tag: "≤ Rp 300.000"        },
  { maxBudget: 500000,  icon: "🏨", title: "Staycation Mini",          desc: "Cari hotel budget yang cozy. Nikmati kolam renang dan sarapan bersama.",               tips: "Pesan jauh-jauh hari untuk harga lebih murah!",                      tag: "≤ Rp 500.000"        },
  { maxBudget: Infinity, icon: "✈️", title: "Short Vacation",          desc: "Rencanakan liburan singkat ke kota lain — naik kereta atau bus, menginap 1-2 malam.",  tips: "Buat itinerary bersama — merencanakannya pun jadi kenangan indah!",   tag: "Rp 500.000+"         },
];

function getActivities() {
  const budgetInput = document.getElementById('budgetInput');
  const resultArea  = document.getElementById('activityResult');
  const budget      = parseInt(budgetInput.value);

  if (!budget || budget <= 0) {
    resultArea.innerHTML = `<div class="empty-state"><span class="es-icon">💸</span>Masukkan budget kamu dulu ya!</div>`;
    return;
  }

  const toShow = activitiesData.filter(a => budget <= a.maxBudget).slice(0, 3);

  if (toShow.length === 0) {
    resultArea.innerHTML = `<div class="empty-state"><span class="es-icon">🌸</span>Budget terlalu kecil. Coba minimal Rp 10.000!</div>`;
    return;
  }

  resultArea.innerHTML = `
    <p style="font-size:0.85rem;color:var(--text-mid);margin-bottom:4px;">
      Rekomendasi untuk budget <strong>Rp ${budget.toLocaleString('id-ID')}</strong>:
    </p>
    ${toShow.map(a => `
      <div class="result-card">
        <span class="rc-icon">${a.icon}</span>
        <div class="rc-title">${a.title}</div>
        <div class="rc-desc">${a.desc}</div>
        <div class="rc-desc" style="font-style:italic;margin-top:4px;">💡 Tips: ${a.tips}</div>
        <span class="rc-tag">${a.tag}</span>
      </div>
    `).join('')}
  `;
}

function setBudget(amount) {
  const input = document.getElementById('budgetInput');
  if (input) { input.value = amount; getActivities(); }
}


//HALAMANNNNNNNNNNNNNN LOCATION

const placesData = [
  { icon: "🌿", name: "Taman Kota Terdekat",        type: "Taman",        distance: "1–3 km",   desc: "Taman hijau cocok untuk jalan sore, bersantai, atau piknik berdua.",          mapsQuery: "taman kota"          },
  { icon: "☕", name: "Cafe Aesthetic Sekitar",      type: "Cafe",         distance: "2–5 km",   desc: "Cafe cozy dengan suasana romantis untuk ngobrol berdua.",                     mapsQuery: "cafe aesthetic"      },
  { icon: "🍜", name: "Kuliner Lokal Populer",       type: "Restoran",     distance: "1–4 km",   desc: "Nikmati makanan lokal yang lezat di tempat yang mudah dijangkau.",            mapsQuery: "restoran romantis"   },
  { icon: "🌅", name: "Spot Sunset Terdekat",        type: "Wisata Alam",  distance: "5–10 km",  desc: "Lihat matahari terbenam bersama dia — momen yang selalu diingat.",            mapsQuery: "spot sunset"         },
  { icon: "🎡", name: "Tempat Hiburan",              type: "Hiburan",      distance: "3–8 km",   desc: "Wahana seru dan makanan jajanan untuk kencan santai.",                        mapsQuery: "tempat hiburan"      },
  { icon: "🌺", name: "Taman Bunga / Kebun Wisata",  type: "Wisata",       distance: "7–15 km",  desc: "Foto aesthetic di tengah bunga-bunga cantik. Cocok untuk kencan!",            mapsQuery: "taman bunga wisata"  },
];

function getLocations() {
  const locationInput = document.getElementById('locationInput');
  const resultArea    = document.getElementById('locationResult');
  const city          = locationInput.value.trim();

  if (!city) {
    resultArea.innerHTML = `<div class="empty-state"><span class="es-icon">📍</span>Masukkan nama kota kamu dulu!</div>`;
    return;
  }

  resultArea.innerHTML = `
    <p style="font-size:0.85rem;color:var(--text-mid);margin-bottom:4px;">
      Rekomendasi di sekitar <strong>${city}</strong>:
    </p>
    ${placesData.map(p => `
      <div class="result-card">
        <span class="rc-icon">${p.icon}</span>
        <div class="rc-title">${p.name}</div>
        <div class="rc-desc" style="font-size:0.8rem;color:var(--pink-mid);margin-bottom:2px;">${p.type} · 📏 ${p.distance}</div>
        <div class="rc-desc">${p.desc}</div>
        <a href="https://www.google.com/maps/search/${encodeURIComponent(p.mapsQuery + ' ' + city)}" target="_blank" class="btn-maps">🗺️ Buka Google Maps</a>
      </div>
    `).join('')}
  `;
}

function useMyLocation() {
  const resultArea    = document.getElementById('locationResult');
  const locationInput = document.getElementById('locationInput');

  if (!navigator.geolocation) {
    resultArea.innerHTML = `<div class="empty-state"><span class="es-icon">😔</span>Browser kamu tidak mendukung GPS.</div>`;
    return;
  }

  resultArea.innerHTML = `<div class="empty-state"><span class="es-icon">📡</span>Mendeteksi lokasi kamu...</div>`;

  navigator.geolocation.getCurrentPosition(
    function(position) {
      const lat = position.coords.latitude.toFixed(4);
      const lon = position.coords.longitude.toFixed(4);
      locationInput.value = `${lat}, ${lon}`;

      resultArea.innerHTML = `
        <p style="font-size:0.85rem;color:var(--text-mid);margin-bottom:4px;">
          Lokasi terdeteksi: <strong>${lat}, ${lon}</strong>
        </p>
        ${placesData.map(p => `
          <div class="result-card">
            <span class="rc-icon">${p.icon}</span>
            <div class="rc-title">${p.name}</div>
            <div class="rc-desc" style="font-size:0.8rem;color:var(--pink-mid);">${p.type} · 📏 ${p.distance}</div>
            <div class="rc-desc">${p.desc}</div>
            <a href="https://www.google.com/maps/search/${encodeURIComponent(p.mapsQuery)}/@${lat},${lon},14z" target="_blank" class="btn-maps">🗺️ Buka Google Maps</a>
          </div>
        `).join('')}
      `;
    },
    function() {
      resultArea.innerHTML = `<div class="empty-state"><span class="es-icon">😔</span>Tidak bisa akses GPS. Coba ketik nama kota kamu!</div>`;
    }
  );
}