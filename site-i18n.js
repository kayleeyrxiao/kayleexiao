/* ============================================================
   Kaylee Xiao — English / 中文 language layer.
   A dictionary of exact source strings + a DOM text-node
   translator that re-applies itself after every React render.
   Elements marked [data-no-i18n] are left alone.
   ============================================================ */
(function () {
const ZH = {
  /* ---- nav / chrome ---- */
  'About': '关于我',
  'Education': '教育背景',
  'Experiences': '专业经历',
  'Portfolio': '作品集',
  'Contact': '联系我',
  'View →': '查看 →',
  'View details →': '查看详情 →',
  'Watch & read →': '观看与阅读 →',
  'Back to top': '返回顶部',

  /* ---- corkboard hooks (also the CSS fallback fobs) ---- */
  'Who I am beyond the résumé.': '简历之外的我。',
  'NYU Steinhardt, and where it started.': '纽约大学 Steinhardt，以及一切的起点。',
  'Internships, leadership, creative work.': '实习、组织工作与创作。',
  'Documentaries, design, and code.': '纪录片、设计，还有代码。',

  /* ---- home ---- */
  'Hello, I\'m': '你好，我是',
  'View Portfolio': '查看作品集',
  'Get in touch': '联系我',
  'Portfolio & Resume': '作品集与简历',
  'A student at NYU Steinhardt who loves to make things — video, music, graphic design, and anything creative.':
    '在纽约大学 Steinhardt 学院念书，喜欢做点东西出来——视频、音乐、平面设计，和任何有创造力的。',
  'Welcome': '欢迎',
  'Hi, I\'m Kaylee —': '嗨，我是 Kaylee ——',
  'nice to meet you!': '很高兴认识你！',
  'I\'m Kaylee (': '我是 Kaylee（',
  'Yingrui Xiao': '肖璎芮',
  '), a student at': '），在',
  'NYU Steinhardt': '纽约大学 Steinhardt 学院',
  'studying Media, Culture, and Communication. I love to make things:':
    '读媒体、文化与传播。我喜欢自己动手做东西：',
  'video': '视频',
  'music': '音乐',
  'graphic design': '平面设计',
  'design': '设计',
  ', and anything creative.': '，和任何有创造力的。',
  ', and anything creative. Outside of class, I film and edit vlogs about my life as an international student, which have grown to': '，和任何有创造力的。课余时间，我拍摄并剪辑记录留学生活的 vlog，目前已获得',
  '357k+ likes': '35.7 万+ 点赞',
  'This website is where my education, experiences, and creative work live. Take a look around!':
    '这里放着我读书、实习和创作的点点滴滴，随便逛逛吧！',
  'Explore': '探索',
  'Where to next?': '接下来去哪儿？',
  'Who I am beyond the résumé — and what I love to create.': '简历之外的我，和我喜欢做的事。',
  'NYU Steinhardt, coursework, and where it started.': '纽约大学 Steinhardt，上过的课，和最初的起点。',
  'Internships, leadership, and creative work.': '实习、社团，还有那些创作。',
  'Documentaries, design, and a site I coded by hand.': '纪录片、设计，还有一个我一行行敲出来的网站。',

  /* ---- about ---- */
  'Who am I?': '我是谁？',
  'A creator at heart': '骨子里就想做东西',
  'I\'m drawn to work that happens live:': '我着迷于现场发生的工作：',
  'concerts': '演唱会',
  'music shows': '音乐节目',
  'broadcasts': '直播',
  'where everything has to land the first time. I love': '，一切都必须一次到位。我热爱',
  'filming': '拍摄',
  'and': '和',
  'video production': '视频制作',
  ', and I\'m happiest close to the music, whether that\'s behind a camera, at a console, or helping a show come together.': '，离音乐越近我越开心——无论是在镜头后、调音台前，还是帮一场演出落地成形。',
  'Through internships at': '通过在',
  'Shenzhen Media Group': '深圳广电集团',
  ', I\'ve trained with the VFX broadcasting team of': '的实习，我跟随',
  'Singer 2026': '《歌手2026》',
  ', brainstormed stage visuals for a': '视效播出团队学习，为一场',
  'CCTV-hosted music festival': '央视主办的音乐节',
  ', directed a commercial livestream, and edited daily news videos for a 7M+ audience.': '构思舞台视觉，执导过一场商业直播，并为 700 万+ 受众剪辑每日新闻视频。',
  'I\'m Kaylee — in Chinese,': '我是 Kaylee，中文名叫',
  '. I\'m a': '。我是一名',
  'student': '学生',
  'vlogger': 'Vlog 博主',
  'photographer': '摄影师',
  'content creator': '内容创作者',
  ', and': '、',
  ', ': '、',
  ',': '、',
  '. I love to create — anything related to creative and media work.':
    '。只要跟创意和媒体沾边的事，我都想试试。',
  'I study Media, Culture, and Communication at NYU Steinhardt, with a foot in the business of entertainment and a camera always close by. Whether it\'s editing a documentary, designing a magazine cover, or shooting a vlog, I\'m happiest when I\'m making something.':
    '我在纽约大学 Steinhardt 学院读媒体、文化与传播，也在学娱乐产业的商业那一块，相机基本不离身。不管是剪一部纪录片、做一本杂志封面，还是拍一支 Vlog——只要在做东西，我就是最开心的。',
  'What I do': '我会什么',
  'Skills & tools': '技能与工具',
  'Graphic Design': '平面设计',
  'CapCut': '剪映',
  'Photography': '摄影',
  'Filming': '摄像',
  'Web Design': '网页设计',
  'Microsoft Office Suite': 'Microsoft Office 办公套件',
  'Social Media Strategy': '社交媒体运营',
  'Strategic Content Development': '内容策划',
  'Languages': '语言',
  'pick a charm': '选一个挂件',
  'Make': '创作', 'Generate': '生成', 'Build': '搭建', 'Plan': '策划', 'Speak': '语言',
  'Mandarin — fluent': '中文 · 母语',
  'English — fluent': '英语 · 流利',
  'Korean — conversational': '韩语 · 日常交流',

  /* ---- education ---- */
  'New York University · Steinhardt': '纽约大学 · Steinhardt 学院',
  'New York University ·': '纽约大学 ·',
  'Steinhardt': 'Steinhardt 学院',
  'Bachelor of Science in Media, Culture, and Communication': '媒体、文化与传播 学士',
  '— New York, NY.': '——美国纽约。',
  'Minor in the Business of Entertainment, Media, and Technology, and in Integrated Design and Media. NYU Steinhardt Dean\'s List (2024–25, 2025–26).':
    '辅修娱乐、媒体与科技商业，以及综合设计与媒体，连续两年入选 Steinhardt 学院院长嘉许名单（2024–25、2025–26）。',
  'Relevant coursework': '相关课程',
  'Business Structure of the Music Industry': '音乐产业商业结构',
  'Methods in Media Studies': '媒体研究方法',
  'Digital Business Strategy': '数字商业战略',
  'Women as Entrepreneurs in Pop Music': '流行音乐中的女性创业者',
  'Producing for Film & TV': '影视制片',
  'Movie Marketing': '电影营销',
  'Entertainment & Media Industries': '娱乐与媒体产业',
  'Television Management': '电视管理',
  'Critical Video': '影像批评与创作',
  'Media and Culture of Money': '媒体与金钱文化',
  'Critical Making': '批判性创造',
  'Vanke Meisha Academy': '万科梅沙书院',
  'I completed my high school diploma in': '我在',
  'Shenzhen, China': '中国深圳',
  ', where I served on the Student Council as a Think Tank Member and sang in the Choir — and really grew into editing, design, and storytelling.':
    '读的高中，在学长团是智囊团成员，也在合唱团唱歌。剪辑、设计和讲故事这几件事，也是在那几年真正打磨起来的。',

  'AI Video & Image Generation': 'AI 视频与图像生成',
  /* ---- experiences ---- */
  'Jun – Aug 2026': '2026年6月 – 8月',
  'Changsha, China': '中国长沙',
  'AI Production Studio Intern': 'AI 制作工作室实习生',
  'Hunan TV': '湖南卫视',
  'Co-created a': '参与共创',
  'virtual singer music video': '虚拟歌手 MV',
  ', designing the stage, lighting, camera angles, and storyboard, then generating final visuals on LiblibTV.': '，设计舞台、灯光、机位与分镜，并在 LiblibTV 上生成最终画面。',
  'Produced three minutes of AI-generated short-form video': '制作三分钟 AI 生成短视频',
  'for a new Hunan TV social media account, working from fast-paced, high-concept scripts.': '，服务湖南卫视新开设的社交媒体账号，脚本节奏快、概念性强。',
  'Apprenticed with the VFX Production & Broadcasting team of': '跟随',
  '“Singer 2026”': '《歌手2026》',
  ', training on MA lighting console and Green Hippo media server workflows for live broadcast.': '视效制作与播出团队学习，接受 MA 灯光控台与 Green Hippo 媒体服务器直播流程培训。',
  'Produced the': '制作',
  'nominee VCR for the China TV Golden Eagle Awards': '中国电视金鹰奖提名 VCR',
  ', using AI tools to juxtapose each actor with their nominated character.': '，用 AI 工具将每位演员与其提名角色同框呈现。',
  'Brainstormed video jockey (VJ) sequences and key visual concepts for a CCTV-hosted music festival.': '为央视主办的音乐节构思 VJ 视频段落与主视觉概念。',
  'Built reference asset sets for each project to keep AI-generated videos and posters consistent across generations.': '为每个项目搭建参考素材库，保证 AI 生成的视频与海报在多次生成中风格一致。',
  'AI Video': 'AI 视频',
  'Live Broadcast': '直播播出',
  'Visual Design': '视觉设计',
  'May – Aug 2025': '2025年5月 – 8月',
  'May 2022 – May 2024': '2022年5月 – 2024年5月',
  'Sept 2021 – May 2024': '2021年9月 – 2024年5月',
  '2018 – Present': '2018年至今',
  'News Center Intern': '民生新闻部门实习生',
  'Shenzhen Media Group (SZMG)': '深圳广播电影电视集团（SZMG）',
  'Managed official social media accounts; edited and uploaded daily news videos reaching': '社交媒体运营：管理“第一现场”微信视频号和抖音账号，编辑并上传新闻视频内容，',
  '7M+ nationwide followers': '最高浏览量超 83 万',
  'and driving continued audience growth.': '。',
  'Wrote and edited WeChat Official Account articles for the Minsheng News Division — health and wellness coverage and healthcare/social-welfare campaigns, each with': '公众号内容制作：撰写并排版“深广电湾区健康”公众号文章，',
  '400+ views.': '阅读人数 400+。',
  'Produced': '视频策划与拍摄：',
  'commercial video content': '参与新媒体视频内容策划及现场拍摄工作',
  'and worked with talent during on-site filming to advertise featured products.': '，最高点赞超 500。',
  'Directed a': '直播现场统筹：',
  'commercial live-streaming event': '担任直播 PD',
  '— overseeing show flow, cueing, and real-time stage coordination — peaking at': '，负责现场流程衔接、提示与场控，',
  '1,200+ concurrent viewers.': '最高同时观看人数达 1200+。',
  'Video Editing': '视频剪辑',
  'Social Media': '社交媒体',
  'Live Production': '直播制作',
  'Publicity Coordinator & Think Tank Member': '文宣负责人 & 智囊团成员',
  'Student Council': '学长团',
  'Organized Orientation Week for': '迎新周活动策划：组织并策划',
  '700+ participants': '700+ 人参与的迎新周活动',
  ', helping new students adjust and build community.': '，帮助新生更好融入校园。',
  'Managed the Council\'s': '社交媒体运营：运营公众号，负责内容撰写、视频制作和公众号排版，',
  'WeChat Official Account': '粉丝达到 1000+',
  ', producing written and video content for branding and event notices.': '。',
  'Led the planning and execution of': '活动策划 & 执行：担任',
  '"Thanksgiving Week"': '感恩周活动项目负责人',
  '— gratitude notes, DIY crafts, and photo-collage activities to strengthen the student–faculty bond.': '，策划并推进项目进行，吸引全校师生参加。',
  'Event Planning': '活动策划',
  'Content': '内容创作',
  'Leadership': '团队领导',
  'Editor & Designer': '编辑 & 设计',
  'Magazine Club': '杂志社',
  'Managed the club\'s WeChat Official Account — wrote, edited, and published literary articles averaging': '新媒体运营：负责公众号编辑与排版，策划选题，撰写并发表多篇推文，',
  '500+ views each.': '每篇阅读量超 500。',
  'Developed feature columns including original poems, film reviews, and short stories, and': '内容策划 & 采访：策划专题栏目，',
  'interviewed students and faculty': '组织并制作优秀学生与教师采访，阅读量超 400',
  'to highlight personal narratives.': '。',
  'Designed': '视觉设计：担任杂志社',
  'magazine covers and cultural merchandise': '封面与文创周边设计',
  'for the annual journal release, strengthening the club\'s visual identity.': '，提高社团辨识度。',
  'Editorial': '编辑出版',
  'Branding': '品牌视觉',
  'Vlogger & Content Creator': 'Vlog 博主 & 内容创作者',
  'RedNote & WeChat Channel': '小红书 & 微信视频号',
  'Film and edit vlogs': '自己拍自己剪 Vlog',
  'documenting my life and experiences as an international student.': '，记录留学生活。',
  'documenting my life and experiences as an international student; grew to': '，记录留学生活，累计粉丝',
  '1.3k+ followers.': '1.3k+。',
  'Share college application tips, TOEFL practice guides, and CTB competition experiences.':
    '分享大学申请经验、托福备考方法和 CTB 竞赛的心得。',
  'Collaborate with brands for commercial promotion and': '和品牌合作做商业推广，',
  'produce sponsored content.': '产出定制内容。',
  'Vlogging': 'Vlog 拍摄',
  'Editing': '剪辑',
  'Brand Collabs': '品牌合作',

  /* ---- portfolio: sections ---- */
  'Documentary & video, graphic design, and a site I coded from scratch.':
    '纪录片和视频、平面设计，还有一个我从零手写出来的网站。',
  'Film & Video': '影像作品',
  'Documentary & editing': '纪录片与剪辑',
  'Graphic & UI Design': '平面与界面设计',
  'Design work': '设计作品',
  'Web': '网页',
  'Built by hand': '手写代码',
  'Video / stills coming soon': '视频 / 剧照即将上线',

  /* ---- portfolio: categories & tags ---- */
  'Documentary': '纪录片',
  'UI / UX Design': 'UI / UX 设计',
  'Editorial Design': '编辑设计',
  'Web · HTML, CSS & JS': '网页 · HTML、CSS 与 JS',
  'Sound': '声音',
  'Directing': '导演',
  'Cinematography': '摄影指导',
  'BTS': '幕后花絮',
  'Social': '社交媒体',
  'UI': '界面设计',
  'Illustration': '插画',
  'Print': '印刷',
  'Web Design ': '网页设计',

  /* ---- portfolio: rough trade ---- */
  'Rough Trade NYC': 'Rough Trade 纽约唱片店',
  'An ethnographic short documentary on the people and culture of an independent NYC record store.':
    '一部短纪录片，拍纽约一家独立唱片店里的人和他们的文化。',
  'Shot and edited as part of my media studies coursework, this documentary presents our': '这部纪录片拍摄、剪辑于我的媒体研究课程，呈现了我们对',
  'ethnographic study of Rough Trade NYC': 'Rough Trade 纽约店的民族志研究',
  ', a two-level': '——一家上下两层、',
  'independent record store located in Rockefeller Center': '位于曼哈顿洛克菲勒中心的独立唱片店',
  ', Manhattan. Founded in London in 1976, Rough Trade has grown into an international brand that now holds about 30% of the UK vinyl market, operating ten stores worldwide — seven in the UK, two in New York City, and one in Berlin. The Rough Trade Above store opened in 2021, and the new Rough Trade Below performance space followed in April 2025. Beyond selling vinyl across genres, the store also offers': '。Rough Trade 于 1976 年创立于伦敦，如今已成长为国际品牌，占据英国黑胶市场约 30% 的份额，在全球经营十家门店：英国七家、纽约两家、柏林一家。Rough Trade Above 于 2021 年开业，新的演出空间 Rough Trade Below 则在 2025 年 4 月落成。除了售卖各类黑胶唱片，店内还提供',
  'books': '书籍',
  'cassettes': '卡带',
  'merchandise': '周边',
  ', and regularly hosts': '，并定期举办',
  'live events': '现场活动',
  'that connect artists and fans.': '，连接音乐人与乐迷。',
  'Through': '通过',
  'two two-hour observation sessions and four interviews': '两场各两小时的实地观察与四次访谈',
  'with staff and customers, we explored Rough Trade as both a retail space and a community that thrives at the intersection of tradition and technology. Our research focuses on the tension between the': '（对象为店员与顾客），我们把 Rough Trade 视为一个零售空间，也视为一个在传统与技术交汇处生长的社群。研究聚焦于',
  'digital streaming industry': '数字流媒体产业',
  'and the persistence of': '与',
  'physical media': '实体媒介',
  '. We ask: what keeps a record store thriving in an age when music is instantly available online? Is vinyl today simply a symbol of nostalgia, or has it taken on new meanings of authenticity, belonging, and resistance in the digital era? This project aims to capture': '之间的张力：在音乐随手可得的时代，是什么让一家唱片店依然兴旺？今天的黑胶只是怀旧的符号，还是在数字时代被赋予了真实感、归属感与某种抵抗的新含义？这个项目希望记录',
  'how Rough Trade continues to reinvent what it means to experience music together in a physical space.': 'Rough Trade 如何不断重新定义“在同一个物理空间里共同聆听音乐”这件事。',
  ',': '、',
  ', and': '与',
  'Role': '角色',
  'Director / Editor': '导演 / 剪辑',
  'Type': '类型',
  'Ethnographic doc': '民族志纪录片',
  'Year': '年份',
  'Watch on YouTube': '在 YouTube 观看',

  /* ---- portfolio: cellist ---- */
  'Portrait of a Cellist': '大提琴手的一天',
  'An intimate short documentary, shot, directed, and edited entirely by me.':
    '从拍摄、导演到剪辑都由我一个人完成的人物短片。',
  'A short documentary': '短纪录片：',
  'shot, directed, and edited entirely by me': '由我独立拍摄、导演与剪辑',
  '— an': '——',
  'intimate portrait of a cellist': '一位大提琴手的近距离肖像',
  'and a day in her life, tracing her journey from backstage preparation to final performance. Through this single day, the film unfolds a much longer story:': '，记录她从后台准备到最终登台的一天。透过这一天，影片展开的是一个更长的故事：',
  'over a decade of discipline, growth, and emotional commitment to music.': '十余年的坚持、成长，以及对音乐的情感投入。',
  'The documentary centers on': '影片主角',
  'Eva': 'Eva',
  ', an NYU student who has been playing the cello since third grade. What began as childhood music lessons gradually became a defining part of her identity. Beyond her technical training, her relationship with music expanded into a connection with': '是纽约大学的学生，从小学三年级起学习大提琴。童年的音乐课逐渐成为她身份认同中不可分割的一部分。除了技术训练，她与音乐的关系还延伸到',
  'Chinese traditional music': '中国传统音乐',
  ', where she performs in Chinese orchestras and now serves as the president of the Chinese Traditional Music Club at New York University.': '——她在民乐团演出，如今担任纽约大学中国民乐团主席。',
  'Structured around the natural timeline of a gala performance —': '影片以一场晚会演出的自然时间线为结构——',
  'preparation, rehearsal, performance, and the curtain call': '准备、彩排、演出与谢幕',
  '— the film unfolds in these four chapters. It uses observational B-roll as its narrative backbone. Footage of makeup, tuning, backstage waiting, rehearsals, and live performance will be interwoven with interviews reflecting on her childhood, years of training, moments of frustration, and the role music has played in shaping her life.': '，分为四个章节，以观察式空镜作为叙事骨架。化妆、调音、后台等待、彩排与现场演出的影像，与她回忆童年、多年训练、挫败时刻以及音乐如何塑造她人生的访谈交织在一起。',
  'At its core, the driving question is:': '影片的核心问题是：',
  'What does it mean to grow up with a Western instrument and carry it over with her own understanding, and incorporate Chinese traditional music elements and techniques?': '对于 Eva 来说，伴随一件西洋乐器长大，再以自己的理解把它带入中国传统音乐的元素与技法之中，意味着什么？',
  'Solo — everything': '独立完成全部环节',
  'Portrait doc': '人物纪录片',

  /* ---- portfolio: range rover ---- */
  'Range Rover BTS Vlog': '路虎揽胜幕后 Vlog',
  'A short-form behind-the-scenes vlog I co-filmed and edited at a Range Rover commercial shoot, posted on the talent’s Douyin.':
    '路虎揽胜广告拍摄的幕后短视频 Vlog，由我参与拍摄并剪辑，发在出镜嘉宾的抖音上。',
  'Editor / Co-filming': '剪辑 / 联合拍摄',
  'Format': '形式',
  'Short-form video': '短视频',
  'I filmed part of the footage myself, and the talent shot the rest.': '部分素材由我拍摄，其余由嘉宾本人拍摄。',
  'A behind-the-scenes vlog I edited from a': '这支幕后 Vlog 剪辑自我们',
  'commercial shooting collaboration with Range Rover': '与路虎揽胜的商业拍摄合作',
  ', following one of our compères/talent through the day of the shoot.': '，跟拍主持人／出镜嘉宾一整天的拍摄过程。',
  'Rather than the commercial itself, this is the personal, on-set story — the energy between takes, the crew, and the talent — cut as a short-form video for her own Douyin account.':
    '它记录的不是广告本身，而是片场上的个人视角故事——镜头之间的氛围、team 与嘉宾的状态，专为她的抖音账号剪辑成短视频。',
  'Editor': '剪辑',
  'Brand': '品牌',
  'Range Rover': '路虎揽胜',
  'Platform': '发布平台',
  'Douyin (talent’s account)': '抖音（嘉宾账号）',
  'Made at': '任职单位',
  'Watch on Douyin': '在抖音观看',
  'Art Film': '艺术影像', 'Memento Museum': 'Memento Museum',
  'Filming for Coco’s art project, Memento Museum, made for her course Memory Studio.': '为好友 Coco 在 Memory Studio 课程中创作的艺术项目 Memento Museum 担任拍摄。',
  ', made for her course': '，这是她为课程', 'Memory Studio': 'Memory Studio', 'Course': '课程',
  'I was responsible for': '我负责', 'my friend Coco’s art project,': '好友 Coco 的艺术项目',
  '. It was shot on a': '创作的作品。本片使用', 'Fujifilm X-S10': 'Fujifilm X-S10', 'camera.': '相机拍摄。',
  'Coco’s artist statement:': 'Coco 的创作自述：', 'Bubbles': '泡泡', 'Teeth': '牙齿',
  'Memory shows us what time is, and it leaves deep marks in everyone’s heart. In this video, I use five installations (wontons, the hospital, the wet market, bubbles, and teeth) to explore childhood, growing up, and wishes. Each piece is a reconstruction of a memory from my past, and each one expresses my personal experience.': '记忆显示了时间是什么，在每个人的心中都留下了深深的痕迹。在这个视频中，我用五件装置（馄炖、医院、菜市场、泡泡、牙齿）来发现童年、成长和愿望。每一件作品都是对我过去记忆的重建，每一件作品都表现了我的个人经历。',
  'These works record my own past, and I also hope they lead viewers to think of their own experiences. Memories are fragile and fade easily, like bubbles bursting in the sunlight, or the wish made after losing a tooth that never comes true. Still, we keep making wishes, and we let go of the bad memories from the hospital. I connected all of these through the medium of a diary, hoping to make the storyline clearer. It is like looking back at my own diary: every moment, experience, and memory recorded in it seems to have passed.': '这些作品不仅记录了我过去的经历，也希望可以让观众想到自己的经历。回忆很脆弱，很容易消失，就像阳光下的泡沫会破裂，牙齿掉下来后许下的愿望永远不会实现，但我们还是会许下愿望，丢掉医院里不好的记忆等等。我把这些都通过日记的媒介联系起来，希望让故事线可以更清晰。这就像回头看到我自己的日记一样，记录在日记里，所有的时刻、经历和回忆都好像过去了一样。',
  'Cinematographer': '摄影师', 'Camera': '相机', 'Artist': '艺术家', 'WeChat Channels': '微信视频号', 'Art': '艺术',
  'Watch on WeChat Channels': '在微信视频号观看',

  /* ---- portfolio: rock paper scissors ---- */
  'Rock Paper Scissors': '石头剪刀布',
  'A silent, playful two-player Rock Paper Scissors game for mobile.':
    '一款弱化文字说明、强调视觉效果的双人猜拳小游戏。',
  'A playful mobile game UI/UX design for Rock Paper Scissors, built as a': '一款趣味手机游戏的 UI/UX 设计，为两人对战而做的',
  'lightweight prototype': '轻量原型',
  'for two people to play on their own phones. It\'s a': '。它是一款',
  'silent game that leans on visual elements': '“无声”、依靠视觉元素承载体验的游戏',
  'to carry the experience, keeping written instructions to a minimum — players throw their move by': '，文字说明降到最低——玩家通过',
  'tapping and swiping': '点击与滑动',
  'to choose between rock, paper, and scissors.': '，在石头、剪刀、布之间出招。',
  'Rather than lean on familiar app conventions, pairing is kept minimal and imaginative — inspired by AirDrop, two players hold the tops of their phones together to pair, a lightweight way to find each other and know the connection succeeded, handled in just two or three screens. The design covers the full flow:': '相比沿用常见的 App 交互惯例，配对方式被处理得更简洁也更有想象力——灵感来自隔空投送，两位玩家将手机顶部靠在一起即可配对，用两三个界面就完成“找到彼此”与“连接成功”的确认。设计覆盖了完整流程：',
  'pairing': '配对',
  'the throw': '出招',
  'win / lose / tie result states': '胜／负／平的结果状态',
  ', all tied together with the literal rock, paper, and scissors icons, a paper-white canvas, and soft pastel result cards.': '，并以石头、剪刀、布的具象图标、纸白色画布与柔和的马卡龙色结果卡片贯穿始终。',
  ', and the': '，以及',
  'UI / UX Designer': 'UI / UX 设计师',
  'Tools': '工具',
  'Open prototype in Figma': '在 Figma 打开原型',
  'View design file in Figma': '查看 Figma 设计文件',

  /* ---- portfolio: playing cards ---- */
  'Playing Card Set': '扑克牌设计',
  'A reimagined court-card set — fox, cat, and mouse stand in for King, Queen, and Jack.':
    '重新设计的人头牌——狐狸、猫和老鼠分别当 K、Q、J。',
  'A Bauhaus-inspired playing-card system designed in Adobe Illustrator. Rather than relying on traditional drawing, the brief was to': '一套受包豪斯启发、在 Adobe Illustrator 中完成的扑克牌系统。设计要求不依赖传统绘画，而是',
  'build complex, modular characters from simple geometric shapes': '用简单的几何形状搭建出复杂的模块化角色',
  '— replacing the traditional pips (♠♥♦♣) with a': '——以',
  'circle': '圆形',
  ', a': '、',
  'triangle': '三角形',
  'square': '方形',
  ', and a': '，以及我自行设计的',
  'fourth pip': '第四种花色',
  'of my own design. These shapes became the building blocks of the entire deck.': '，取代传统的黑桃、红心、方块与梅花。这些形状成为整副牌的基本构件。',
  'I focused most of my effort on perfecting the court cards —': '我把大部分精力放在打磨',
  'King, Queen, and Jack': 'K、Q、J 三张人头牌',
  '. The same cast of animal characters (cats, mice, and foxes) is constructed entirely from the pip shapes.': '上。同一组动物角色（猫、老鼠与狐狸）完全由花色形状拼构而成。',
  'The project was an exercise in contrast, hierarchy, and rigor — applying Gestalt unity and modularity to develop a cohesive system, and committing to a tight set of self-imposed rules and one shape language across the whole deck.':
    '这个项目是一次关于对比、层级与严谨度的练习——用格式塔的整体性与模块化建立统一系统，并在整副牌中坚持一套自设的严格规则与统一的形状语言。',
  'Illustrator / Designer': '插画 / 设计',
  'Adobe Illustrator': 'Adobe Illustrator',
  'Cards': '牌面',
  'King · Queen · Jack': 'K · Q · J',
  'Pixel & rounded': '像素与圆角',
  'Blocky pixel treatment (top) and the soft rounded treatment (bottom).': '上：块状像素处理；下：柔和圆角处理。',
  'Geometric & pip': '几何与花色',
  'Sharp geometric triangles (top) beside the rounded set (bottom).': '上：锐利的几何三角；下：圆角版本。',
  'Card back': '牌背',
  'A tiled pattern of the animal faces, designed for the back of every card.': '由动物面孔平铺而成的图案，用于每张牌的背面。',
  'Printed deck — faces': '成品牌面',
  'The court cards as a physical deck.': '实体印刷成品中的人头牌。',
  'Printed deck — backs': '成品牌背',
  'The patterned backs on the finished cards.': '成品牌张上的图案牌背。',

  /* ---- portfolio: magazine ---- */
  'Magazine Club Designs': '杂志社设计作品',
  'Cover and visual identity for the Magazine Club’s annual journal — featuring Volume 7, “洄 / Reverse.”':
    '杂志社年刊的封面和整体视觉设计，这里展示的是第七期《洄》。',
  'Covers and cultural merchandise designed for the annual journal release during my time leading design in the Magazine Club — strengthening the club’s visual identity across print and merch.':
    '我在杂志社负责设计期间，为年刊发布所做的封面与文创周边设计——在印刷品与周边上强化社团的视觉识别。',
  'Shown here is': '此处展示的是万科梅沙书院《潮》杂志',
  'Volume 7 (2024)': '2024 年第七期',
  'of Vanke Meisha Academy’s “Tide” magazine, titled': '，主题为',
  '“洄” (Reverse)': '“洄”',
  '. The cover carries the theme in moving water — swirling currents and eddies framing the hand-brushed character 洄. I also worked on several of the issue’s feature columns — the': '。封面以流动的水承载主题——回旋的水流与漩涡环绕着手写的“洄”字。我还参与了本期多个特色栏目的制作：',
  'Photography Column': '摄影专栏',
  ', the bilingual': '、双语的',
  'Tide Interview': '潮间漫谈访谈',
  ', and the': '，以及',
  '3-Line Love-Letters': '三行情书',
  '. The spreads below are excerpts from the printed magazine.': '。下方跨页为印刷版内页节选。',
  'Issue': '期号',
  'No. 7 · 洄 / Reverse': '第七期 · 洄',
  'Magazine': '杂志',
  'Tide · Vanke Meisha Academy': '《潮》· 万科梅沙书院',
  'Printed edition — the full run': '印刷成品全貌',
  'The finished Volume 7 in print — copies laid out to show the front cover, the back cover, and an inner spread from the feature columns.':
    '第七期的印刷成品——分别展示封面、封底与特色栏目的内页跨页。',
  'Tide — Volume 7 (2024) · 洄 / Reverse': '《潮》第七期（2024）· 洄',
  '“洄” — to flow back — is both motion and stillness: the surge that stirs beneath calm water. As we race forward through time, memory pulls us upstream, back toward the spray that once broke against the banks. This issue invites you to drift back through the words and let your thoughts migrate home.':
    '“洄”，逆流而上，既是动，也是静：平静水面之下涌动的暗流。当我们在时间里向前奔跑，记忆却把我们拉回上游，回到那些曾拍打堤岸的浪花。本期邀请你随文字回溯，让思绪洄游。',
  'Photography Column · 摄影专栏': '摄影专栏',
  'Reader photography on the “洄 / Reverse” theme, captured across phones and cameras.':
    '读者以“洄”为主题投稿的摄影作品，来自手机与相机的记录。',
  'Tide Interview · 潮间漫谈': '潮间漫谈',
  'A bilingual interview column — this issue, English teacher Nick McNamara on AI and the value of literature.':
    '双语访谈栏目——本期对话英语教师 Nick McNamara，聊人工智能与文学的价值。',
  '3-Line Love-Letters · 三行情书': '三行情书',
  'A reader column of three-line love poems, paired with photography.': '读者投稿的三行情诗栏目，与摄影作品搭配呈现。',

  /* ---- portfolio: ai video ---- */
  'AI Video': 'AI 视频',
  'AI Music Video': 'AI 音乐视频',
  'Virtual Singer Performance': '虚拟歌手舞台表演',
  'An AI-generated singer performance video inspired by the stage and style of Hunan TV’s “Singer”.': '以湖南卫视《歌手》的舞台与风格为参考的 AI 虚拟歌手表演视频。',
  'Co-creator · Second-half generation': '联合创作 · 后半段生成',
  'My part': '我负责的部分',
  'Second half of the song': '歌曲后半段',
  'Tool': '工具',
  'Stage Design': '舞台设计',
  'Music Video': '音乐视频',
  'Watch the full video on WeChat Channels': '在微信视频号观看完整视频',
  'Reference assets': '参考素材',
  'Song': '歌曲',
  'AI Short Film': 'AI 短片',
  '1 Million People Must Keep Moving': '100万人必须一直向前',
  'A three-minute AI-generated, high-concept survival comedy made for a new Hunan TV social media account.': '为湖南卫视新社交媒体账号制作的三分钟 AI 高概念生存喜剧短片。',
  'Chapter 6 generation': '第六章生成',
  '~2:30 – 3:00': '约 2:30 – 3:00',
  'Length': '时长',
  '3 min': '3 分钟',
  'Short Film': '短片',
  'Short-form Documentary': '纪实短视频',
  'Interview with Yue-Sai Kan': '靳羽西专访',
  'A short-form documentary-style interview with Yue-Sai Kan, written and edited for Douyin.': '与靳羽西的纪实风格短视频专访，由我撰写脚本并剪辑，发布于抖音。',
  'Scriptwriter / Editor': '脚本 / 剪辑',
  'Scriptwriting': '脚本撰写',
  'Interview': '访谈',
  'An': '这是一段', 'interview between an SZMG reporter and Yue-Sai Kan': '深圳广电记者与靳羽西的访谈',
  ', cut as a short-form video for Douyin.': '，剪辑成短视频发布在抖音。',
  'The piece is': '整支视频兼具', 'documentary-style': '纪实感', 'informative': '信息量',
  '. I wrote the': '。我撰写了', 'narrative script': '叙事脚本', 'edited': '剪辑了',
  'the video, shaping the conversation into a clear story for a short-form audience.': '视频，把对话梳理成适合短视频观众的清晰故事。',
  'Douyin': '抖音', 'SZMG': '深圳广电',
  'Office Battle': '办公室战争',
  'An AI-generated wuxia office comedy where a Monday pitch meeting turns into a martial-arts showdown.': '一部 AI 生成的武侠职场喜剧：周一的方案会变成一场武林对决。',
  'Shots 16 – 41 generation': '分镜 16 – 41 生成',
  '~0:38 – 1:50': '约 0:38 – 1:50',
  'Comedy': '喜剧',
  'Seating plan': '座次设定',
  'The boss': '老板',
  'The lead employee': '主员工',
  'Black concept space': '黑色概念空间',
  'Cyberpunk city': '赛博城市',
  'The giant Buddha': '佛祖化身',
  'The full cast in place, locking who sits where so the seating never drifts between shots.': '全员就位的座次图，锁定每个人的位置，避免镜头之间座次漂移。',
  'Close-up, front, side, and back views of the boss.': '老板的特写、正面、侧面与背面视图。',
  'Close-up, front, side, and back views of the lead employee.': '主员工的特写、正面、侧面与背面视图。',
  'The meeting room stripped away, just before the city appears.': '会议室被剥离后的空间，城市即将出现。',
  'The meeting table in the middle of the city the employee creates.': '员工创造出的城市中央的会议桌。',
  'Turnaround of the glowing Buddha behind the boss’s palm strike.': '老板出掌时身后发光佛祖的三视图。',
  'MC turnaround': 'MC 三视图',
  'MC microphone': 'MC 话筒',
  'Roadside set pieces': '路边场景道具',
  'The starting line': '起点',
  'The road, later': '之后的公路',
  'The moving city': '移动城市',
  'Close-up, front, side, and back views that keep the MC consistent from shot to shot.': '特写、正面、侧面与背面视图，保证 MC 在每个镜头中形象一致。',
  'Three views of his signature Y2K microphone.': '他标志性 Y2K 话筒的三视图。',
  'Chrome trailers, a fuel tower, a grandstand, and a billboard, built as reusable props.': '铬金属拖车、加油塔、看台与广告牌，作为可复用的场景道具。',
  'The road before the game begins.': '游戏开始前的公路。',
  'The same road once the mobile stalls and services appear.': '移动摊位与服务出现后的同一条公路。',
  'The road grown into a full city, with a hospital, shops, and towers.': '公路发展成完整城市，有医院、商店与高楼。',
  'Character sheet': '角色设定图',
  'Stage layout': '舞台布局',
  'Crescent set piece': '新月舞美装置',
  'Guitar reference': '吉他参考图',
  'Face, expressions, turnaround, costume, and palette, used to keep the singer consistent across generations.': '面部、表情、三视图、服装与配色，用于在多次生成中保持歌手形象一致。',
  'Front and top views of the stage, with mic stand placement.': '舞台正视图与俯视图，含话筒架摆位。',
  'The central crystal crescent behind the singer.': '歌手身后的水晶新月主装置。',
  'Front, side, and back views so the instrument stays the same in every shot.': '正、侧、背三视图，确保乐器在每个镜头中保持一致。',
  /* ---- portfolio: dress to impress ---- */
  'Dress to Impress': 'Dress to Impress 校服设计',
  'Fashion Design': '服装设计',
  'Three redesigns of our school uniform, covering both the formal and PE sets.': '三套校服重新设计方案，涵盖正装与体育服。',
  'Formal · PE': '正装 · 体育服',
  'Sketch 1 · Irish / gothic': '草图 1 · 爱尔兰 / 哥特风',
  'Sketch 2 · Modern Tang suit': '草图 2 · 新式唐装',
  'Sketch 3 · British': '草图 3 · 英伦风',
  'Ruffled blouses, a capelet with frog fastenings, and a red plaid skirt.': '荷叶边衬衫、带盘扣的小披肩，以及红色格纹裙。',
  'Mandarin collars, knotted closures, and a unisex coat with frog fastenings at the hem.': '立领、绳结扣，以及下摆饰有盘扣的中性外套。',
  'Madras plaid, a unisex knit cardigan with frog fastenings, and crested sportswear.': '马德拉斯格纹、带盘扣的中性针织开衫，以及饰有校徽的运动服。',
  'Sketching': '手绘',
  /* ---- portfolio: stickers ---- */
  'Sticker Set Designs': '贴纸套装设计',
  'Two themed sticker sets designed for high school events — “Grateful Memoir” and “Zone.”':
    '高中时给校园活动做的两套主题贴纸：《幸忆》和《Zone》。',
  'Two sticker sets I designed and illustrated in high school for student-run events.':
    '高中时期我为学生自主策划的活动设计并绘制的两套贴纸。',
  '“Grateful Memoir” (幸忆 — “happy memories”)': '《幸忆》',
  'was designed for': '为',
  'Thanksgiving Week': '感恩周',
  ', woven together with elements from our Student Council, whom I served on.': '设计，融入了我所在学长团的视觉元素；',
  '“Zone”': '《Zone》',
  'was designed for our school’s': '则为学校',
  'TEDx event': 'TEDx 活动',
  ', built around that year’s theme of the same name.': '设计，围绕当年的同名主题展开。',
  'The mockups below illustrate how each set could be applied to tote bags, mugs, badge holders, tins, and notebooks.':
    '下方样机展示了两套贴纸应用于帆布袋、马克杯、卡套、铁盒与笔记本上的效果。',
  'Sets': '套装',
  'Grateful Memoir · Zone': '幸忆 · Zone',
  'Made for': '应用场景',
  'Thanksgiving Week · TEDx': '感恩周 · TEDx',
  'Grateful Memoir · 幸忆 — sticker sheet': '《幸忆》贴纸原稿',
  '“幸忆” — happy memories. Designed for Thanksgiving Week, woven together with imagery from our Student Council.':
    '“幸忆”即美好的回忆。为感恩周设计，并融入学长团的视觉元素。',
  'Grateful Memoir — merch mockup (illustrative)': '《幸忆》周边样机（示意）',
  'Zone — sticker sheet': '《Zone》贴纸原稿',
  'Designed for our school’s TEDx event, built around that year’s theme, “Zone.”':
    '为学校 TEDx 活动设计，围绕当年的主题“Zone”展开。',
  'Zone — merch mockup (illustrative)': '《Zone》周边样机（示意）',

  /* ---- portfolio: personal website ---- */
  'My Personal Website': '我的个人网站',
  'A personal site I designed and built by hand in HTML, CSS, and JavaScript — the original of this portfolio.':
    '用 HTML、CSS 和 JavaScript 一行行写出来的个人网站，也是这个个人网站最初的样子。',
  'A personal website I designed and built': '一个',
  'entirely by hand': '完全由我手写',
  'in': '',
  'HTML, CSS, and JavaScript': 'HTML、CSS 与 JavaScript',
  '— the original version that this portfolio grew out of.': '设计并搭建的个人网站——现在这个网站正是从它生长出来的。',
  'It was where I first learned to translate a visual idea into structured, styled pages from scratch, and to add interactivity: a light/dark theme toggle that remembers your choice, a scroll-aware header, and a collapsible mobile menu. The live site is embedded below — use its own menu to move between About, Education, Experiences, Portfolio, and Contact.':
    '在这个项目里，我第一次学会把一个视觉想法从零翻译成有结构、有样式的页面，并加入交互：可记住选择的深浅色主题切换、随滚动变化的顶栏，以及可收起的移动端菜单。下方嵌入了网站实况——可用它自身的菜单在关于、教育、经历、作品与联系之间切换。',
  'Designer / Developer': '设计 / 开发',
  'Built with': '技术栈',
  'HTML · CSS · JavaScript': 'HTML · CSS · JavaScript',
  'Pages': '页面',
  '6 · hand-coded': '6 个 · 全手写',
  'Open the full site in a new tab': '在新标签页打开完整网站',

  /* ---- contact ---- */
  'Say hello': '打个招呼',
  'Let\'s connect': '聊聊吧',
  'I\'m always happy to connect with people in music, media, and entertainment, whether it\'s for a creative collaboration, an opportunity, or just a chat. Reach me here:': '很高兴认识音乐、媒体和娱乐行业的朋友，无论是创意合作、工作机会，还是随便聊聊，都欢迎找我：',
  'I\'m always open to creative collaborations, opportunities, or just a chat about media, film, and design. Reach me here:':
    '创意合作、工作机会，或者只是想聊聊媒体、影像和设计，都欢迎找我：',
  'Email': '邮箱',
  'Phone': '电话',
  'Phone (CN)': '中国手机',
  'Based in': '所在地',
  'Los Angeles, CA · New York, NY': '美国洛杉矶 · 纽约',
  'LinkedIn': '领英',
  'First Name': '名',
  'Last Name': '姓',
  'Email Address': '邮箱地址',
  'Message': '留言',
  'Send': '发送',
  'Please enter your first name.': '请填写名字。',
  'Please enter your last name.': '请填写姓氏。',
  'Please enter your email address.': '请填写邮箱地址。',
  'That email doesn\'t look right — check for a missing @ or domain.': '邮箱地址格式不太对，检查一下是否缺少 @ 或域名。',
  'Please enter a message.': '请填写留言内容。',
  'Sending…': '发送中…',
  'Thanks — your message has been sent!': '收到啦，谢谢你的留言！',
  'Something went wrong. Please email kayleexiao0806@gmail.com directly.': '好像出了点问题，可以直接发邮件到 kayleexiao0806@gmail.com。',
};

/* education / experiences / portfolio / contact gaps */
Object.assign(ZH, {
  ', where I served on the Student Council as a Think Tank Member, worked as an editor and on publicity for our Magazine Club, and sang in the Choir.': '读完高中，期间担任学长团智囊团成员，在杂志社负责编辑与宣传，还参加了合唱团。',
  'Most of this work meant collaborating with large groups of people, and it\'s where I built a real sense of belonging and responsibility to a team, something I\'ve carried into every project since.': '这些事大多需要和很多人一起协作，也让我真正有了对团队的归属感和责任感，这份感觉我一直带到了之后的每个项目里。',
  'Choir': '合唱团', 'FRESHMAN.jpg': '大一.jpg', 'Photo Booth': '大头贴',
  'Industry': '业界', 'Campus & creator': '校园与创作', '2018 — now': '2018 — 至今',
  'Douyin, RedNote & WeChat Channel': '抖音、小红书 & 微信视频号',
  'Sept – Dec 2026': '2026年9月 – 12月', 'Los Angeles, CA': '美国洛杉矶', 'Film, TV & Branded Intern': '影视与品牌内容实习生',
  'Work directly with the CEO and write': '直接对接 CEO，为新项目撰写', 'script coverage': '剧本评估报告', 'for incoming projects.': '。',
  'Edit the CEO\'s': '剪辑 CEO 的', 'podcast series': '播客系列', ', publish it across platforms, and cut': '并发布到各平台，同时剪出', 'short-form clips': '短视频切片', 'for social.': '用于社交媒体。',
  'Turn podcast episodes into blog posts.': '把播客单集改写成博客文章。',
  'Research agency contacts for media packages pairing': '调研代理商联系人，策划将', 'branded entertainment': '品牌娱乐内容', 'with': '与', 'ad buys.': '广告投放相结合的媒体套餐。',
  'Edit Steve Burns\'': '将 Steve Burns 的', '“Blender Brilliance”': '《Blender Brilliance》', 'course into easy-to-follow tutorial modules.': '课程剪辑成易于跟学的教程模块。',
  'Branded Content': '品牌内容',
  'AI-generated three-minute short-form videos': 'AI 生成的三分钟短视频',
  'Apprenticed with the': '跟随', 'VFX Production & Broadcasting': '', 'team of': '', '“': '', '”': '',
  'nominee VCR for the 33rd': '第33届', 'China TV Golden Eagle Awards': '中国电视金鹰奖提名 VCR',
  'Brainstormed': '构思', 'video jockey (VJ) sequences': 'VJ 视频段落', 'and key visual concepts for the': '与主视觉概念，服务于', 'CCTV-hosted': '央视主办的',
  'N²EE-LUNA “Rising Moon Over the Sea” Music Festival': 'N²EE-LUNA“海上生明月”音乐节',
  'nationwide followers': '全国粉丝', 'views.': '阅读量。', 'concurrent viewers.': '同时在线观看。', 'participants': '人参与的迎新周活动', 'views each.': '每篇阅读量。',
  'followers and': '，点赞', 'likes': '', 'across all platforms.': '（全平台）。',
  'Contents': '目录', 'Open a folder': '打开文件夹', 'Filming & Video Editing': '拍摄与视频剪辑',
  '(required)': '（必填）', 'Admit One': '凭此入场', 'ON AIR': '直播中', 'STANDBY': '待播'
});
/* passport stamps */
Object.assign(ZH, {
  'PASSPORT': '护照', 'Skills': '技能', 'Visas ·': '签证 ·', 'Arrival': '入境', 'Entry permit': '入境许可',
  '✈ Entry permit ✈': '✈ 入境许可 ✈', 'Visa granted': '签证已批', '✈ Visa granted ✈': '✈ 签证已批 ✈',
  'Admitted': '准予入境', '✈ Admitted ✈': '✈ 准予入境 ✈', 'Welcome to': '欢迎来到', '✈ Welcome to ✈': '✈ 欢迎来到 ✈',
  'Departure': '出境', '✈ Departure ✈': '✈ 出境 ✈', '✈ Arrival ✈': '✈ 入境 ✈',
  'Podcast Editing': '播客剪辑', 'Blog Editing': '博客编辑', 'Script Coverage': '剧本评估',
  'AI Image & Video Generation': 'AI 图像与视频生成', 'Live Event Production': '现场活动制作',
  'Software / Platform': '软件 / 平台', 'Language': '语言', 'Mandarin': '普通话', 'fluent': '流利',
  'English': '英语', 'Korean': '韩语', 'conversational': '日常会话', 'native': '母语', 'Cantonese': '粤语', 'basic': '基础'
});
const PP_MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function zhPattern(key) {
  let m = key.match(/^(\d{2}) ([A-Z]{3}) (\d{4})$/);
  if (m && PP_MON.indexOf(m[2]) >= 0) return m[3] + '.' + String(PP_MON.indexOf(m[2]) + 1).padStart(2, '0') + '.' + m[1];
  m = key.match(/^Rundown · (\d+) roles$/);
  if (m) return '节目单 · ' + m[1] + ' 段经历';
  m = key.match(/^(\d+) (works?|folders?)$/);
  if (m) return m[1] + (m[2][0] === 'w' ? ' 个作品' : ' 个文件夹');
  m = key.match(/^No\. (\d+)$/);
  if (m) return '编号 ' + m[1];
  return null;
}

/* AI video modals */
const ZH_AI = {
  'A music video for an': '这是一支为', 'AI-generated virtual singer': 'AI 生成的虚拟歌手',
  ', modelled on the stage and visual style of Hunan TV’s music show': '制作的音乐视频，舞台与视觉风格参照湖南卫视音乐节目',
  '“Singer”': '《歌手》', 'The song,': '歌曲', '《孩子》 (“Kid”)': '《孩子》',
  ', is AI-generated as well, and pays tribute to Gu Cheng’s poem': '同样由 AI 生成，致敬顾城的诗作',
  '《我是一个任性的孩子》 (“I Am a Wilful Child”)': '《我是一个任性的孩子》',
  'Working with another intern, we designed the': '我和另一位实习生一起设计了', 'stage': '舞台',
  'together and planned how the': '，并规划了', 'lighting': '灯光',
  'would progress through the song. I then generated the': '随歌曲推进的变化。之后我在 LiblibTV 上生成了',
  'second half (1:26 – 3:15)': '后半段（1:26 – 3:15）', 'on LiblibTV, handling its': '，负责其中的',
  'camera angles': '机位', 'video content': '画面内容', 'lighting changes': '灯光变化',
  ', while the other intern created the first half.': '；前半段由另一位实习生完成。', '《孩子》 Kid': '《孩子》',
  ': a million people are dropped onto an endless road and must keep moving forward. Anyone who falls below the minimum speed for 10 seconds is': '：一百万人被投放到一条没有尽头的公路上，必须一直向前。任何人低于最低速度超过 10 秒，就会被',
  'deleted like a system file': '像系统文件一样删除',
  '. A game-show MC announces each brutal rule with cheerful variety-show energy, and the world escalates every 30 seconds, from survival game to moving city to a whole new civilisation.': '。一位游戏节目 MC 用综艺式的欢快语气宣布每一条残酷规则，世界每 30 秒升级一次：从生存游戏，到移动城市，再到一个全新的文明。',
  'We split the film by chapter. I was responsible for': '我们按章节分工，我负责',
  'Chapter 6, “The Second Rule” (about 2:30 – 3:00)': '第六章《第二条规则》（约 2:30 – 3:00）',
  ', the finale. The camera rises to reveal that the road is a giant loop, the MC celebrates that 990,000 people have been “successfully eliminated”, and a wall rises across the horizon to set up the next stage.': '，也就是结尾。镜头升起，揭示这条路其实是一个巨大的环；MC 庆祝 99 万人已被“成功淘汰”；地平线上升起一堵墙，引出下一阶段。',
  ': at an ad agency’s Monday meeting, a PPT suddenly gains the power to reshape reality, and one “just change this bit” sets off an escalating battle between the boss and his staff. The office is played as a': '：广告公司的周一例会上，一份 PPT 突然拥有了改写现实的力量，一句“这里再改一下”引发了老板与员工之间不断升级的大战。整个办公室被演绎成一个',
  'wuxia jianghu': '武侠江湖',
  ': the young employees fight with PPT, AI, and design skills, while the boss answers with long-lost management techniques, from red-pen revisions to budget cuts.': '：年轻员工用 PPT、AI 和设计技能出招，老板则以失传已久的管理绝学应战，从红笔批改到预算削减。',
  'We split the film by shot. I was responsible for': '我们按镜头分工，我负责', 'shots 16 – 41': '第 16 – 41 镜',
  '(about 0:38 – 1:50), covering most of': '（约 0:38 – 1:50），涵盖', 'Act 1 and Act 2': '第一幕与第二幕',
  '. The boss and the lead employee face off, the employee’s “AI creation” turns the meeting room into a cyberpunk city, and the boss strikes back with his first move, a giant palm made of red revision marks that wipes the city out.': '的大部分内容。老板与主角员工正面对峙，员工的“AI 创造”把会议室变成一座赛博朋克城市，老板随即使出第一招：一只由红色批改痕迹组成的巨掌，把整座城市一掌抹平。',
  'Face, expressions, turnaround, costume, and palette, used to keep the singer consistent across generations.': '面部、表情、三视图、服装与配色，保证歌手在多次生成中形象一致。',
  'Front and top views of the stage, with mic stand placement.': '舞台正视图与俯视图，标出麦克风架位置。',
  'The central crystal crescent behind the singer.': '歌手身后居中的水晶弯月。',
  'Front, side, and back views so the instrument stays the same in every shot.': '正面、侧面与背面视图，保证乐器在每个镜头中保持一致。',
  'Close-up, front, side, and back views that keep the MC consistent from shot to shot.': '特写、正面、侧面与背面视图，保证 MC 在每个镜头中形象一致。',
  'Three views of his signature Y2K microphone.': '他标志性 Y2K 话筒的三视图。',
  'Chrome trailers, a fuel tower, a grandstand, and a billboard, built as reusable props.': '铬金属拖车、加油塔、看台和广告牌，作为可复用道具搭建。',
  'The road before the game begins.': '游戏开始前的公路。',
  'The same road once the mobile stalls and services appear.': '出现流动摊位和服务设施后的同一条公路。',
  'The road grown into a full city, with a hospital, shops, and towers.': '公路发展成一座完整的城市，有医院、商店和高楼。',
  'The full cast in place, locking who sits where so the seating never drifts between shots.': '全体角色就位，固定每个人的座位，保证镜头之间座次不乱。',
  'Close-up, front, side, and back views of the boss.': '老板的特写、正面、侧面与背面视图。',
  'Close-up, front, side, and back views of the lead employee.': '主角员工的特写、正面、侧面与背面视图。',
  'The meeting room stripped away, just before the city appears.': '会议室被剥离，城市即将出现的瞬间。',
  'The meeting table in the middle of the city the employee creates.': '员工创造出的城市中央的会议桌。',
  'Turnaround of the glowing Buddha behind the boss’s palm strike.': '老板掌击背后发光佛像的三视图。',
  'Portfolio': '作品集'
};
Object.assign(ZH, ZH_AI);
/* attribute strings (placeholders, alt text, tooltips) */
const ZH_ATTR = {
  'Kaylee': 'Kaylee',
  'Xiao': 'Xiao',
  'you@email.com': 'you@email.com',
  'Enter your message here.': '在这里输入你的留言。',
  'Back to top': '返回顶部',
  'View full screen': '全屏查看',
  'Exit full screen': '退出全屏',
  'Close': '关闭',
  'Menu': '菜单',
  'Scroll left': '向左滚动',
  'Scroll right': '向右滚动',
};
Object.assign(ZH_ATTR, ZH_AI);
const ATTR_NAMES = ['placeholder', 'aria-label', 'title', 'alt'];

const orig = new WeakMap();
let lang = (typeof localStorage !== 'undefined' && localStorage.getItem('kx-lang')) || 'en';
let observer = null, queued = false;
const written = new WeakMap();

function skip(node) {
  let el = node.parentElement;
  while (el) {
    const t = el.tagName;
    if (t === 'SCRIPT' || t === 'STYLE' || t === 'NOSCRIPT' || t === 'TEXTAREA' || el.hasAttribute('data-no-i18n')) return true;
    el = el.parentElement;
  }
  return false;
}

function translateText() {
  const it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = it.nextNode())) nodes.push(n);
  nodes.forEach(node => {
    if (skip(node)) return;
    if (!orig.has(node)) orig.set(node, node.nodeValue);
    let src = orig.get(node);
    /* the app can rewrite a node itself (dynamic labels, status text). If the
       current text is neither our cached source nor what we last wrote, the app
       changed it — re-cache so we don't stomp the new value. */
    if (node.nodeValue !== src && node.nodeValue !== written.get(node)) {
      src = node.nodeValue;
      orig.set(node, src);
    }
    const key = src.trim();
    if (!key) return;
    let next = src;
    if (lang === 'zh' && (ZH[key] != null || zhPattern(key) != null)) {
      const zh = ZH[key] != null ? ZH[key] : zhPattern(key);
      // CJK layout doesn't take the ASCII inter-word spaces the English source needed
      next = zh;
    }
    if (node.nodeValue !== next) node.nodeValue = next;
    written.set(node, next);
  });
}

