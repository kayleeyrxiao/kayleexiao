/* ============================================================
   Kaylee Xiao — About, Education, Experiences, Portfolio, Contact.
   ============================================================ */
(function () {
const { KXKicker, KXH3, KXH4, KXP, KXHL, KXTag, KXCover, KXSection, KXBand,
        KXEntry, KXProjectCard, KXProjectModal, KXSiteButton, KXField, KX_IMG, KXCarousel } = window;

/* ---------------- ABOUT ---------------- */
/* skills as festival bunting: one string per kind of work, pennants hanging along its sag */
const SKILL_CSS = `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
/* skills as an index-card file: one tabbed card per kind of work, each skill a label-maker strip on a ruled line */
.kx-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:22px 14px;align-items:stretch}
.kx-card{position:relative;display:flex;flex-direction:column;padding-top:30px;min-width:0}
.kx-card-tab{position:absolute;top:0;left:10px;max-width:calc(100% - 20px);box-sizing:border-box;height:34px;display:flex;align-items:center;gap:7px;padding:0 12px 6px;border-radius:9px 9px 0 0;background:var(--tab);color:var(--tabi)}
.kx-card-tab b{font-family:ui-monospace,"SFMono-Regular","Courier New",monospace;font-weight:400;font-size:11px;letter-spacing:.14em;opacity:.75}
.kx-card-tab span{font-family:var(--site-heading);font-size:clamp(14px,1.6vw,19px);line-height:1;white-space:nowrap}
.kx-card-body{position:relative;flex:1;display:flex;flex-direction:column;gap:0;padding:12px 14px 18px;border-radius:4px 10px 10px 10px;background:var(--site-bg);box-shadow:0 1px 0 rgba(62,50,40,.08),0 10px 22px -14px rgba(62,50,40,.4);
  background-image:linear-gradient(var(--tab),var(--tab));background-size:100% 4px;background-repeat:no-repeat;transition:transform .25s,box-shadow .25s}
.kx-card:hover .kx-card-body{transform:translateY(-3px);box-shadow:0 1px 0 rgba(62,50,40,.08),0 16px 28px -14px rgba(62,50,40,.45)}
.kx-card-lead{font-family:'Caveat','Bradley Hand','Segoe Print',cursive;font-weight:700;font-size:21px;line-height:1.05;padding:8px 0 7px;color:color-mix(in srgb,var(--site-text) 80%,transparent);border-bottom:1px solid color-mix(in srgb,var(--site-text) 13%,transparent);text-wrap:balance}
.kx-tape-row{min-height:38px;padding:6px 0;box-sizing:border-box;display:flex;align-items:center;border-bottom:1px solid color-mix(in srgb,var(--site-text) 13%,transparent)}
.kx-tape{display:inline-block;max-width:100%;box-sizing:border-box;padding:5px 11px 4px;font-family:var(--site-body);font-weight:900;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;line-height:1.35;text-wrap:balance;color:var(--tapei);background:var(--tape);border-radius:2px;
  clip-path:polygon(4px 0,calc(100% - 4px) 0,100% 50%,calc(100% - 4px) 100%,4px 100%,0 50%);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(0,0,0,.22);text-shadow:0 -1px 0 rgba(0,0,0,.25);transform:rotate(var(--tr,0deg));transition:transform .2s}
.kx-tape-row:hover .kx-tape{transform:translateX(3px) rotate(var(--tr,0deg))}
.kx-card.t-ink{--tab:var(--site-text);--tabi:var(--site-bg);--tape:var(--site-text);--tapei:var(--site-bg)}
.kx-card.t-rose{--tab:color-mix(in srgb,var(--site-selected) 55%,var(--site-bg));--tabi:var(--site-text);--tape:color-mix(in srgb,var(--site-selected) 78%,var(--site-text));--tapei:#fff}
.kx-card.t-link{--tab:color-mix(in srgb,var(--site-link) 45%,var(--site-text));--tabi:var(--site-bg);--tape:color-mix(in srgb,var(--site-link) 45%,var(--site-text));--tapei:var(--site-bg)}
.kx-card.t-paper{--tab:color-mix(in srgb,var(--site-text) 22%,var(--site-bg));--tabi:var(--site-text);--tape:color-mix(in srgb,var(--site-text) 72%,var(--site-bg));--tapei:var(--site-bg)}
.kx-shelves{display:flex;flex-direction:column;gap:6px}
.kx-shelf{display:grid;grid-template-columns:minmax(110px,150px) minmax(0,1fr);gap:20px;align-items:start}
.kx-shelf-label{display:flex;align-items:baseline;gap:10px;padding-top:14px}
.kx-shelf-no{font-family:ui-monospace,"SFMono-Regular","Courier New",monospace;font-size:12px;letter-spacing:.14em;color:color-mix(in srgb,var(--site-text) 55%,transparent)}
.kx-shelf-name{font-family:var(--site-heading);font-size:24px;line-height:1;color:var(--site-text)}
.kx-bunting{position:relative;display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:8px;padding:0 6px 26px;min-width:0}
.kx-bunting-string{position:absolute;left:-6px;width:calc(100% + 12px);top:4px;height:calc(var(--sag) + 4px);overflow:visible;pointer-events:none;color:color-mix(in srgb,var(--site-text) 62%,transparent)}
.kx-flag-cell{display:flex;justify-content:center;padding-top:calc(4px + var(--y))}
.kx-flag{--f:var(--site-text);--fi:var(--site-container2);position:relative;display:flex;align-items:flex-start;justify-content:center;text-align:center;box-sizing:border-box;min-width:88px;max-width:100%;padding:14px 14px 30px;font-family:var(--site-body);font-weight:900;font-size:13px;letter-spacing:.1em;text-transform:uppercase;line-height:1.25;text-wrap:balance;color:var(--fi);background:var(--f);clip-path:polygon(0 0,100% 0,100% 100%,50% calc(100% - 16px),0 100%);transform-origin:50% 0;transform:rotate(var(--r));animation:kxFlagSway var(--d) ease-in-out var(--dl) infinite alternate;filter:drop-shadow(0 3px 2px rgba(62,50,40,.22));cursor:default}
.kx-flag::before{content:'';position:absolute;left:0;right:0;top:0;height:7px;background:rgba(0,0,0,.18)}
.kx-flag:hover{animation:kxFlagFlap .6s ease-in-out}
@keyframes kxFlagSway{from{transform:rotate(calc(var(--r) - 1.8deg))}to{transform:rotate(calc(var(--r) + 1.8deg))}}
@keyframes kxFlagFlap{0%{transform:rotate(var(--r))}25%{transform:rotate(-9deg)}55%{transform:rotate(6deg)}80%{transform:rotate(-3deg)}100%{transform:rotate(var(--r))}}
.kx-flag.c1{--f:color-mix(in srgb,var(--site-selected) 40%,var(--site-bg));--fi:var(--site-text)}
.kx-flag.c2{--f:var(--site-bg);--fi:var(--site-text)}
.kx-flag.c3{--f:color-mix(in srgb,var(--site-link) 30%,var(--site-text))}
.kx-flag-lead{font-size:14.5px}
@media (prefers-reduced-motion:reduce){.kx-flag,.kx-flag:hover{animation:none}}
@media (max-width:720px){
  .kx-shelf{grid-template-columns:1fr;gap:6px}
  .kx-bunting{display:flex;flex-wrap:wrap;gap:12px 8px;border-top:1.5px solid color-mix(in srgb,var(--site-text) 62%,transparent);padding-bottom:14px}
  .kx-bunting-string{display:none}
  .kx-flag-cell{padding-top:0}
}
`;
function About({ skills }) {
  const shelves = [
    { no: '01', name: 'Skills', tone: 'ink', items: ['Photography', 'Filming', 'Graphic Design', 'Web Design', 'HTML & CSS', 'Social Media Strategy', 'Video Editing', 'Podcast Editing', 'Blog Editing', 'Script Coverage', 'AI Image & Video Generation', 'Live Event Production'] },
    { no: '02', name: 'AI', tone: 'rose', lead: 'AI Video & Image Generation', items: ['LiblibTV', 'Kling', 'Seedance', 'TapNow', 'Midjourney', 'Lovart'] },
    { no: '03', name: 'Software / Platform', tone: 'link', items: ['CapCut', 'Adobe Creative Suite', 'Figma', 'Microsoft Office Suite', 'Riverside'] },
    { no: '04', name: 'Language', tone: 'paper', items: ['Mandarin — fluent', 'English — fluent', 'Korean — conversational'] },
  ];
  const SAG = 26;
  return (
    <>
      <KXCover title="About" img="assets/cutout-about.webp" layered imgHeight="84%" />
      <KXSection embed="https://famous-ferret-196518.framer.app/" embedBare alt="Interactive polaroid" bg="var(--site-container)">
        <KXKicker>Who am I?</KXKicker>
        <KXH3>A creator at heart</KXH3>
        <KXP>I'm drawn to work that happens live: <KXHL>concerts</KXHL>, <KXHL>music shows</KXHL>, and <KXHL>broadcasts</KXHL> where everything has to land
          the first time. I love <KXHL>filming</KXHL> and <KXHL>video production</KXHL>, and I'm happiest close to the music, whether that's
          behind a camera, at a console, or helping a show come together.</KXP>
        <KXP>Through internships at <KXHL>Hunan TV</KXHL> and <KXHL>Shenzhen Media Group</KXHL>, I've trained with the
          VFX broadcasting team of <KXHL>Singer 2026</KXHL>, brainstormed stage visuals for a <KXHL>CCTV-hosted music festival</KXHL>,
          directed a commercial livestream, and edited daily news videos for a 7M+ audience.</KXP>
      </KXSection>
      <KXBand bg="var(--site-container2)">
        <KXKicker>What I do</KXKicker>
        <KXH3 style={{ marginBottom: 28 }}>Skills & tools</KXH3>
        <style>{SKILL_CSS}</style>
        {window.KXSkillsAlt && ['sheet', 'tracks', 'timeline', 'passport', 'jars'].includes(skills) ? <window.KXSkillsAlt kind={skills} shelves={shelves} /> : skills !== 'bunting' ? (
        <div className="kx-cards">
          {shelves.map((s) => (
            <div className={'kx-card t-' + s.tone} key={s.no}>
              <div className="kx-card-tab"><b>{s.no}</b><span>{s.name}</span></div>
              <div className="kx-card-body">
                {s.lead ? <div className="kx-card-lead">{s.lead}</div> : null}
                {s.items.map((t, j) => (
                  <div className="kx-tape-row" key={t}><span className="kx-tape" style={{ '--tr': ((j * 37 + s.no.charCodeAt(1)) % 5 - 2) * 0.35 + 'deg' }}>{t}</span></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        ) : (
        <div className="kx-shelves">
          {shelves.map((s, i) => {
            const flags = (s.lead ? [s.lead] : []).concat(s.items);
            const n = flags.length;
            const w = flags.map((_, j) => (s.lead && j === 0 ? 1.9 : 1));
            const W = w.reduce((a, b) => a + b, 0);
            const mid = w.map((x, j) => (w.slice(0, j).reduce((a, b) => a + b, 0) + x / 2) / W);
            return (
            <div className="kx-shelf" key={s.no}>
              <div className="kx-shelf-label"><span className="kx-shelf-no">{s.no}</span><span className="kx-shelf-name">{s.name}</span></div>
              <div className="kx-bunting" style={{ '--sag': SAG + 'px', gridTemplateColumns: w.map((x) => 'minmax(0,' + x + 'fr)').join(' ') }}>
                <svg className="kx-bunting-string" viewBox={'0 0 100 ' + SAG} preserveAspectRatio="none" aria-hidden="true"><path d={'M0,0 Q50,' + SAG * 2 + ' 100,0'} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke"></path></svg>
                {flags.map((t, j) => {
                  const u = mid[j];
                  const k = (i * 2 + j) % 4;
                  return (
                  <div className="kx-flag-cell" key={t} style={{ '--y': (SAG * 4 * u * (1 - u)).toFixed(1) + 'px' }}>
                    <span className={'kx-flag c' + k + (s.lead && j === 0 ? ' kx-flag-lead' : '')}
                      style={{ '--r': ((0.5 - u) * 7).toFixed(1) + 'deg', '--d': 2.6 + (j % 3) * 0.5 + 's', '--dl': -j * 0.7 + 's' }}>{t}</span>
                  </div>);
                })}
              </div>
            </div>);
          })}
        </div>
        )}
      </KXBand>
    </>
  );
}

/* ---------------- EDUCATION ---------------- */
function Education({ council }) {
  return (
    <>
      <KXCover title="Education" img="assets/cover4.webp" layered />
      <KXSection img="assets/freshman.webp" alt="Kaylee with friends, freshman year" bg="var(--site-container)"
        windows={[
          { src: 'assets/freshman.webp', title: 'FRESHMAN.jpg', alt: 'Kaylee with friends, freshman year' },
          { src: 'assets/edu-win-2.webp', title: 'Photo Booth', alt: 'NYU photo' },
          { src: 'assets/edu-win-3.webp', title: 'Us', alt: 'NYU photo' }]}>
        <KXKicker>2024 – 2028</KXKicker>
        <KXH3>New York University · <i className="kx-bodoni">Steinhardt</i></KXH3>
        <KXP><KXHL>Bachelor of Science in Media, Culture, and Communication</KXHL> — New York, NY.</KXP>
        <KXP>Minor in the Business of Entertainment, Media, and Technology, and in Integrated Design
          and Media. NYU Steinhardt Dean's List (2024–25, 2025–26).</KXP>
        <KXH4>Relevant coursework</KXH4>
        <div className="kx-skill-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
          {['Business Structure of the Music Industry', 'Digital Business Strategy',
            'Entertainment & Media Industries', 'Television Management', 'Movie Marketing',
            'Producing for Film & TV'].map(c => <KXTag key={c}>{c}</KXTag>)}
        </div>
      </KXSection>
      <KXSection img="assets/studentcouncil.webp" alt="Kaylee with the Student Council" bg="var(--site-container2)" reverse
        gallery={council && council !== 'single' && window.KXCouncilPhotos ? <window.KXCouncilPhotos layout={council} /> : null}>
        <KXKicker>2021 – 2024</KXKicker>
        <KXH3>Vanke Meisha Academy</KXH3>
        <KXP>I completed my high school diploma in <KXHL>Shenzhen, China</KXHL>, where I served on
          the Student Council as a Think Tank Member, worked as an editor and on publicity for our Magazine Club, and sang in the Choir.</KXP>
        <KXP>Most of this work meant collaborating with large groups of people, and it's where I built
          a real sense of belonging and responsibility to a team, something I've carried into every project since.</KXP>
      </KXSection>
    </>
  );
}

/* ---------------- EXPERIENCES ---------------- */
const HL = (props) => React.createElement(window.KXHL, props);
const U = (props) => React.createElement(window.KXU, props);
const N = ({ children }) => <b className="kx-stat">{children}</b>;
const EXPERIENCES = [
  {
    id: 'luxhammer',
    dates: 'Sept – Dec 2026', location: 'Los Angeles, CA',
    role: 'Film, TV & Branded Intern', org: 'LUXHAMMER',
    points: [
            <>Work directly with the CEO and write <HL>script coverage</HL> for incoming projects.</>,
            <>Edit the CEO's <HL>podcast series</HL>, publish it across platforms, and cut <HL>short-form clips</HL> for social.</>,
            'Turn podcast episodes into blog posts.',
            <>Research agency contacts for media packages pairing <HL>branded entertainment</HL> with <HL>Digital Trends</HL> ad buys.</>,
            <>Edit Steve Burns' <HL>“Blender Brilliance”</HL> course into easy-to-follow tutorial modules.</>,
    ],
    tags: ['Podcast Editing', 'Script Coverage', 'Branded Content'],
  },
  {
    id: 'hunantv', img: 'assets/exp-hunantv.jpg',
    dates: 'Jun – Aug 2026', location: 'Changsha, China',
    role: 'AI Production Studio Intern', org: 'Hunan TV',
    points: [
            <>Co-created a <HL>virtual singer music video</HL>, designing the stage, lighting, camera angles, and storyboard, then generating final visuals on LiblibTV.</>,
            <>Produced <HL>AI-generated three-minute short-form videos</HL> for a new Hunan TV social media account, working from fast-paced, high-concept scripts.</>,
            <>Apprenticed with the <HL>VFX Production & Broadcasting</HL> team of <HL>“<N>Singer 2026</N>”</HL>, training on MA lighting console and Green Hippo media server workflows for live broadcast.</>,
            <>Produced the <HL>nominee VCR for the 33rd <N>China TV Golden Eagle Awards</N></HL>, using AI tools to juxtapose each actor with their nominated character.</>,
            <>Brainstormed <HL>video jockey (VJ) sequences</HL> and key visual concepts for the <HL>CCTV-hosted <b>N²EE-LUNA “Rising Moon Over the Sea” Music Festival</b>.</HL></>,
            'Built reference asset sets for each project to keep AI-generated videos and posters consistent across generations.',
    ],
    tags: ['AI Video', 'Live Broadcast', 'Visual Design'],
  },
  {
    id: 'szmg',
    dates: 'May – Aug 2025', location: 'Shenzhen, China',
    role: 'News Center Intern', org: 'Shenzhen Media Group (SZMG)',
    points: [
            <>Managed official social media accounts; edited and uploaded daily news videos reaching <HL><N>7M+</N> nationwide followers</HL> and driving continued audience growth.</>,
            <>Wrote and edited WeChat Official Account articles for the Minsheng News Division — health and wellness coverage and healthcare/social-welfare campaigns, each with <HL><N>400+</N> views.</HL></>,
            <>Produced <HL>commercial video content</HL> and worked with talent during on-site filming to advertise featured products.</>,
            <>Directed a <HL>commercial live-streaming event</HL> — overseeing show flow, cueing, and real-time stage coordination — peaking at <HL><N>1,200+</N> concurrent viewers.</HL></>,
    ],
    tags: ['Video Editing', 'Social Media', 'Live Production'],
  },
  {
    id: 'council',
    dates: 'May 2022 – May 2024', location: 'Shenzhen, China',
    role: 'Publicity Coordinator & Think Tank Member', org: 'Student Council',
    points: [
            <>Organized Orientation Week for <HL><N>700+</N> participants</HL>, helping new students adjust and build community.</>,
            <>Managed the Council's <HL>WeChat Official Account</HL>, producing written and video content for branding and event notices.</>,
            <>Led the planning and execution of <HL>"Thanksgiving Week"</HL> — gratitude notes, DIY crafts, and photo-collage activities to strengthen the student–faculty bond.</>,
    ],
    tags: ['Event Planning', 'Content', 'Leadership'],
  },
  {
    id: 'magazine',
    dates: 'Sept 2021 – May 2024', location: 'Shenzhen, China',
    role: 'Editor & Designer', org: 'Magazine Club',
    points: [
            <>Managed the club's WeChat Official Account — wrote, edited, and published literary articles averaging <HL><N>500+</N> views each.</HL></>,
            <>Developed feature columns including original poems, film reviews, and short stories, and <HL>interviewed students and faculty</HL> to highlight personal narratives.</>,
            <>Designed <HL>magazine covers and cultural merchandise</HL> for the annual journal release, strengthening the club's visual identity.</>,
    ],
    tags: ['Editorial', 'Graphic Design', 'Branding'],
  },
  {
    id: 'vlog',
    dates: '2018 – Present',
    role: 'Vlogger & Content Creator', org: 'Douyin, RedNote & WeChat Channel',
    points: [
            <><HL>Film and edit vlogs</HL> documenting my life and experiences as an international student; grew to <HL><N>3.1k+</N> followers and <N>357k+</N> likes</HL> across all platforms.</>,
            'Share college application tips, TOEFL practice guides, and CTB competition experiences.',
            <>Collaborate with brands for commercial promotion and <HL>produce sponsored content.</HL></>,
    ],
    tags: ['Vlogging', 'Editing', 'Brand Collabs'],
  },
];
function Experiences({ exp }) {
  return (
    <>
      <KXCover title="Experiences" img="assets/cutout-experiences.webp" layered imgHeight="88%" />
      <KXBand bg="var(--site-container)">
        {React.createElement(exp === 'reel' ? window.KXExperienceReel : window.KXExperienceRundown, { items: EXPERIENCES })}
      </KXBand>
    </>
  );
}

/* ---------------- PORTFOLIO ----------------
   To embed a video on any project, set ONE of:
     video:     'https://www.youtube.com/embed/XXXX'  (or Vimeo/Bilibili embed URL)
     videoFile: 'assets/videos/my-edit.mp4'            (a local file in the project)
   Add `src` for a cover image, `long` for the full write-up (use \n for paragraphs),
   `meta` for the detail rows, and `link` for an external "watch on …" button. */
function Portfolio() {
  const [active, setActive] = React.useState(null);
  const film = [
    { id: 'roughtrade', category: 'Documentary', title: 'Rough Trade NYC',
      desc: 'An ethnographic short documentary on the people and culture of an independent NYC record store.',
      long: 'Shot and edited as part of my media studies coursework, this documentary presents our __ethnographic study of Rough Trade NYC__, a two-level __independent record store located in Rockefeller Center__, Manhattan. Founded in London in 1976, Rough Trade has grown into an international brand that now holds about 30% of the UK vinyl market, operating ten stores worldwide — seven in the UK, two in New York City, and one in Berlin. The Rough Trade Above store opened in 2021, and the new Rough Trade Below performance space followed in April 2025. Beyond selling vinyl across genres, the store also offers ==books==, ==cassettes==, and ==merchandise==, and regularly hosts ==live events== that connect artists and fans.\nThrough __two two-hour observation sessions and four interviews__ with staff and customers, we explored Rough Trade as both a retail space and a community that thrives at the intersection of tradition and technology. Our research focuses on the tension between the ==digital streaming industry== and the persistence of ==physical media==. We ask: what keeps a record store thriving in an age when music is instantly available online? Is vinyl today simply a symbol of nostalgia, or has it taken on new meanings of authenticity, belonging, and resistance in the digital era? This project aims to capture __how Rough Trade continues to reinvent what it means to experience music together in a physical space.__',
      meta: [['Role', 'Director / Editor'], ['Type', 'Ethnographic doc'], ['Year', '2025']],
      video: 'https://www.youtube-nocookie.com/embed/S6CiHQ_IUQ4',
      src: 'assets/portfolio-roughtrade.webp', accent: 'var(--site-container2)',
      link: { label: 'Watch on YouTube', href: 'https://www.youtube.com/watch?v=S6CiHQ_IUQ4' },
      tags: ['Filming', 'Editing', 'Sound'] },
    { id: 'cellist', category: 'Documentary', title: 'Portrait of a Cellist',
      desc: 'An intimate short documentary, shot, directed, and edited entirely by me.',
      long: 'A short documentary __shot, directed, and edited entirely by me__ — an ==intimate portrait of a cellist== and a day in her life, tracing her journey from backstage preparation to final performance. Through this single day, the film unfolds a much longer story: __over a decade of discipline, growth, and emotional commitment to music.__\nThe documentary centers on ==Eva==, an NYU student who has been playing the cello since third grade. What began as childhood music lessons gradually became a defining part of her identity. Beyond her technical training, her relationship with music expanded into a connection with ==Chinese traditional music==, where she performs in Chinese orchestras and now serves as the president of the Chinese Traditional Music Club at New York University.\nStructured around the natural timeline of a gala performance — __preparation, rehearsal, performance, and the curtain call__ — the film unfolds in these four chapters. It uses observational B-roll as its narrative backbone. Footage of makeup, tuning, backstage waiting, rehearsals, and live performance will be interwoven with interviews reflecting on her childhood, years of training, moments of frustration, and the role music has played in shaping her life.\nAt its core, the driving question is: __What does it mean to grow up with a Western instrument and carry it over with her own understanding, and incorporate Chinese traditional music elements and techniques?__',
      meta: [['Role', 'Solo — everything'], ['Type', 'Portrait doc'], ['Year', '2026']],
      video: 'https://www.youtube-nocookie.com/embed/TgbS2BAxXNY',
      src: 'assets/portfolio-cellist.webp', accent: 'var(--site-container2)',
      link: { label: 'Watch on YouTube', href: 'https://youtu.be/TgbS2BAxXNY' },
      tags: ['Directing', 'Cinematography', 'Editing'] },
    { id: 'rangerover', category: 'Video Editing', title: 'Range Rover BTS Vlog',
      desc: 'A short-form behind-the-scenes vlog I co-filmed and edited at a Range Rover commercial shoot, posted on the talent’s Douyin.',
      long: 'A behind-the-scenes vlog I edited from a __commercial shooting collaboration with Range Rover__, following one of our compères/talent through the day of the shoot.\nRather than the commercial itself, this is the personal, on-set story — the energy between takes, the crew, and the talent — cut as a short-form video for her own Douyin account.\nI filmed part of the footage myself, and the talent shot the rest.',
      meta: [['Role', 'Editor / Co-filming'], ['Format', 'Short-form video'], ['Platform', 'Douyin (talent’s account)'], ['Made at', 'SZMG']],
      src: 'assets/portfolio-rangerover.webp', sideBySide: true,
      video: 'https://drive.google.com/file/d/1sqqbqx7O19A1YHspxLQhBUvCqf6OL6K_/preview',
      link: { label: 'Watch on Douyin', href: 'https://v.douyin.com/TaaY3ZO33MY/' },
      tags: ['Video Editing', 'BTS', 'Social'] },
    { id: 'yuesaikan', category: 'Short-form Documentary', title: 'Interview with Yue-Sai Kan',
      desc: 'A short-form documentary-style interview with Yue-Sai Kan, written and edited for Douyin.',
      long: 'An __interview between an SZMG reporter and Yue-Sai Kan__, cut as a short-form video for Douyin.\nThe piece is ==documentary-style== and ==informative==. I wrote the ==narrative script== and ==edited== the video, shaping the conversation into a clear story for a short-form audience.',
      meta: [['Role', 'Scriptwriter / Editor'], ['Format', 'Short-form video'], ['Platform', 'Douyin'], ['Made at', 'SZMG']],
      src: 'assets/portfolio-yuesaikan.jpg', sideBySide: true,
      video: 'https://drive.google.com/file/d/1bFaD4Whosm_tO43jZXeZU4efTS3PCmI7/preview',
      tags: ['Video Editing', 'Scriptwriting', 'Interview'] },
    { id: 'mementomuseum', category: 'Art Film', title: 'Memento Museum',
      desc: 'Filming for Coco’s art project, Memento Museum, made for her course Memory Studio.',
      long: 'I was responsible for ==filming== my friend Coco’s art project, __Memento Museum__, made for her course ==Memory Studio==. It was shot on a ==Fujifilm X-S10== camera.\nCoco’s artist statement:\nMemory shows us what time is, and it leaves deep marks in everyone’s heart. In this video, I use five installations (wontons, the hospital, the wet market, bubbles, and teeth) to explore childhood, growing up, and wishes. Each piece is a reconstruction of a memory from my past, and each one expresses my personal experience.\nThese works record my own past, and I also hope they lead viewers to think of their own experiences. Memories are fragile and fade easily, like bubbles bursting in the sunlight, or the wish made after losing a tooth that never comes true. Still, we keep making wishes, and we let go of the bad memories from the hospital. I connected all of these through the medium of a diary, hoping to make the storyline clearer. It is like looking back at my own diary: every moment, experience, and memory recorded in it seems to have passed.',
      meta: [['Role', 'Cinematographer'], ['Camera', 'Fujifilm X-S10'], ['Artist', 'Coco'], ['Course', 'Memory Studio'], ['Platform', 'WeChat Channels']],
      accent: 'var(--site-container2)', src: 'assets/memento-bubbles.jpg',
      gallerySections: [
        { columns: 2,
          items: [
            { src: 'assets/memento-bubbles.jpg', bg: '#eef1f4', aspect: '1600 / 854', caption: '' },
            { src: 'assets/memento-teeth.jpg', bg: '#eef1f4', aspect: '1600 / 862', caption: '' },
          ] },
      ],
      link: { label: 'Watch on WeChat Channels', href: 'https://weixin.qq.com/sph/A9oy1is8Km' },
      tags: ['Filming', 'Cinematography', 'Art'] },
  ];
  const design = [
    { id: 'rps', category: 'UI / UX Design', title: 'Rock Paper Scissors',
      desc: 'A silent, playful two-player Rock Paper Scissors game for mobile.',
      long: 'A playful mobile game UI/UX design for Rock Paper Scissors, built as a ==lightweight prototype== for two people to play on their own phones. It\'s a __silent game that leans on visual elements__ to carry the experience, keeping written instructions to a minimum — players throw their move by ==tapping and swiping== to choose between rock, paper, and scissors.\nRather than lean on familiar app conventions, pairing is kept minimal and imaginative — inspired by AirDrop, two players hold the tops of their phones together to pair, a lightweight way to find each other and know the connection succeeded, handled in just two or three screens. The design covers the full flow: ==pairing==, ==the throw==, and the ==win / lose / tie result states==, all tied together with the literal rock, paper, and scissors icons, a paper-white canvas, and soft pastel result cards.',
      meta: [['Role', 'UI / UX Designer'], ['Tools', 'Figma'], ['Year', '2026']],
      src: 'assets/portfolio-rps.webp', accent: 'var(--site-container2)', sideBySide: true, phoneFrame: true,
      screens: [
        { id: 'start', label: 'Start', src: 'assets/rps/rps-start.png' },
        { id: 'lobby', label: 'Join a game' },
        { id: 'ready', label: 'Get ready', src: 'assets/rps/rps-ready.png' },
        { id: 'choose', label: 'Make your throw', src: 'assets/rps/rps-choose.png' },
        { id: 'waiting', label: 'Waiting', src: 'assets/rps/rps-waiting.png' },
        { id: 'reveal', label: 'Reveal', src: 'assets/rps/rps-reveal.png' },
        { id: 'win', label: 'Result: win', src: 'assets/rps/rps-win.png' },
        { id: 'lose', label: 'Result: lose', src: 'assets/rps/rps-lose.png' },
        { id: 'tie', label: 'Result: tie', src: 'assets/rps/rps-tie.png' },
        { id: 'again', label: 'Play again', src: 'assets/rps/rps-again.png' }],
      video: 'https://embed.figma.com/proto/6DTAYKLHzkPqfDUZjs1eS5/Rock-Paper-Scissor?node-id=214-5192&scaling=contain&content-scaling=responsive&page-id=214%3A5107&starting-point-node-id=214%3A5192&embed-host=share&hide-ui=1&hotspot-hints=0',
      embedTall: true,
      links: [
        { label: 'Open prototype in Figma', href: 'https://www.figma.com/proto/6DTAYKLHzkPqfDUZjs1eS5/Rock-Paper-Scissor?node-id=251-405&p=f&scaling=scale-down&content-scaling=fixed&page-id=214%3A5107&starting-point-node-id=214%3A5192' },
        { label: 'View design file in Figma', href: 'https://www.figma.com/design/6DTAYKLHzkPqfDUZjs1eS5/Rock-Paper-Scissor?node-id=214-5107' },
      ],
      tags: ['Figma', 'UI', 'Illustration'] },
    { id: 'cards', category: 'Graphic Design', title: 'Playing Card Set',
      desc: 'A reimagined court-card set — fox, cat, and mouse stand in for King, Queen, and Jack.',
      long: 'A Bauhaus-inspired playing-card system designed in Adobe Illustrator. Rather than relying on traditional drawing, the brief was to __build complex, modular characters from simple geometric shapes__ — replacing the traditional pips (♠♥♦♣) with a ==circle==, a ==triangle==, a ==square==, and a ==fourth pip== of my own design. These shapes became the building blocks of the entire deck.\nI focused most of my effort on perfecting the court cards — ==King, Queen, and Jack==. The same cast of animal characters (cats, mice, and foxes) is constructed entirely from the pip shapes.\nThe project was an exercise in contrast, hierarchy, and rigor — applying Gestalt unity and modularity to develop a cohesive system, and committing to a tight set of self-imposed rules and one shape language across the whole deck.',
      meta: [['Role', 'Illustrator / Designer'], ['Tools', 'Adobe Illustrator'], ['Cards', 'King · Queen · Jack']],
      src: 'assets/cards/printed-faces.webp', accent: 'var(--site-container2)',
      gallerySections: [
        { columns: 3,
          items: [
            { src: 'assets/cards/facecard-1.webp', label: 'Pixel & rounded', bg: '#fff', caption: 'Blocky pixel treatment (top) and the soft rounded treatment (bottom).' },
            { src: 'assets/cards/facecard-2.webp', label: 'Geometric & pip', bg: '#fff', caption: 'Sharp geometric triangles (top) beside the rounded set (bottom).' },
            { src: 'assets/cards/back-pattern.webp', label: 'Card back', bg: '#fff', caption: 'A tiled pattern of the animal faces, designed for the back of every card.' },
          ] },
        { columns: 2,
          items: [
            { src: 'assets/cards/printed-faces.webp', label: 'Printed deck — faces', bg: '#f4f1ec', aspect: '1500 / 2620', caption: 'The court cards as a physical deck.' },
            { src: 'assets/cards/printed-backs.webp', label: 'Printed deck — backs', bg: '#f4f1ec', aspect: '1500 / 2620', caption: 'The patterned backs on the finished cards.' },
          ] },
      ],
      tags: ['Illustration', 'Graphic Design', 'Adobe Illustrator'] },
    { id: 'magazine', category: 'Editorial Design', title: 'Magazine Club Designs',
      desc: 'Cover and visual identity for the Magazine Club’s annual journal — featuring Volume 7, “洄 / Reverse.”',
      long: 'Covers and cultural merchandise designed for the annual journal release during my time leading design in the Magazine Club — strengthening the club’s visual identity across print and merch.\nShown here is ==Volume 7 (2024)== of Vanke Meisha Academy’s “Tide” magazine, titled ==“洄” (Reverse)==. The cover carries the theme in moving water — swirling currents and eddies framing the hand-brushed character 洄. I also worked on several of the issue’s feature columns — the ==Photography Column==, the bilingual ==Tide Interview==, and the ==3-Line Love-Letters==. The spreads below are excerpts from the printed magazine.',
      meta: [['Role', 'Editor & Designer'], ['Issue', 'No. 7 · 洄 / Reverse'], ['Year', '2024'], ['Magazine', 'Tide · Vanke Meisha Academy']],
      src: 'assets/magazine-mockup.webp', accent: 'var(--site-container2)',
      gallerySections: [
        { columns: 2,
          items: [
            { src: 'assets/magazine-mockup.webp', label: 'Printed edition — the full run', bg: '#eef1f4', caption: 'The finished Volume 7 in print — copies laid out to show the front cover, the back cover, and an inner spread from the feature columns.' },
            { src: 'assets/magazine-vol7.webp', label: 'Tide — Volume 7 (2024) · 洄 / Reverse', bg: '#eaf4fb', caption: '“洄” — to flow back — is both motion and stillness: the surge that stirs beneath calm water. As we race forward through time, memory pulls us upstream, back toward the spray that once broke against the banks. This issue invites you to drift back through the words and let your thoughts migrate home.' },
          ] },
        { columns: 3,
          items: [
            { src: 'assets/magazine-photography.webp', label: 'Photography Column · 摄影专栏', bg: '#f3e9c9', caption: 'Reader photography on the “洄 / Reverse” theme, captured across phones and cameras.' },
            { src: 'assets/magazine-interview.webp', label: 'Tide Interview · 潮间漫谈', bg: '#e4eee2', caption: 'A bilingual interview column — this issue, English teacher Nick McNamara on AI and the value of literature.' },
            { src: 'assets/magazine-loveletters.webp', label: '3-Line Love-Letters · 三行情书', bg: '#f7e3e8', caption: 'A reader column of three-line love poems, paired with photography.' },
          ] },
      ],
      tags: ['Editorial', 'Branding', 'Print'] },
    { id: 'stickers', category: 'Graphic Design', title: 'Sticker Set Designs',
      desc: 'Two themed sticker sets designed for high school events — “Grateful Memoir” and “Zone.”',
      long: 'Two sticker sets I designed and illustrated in high school for student-run events.\n==“Grateful Memoir” (幸忆 — “happy memories”)== was designed for __Thanksgiving Week__, woven together with elements from our Student Council, whom I served on. ==“Zone”== was designed for our school’s __TEDx event__, built around that year’s theme of the same name.\nThe mockups below illustrate how each set could be applied to tote bags, mugs, badge holders, tins, and notebooks.',
      meta: [['Role', 'Illustrator / Designer'], ['Sets', 'Grateful Memoir · Zone'], ['Made for', 'Thanksgiving Week · TEDx']],
      src: 'assets/stickers-gratefulmemoir-mockup.png', accent: 'var(--site-container2)',
      gallerySections: [
        { columns: 2,
          items: [
            { src: 'assets/stickers-gratefulmemoir-sheet.png', label: 'Grateful Memoir · 幸忆 — sticker sheet', bg: '#fdf6ee', caption: '“幸忆” — happy memories. Designed for Thanksgiving Week, woven together with imagery from our Student Council.' },
            { src: 'assets/stickers-gratefulmemoir-mockup.png', label: 'Grateful Memoir — merch mockup (illustrative)', bg: '#f4ede0', caption: '' },
          ] },
        { columns: 2,
          items: [
            { src: 'assets/stickers-zone-sheet.png', label: 'Zone — sticker sheet', bg: '#fdf9ef', caption: 'Designed for our school’s TEDx event, built around that year’s theme, “Zone.”' },
            { src: 'assets/stickers-zone-mockup.png', label: 'Zone — merch mockup (illustrative)', bg: '#f2ede2', caption: '' },
          ] },
      ],
      tags: ['Illustration', 'Graphic Design', 'Branding'] },
    { id: 'dti', category: 'Fashion Design', title: 'Dress to Impress',
      desc: 'Three redesigns of our school uniform, covering both the formal and PE sets.',
      long: 'A 2021 school project where the brief was to be as creative as possible in __redesigning our school uniform__, with full sets for both the ==formal uniform== and the ==PE uniform==, for girls and boys.\nAll three designs share one common element: the traditional Chinese ==frog fastening== (盘扣). Around it, each sketch takes a different direction. ==Sketch 1== leans slightly Irish and gothic, ==Sketch 2== draws on the modern Tang suit, and ==Sketch 3== is slightly more British.',
      meta: [['Role', 'Designer'], ['Sets', 'Formal · PE'], ['Year', '2021']],
      src: 'assets/dti-sketch-2.jpg', accent: 'var(--site-container2)',
      gallerySections: [
        { columns: 3,
          items: [
            { src: 'assets/dti-sketch-1.jpg', label: 'Sketch 1 · Irish / gothic', bg: '#fff', aspect: '1280 / 1621', caption: 'Ruffled blouses, a capelet with frog fastenings, and a red plaid skirt.' },
            { src: 'assets/dti-sketch-2.jpg', label: 'Sketch 2 · Modern Tang suit', bg: '#fff', aspect: '1280 / 1621', caption: 'Mandarin collars, knotted closures, and a unisex coat with frog fastenings at the hem.' },
            { src: 'assets/dti-sketch-3.jpg', label: 'Sketch 3 · British', bg: '#fff', aspect: '1280 / 1621', caption: 'Madras plaid, a unisex knit cardigan with frog fastenings, and crested sportswear.' },
          ] },
      ],
      tags: ['Fashion Design', 'Sketching', 'Illustration'] },
  ];
  const ai = [
    { id: 'virtualsinger', category: 'AI Music Video', title: 'Virtual Singer Performance',
      desc: 'An AI-generated singer performance video inspired by the stage and style of Hunan TV’s “Singer”.',
      long: 'A music video for an __AI-generated virtual singer__, modelled on the stage and visual style of Hunan TV’s music show ==“Singer”==.\nThe song, ==《孩子》 (“Kid”)==, is AI-generated as well, and pays tribute to Gu Cheng’s poem __《我是一个任性的孩子》 (“I Am a Wilful Child”)__.\nWorking with another intern, we designed the ==stage== together and planned how the ==lighting== would progress through the song. I then generated the ==second half (1:26 – 3:15)== on LiblibTV, handling its ==camera angles==, ==video content==, and ==lighting changes==, while the other intern created the first half.',
      meta: [['Role', 'Co-creator · Second-half generation'], ['Song', '《孩子》 Kid'], ['My part', '1:26 – 3:15'], ['Tool', 'LiblibTV'], ['Made at', 'Hunan TV']],
      src: 'assets/portfolio-virtualsinger-web.jpg', sideBySide: true,
      video: 'https://drive.google.com/file/d/1LFOcQYYlUKCvdBgvcwka7iMIbU2seQXQ/preview',
      gallerySections: [
        { heading: 'Reference assets', columns: 2,
          items: [
            { src: 'assets/vs-character-sheet-web.jpg', label: 'Character sheet', bg: '#fff', aspect: '16 / 9', caption: 'Face, expressions, turnaround, costume, and palette, used to keep the singer consistent across generations.' },
            { src: 'assets/vs-stage-layout-web.jpg', label: 'Stage layout', bg: '#fff', aspect: '16 / 9', caption: 'Front and top views of the stage, with mic stand placement.' },
            { src: 'assets/vs-crescent-web.jpg', label: 'Crescent set piece', bg: '#000', aspect: '16 / 9', caption: 'The central crystal crescent behind the singer.' },
            { src: 'assets/vs-guitar-web.jpg', label: 'Guitar reference', bg: '#000', aspect: '16 / 9', caption: 'Front, side, and back views so the instrument stays the same in every shot.' },
          ] },
      ],
      link: { label: 'Watch the full video on WeChat Channels', href: 'https://weixin.qq.com/sph/AfI7oJI3ga' },
      tags: ['AI Video', 'Stage Design', 'Music Video'] },
    { id: 'millionforward', category: 'AI Short Film', title: '1 Million People Must Keep Moving',
      desc: 'A three-minute AI-generated, high-concept survival comedy made for a new Hunan TV social media account.',
      long: '==《100万人必须一直向前》==: a million people are dropped onto an endless road and must keep moving forward. Anyone who falls below the minimum speed for 10 seconds is __deleted like a system file__. A game-show MC announces each brutal rule with cheerful variety-show energy, and the world escalates every 30 seconds, from survival game to moving city to a whole new civilisation.\nWe split the film by chapter. I was responsible for ==Chapter 6, “The Second Rule” (about 2:30 – 3:00)==, the finale. The camera rises to reveal that the road is a giant loop, the MC celebrates that 990,000 people have been “successfully eliminated”, and a wall rises across the horizon to set up the next stage.',
      meta: [['Role', 'Chapter 6 generation'], ['My part', '~2:30 – 3:00'], ['Length', '3 min'], ['Made at', 'Hunan TV']],
      src: 'assets/portfolio-millionforward-web.jpg', sideBySide: true,
      video: 'https://drive.google.com/file/d/1J6WAC_WcaP1brUo5war3Ee41LxtrOjEM/preview',
      gallerySections: [
        { heading: 'Reference assets', columns: 2,
          items: [
            { src: 'assets/mf-mc-web.jpg', label: 'MC turnaround', bg: '#fff', aspect: '2016 / 864', caption: 'Close-up, front, side, and back views that keep the MC consistent from shot to shot.' },
            { src: 'assets/mf-mic-web.jpg', label: 'MC microphone', bg: '#fff', aspect: '2016 / 864', caption: 'Three views of his signature Y2K microphone.' },
            { src: 'assets/mf-sets-web.jpg', label: 'Roadside set pieces', bg: '#fff', aspect: '2016 / 864', caption: 'Chrome trailers, a fuel tower, a grandstand, and a billboard, built as reusable props.' },
            { src: 'assets/mf-road-start-web.jpg', label: 'The starting line', bg: '#000', aspect: '640 / 357', caption: 'The road before the game begins.' },
            { src: 'assets/mf-road-web.jpg', label: 'The road, later', bg: '#000', aspect: '640 / 357', caption: 'The same road once the mobile stalls and services appear.' },
            { src: 'assets/mf-city-web.jpg', label: 'The moving city', bg: '#000', aspect: '16 / 9', caption: 'The road grown into a full city, with a hospital, shops, and towers.' },
          ] },
      ],
      tags: ['AI Video', 'Short Film', 'Social'] },
    { id: 'officewar', category: 'AI Short Film', title: 'Office Battle',
      desc: 'An AI-generated wuxia office comedy where a Monday pitch meeting turns into a martial-arts showdown.',
      long: '==《办公室战争》==: at an ad agency’s Monday meeting, a PPT suddenly gains the power to reshape reality, and one “just change this bit” sets off an escalating battle between the boss and his staff. The office is played as a __wuxia jianghu__: the young employees fight with PPT, AI, and design skills, while the boss answers with long-lost management techniques, from red-pen revisions to budget cuts.\nWe split the film by shot. I was responsible for ==shots 16 – 41== (about 0:38 – 1:50), covering most of ==Act 1 and Act 2==. The boss and the lead employee face off, the employee’s “AI creation” turns the meeting room into a cyberpunk city, and the boss strikes back with his first move, a giant palm made of red revision marks that wipes the city out.',
      meta: [['Role', 'Shots 16 – 41 generation'], ['My part', '~0:38 – 1:50'], ['Made at', 'Hunan TV']],
      src: 'assets/ow-cast-web.jpg', sideBySide: true,
      video: 'https://drive.google.com/file/d/1K0RESBMHQOAtNbGEQjACwv-hUxz-0Voz/preview',
      gallerySections: [
        { heading: 'Reference assets', columns: 2,
          items: [
            { src: 'assets/ow-cast-web.jpg', label: 'Seating plan', bg: '#fff', aspect: '16 / 9', caption: 'The full cast in place, locking who sits where so the seating never drifts between shots.' },
            { src: 'assets/ow-boss-web.jpg', label: 'The boss', bg: '#fff', aspect: '16 / 9', caption: 'Close-up, front, side, and back views of the boss.' },
            { src: 'assets/ow-employee-web.jpg', label: 'The lead employee', bg: '#fff', aspect: '16 / 9', caption: 'Close-up, front, side, and back views of the lead employee.' },
            { src: 'assets/ow-black-web.jpg', label: 'Black concept space', bg: '#000', aspect: '16 / 9', caption: 'The meeting room stripped away, just before the city appears.' },
            { src: 'assets/ow-city-web.jpg', label: 'Cyberpunk city', bg: '#000', aspect: '16 / 9', caption: 'The meeting table in the middle of the city the employee creates.' },
            { src: 'assets/ow-buddha-web.jpg', label: 'The giant Buddha', bg: '#000', aspect: '16 / 9', caption: 'Turnaround of the glowing Buddha behind the boss’s palm strike.' },
          ] },
      ],
      tags: ['AI Video', 'Short Film', 'Comedy'] },
  ];
  const web = [
    { id: 'website', category: 'Web · HTML, CSS & JS', title: 'My Personal Website',
      desc: 'A personal site I designed and built by hand in HTML, CSS, and JavaScript — the original of this portfolio.',
      long: 'A personal website I designed and built __entirely by hand__ in ==HTML, CSS, and JavaScript== — the original version that this portfolio grew out of.\nIt was where I first learned to translate a visual idea into structured, styled pages from scratch, and to add interactivity: a light/dark theme toggle that remembers your choice, a scroll-aware header, and a collapsible mobile menu. The live site is embedded below — use its own menu to move between About, Education, Experiences, Portfolio, and Contact.',
      meta: [['Role', 'Designer / Developer'], ['Built with', 'HTML · CSS · JavaScript'], ['Pages', '6 · hand-coded']],
      src: 'assets/website-cover-new.png', accent: '#e8e0ff',
      video: 'personal-site/content.html',
      link: { label: 'Open the full site in a new tab', href: 'personal-site/content.html' },
      tags: ['HTML', 'CSS', 'JavaScript', 'Web Design'] },
  ];
  const photo = [
    { id: 'kayleestudio', category: 'Photography', title: 'My Studio',
      desc: 'My photography portfolio, published as its own site.',
      long: 'My photography portfolio, designed as a __3D studio space__. ==Play around with it== in the live site above.',
      meta: [['Role', 'Photographer'], ['Site', 'kayleeyrxiao.github.io/kayleestudio']],
      src: 'assets/kayleestudio-cover.png', accent: '#e8e0ff',
      video: 'https://kayleeyrxiao.github.io/kayleestudio/',
      link: { label: 'Open the full site in a new tab', href: 'https://kayleeyrxiao.github.io/kayleestudio/' },
      tags: ['Photography'] },
  ];
  const secondImg = p => {
    const all = p.gallerySections ? p.gallerySections.flatMap(s => s.items) : (p.gallery || []);
    const hit = all.map(g => g.src).find(s => s && s !== p.src);
    return hit || null;
  };
  const card = (p, i) => <KXProjectCard key={p.id} slotId={'pf-' + p.id} category={p.category} title={p.title}
    desc={p.desc} src={p.src} hoverSrc={secondImg(p)} accent={p.accent} bodyBg={p.bodyBg} hasVideo={!!(p.video || p.videoFile)}
    frame={i + 1} onOpen={() => setActive(p)} />;
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 };
  const folders = [
    { id: 'film', kicker: 'Film & Video', name: 'Filming & Video Editing',
      count: film.length + ' works', peeks: film.map(p => p.src), stickers: ['📹', '🎬'],
      content: film.length > 3 ? <KXCarousel>{film.map(card)}</KXCarousel> : <div className="kx-portfolio-grid" style={grid}>{film.map(card)}</div> },
    { id: 'ai', kicker: 'AI', name: 'AI Video',
      count: ai.length + (ai.length === 1 ? ' work' : ' works'), peeks: ai.map(p => p.src).filter(Boolean),
      stickers: ['🤖', '🦾'],
      content: ai.length > 3 ? <KXCarousel>{ai.map(card)}</KXCarousel> : <div className="kx-portfolio-grid" style={grid}>{ai.map(card)}</div> },
    { id: 'design', kicker: 'Design', name: 'Graphic & UI Design',
      count: design.length + ' works', peeks: (() => { const s = design.map(p => p.src), i = design.findIndex(p => p.id === 'stickers'); if (i > 1) [s[1], s[i]] = [s[i], s[1]]; return s; })(), stickers: ['🎨', '✏️'],
      content: <KXCarousel>{design.map(card)}</KXCarousel> },
    { id: 'web', kicker: 'Web', name: 'Web Design',
      count: web.length + (web.length === 1 ? ' work' : ' works'), peeks: web.map(p => p.src),
      stickers: ['💻', '🖱️'],
      content: web.length > 3 ? <KXCarousel>{web.map(card)}</KXCarousel> : <div className="kx-portfolio-grid" style={grid}>{web.map(card)}</div> },
    { id: 'photo', kicker: 'Photography', name: 'Photography',
      count: photo.length + (photo.length === 1 ? ' work' : ' works'), peeks: photo.map(p => p.src).filter(Boolean),
      stickers: ['📷', '🎞️'],
      content: <div className="kx-portfolio-grid" style={grid}>{photo.map(card)}</div> },
  ];
  return (
    <>
      <KXCover title="Portfolio" img="assets/cutout-portfolio.webp" layered />
      <KXBand bg="var(--site-container2)" id="pf-browse">
        <KXKicker>Contents</KXKicker>
        <KXH3 style={{ marginBottom: 30 }}>Open a folder</KXH3>
        <window.KXFolderIndex folders={folders} />
      </KXBand>
      <KXProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}

/* ---------------- CONTACT ---------------- */
/* the heading types itself: connect / create / collaborate, on a loop */
const TYPE_WORDS = { en: ['connect', 'create', 'collaborate'], zh: ['联系', '创作', '合作'] };
const TYPE_LEAD = { en: "Let's ", zh: '一起' };
function TypeWord() {
  const [lang, setLang] = React.useState(() => (window.KXGetLang ? window.KXGetLang() : 'en'));
  const [text, setText] = React.useState('');
  React.useEffect(() => {
    const on = (e) => setLang(e.detail);
    window.addEventListener('kx-lang-change', on);
    return () => window.removeEventListener('kx-lang-change', on);
  }, []);
  React.useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText((TYPE_WORDS[lang] || TYPE_WORDS.en)[0]);
      return undefined;
    }
    const words = TYPE_WORDS[lang] || TYPE_WORDS.en;
    let w = 0, i = 0, erasing = false, timer = 0, live = true;
    const step = () => {
      if (!live) return;
      const word = words[w];
      i += erasing ? -1 : 1;
      setText(word.slice(0, i));
      let wait = erasing ? 55 : 110 + Math.random() * 70;
      if (!erasing && i === word.length) { erasing = true; wait = 1500; }
      else if (erasing && i === 0) { erasing = false; w = (w + 1) % words.length; wait = 420; }
      timer = setTimeout(step, wait);
    };
    timer = setTimeout(step, 500);
    return () => { live = false; clearTimeout(timer); };
  }, [lang]);
  return (
    <span>
      <span>{TYPE_LEAD[lang] || TYPE_LEAD.en}</span>
      <span className="kx-type" data-no-i18n="true">{text}<span className="kx-caret" aria-hidden="true"></span></span>
    </span>
  );
}
const CURL_SLICES = 24;
/* the stub rolls up like a page curl: it's drawn as N horizontal slices, each
   clipped out of a full copy of the stub and mapped onto a cylinder whose root
   travels from the top edge down to the bottom. */
function TearStub({ torn, onDone, children }) {
  const wrapRef = React.useRef(null);
  const slices = React.useRef([]);
  React.useEffect(() => {
    if (!torn) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { onDone && onDone(); return; }
    const W = wrapRef.current ? wrapRef.current.offsetWidth : 92;
    const H = wrapRef.current ? wrapRef.current.offsetHeight : 400;
    const R = Math.max(20, W / 2.8);
    const dur = 1450;
    let start = null, raf = 0;
    const step = (t) => {
      if (start === null) start = t;
      const raw = Math.min(1, (t - start) / dur);
      const p = 1 - Math.pow(1 - raw, 2.1);
      const root = -R * 0.4 + (H + R * 1.6) * p;
      for (let i = 0; i < slices.current.length; i++) {
        const el = slices.current[i];
        if (!el) continue;
        const y = (i / CURL_SLICES) * H;
        const s = root - y;
        if (s <= 0) { el.style.transform = 'none'; el.style.filter = 'none'; continue; }
        const th = Math.min(s / R, Math.PI * 2.6);
        const ny = root - R * Math.sin(th);
        const z = R * (1 - Math.cos(th));
        el.style.transform = 'translate3d(0,' + (ny - y).toFixed(2) + 'px,' + z.toFixed(2) +
          'px) rotateX(' + (-th * 180 / Math.PI).toFixed(2) + 'deg)';
        el.style.filter = 'brightness(' + (1 + 0.05 * Math.cos(th) - 0.22 * (1 - Math.cos(th)) / 2).toFixed(3) + ')';
      }
      if (raw < 1) raf = requestAnimationFrame(step); else onDone && onDone();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [torn]);
  return (
    <div className="kx-ticket-stub" ref={wrapRef} aria-hidden="true">
      {!torn && children}
      {torn && Array.from({ length: CURL_SLICES }).map((_, i) => {
        const a = (i / CURL_SLICES) * 100, b = ((i + 1) / CURL_SLICES) * 100 + 0.2;
        return (
          <div key={i} className="kx-curl-slice" ref={(el) => { slices.current[i] = el; }}
            style={{ transformOrigin: '50% ' + a + '%',
              clipPath: 'polygon(-5% ' + a + '%,105% ' + a + '%,105% ' + b + '%,-5% ' + b + '%)' }}>
            <div className="kx-curl-inner">{children}</div>
          </div>
        );
      })}
    </div>
  );
}
function Contact() {
  const row = { display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 14 };
  const lbl = { fontFamily: 'var(--site-nav)', fontSize: 15, letterSpacing: '.14em',
    textTransform: 'uppercase', color: 'var(--site-selected)', minWidth: 96 };
  const val = { fontFamily: 'var(--site-body)', fontSize: 19, color: 'var(--site-text)', textDecoration: 'none' };
  const [status, setStatus] = React.useState(null); // null | 'sending' | 'ok' | 'error'
  const [torn, setTorn] = React.useState(false);
  const [flyoff, setFlyoff] = React.useState(false);
  const [gone, setGone] = React.useState(false);
  React.useEffect(() => {
    if (!torn) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && window.KXTearSound) window.KXTearSound({ tearDur: 1.45, slideAt: 1.45 });
    return undefined;
  }, [torn]);
  React.useEffect(() => {
    if (!flyoff) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setTimeout(() => setGone(true), reduce ? 0 : 820);
    return () => clearTimeout(id);
  }, [flyoff]);
  const [errors, setErrors] = React.useState({});
  const clearErr = (name) => setErrors(prev => (prev[name] ? { ...prev, [name]: null } : prev));
  function validate(form) {
    const val = (n) => (form.elements[n] ? String(form.elements[n].value || '').trim() : '');
    const next = {};
    if (!val('first-name')) next['first-name'] = 'Please enter your first name.';
    if (!val('last-name')) next['last-name'] = 'Please enter your last name.';
    const email = val('email');
    if (!email) next.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'That email doesn\'t look right — check for a missing @ or domain.';
    if (!val('message')) next.message = 'Please enter a message.';
    return next;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) { const el = form.elements[first]; if (el && el.focus) el.focus(); return; }
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/mqevdpoy', {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
      });
      if (res.ok) { setStatus('ok'); setTorn(true); form.reset(); }
      else { setStatus('error'); }
    } catch (err) { setStatus('error'); }
  }
  return (
    <>
      <KXCover title="Contact" img="assets/cutout-contact-clean.png" layered imgHeight="74%" imgAnchor={57} />
      <div className="kx-contact-band kx-fullscreen-sec" style={{ background: 'var(--site-container)' }}>
        <div className="kx-contact" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
          maxWidth: 1000, margin: 'auto', padding: '64px 40px', alignItems: 'start',
          width: '100%', boxSizing: 'border-box' }}>
          <div>
            <KXKicker>Say hello</KXKicker>
            <KXH3><TypeWord /></KXH3>
            <KXP>I'm always happy to connect with people in music, media, and entertainment, whether it's for a creative collaboration,
              an opportunity, or just a chat. Reach me here:</KXP>
            <div style={{ marginTop: 26 }}>
              <div className="kx-contact-row" style={row}><span style={lbl}>Email</span><a href="mailto:kayleexiao0806@gmail.com" style={val}>kayleexiao0806@gmail.com</a></div>
              <div className="kx-contact-row" style={row}><span style={lbl}>Phone</span><span style={val}><a href="tel:+16463457392" style={val}>+1 646-345-7392</a> · <a href="tel:+8613510080927" style={val}>+86 135-1008-0927</a></span></div>
              <div className="kx-contact-row" style={row}><span style={lbl}>Based in</span><span style={val}>Los Angeles, CA · New York, NY</span></div>
              <div className="kx-contact-row" style={row}><span style={lbl}>LinkedIn</span>
                <a href="https://www.linkedin.com/in/kaylee-xiao-4562b738a" target="_blank" rel="noopener" style={val}>Kaylee Xiao →</a></div>
            </div>
          </div>
          <div className={'kx-ticket' + (torn ? ' kx-ticket-torn' : '') + (flyoff ? ' kx-ticket-flyoff' : '') + (gone ? ' kx-ticket-gone' : '')}>
          <form onSubmit={handleSubmit} noValidate className={'kx-ticket-main' + (status === 'ok' || status === 'error' ? ' kx-ticket-swapped' : '')} style={{ background: 'var(--site-form-bg)', padding: 26, borderRadius: 'var(--radius-site-lg)',
            display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 12px 30px rgba(0,0,0,.14)' }}>
            <window.KXTicketPiece side="main" />
            <h3 style={{ margin: 0, fontFamily: 'var(--site-heading)', fontSize: 28, color: 'var(--site-text)' }}>Get in touch</h3>
            <input type="hidden" name="_subject" value="New message from your portfolio site" />
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <KXField label={<>First Name <span className="kx-req">(required)</span></>} name="first-name" placeholder="Kaylee"
                  aria-invalid={!!errors['first-name']} onInput={() => clearErr('first-name')} />
                {errors['first-name'] && <span className="kx-field-err">{errors['first-name']}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <KXField label={<>Last Name <span className="kx-req">(required)</span></>} name="last-name" placeholder="Xiao"
                  aria-invalid={!!errors['last-name']} onInput={() => clearErr('last-name')} />
                {errors['last-name'] && <span className="kx-field-err">{errors['last-name']}</span>}
              </div>
            </div>
            <div>
              <KXField label={<>Email Address <span className="kx-req">(required)</span></>} name="email" type="email" placeholder="you@email.com"
                aria-invalid={!!errors.email} onInput={() => clearErr('email')} />
              {errors.email && <span className="kx-field-err">{errors.email}</span>}
            </div>
            <div>
              <KXField label={<>Message <span className="kx-req">(required)</span></>} name="message" multiline rows={5} placeholder="Enter your message here."
                aria-invalid={!!errors.message} onInput={() => clearErr('message')} />
              {errors.message && <span className="kx-field-err">{errors.message}</span>}
            </div>
            <KXSiteButton type="submit">{status === 'sending' ? 'Sending…' : 'Send'}</KXSiteButton>
            {(status === 'ok' || status === 'error') && (
              <div className="kx-ticket-msg" aria-live="polite">
                <span className="kx-ticket-msg-kicker">{status === 'ok' ? 'Admit One' : 'Void'}</span>
                <p className="kx-ticket-msg-text">{status === 'ok'
                  ? 'Thanks — your message has been sent!'
                  : 'Something went wrong. Please email kayleexiao0806@gmail.com directly.'}</p>
                {status === 'error'
                  ? <button type="button" className="kx-ticket-msg-again" onClick={() => setStatus(null)}>Try again</button>
                  : <span className="kx-ticket-msg-serial">{new Date().toLocaleDateString(undefined,
                      { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
              </div>
            )}
          </form>
          <TearStub torn={torn} onDone={() => setFlyoff(true)}>
            <window.KXTicketPiece side="stub" />
            <span className="kx-ticket-admit">Admit One</span>
            <span className="kx-ticket-barcode"></span>
            <span className="kx-ticket-serial">No. 2026</span>
          </TearStub>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { KXAbout: About, KXEducation: Education, KXExperiences: Experiences,
  KXPortfolio: Portfolio, KXContact: Contact });
})();
