---
layout: home
hero:
  name: Vizualni Admin
  text: Алатка за визуализацију српских отворених података
  tagline: Креирајте прелепе, интерактивне визуализације од података српске владе
  image:
    src: /hero-image.svg
    alt: Vizualni Admin Лого
  actions:
    - theme: brand
      text: Започните
      link: /vodic/brzi-pocetak
    - theme: alt
      text: Демо
      link: https://acailic.github.io/vizualni-admin/
    - theme: alt
      text: GitHub
      link: https://github.com/acailic/vizualni-admin

features:
  - icon: 📊
    title: Богата библиотека дијаграма
    details: Подршка за линеарне, стубичасте, мапе, Scatter дијаграме и још много тога са пуним опцијама прилагођавања.
  - icon: 🇷🇸
    title: Интеграција српских података
    details: Нативна интеграција са data.gov.rs API за безбедан приступ српским владиним скуповима података.
  - icon: 🌍
    title: Вишезична подршка
    details: Потпуна подршка за српски (ћирилица и латиница) и енглески језик.
  - icon: 📱
    title: Респонсивни дизајн
    details: Савршено ради на десктопу, таблету и мобилним уређајима са прилагођеним интеракцијама.
  - icon: ♿
    title: Приступачност
    details: WCAG 2.1 усаглашено са подршком за читаче екрана и навигацију тастатуром.
  - icon: 🔧
    title: Прилагођено програмерима
    details: TypeScript први са свеобухватним API-јима, лаким угњеждавањем и екстензивним прилагођавањем.
  - icon: ⚡
    title: Високе перформансе
    details: Изграђено са Next.js, оптимизовано за брзину са серверским рендеровањем и ефикасним руковањем подацима.
  - icon: 🎨
    title: Лепо темељење
    details: Temeljено на Material-UI са прилагодљивим темама које се поклапају са вашим брендом.

footer: BSD-3-Clause Лиценца | Објављено са ❤️ од стране заједнице српских отворених података
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Додајте било коју JavaScript логику специфичну за почетну страницу
})
</script>

<div class="grid-container">
  <div class="demo-section">
    <h2>Видите у акцији</h2>
    <p>Истражите интерактивне примере који приказују могућности Vizualni Admin-а</p>
    <div class="demo-grid">
      <a href="/primeri/demografski-podaci" class="demo-card">
        <h3>Динамика становништва</h3>
        <p>Интерактивна визуализација демографских података Србије</p>
        <span class="demo-tag">Популациони подаци</span>
      </a>
      <a href="/primeri/ekonomske-indikatorе" class="demo-card">
        <h3>Економски индикатори</h3>
        <p>Праћење кључних економских метрика из података српске владе</p>
        <span class="demo-tag">Економија</span>
      </a>
      <a href="/primeri/ regionalno-mapiranje" class="demo-card">
        <h3>Регионално мапирање</h3>
        <p>Географске визуализације српских региона и општина</p>
        <span class="demo-tag">Мапе</span>
      </a>
    </div>
  </div>
</div>

<style scoped>
.grid-container {
  margin-top: 2rem;
}

.demo-section {
  text-align: center;
  padding: 3rem 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  margin: 3rem 0;
}

.demo-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--vp-c-brand-1);
}

.demo-section p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.demo-card {
  display: block;
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.demo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.demo-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-brand-1);
  font-size: 1.25rem;
}

.demo-card p {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.demo-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }

  .demo-section {
    padding: 2rem 0;
  }
}
</style>