function translateAttrs() {
  ATTR_NAMES.forEach(attr => {
    document.querySelectorAll('[' + attr + ']').forEach(el => {
      if (el.closest('[data-no-i18n]')) return;
      const store = 'kxI18n' + attr.replace(/-/g, '');
      if (el.dataset[store] == null) el.dataset[store] = el.getAttribute(attr);
      const src = el.dataset[store];
      const next = (lang === 'zh' && ZH_ATTR[src] != null) ? ZH_ATTR[src] : src;
      if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
    });
  });
}

function apply() {
  if (observer) observer.disconnect();
  translateText();
  translateAttrs();
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.setAttribute('data-lang', lang);
  if (observer) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; apply(); });
}

function start() {
  observer = new MutationObserver(schedule);
  apply();
}

/* the 3D charm tags engrave their wording into a canvas, so they can't be
   reached by the DOM text walker — they ask for their label instead. */
window.KXTagLabel = t => (lang === 'zh' && ZH[t] != null) ? ZH[t] : t;

window.KXGetLang = () => lang;
window.KXSetLang = l => {
  lang = l === 'zh' ? 'zh' : 'en';
  try { localStorage.setItem('kx-lang', lang); } catch (e) {}
  apply();
  window.dispatchEvent(new CustomEvent('kx-lang-change', { detail: lang }));
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
})();
