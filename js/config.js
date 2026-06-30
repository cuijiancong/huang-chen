/* ============================================
   婚宴邀请函 — 可编辑配置文件
   修改本文件中的所有内容即可自定义邀请函
   ============================================ */

window.WEDDING_CONFIG = {

  // ========== 新人信息 ==========
  couple: {
    groom: '黄先生',          // 新郎名字
    bride: '邓小姐',          // 新娘名字
    groomNick: '',            // 新郎昵称（可选，为空则用名字）
    brideNick: ''             // 新娘昵称（可选，为空则用名字）
  },

  // ========== 婚礼日期 ==========
  // 注意：月份从 0 开始，0=1月, 7=8月
  weddingDate: {
    year: 2026,
    month: 9,                 // 10月 = 9
    day: 3,
    hour: 18,
    minute: 8,
    display: '2026 · 10 · 03',     // 封面显示的日期格式
    displayShort: '2026.10.03',    // 感谢页短格式
    weekday: '周六',                // 星期几
    lunar: '农历八月廿三'            // 农历日期
  },

  // ========== 倒计时文案 ==========
  countdown: {
    before: '距离婚礼还有',           // 婚礼前显示
    after: '我们已经结婚'             // 婚礼过后显示
  },

  // ========== 酒店信息 ==========
  venue: {
    name: '黄氏宗祠',        // 酒店名称+厅名
    address: '佛山市南海区狮山镇南海科技工业园松夏工业园区',     // 详细地址（直接用于地图导航）
  },

  // ========== 仪式时间安排 ==========
  schedule: {
    welcome: '下午 17:30 迎宾',
    ceremony: '18:08 仪式开始',
    dinner: '18:58 晚宴'
  },

  // ========== 页面文案 ==========
  pages: {
    // --- 封面 ---
    cover: {
      subtitle: '诚挚邀请您见证',
      slogan: '我们结婚啦',
      scrollHint: '上滑查看邀请函'
    },

    // --- 爱情故事 ---
    story: {
      title: '我们相遇',
      paragraphs: [
        '「 世间所有的相遇，都是久别重逢 」',
        '从相识、相知到相爱，',
        '我们走过了最美好的时光。',
        '如今，我们决定携手共度余生，',
        '诚挚邀请您来见证我们的幸福时刻。'
      ]
    },

    // --- 新郎页 ---
    groom: {
      title: '新郎',                     // 标题
      name: '黄先生',                    // 显示名字
      subtitle: '终于等到你',            // 副标题
      description: '今天，我要嫁给你啦'   // 底部文案
    },

    // --- 新娘页 ---
    bride: {
      title: '新娘',
      name: '邓小姐',
      subtitle: '往后余生都是你',
      description: '今天，我要娶你回家'
    },

    // --- 照片墙 ---
    gallery: {
      title: '甜蜜瞬间'
    },

    // --- 婚礼信息 ---
    info: {
      title: '婚礼信息',
      countdownLabel: '距离婚礼还有',
      dateLabel: '婚礼日期',
      timeLabel: '仪式时间',
      locationLabel: '婚礼地点',
      navButton: '导航到酒店',
      mapHint: '点击地图或上方按钮开始导航'
    },

    // --- 感谢页 ---
    thanks: {
      title: '感谢您的见证',
      text: '愿我们的幸福，也能温暖您的心',
      qrcodeHint: '承蒙厚爱，扫码添彩，您给的每一分都是我们未来的糖。',
      shareButton: '分享给朋友'            // 分享按钮文案
    }
  },

  // ========== 页面标题 ==========
  pageTitle: '婚宴邀请函',

  // ========== 资源路径 ==========
  assets: {
    music: 'assets/music/bg.mp3',          // 背景音乐路径（留空则不加载）

    storyPhotos: [                          // 爱情故事页照片（2-3张）
      'assets/images/story-1.svg',
      'assets/images/story-2.svg',
      'assets/images/story-3.svg'
    ],

    groomPhoto: 'assets/images/groom.svg',  // 新郎特写照片

    bridePhoto: 'assets/images/bride.svg',   // 新娘特写照片

    galleryPhotos: [                        // 照片墙照片（建议6-9张）
      'assets/images/gallery-1.svg',
      'assets/images/gallery-2.svg',
      'assets/images/gallery-3.svg',
      'assets/images/gallery-4.svg',
      'assets/images/gallery-5.svg',
      'assets/images/gallery-6.svg',
      'assets/images/gallery-7.svg',
      'assets/images/gallery-8.svg',
      'assets/images/gallery-9.svg'
    ],

    // 收款二维码（感谢页底部）
    qrcode: {
      groom: 'assets/images/qrcode-groom.svg',  // 新郎收款码
      bride: 'assets/images/qrcode-bride.svg'    // 新娘收款码
    }
  },

  // ========== 微信分享卡片 ==========
  // 图片必须是 JPG 或 PNG 格式，建议 300×300 以上，放在你部署的域名下
  share: {
    image: 'assets/images/share-cover.jpg',     // 分享卡片封面图
    pageUrl: ''                                  // 部署后的完整 URL，留空自动取当前地址
  }
};
