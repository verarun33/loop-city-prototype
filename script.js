const palette = {
  ink: "#20242b",
  blue: "#2547d0",
  orange: "#f26d21",
  cream: "#fbf6e8",
  mist: "#eef0f2"
};

const AUTH_USERS_KEY = "loop-city-users";
const AUTH_SESSION_KEY = "loop-city-session";
const LOOP_DATA_VERSION = "20260624-deep-culture-v1";
const LOOP_EXTERNAL_DATA = typeof window !== "undefined" && window.LOOP_DATA_V01 && typeof window.LOOP_DATA_V01 === "object"
  ? window.LOOP_DATA_V01
  : null;
const LOOP_EXTERNAL_CITIES = Array.isArray(LOOP_EXTERNAL_DATA?.cities) ? LOOP_EXTERNAL_DATA.cities : [];
const LOOP_EXTERNAL_SOURCE_GROUPS = Array.isArray(LOOP_EXTERNAL_DATA?.sourceGroups) ? LOOP_EXTERNAL_DATA.sourceGroups : [];
const LOOP_DATA_VERSION_KEY = "loop-city-data-version";
const DEMO_ACCOUNT = "demo@loop.city";
const DEMO_PASSWORD = "loop2026";
const DEMO_PREVIEW_PASS_TARGET = 3;
const DEMO_PREVIEW_INTEREST_MAP_TARGET = 3;
const PROFILE_RECORD_PAGE_SIZE = 6;
const SCREENSHOT_SCENARIOS = Object.freeze(["login", "home", "atlas", "folio", "profile-records"]);

const cityArt = {
  shanghai:
    `linear-gradient(180deg, rgba(251,246,232,.04), rgba(32,36,43,.78)), radial-gradient(circle at 72% 18%, rgba(37,71,208,.72), transparent 18%), linear-gradient(112deg, ${palette.ink} 0 18%, ${palette.mist} 18% 23%, ${palette.blue} 23% 34%, #8d8a83 34% 42%, ${palette.ink} 42% 55%, ${palette.cream} 55% 60%, ${palette.ink} 60% 100%)`,
  chengdu:
    `linear-gradient(180deg, rgba(251,246,232,.04), rgba(32,36,43,.72)), radial-gradient(circle at 30% 22%, rgba(242,109,33,.58), transparent 16%), linear-gradient(128deg, ${palette.ink} 0 26%, ${palette.cream} 26% 36%, ${palette.blue} 36% 48%, ${palette.mist} 48% 60%, ${palette.ink} 60% 100%)`,
  abudhabi:
    `linear-gradient(180deg, rgba(251,246,232,.08), rgba(32,36,43,.68)), radial-gradient(circle at 72% 20%, rgba(242,109,33,.55), transparent 18%), linear-gradient(122deg, ${palette.cream} 0 22%, ${palette.mist} 22% 38%, ${palette.blue} 38% 49%, #8d8a83 49% 58%, ${palette.ink} 58% 100%)`
};

const routeArt = {
  coffee: `linear-gradient(135deg, ${palette.cream} 0 20%, ${palette.orange} 20% 36%, ${palette.mist} 36% 54%, ${palette.ink} 54% 100%)`,
  drink: `linear-gradient(135deg, ${palette.ink} 0 28%, ${palette.blue} 28% 48%, ${palette.cream} 48% 60%, ${palette.orange} 60% 100%)`,
  quest: `linear-gradient(135deg, ${palette.ink} 0 30%, ${palette.orange} 30% 48%, ${palette.cream} 48% 60%, ${palette.blue} 60% 100%)`,
  theatre: `linear-gradient(135deg, ${palette.ink} 0 24%, ${palette.orange} 24% 34%, ${palette.blue} 34% 58%, ${palette.cream} 58% 100%)`,
  art: `linear-gradient(135deg, ${palette.mist} 0 30%, ${palette.blue} 30% 48%, ${palette.cream} 48% 62%, ${palette.ink} 62% 100%)`,
  fashion: `linear-gradient(135deg, ${palette.cream} 0 24%, ${palette.ink} 24% 44%, ${palette.orange} 44% 56%, ${palette.blue} 56% 100%)`,
  bookstore: `linear-gradient(135deg, ${palette.cream} 0 34%, ${palette.blue} 34% 42%, ${palette.mist} 42% 62%, ${palette.ink} 62% 100%)`,
  music: `linear-gradient(135deg, ${palette.ink} 0 36%, ${palette.blue} 36% 48%, ${palette.orange} 48% 55%, ${palette.ink} 55% 100%)`,
  cinema: `linear-gradient(135deg, ${palette.ink} 0 30%, ${palette.cream} 30% 42%, ${palette.orange} 42% 50%, ${palette.blue} 50% 100%)`,
  climb: `linear-gradient(135deg, ${palette.mist} 0 24%, ${palette.orange} 24% 44%, ${palette.ink} 44% 58%, ${palette.blue} 58% 100%)`,
  riding: `linear-gradient(135deg, ${palette.cream} 0 28%, ${palette.orange} 28% 38%, ${palette.mist} 38% 58%, ${palette.ink} 58% 100%)`,
  architecture: `linear-gradient(135deg, ${palette.ink} 0 28%, ${palette.mist} 28% 38%, ${palette.blue} 38% 44%, ${palette.cream} 44% 100%)`,
  citywalk: `linear-gradient(135deg, ${palette.cream} 0 24%, ${palette.blue} 24% 36%, ${palette.mist} 36% 58%, ${palette.ink} 58% 100%)`,
  market: `linear-gradient(135deg, ${palette.cream} 0 26%, ${palette.blue} 26% 38%, ${palette.orange} 38% 48%, ${palette.mist} 48% 100%)`,
  wellness: `linear-gradient(135deg, ${palette.mist} 0 36%, ${palette.cream} 36% 54%, ${palette.blue} 54% 60%, ${palette.ink} 60% 100%)`,
  night: `linear-gradient(135deg, ${palette.ink} 0 40%, ${palette.blue} 40% 55%, ${palette.orange} 55% 62%, #111 62% 100%)`,
  featured: `linear-gradient(135deg, ${palette.ink} 0 24%, ${palette.orange} 24% 42%, ${palette.cream} 42% 54%, ${palette.blue} 54% 100%)`,
  anime: `linear-gradient(135deg, ${palette.ink} 0 24%, ${palette.blue} 24% 42%, ${palette.cream} 42% 54%, ${palette.orange} 54% 100%)`,
  tufting: `linear-gradient(135deg, ${palette.cream} 0 28%, ${palette.orange} 28% 42%, ${palette.mist} 42% 58%, ${palette.blue} 58% 100%)`,
  pottery: `linear-gradient(135deg, ${palette.mist} 0 26%, ${palette.ink} 26% 38%, ${palette.orange} 38% 52%, ${palette.cream} 52% 100%)`,
  floristry: `linear-gradient(135deg, ${palette.cream} 0 28%, ${palette.blue} 28% 36%, ${palette.orange} 36% 44%, ${palette.mist} 44% 100%)`,
  dance: `linear-gradient(135deg, ${palette.ink} 0 32%, ${palette.orange} 32% 42%, ${palette.blue} 42% 60%, ${palette.ink} 60% 100%)`,
  default: `linear-gradient(135deg, ${palette.ink} 0 26%, ${palette.blue} 26% 48%, ${palette.cream} 48% 62%, ${palette.ink} 62% 100%)`
};

const cityImageKeywords = {
  shanghai: "shanghai,street",
  chengdu: "chengdu,city",
  abudhabi: "abu dhabi,architecture"
};

const layerImageKeywords = {
  coffee: "coffee,cafe",
  drink: "cocktail,bar",
  quest: "city,street",
  theatre: "theatre,stage",
  art: "museum,art",
  fashion: "fashion,streetwear",
  bookstore: "bookstore,books",
  music: "jazz,live music",
  cinema: "cinema,movie",
  climb: "climbing,bouldering",
  riding: "horse,riding",
  architecture: "architecture,building",
  citywalk: "city,walking",
  market: "market,street",
  wellness: "tea,relax",
  night: "city,night",
  featured: "city,cafe",
  cycling: "city,bicycle",
  skate: "skateboard,street",
  workshop: "ceramics,workshop",
  anime: "anime,store",
  tufting: "tufting,workshop",
  pottery: "pottery,ceramics",
  floristry: "florist,flowers",
  dance: "dance,studio",
  photography: "street,photography",
  boardgame: "board game,cafe",
  vintage: "vintage,record store",
  foodie: "restaurant,street food",
  tea: "tea,teahouse",
  comedy: "theatre,comedy",
  outdoor: "outdoor,park",
  pet: "dog,cafe"
};

const unsplashPhotoIds = {
  coffee: ["1495474472287-4d71bcdd2085", "1501339847302-ac426a4a7cbb", "1442512595331-e89e73853f31"],
  drink: ["1514362545857-3bc16c4c7d1b", "1572116469696-31de0f17cc34", "1470337458703-46ad1756a187"],
  quest: ["1449824913935-59a10b8d2000", "1519501025264-65ba15a82390", "1494526585095-c41746248156"],
  theatre: ["1503095396549-807759245b35", "1505236858219-8359eb29e329", "1517457373958-b7bdd4587205"],
  art: ["1545987796-200677ee1011", "1531058020387-3be344556be6", "1518998053901-5348d3961a04"],
  fashion: ["1441986300917-64674bd600d8", "1483985988355-763728e1935b", "1496747611176-843222e1e57c"],
  bookstore: ["1524995997946-a1c2e315a42f", "1512820790803-83ca734da794", "1481627834876-b7833e8f5570"],
  music: ["1506157786151-b8491531f063", "1511671782779-c97d3d27a1d4", "1493225457124-a3eb161ffa5f"],
  cinema: ["1489599849927-2ee91cede3ba", "1478720568477-152d9b164e26", "1517604931442-7e0c8ed2963c"],
  climb: ["1522163182402-834f871fd851", "1549880338-65ddcdfd017b", "1516592673884-4a382d1124c2"],
  riding: ["1553284965-83fd3e82fa5a", "1518877593221-1f28583780b4", "1557411732-1797a9171fcf"],
  architecture: ["1487958449943-2429e8be8625", "1494526585095-c41746248156", "1518005020951-eccb494ad742"],
  market: ["1488459716781-31db52582fe9", "1533900298318-6b8da08a523e", "1513128034602-7814ccaddd4e"],
  wellness: ["1544787219-7f47ccb76574", "1506126613408-eca07ce68773", "1515377905703-c4788e51af15"],
  night: ["1519501025264-65ba15a82390", "1493246507139-91e8fad9978e", "1500530855697-b586d89ba3ee"],
  city: ["1477959858617-67f85cf4f1df", "1449824913935-59a10b8d2000", "1500530855697-b586d89ba3ee"]
};

const cityPhotoIds = {
  shanghai: ["1477959858617-67f85cf4f1df", "1508804185872-d7badad00f7d", "1518005020951-eccb494ad742"],
  chengdu: ["1449824913935-59a10b8d2000", "1500530855697-b586d89ba3ee", "1487958449943-2429e8be8625"],
  abudhabi: ["1487958449943-2429e8be8625", "1518005020951-eccb494ad742", "1494526585095-c41746248156"]
};

const layers = [
  { id: "featured", symbol: "通", name: "城市通行证", desc: "城市特刊 / 主题路线 / 到店权益", featured: true },
  { id: "quest", symbol: "秘", name: "秘境探索", desc: "线索 / 实景 / 城市故事", featured: true },
  { id: "coffee", symbol: "咖", name: "咖啡", desc: "独立咖啡 / 街角 / 独处" },
  { id: "drink", symbol: "酒", name: "喝酒", desc: "自然酒 / 鸡尾酒 / 微醺" },
  { id: "theatre", symbol: "剧", name: "剧场", desc: "小剧场 / Livehouse / 现场" },
  { id: "art", symbol: "艺", name: "艺术", desc: "展览 / 画廊 / 街区" },
  { id: "fashion", symbol: "潮", name: "潮流服饰", desc: "买手店 / 古着 / 球鞋" },
  { id: "bookstore", symbol: "书", name: "书店杂志", desc: "独立书店 / 杂志 / 出版" },
  { id: "music", symbol: "音", name: "音乐现场", desc: "Livehouse / 爵士 / 唱片" },
  { id: "cinema", symbol: "影", name: "电影放映", desc: "独立影院 / 影展 / 露天" },
  { id: "climb", symbol: "攀", name: "攀岩", desc: "抱石 / 新手墙 / 训练" },
  { id: "riding", symbol: "马", name: "骑马", desc: "马场 / 体验课 / 户外" },
  { id: "architecture", symbol: "建", name: "建筑", desc: "老建筑 / 空间 / 立面" },
  { id: "citywalk", symbol: "走", name: "City Walk", desc: "街区 / 随机散步 / 观察" },
  { id: "market", symbol: "集", name: "市集", desc: "周末市集 / 手作 / 食物" },
  { id: "wellness", symbol: "养", name: "身心放松", desc: "瑜伽 / 香氛 / 独处" },
  { id: "night", symbol: "夜", name: "深夜", desc: "夜路 / 深夜咖啡 / 小酒" },
  { id: "cycling", symbol: "骑", name: "城市骑行", desc: "河岸 / 公园 / 慢骑" },
  { id: "skate", symbol: "滑", name: "滑板街头", desc: "广场 / 街头 / 运动" },
  { id: "workshop", symbol: "作", name: "手作课程", desc: "银饰 / 香氛 / 版画" },
  { id: "anime", symbol: "漫", name: "二次元", desc: "动漫店 / 谷子 / 展会" },
  { id: "tufting", symbol: "毯", name: "Tufting", desc: "地毯 / 手作 / 工作坊" },
  { id: "pottery", symbol: "陶", name: "陶艺", desc: "拉坯 / 上釉 / 器物" },
  { id: "floristry", symbol: "花", name: "插花", desc: "花艺 / 植物 / 礼物" },
  { id: "dance", symbol: "舞", name: "街舞舞蹈", desc: "舞室 / 公开课 / 身体" },
  { id: "photography", symbol: "摄", name: "摄影扫街", desc: "胶片 / 街拍 / 光影" },
  { id: "boardgame", symbol: "桌", name: "桌游社群", desc: "桌游 / 推理 / 轻社交" },
  { id: "vintage", symbol: "古", name: "古着黑胶", desc: "古着 / 黑胶 / 旧物" },
  { id: "foodie", symbol: "食", name: "小餐馆", desc: "小店 / 夜宵 / 地方味" },
  { id: "tea", symbol: "茶", name: "茶馆茶室", desc: "茶馆 / 茶室 / 慢下午" },
  { id: "comedy", symbol: "笑", name: "脱口秀", desc: "开放麦 / 小剧场 / 夜场" },
  { id: "outdoor", symbol: "野", name: "户外轻运动", desc: "徒步 / 飞盘 / 露营" },
  { id: "pet", symbol: "宠", name: "宠物友好", desc: "宠物咖啡 / 公园 / 小店" }
];

const moods = [
  {
    id: "music",
    type: "音乐",
    title: "坂本龙一《Aqua》",
    meta: "安静、轻、慢下来",
    layers: ["coffee", "bookstore", "art"],
    line: "今天适合把城市调低一点音量。",
    art: "linear-gradient(135deg, #20242b 0 34%, #2547d0 34% 54%, #fbf6e8 54% 66%, #20242b 66% 100%)"
  },
  {
    id: "reading",
    type: "阅读",
    title: "卡尔维诺《看不见的城市》",
    meta: "换一个角度看街区",
    layers: ["quest", "architecture", "market"],
    line: "无聊不是没地方去，是路线太固定。",
    art: "linear-gradient(135deg, #fbf6e8 0 32%, #20242b 32% 46%, #2547d0 46% 64%, #eef0f2 64% 100%)"
  },
  {
    id: "film",
    type: "电影",
    title: "王家卫《花样年华》",
    meta: "夜色、微醺、旧楼梯",
    layers: ["drink", "music", "night"],
    line: "让夜晚慢下来，不一定要很吵。",
    art: "linear-gradient(135deg, #20242b 0 26%, #f26d21 26% 42%, #2547d0 42% 58%, #20242b 58% 100%)"
  },
  {
    id: "series",
    type: "剧集",
    title: "《The Bear》",
    meta: "节奏、夜晚、街区能量",
    layers: ["drink", "market", "night"],
    line: "今天适合找一点真实、热烈但不喧哗的城市能量。",
    art: "linear-gradient(135deg, #2547d0 0 24%, #20242b 24% 50%, #fbf6e8 50% 62%, #f26d21 62% 100%)"
  },
  {
    id: "design",
    type: "设计",
    title: "Dieter Rams 的十条原则",
    meta: "克制、物件、好品味",
    layers: ["fashion", "bookstore", "architecture"],
    line: "今天适合看一些被认真设计过的东西。",
    art: "linear-gradient(135deg, #eef0f2 0 30%, #2547d0 30% 44%, #20242b 44% 56%, #fbf6e8 56% 100%)"
  },
  {
    id: "artist",
    type: "艺术家",
    title: "Agnes Martin",
    meta: "留白、秩序、安静的线",
    layers: ["art", "wellness", "coffee"],
    line: "今天适合在留白里找一点秩序。",
    art: "linear-gradient(135deg, #fbf6e8 0 24%, #eef0f2 24% 48%, #2547d0 48% 52%, #fbf6e8 52% 100%)"
  }
];

const inspirationPools = {
  default: {
    music: [
      inspirationItem("Nujabes《Luv(sic) pt3》", "低拍、夜路、温柔移动", ["music", "coffee", "night"], "今天适合把路线走得像一段低速鼓点。", ["在城市听这首歌", "街角黑胶店", "老街区", "傍晚后", "先听一段低拍，再去找一条不用赶路的夜路。", ["黑胶", "夜路", "慢走"]]),
      inspirationItem("Fishmans《Long Season》", "长线、河岸、漂浮感", ["citywalk", "coffee", "art"], "今天适合把一段路拉长，走到城市声音变稀。", ["在城市听这首歌", "河岸慢走点", "水边", "日落前", "这首歌适合水边和长步行，把今天从固定半径里带出去。", ["河岸", "长线", "漂浮"]]),
      inspirationItem("The xx《Intro》", "冷感、楼梯、低光", ["drink", "architecture", "night"], "今天适合进入低光城市，不需要热闹。", ["在城市听这首歌", "旧楼二层", "老街", "20:00 后", "短、冷、克制，适合旧楼梯和微暗街角。", ["低光", "旧楼", "微醺"]])
    ],
    reading: [
      inspirationItem("本雅明《单向街》", "街道、碎片、橱窗", ["bookstore", "citywalk", "fashion"], "今天适合用碎片感重新读一条街。", ["在城市读这本书", "独立杂志店", "小街", "下午", "橱窗、招牌和短句会把熟悉街区拆成新的段落。", ["杂志", "橱窗", "观察"]]),
      inspirationItem("马可·奥吉《非地点》", "通勤、边界、陌生半径", ["architecture", "quest", "coffee"], "今天适合去那些平时只是路过的地方停一下。", ["在城市读这本书", "交通边界咖啡", "换乘附近", "工作日傍晚", "把通勤里的边角料变成一次真正的观察。", ["边界", "建筑", "停留"]]),
      inspirationItem("谷崎润一郎《阴翳礼赞》", "阴影、材质、安静", ["architecture", "art", "tea"], "今天适合看光线照不到的地方。", ["在城市读这本书", "安静茶室", "旧建筑附近", "午后", "阴影、木质和墙面会让城市从另一面显出来。", ["阴影", "材质", "茶"]])
    ],
    film: [
      inspirationItem("贾木许《帕特森》", "重复日常、诗、公交线", ["citywalk", "bookstore", "coffee"], "今天适合把重复生活里的小细节捡起来。", ["在城市靠近这部电影", "社区咖啡窗口", "生活街区", "上午", "不用去很远，换一个观察方式，日常就会变得不一样。", ["日常", "诗意", "慢走"]]),
      inspirationItem("侯孝贤《咖啡时光》", "火车、咖啡、独处", ["coffee", "bookstore", "architecture"], "今天适合一个人移动，停在几处安静的坐标。", ["在城市靠近这部电影", "靠窗咖啡", "铁路或老街附近", "下午", "让咖啡、书和一段移动组成很轻的一天。", ["独处", "咖啡", "移动"]]),
      inspirationItem("维姆·文德斯《完美的日子》", "秩序、树影、城市角落", ["wellness", "architecture", "citywalk"], "今天适合给一条普通路线重新建立秩序。", ["在城市靠近这部电影", "树影长椅", "公园边", "清晨或午后", "重复不一定无聊，关键是你有没有看见细节。", ["树影", "秩序", "日常"]])
    ],
    series: [
      inspirationItem("《High Maintenance》", "街区人物、短篇、轻观察", ["citywalk", "market", "coffee"], "今天适合让街区自己带你走。", ["在城市进入这部剧的节奏", "社区小店", "生活街区", "周末下午", "每个小店都是一段短篇，不需要深入社交也能看见人。", ["街区", "小店", "短篇"]]),
      inspirationItem("《Midnight Diner》", "深夜、小餐馆、安静人声", ["foodie", "night", "drink"], "今天适合找一家不大的店，把夜晚过得轻一点。", ["在城市进入这部剧的节奏", "深夜小餐馆", "夜路附近", "21:00 后", "食物和低声人语，比热闹更适合收尾。", ["夜宵", "小店", "低声"]]),
      inspirationItem("《Master of None》", "餐桌、城市、临时兴致", ["foodie", "cinema", "drink"], "今天适合把吃饭变成探索的入口。", ["在城市进入这部剧的节奏", "主理人小餐馆", "街角", "晚餐前后", "从一顿饭开始，顺路看电影或喝一杯。", ["餐桌", "电影", "轻松"]])
    ],
    design: [
      inspirationItem("原研哉《设计中的设计》", "留白、物件、秩序", ["design", "bookstore", "architecture"].map((id) => id === "design" ? "fashion" : id), "今天适合看被认真处理过的细节。", ["在城市看见设计", "生活方式书店", "设计街区", "下午", "书、器物、橱窗和空间比例会把品味串起来。", ["书店", "器物", "留白"]]),
      inspirationItem("Naoto Fukasawa 的无意识设计", "日用品、触感、克制", ["fashion", "workshop", "coffee"], "今天适合靠近那些低调但好用的东西。", ["在城市看见设计", "器物小店", "小街", "午后", "从杯子、椅子、把手和包装开始看城市审美。", ["器物", "触感", "小店"]]),
      inspirationItem("Yohji Yamamoto 的黑色轮廓", "剪裁、街头、旧楼", ["fashion", "vintage", "architecture"], "今天适合看城市里更锋利、更克制的一面。", ["在城市看见设计", "古着买手店", "青年文化街区", "傍晚", "黑色、旧楼和橱窗会让街区更有轮廓。", ["古着", "剪裁", "旧楼"]])
    ],
    artist: [
      inspirationItem("James Turrell", "光、空间、沉默", ["art", "architecture", "wellness"], "今天适合用光线重新理解空间。", ["在城市靠近这位艺术家", "白色展厅", "艺术街区", "日落前", "找一处光线落得很干净的空间，停一会儿。", ["光", "空间", "安静"]]),
      inspirationItem("Sophie Calle", "线索、陌生人、私人叙事", ["quest", "photography", "bookstore"], "今天适合把城市当成一组私人线索。", ["在城市靠近这位艺术家", "旧门牌附近", "老街", "下午", "跟着门牌、照片和一句记录，走一条更私人的路线。", ["线索", "摄影", "叙事"]]),
      inspirationItem("Olafur Eliasson", "天气、光影、水面", ["art", "citywalk", "outdoor"], "今天适合看天气如何改变一座城市。", ["在城市靠近这位艺术家", "水边光影点", "河岸", "日落前后", "风、光和水面会把熟悉地方变成另一个空间。", ["天气", "水面", "光影"]])
    ]
  },
  shanghai: {
    music: [
      inspirationItem("坂本龙一《Merry Christmas Mr. Lawrence》", "玻璃反光、慢、旧街", ["coffee", "architecture", "art"], "今天适合把声音放低，沿旧街走到光线变软。", ["在上海听这首歌", "思南路窗边", "衡复街区", "16:00 后", "钢琴和旧楼的比例很接近，适合从咖啡走到书店。", ["钢琴", "旧楼", "咖啡"]]),
      inspirationItem("窦靖童《River Run》", "河岸、年轻、松弛", ["music", "art", "citywalk"], "今天适合去水边，把城市的年轻感重新打开。", ["在上海听这首歌", "西岸江边", "徐汇滨江", "日落前", "声音有一点流动感，适合展厅之后继续沿河走。", ["河岸", "展厅", "松弛"]])
    ],
    reading: [
      inspirationItem("金宇澄《繁花》", "街面、人声、旧上海", ["foodie", "architecture", "bookstore"], "今天适合在街面和旧楼之间看城市的生活褶皱。", ["在上海读这本书", "复兴中路街角", "衡复", "下午到傍晚", "不要只找景点，去看小店、门洞和路边声音。", ["街面", "旧楼", "生活"]]),
      inspirationItem("王安忆《长恨歌》", "弄堂、时间、室内光", ["architecture", "bookstore", "quest"], "今天适合看一座城市如何把时间藏进楼里。", ["在上海读这本书", "弄堂口", "静安小街", "午后", "门洞、楼梯和窗帘会比大路更有信息。", ["弄堂", "楼梯", "时间"]])
    ],
    film: [
      inspirationItem("娄烨《苏州河》", "河岸、反光、漂移", ["citywalk", "quest", "art"], "今天适合沿着水边走，不按最短路径。", ["在上海靠近这部电影", "苏州河桥边", "苏州河", "傍晚", "桥、水面和旧厂房会让城市有一点失焦的美。", ["苏州河", "反光", "旧厂房"]]),
      inspirationItem("王家卫《堕落天使》", "霓虹、夜路、孤独感", ["night", "drink", "cinema"], "今天适合把夜晚过得有电影感，但不必喧闹。", ["在上海靠近这部电影", "低光夜咖啡", "安福路附近", "21:00 后", "霓虹、旧楼和一杯东西，会比赶场更像夜晚。", ["霓虹", "夜咖啡", "微醺"]])
    ],
    series: [
      inspirationItem("《繁花》剧集", "饭局、霓虹、街面", ["foodie", "drink", "night"], "今天适合让上海的夜色从一张餐桌开始。", ["在上海进入这部剧的节奏", "小餐馆门口", "黄河路附近", "晚餐前后", "餐桌、招牌和夜路会把城市的热闹收得更有层次。", ["饭局", "夜路", "招牌"]]),
      inspirationItem("《我的天才女友》", "关系、街区、成长边界", ["bookstore", "citywalk", "theatre"], "今天适合去一个平时不会主动进入的街区。", ["在上海进入这部剧的节奏", "独立书店", "静安或衡复", "周末下午", "书店和小剧场会让城市的关系感变得更细。", ["书店", "剧场", "街区"]])
    ],
    design: [
      inspirationItem("nendo 的白色实验", "白、轻、结构", ["fashion", "architecture", "art"], "今天适合看白色空间、结构和陈列如何让城市变轻。", ["在上海看见设计", "上生新所白色空间", "上生新所", "下午", "从旧建筑里的新陈列开始，看城市更新的尺度。", ["白色", "陈列", "建筑"]]),
      inspirationItem("MUJI 的生活尺度", "日用品、低饱和、秩序", ["bookstore", "workshop", "wellness"], "今天适合把注意力放回日用品和身体感受。", ["在上海看见设计", "生活方式小店", "愚园路", "午后", "香氛、纸张、器物和咖啡可以组成很轻的一条线。", ["日用品", "香氛", "慢"]])
    ],
    artist: [
      inspirationItem("蔡国强", "爆破、能量、公共空间", ["art", "outdoor", "photography"], "今天适合去开阔空间，看城市能量如何留下痕迹。", ["在上海靠近这位艺术家", "滨江开阔地", "西岸", "日落前", "在风、江面和大体量建筑之间找一张有能量的照片。", ["公共空间", "能量", "摄影"]]),
      inspirationItem("草间弥生", "重复、波点、沉浸感", ["art", "fashion", "cinema"], "今天适合靠近一点明亮但有秩序的视觉刺激。", ["在上海靠近这位艺术家", "展览周边街区", "西岸或淮海路", "下午", "展厅、橱窗和影像空间会让重复图案变成路线节奏。", ["展览", "图案", "橱窗"]])
    ]
  }
};

const inspirationMediaHints = {
  "Naoto Fukasawa 的无意识设计": { query: "Naoto Fukasawa", type: "designer" },
  "原研哉《设计中的设计》": { query: "Kenya Hara Designing Design", type: "designer" },
  "Yohji Yamamoto 的黑色轮廓": { query: "Yohji Yamamoto", type: "designer" },
  "nendo 的白色实验": { query: "Nendo design studio", type: "designer" },
  "MUJI 的生活尺度": { query: "Muji", type: "design" },
  "James Turrell": { query: "James Turrell", type: "artist" },
  "Sophie Calle": { query: "Sophie Calle", type: "artist" },
  "Olafur Eliasson": { query: "Olafur Eliasson", type: "artist" },
  "蔡国强": { query: "Cai Guo-Qiang", type: "artist" },
  "草间弥生": { query: "Yayoi Kusama", type: "artist" },
  "Nujabes《Luv(sic) pt3》": { query: "Nujabes Luv(sic)", type: "music" },
  "Fishmans《Long Season》": { query: "Fishmans Long Season", type: "music" },
  "The xx《Intro》": { query: "The xx Intro", type: "music" },
  "坂本龙一《Merry Christmas Mr. Lawrence》": { query: "Ryuichi Sakamoto Merry Christmas Mr. Lawrence", type: "music" },
  "窦靖童《River Run》": { query: "Leah Dou River Run", type: "music" },
  "本雅明《单向街》": { query: "Walter Benjamin One-Way Street", type: "book" },
  "马可·奥吉《非地点》": { query: "Marc Auge Non-Places", type: "book" },
  "谷崎润一郎《阴翳礼赞》": { query: "In Praise of Shadows", type: "book" },
  "金宇澄《繁花》": { query: "Blossoms Jin Yucheng", type: "book" },
  "王安忆《长恨歌》": { query: "The Song of Everlasting Sorrow Wang Anyi", type: "book" },
  "贾木许《帕特森》": { query: "Paterson film", type: "film" },
  "侯孝贤《咖啡时光》": { query: "Cafe Lumiere", type: "film" },
  "维姆·文德斯《完美的日子》": { query: "Perfect Days film", type: "film" },
  "娄烨《苏州河》": { query: "Suzhou River film", type: "film" },
  "王家卫《堕落天使》": { query: "Fallen Angels 1995 film", type: "film" },
  "《High Maintenance》": { query: "High Maintenance TV series", type: "series" },
  "《Midnight Diner》": { query: "Midnight Diner Japanese TV series", type: "series" },
  "《Master of None》": { query: "Master of None", type: "series" },
  "《繁花》剧集": { query: "Blossoms Shanghai TV series", type: "series" },
  "《我的天才女友》": { query: "My Brilliant Friend TV series", type: "series" }
};

const cityMoodSpots = {
  shanghai: {
    music: spot("在上海听这首歌", "雨后窗边咖啡", "衡复街区", "17:30 后", "靠窗坐一会儿，街面声音会变薄，适合让《Aqua》把城市降速。", ["咖啡", "独处", "慢走"]),
    reading: spot("在上海读这本书", "独立杂志店", "静安小街", "周日下午", "书架和窄街都像城市切片，适合把熟悉街区看成另一座城市。", ["书店", "建筑", "观察"]),
    film: spot("在上海靠近这部电影", "自然酒小房间", "旧楼二层", "20:00 后", "旧楼梯、暗光和低声说话，会把夜晚留在一个更慢的节奏里。", ["微醺", "夜色", "旧楼"]),
    series: spot("在上海进入这部剧的节奏", "黑盒小剧场外街", "剧场后巷", "散场后", "热烈的现场结束后，留一段不赶路的夜路，会比马上回家更有余味。", ["剧场", "后巷", "夜路"]),
    design: spot("在上海看见设计", "独立杂志店橱窗", "静安", "15:00-17:00", "从杂志、字体、灯具和橱窗比例开始，看见城市里被认真处理过的细节。", ["杂志", "橱窗", "物件"]),
    artist: spot("在上海靠近这位艺术家", "河岸展厅", "西岸", "日落前", "大片留白、光线和水边步行，会让秩序感变得更柔和。", ["展览", "水边", "留白"])
  },
  chengdu: {
    music: spot("在成都听这首歌", "院子咖啡", "玉林", "午后", "树影和竹椅会把声音放软，适合慢一点开始今天。", ["院子", "咖啡", "慢下午"]),
    reading: spot("在成都读这本书", "街角烘焙旁长椅", "玉林", "16:00", "生活气很近，适合一边读一边看街区自己发生。", ["街巷", "阅读", "停留"]),
    film: spot("在成都靠近这部电影", "小酒馆后排", "玉林", "夜晚", "不需要很吵，后排的低光和人声更像一场私人放映。", ["小酒", "夜色", "低光"]),
    series: spot("在成都进入这部剧的节奏", "Livehouse 旁边", "东郊记忆", "散场前后", "现场能量和街区烟火气连在一起，适合找一点真实热度。", ["现场", "散场", "街区"]),
    design: spot("在成都看见设计", "旧厂房展区", "东郊记忆", "周末", "粗糙墙面和新展览放在一起，能看见城市更新的材质。", ["厂房", "展区", "材质"]),
    artist: spot("在成都靠近这位艺术家", "茶馆竹椅", "望平街", "下午三点", "树影、秩序和留白都在一杯盖碗茶旁边慢慢出现。", ["茶馆", "树影", "安静"])
  },
  abudhabi: {
    music: spot("在阿布扎比听这首歌", "白墙咖啡", "Saadiyat", "清晨", "强光城市里的一小块阴影，适合把声音放得很轻。", ["咖啡", "白墙", "清晨"]),
    reading: spot("在阿布扎比读这本书", "海边浓缩吧", "Corniche", "傍晚", "海风和城市边界同时出现，会让阅读变成一段安静的移动。", ["海风", "阅读", "边界"]),
    film: spot("在阿布扎比靠近这部电影", "海湾夜色酒廊", "Corniche", "日落后", "夜色落到海面时，城市会显得克制、柔软，也更有电影感。", ["夜色", "海湾", "微醺"]),
    series: spot("在阿布扎比进入这部剧的节奏", "文化中心剧场", "Saadiyat", "演出夜", "安静建筑里的现场，会把城市的距离感拉近一点。", ["剧场", "建筑", "现场"]),
    design: spot("在阿布扎比看见设计", "设计品店", "Saadiyat", "午后", "白色建筑、材质和器物适合一起看，城市质感会变得更清楚。", ["设计", "材质", "物件"]),
    artist: spot("在阿布扎比靠近这位艺术家", "穹顶光影", "Saadiyat", "日落前", "光落成细密的秩序，适合看见留白和线条。", ["光影", "穹顶", "留白"])
  }
};

const cityPoiPools = {
  shanghai: {
    coffee: ["O.P.S. Cafe", "% Arabica 外滩源", "Manner 武康路", "Metal Hands 上海", "Aunn Cafe", "Seesaw 愚园路"],
    drink: ["Speak Low", "J.Boroski Shanghai", "EPIC", "Sober Company", "Senator Saloon", "Bar No.3"],
    quest: ["武康路蓝色门牌", "复兴中路旧楼梯", "安福路转角灯", "外滩源旧字牌", "苏州河桥下反光", "衡山路门廊"],
    theatre: ["YOUNG 剧场", "上海大剧院", "上剧场", "上海话剧艺术中心", "美琪大戏院", "亚洲大厦星空间"],
    art: ["西岸美术馆", "龙美术馆西岸馆", "Fotografiska 影像艺术中心", "UCCA Edge", "油罐艺术中心", "浦东美术馆"],
    fashion: ["LABELHOOD 蕾虎", "TX 淮海", "DOE 淮海中路", "Common Rare", "LOOKNOW", "niko and ... 上海"],
    bookstore: ["思南书局", "茑屋书店上生新所", "衡山和集", "建投书局", "多抓鱼循环商店", "香蕉鱼书店"],
    music: ["JZ Club", "Blue Note Shanghai", "育音堂", "SYSTEM", "MAO Livehouse 上海", "Modern Sky LAB"],
    cinema: ["大光明电影院", "上海影城", "天山电影院", "百美汇影城", "和平影都", "SFC 上海影城"],
    climb: ["VITAL 攀岩馆", "B-PUMP Shanghai", "洛克公园抱石馆", "岩时攀岩上海", "Rock & Wood", "攀岩工厂"],
    riding: ["上海马术运动场", "松声马术", "青青马术俱乐部", "爱久马术", "浦东马术体验", "佘山骑行场"],
    architecture: ["武康大楼", "黑石公寓", "上生新所", "外滩源", "思南公馆", "邮政博物馆"],
    market: ["上生新所周末市集", "嘉善老市", "安福路市集", "外滩源限时集市", "TX 淮海快闪", "M50 创意市集"],
    wellness: ["愚园路香氛小店", "An Ko Rau 瑜伽", "BottleDream 生活方式空间", "衡复树影慢走", "西岸江边长椅", "静安冥想室"],
    night: ["安福路深夜咖啡", "巨鹿路夜路", "复兴中路夜路", "外滩源夜景", "愚园路夜路", "衡山路夜色"]
  },
  chengdu: {
    coffee: ["% Arabica 成都太古里", "麓湖湖边咖啡", "M Stand 成都", "明堂 NU SPACE 咖啡", "UID Cafe", "院子咖啡"],
    drink: ["小酒馆芳沁店", "贰麻酒馆九眼桥", "The Temple House Bar", "TAG", "少城夜酒", "望平街小酒"],
    quest: ["玉林树影竹椅", "奎星楼街门牌", "望江楼竹影", "东郊记忆侧门", "九眼桥桥下灯", "宽窄巷子旧墙"],
    theatre: ["四川大剧院", "成都城市音乐厅", "麓湖水上剧场", "开心麻花环球汇剧场", "成都高新中演大剧院", "东郊记忆演艺中心"],
    art: ["A4 美术馆", "成都博物馆", "知美术馆", "成都当代影像馆", "蓝顶美术馆", "麓湖艺展中心"],
    fashion: ["成都太古里", "REGULAR 源野", "in99 买手店", "COSMO 成都", "玉林古着店", "东郊记忆设计小店"],
    bookstore: ["方所成都店", "钟书阁 成都", "散花书院", "言几又", "读本屋", "文轩 Books"],
    music: ["NU SPACE", "MAO Livehouse 成都", "CH8 冇独空间", "小酒馆芳沁店", "正火艺术中心", "成都城市音乐厅"],
    cinema: ["峨影 1958", "百丽宫影城太古里", "卢米埃成都", "太平洋影城王府井", "UME 影城成都", "成都百老汇影城"],
    climb: ["岩时攀岩", "趣攀抱石", "Rock Hour 成都", "野攀攀岩馆", "攀岩星球", "极限抱石馆"],
    riding: ["成都马术公园", "金马马术俱乐部", "麓湖骑行场", "牧马山马术", "青城山骑行体验", "天府马术基地"],
    architecture: ["东郊记忆", "四川大学华西坝", "宽窄巷子", "水井坊街区", "麓湖 A4 建筑群", "太古里街区"],
    market: ["奎星楼街", "东郊记忆市集", "玉林生活市集", "麓湖周末市集", "望平街小店", "猛追湾市集"],
    wellness: ["望江楼公园茶座", "人民公园鹤鸣茶社", "麓湖水边慢走", "青羊宫茶座", "锦江河边散步", "玉林树影小坐"],
    night: ["九眼桥夜路", "玉林夜路", "望平街夜色", "奎星楼街散场", "小酒馆后街", "东门大桥夜风"]
  },
  abudhabi: {
    coffee: ["The Espresso Lab", "LOCAL Mamsha", "% Arabica Abu Dhabi", "Rain Cafe", "Cartel Coffee Roasters", "Joud Coffee"],
    drink: ["Ray's Bar", "Buddha-Bar Beach", "Hidden Bar", "Hakkasan Bar", "COYA Abu Dhabi", "Stratos"],
    quest: ["Louvre 白墙边界", "Qasr Al Hosn 石墙", "Mina Zayed 港口边", "Corniche 海风点", "Saadiyat 白色转角", "Al Hosn 老城入口"],
    theatre: ["The Arts Center at NYUAD", "Etihad Arena", "Cultural Foundation", "Abu Dhabi National Theatre", "Berklee Abu Dhabi", "Manarat Al Saadiyat Auditorium"],
    art: ["Louvre Abu Dhabi", "421 Arts Campus", "Manarat Al Saadiyat", "Cultural Foundation", "Qasr Al Hosn", "NYUAD Art Gallery"],
    fashion: ["The Galleria Al Maryah Island", "Yas Mall", "Marina Mall", "Louvre Abu Dhabi Museum Shop", "LOCAL Mamsha", "World Trade Center Mall"],
    bookstore: ["Kinokuniya The Galleria", "Magrudy's Abu Dhabi", "Bookends Abu Dhabi", "Louvre Museum Shop", "Culture Foundation Library", "Qasr Al Hosn Store"],
    music: ["Berklee Abu Dhabi", "The Arts Center at NYUAD", "Etihad Arena", "Cultural Foundation", "Manarat Al Saadiyat", "Saadiyat live venue"],
    cinema: ["VOX Cinemas Yas Mall", "Cine Royal Dalma Mall", "Novo Cinemas World Trade Center", "Vox Cinemas The Galleria", "Cinemacity Al Qana", "Louvre film night"],
    climb: ["CLYMB Abu Dhabi", "Adventure HQ", "Circuit X Hudayriyat", "Yas Island activity zone", "Al Qana climbing wall", "Hudayriyat sports hub"],
    riding: ["Abu Dhabi Equestrian Club", "Mandara Equestrian Club", "Al Forsan Equestrian", "Dhabian Equestrian Club", "Saadiyat riding trail", "Al Wathba riding experience"],
    architecture: ["Qasr Al Watan", "Sheikh Zayed Grand Mosque", "Louvre Abu Dhabi Dome", "Qasr Al Hosn", "Aldar HQ", "Etihad Towers"],
    market: ["Mina Market", "Al Mina Fish Market", "Souq Al Qattara", "World Trade Center Souk", "Mina Zayed plant market", "Hudayriyat food market"],
    wellness: ["Mamsha 海边瑜伽平台", "Saadiyat Beach", "Corniche 海边慢走", "Al Bateen Marina", "Eastern Mangroves", "Hudayriyat Beach"],
    night: ["Corniche 夜风", "Etihad Towers 夜景", "Mamsha 夜路", "Al Maryah Waterfront", "Yas Bay Waterfront", "Saadiyat 海边夜色"]
  }
};

const fallbackPoiPools = {
  cycling: ["河岸慢骑点", "城市绿道入口", "桥下休息点", "公园骑行道", "老街转角", "水边补给站", "夜骑集合点", "自行车友好咖啡", "观景平台", "终点小店"],
  citywalk: ["老街入口", "街区转角", "树影人行道", "旧楼立面", "小店橱窗", "口袋公园", "街角咖啡", "社区公告栏", "天桥视角", "收尾长椅"],
  skate: ["街头广场", "滑板公园", "桥下板场", "夜滑集合点", "街头涂鸦墙", "运动补给店", "滨水平台", "青年文化店", "街角咖啡", "落日台阶"],
  workshop: ["银饰手作", "香氛实验室", "版画空间", "木作小屋", "皮具工作室", "独立手工店", "材料市场", "蜡烛工作坊", "织物小课", "作品拍照角"],
  anime: ["动漫周边店", "谷子店", "手办展柜", "漫画书店", "同人活动点", "主题咖啡", "电玩体验店", "扭蛋机墙", "展会集合点", "夜场放映"],
  tufting: ["Tufting 工作室", "选线墙", "图案草稿桌", "打毯机位", "修边工作台", "成品拍照墙", "材料小店", "手作咖啡", "周末工作坊", "作品打包台"],
  pottery: ["陶艺工作室", "拉坯台", "修坯区", "釉料架", "窑烧展示柜", "器物小店", "茶器空间", "手作咖啡", "作品拍照台", "慢走收尾"],
  floristry: ["花艺工作室", "选花冰柜", "包花长桌", "植物生活店", "香氛小店", "街角咖啡", "礼物小店", "花市入口", "拍照橱窗", "带花散步点"],
  dance: ["街舞教室", "公开课舞室", "镜面练习房", "编舞工作室", "地下舞厅", "运动补给店", "夜场集合点", "街头广场", "散场小店", "拉伸空间"],
  photography: ["胶片冲扫店", "老建筑立面", "树影街口", "天桥视角", "河岸反光", "霓虹招牌", "旧门牌", "小巷尽头", "街角咖啡", "日落机位"],
  boardgame: ["桌游店", "剧本推理馆", "轻社交客厅", "夜场桌游吧", "咖啡桌游空间", "推理主题店", "朋友集合点", "夜宵收尾", "安静包间", "复盘咖啡"],
  vintage: ["古着店", "黑胶唱片店", "旧物仓库", "二手书店", "复古家具店", "青年买手店", "胶片相机店", "街头饰品店", "旧楼梯", "咖啡收尾"],
  foodie: ["街角小餐馆", "深夜面馆", "地方小吃店", "主理人餐厅", "烘焙小店", "熟食档口", "甜品收尾", "夜宵街口", "菜市场边店", "饭后散步点"],
  tea: ["老茶馆", "新中式茶室", "公园茶座", "巷子茶铺", "河边茶桌", "器物小店", "点心铺", "书店茶位", "竹影座位", "慢走收尾"],
  comedy: ["开放麦小剧场", "脱口秀俱乐部", "喜剧夜场", "散场小酒", "演员练习场", "小剧场后街", "夜宵收尾", "街角咖啡", "朋友集合点", "复盘长椅"],
  outdoor: ["城市公园入口", "飞盘草地", "河岸轻徒步", "露营装备店", "落日草坪", "补给咖啡", "户外集合点", "观景桥", "慢跑路线", "夜风收尾"],
  pet: ["宠物友好咖啡", "狗狗公园", "宠物生活店", "河岸散步点", "宠物友好露台", "洗护店", "宠物市集", "安静草坪", "户外水吧", "拍照角"]
};

const cities = {
  shanghai: {
    name: "上海",
    code: "SH",
    number: "03",
    line: "地图探索计划",
    cover: "夜色 / 咖啡 / 剧场",
    weather: "多云 22°",
    location: "静安附近",
    art: cityArt.shanghai,
    hero: {
      title: "今日灵感",
      intro: "从一首歌、一部电影或一本书开始，让 LOOP 判断今天适合哪条城市路线。"
    },
    districts: ["衡复街区", "西岸", "静安"],
    places: [
      place("sh-c1", "coffee", 22, 70, "雨后窗边咖啡", "适合一个人坐 40 分钟。"),
      place("sh-c2", "coffee", 38, 42, "弄堂手冲吧", "菜单很短，适合从一杯浅烘开始。"),
      place("sh-b1", "drink", 60, 52, "自然酒小房间", "不热闹，但会让夜晚变慢。"),
      place("sh-b2", "drink", 78, 26, "爵士楼上", "楼梯很窄，声音很好。"),
      place("sh-t1", "theatre", 47, 64, "黑盒小剧场", "80 分钟，让一晚不再重复。"),
      place("sh-a1", "art", 69, 77, "河岸展厅", "适合黄昏后沿水边走。"),
      place("sh-s1", "bookstore", 28, 22, "独立杂志店", "一面墙就能看见另一种生活。"),
      place("sh-m1", "climb", 82, 68, "城市攀岩馆", "第一次也可以从低墙开始。"),
      place("sh-q1", "quest", 16, 34, "蓝门秘境", "到附近后解锁完整线索。")
    ],
    routes: [
      route("sh-r1", "coffee", "SH-CF-01", "雨后咖啡回路", "旧街、窗边、手冲和一小段不赶路的步行。", ["雨后窗边", "弄堂手冲", "杂志店"], "2.5h", "¥120", "一个人", 1.8, 89),
      route("sh-r2", "drink", "SH-BR-02", "微醺小酒馆回路", "从自然酒到楼上爵士，适合周五晚安静地热烈一下。", ["自然酒", "黑盒剧场", "楼上爵士"], "3h", "¥260", "朋友或独处", 2.4, 94),
      route("sh-r3", "theatre", "SH-TH-03", "看完戏再走一会儿", "小剧场结束后，不急着回家，把夜路走完整。", ["小剧场", "雨后街角", "夜咖啡"], "2h", "¥220", "工作日夜晚", 1.3, 83),
      route("sh-r4", "art", "SH-AR-04", "河岸艺术半日", "展厅、河岸和一段有风的空白时间。", ["河岸展厅", "水边步行", "手冲"], "4h", "¥160", "周日下午", 3.1, 78),
      route("sh-r5", "bookstore", "SH-BK-05", "杂志和香味路线", "从杂志店开始，试着借别人的兴趣看城市。", ["杂志店", "香氛", "窄楼梯"], "2h", "¥180", "想试新事", 1.6, 72),
      route("sh-r6", "climb", "SH-CL-06", "第一次攀岩之前", "一条不会把人吓跑的低强度运动体验。", ["低墙抱石", "咖啡", "河岸"], "3h", "¥210", "周末午后", 2.7, 69),
      route("sh-q1", "quest", "SH-QS-07", "蓝门与雨后反光", "跟着三条实景线索，找到旧街区里被忽略的蓝色门牌。", ["蓝门", "窄楼梯", "散场灯"], "45min", "¥0", "快速玩", 0.8, 96)
    ],
    quests: [
      secret("SH-01", "蓝门之后", "从旧楼蓝色门牌开始，找一段向上的窄楼梯。", "快速玩", "35min"),
      secret("SH-02", "雨后四十分钟", "雨停后 40 分钟，这条路的反光最好。", "完整秘境", "2h"),
      secret("SH-03", "散场后的灯", "不要立刻打车，剧场后门那条路更像结尾。", "快速玩", "25min")
    ]
  },
  chengdu: {
    name: "成都",
    code: "CD",
    number: "07",
    line: "慢下午地图探索",
    cover: "茶馆 / 音乐 / 街巷",
    weather: "小雨 19°",
    location: "玉林附近",
    art: cityArt.chengdu,
    hero: {
      title: "今日灵感",
      intro: "从一首歌、一部电影或一本书开始，给重复的周末一点新的入口。"
    },
    districts: ["玉林", "东郊记忆", "望平街"],
    places: [
      place("cd-c1", "coffee", 24, 66, "院子咖啡", "树影和竹椅之间，时间会变软。"),
      place("cd-c2", "coffee", 42, 34, "街角烘焙", "先闻到豆子，再决定今天去哪。"),
      place("cd-b1", "drink", 60, 48, "小酒馆后排", "不是大声喝酒，是把夜晚放松。"),
      place("cd-b2", "music", 78, 70, "Livehouse 旁边", "喝一杯再进去，或散场后不说话。"),
      place("cd-t1", "theatre", 48, 62, "青年剧场", "故事很近，座位也很近。"),
      place("cd-a1", "art", 72, 28, "旧厂房展区", "粗糙墙面和新展览放在一起。"),
      place("cd-s1", "bookstore", 32, 22, "独立唱片店", "从一张黑胶开始体验别人的兴趣。"),
      place("cd-m1", "climb", 84, 55, "新手抱石馆", "没有压力，只是把身体叫醒。"),
      place("cd-q1", "quest", 16, 40, "盖碗秘境", "找一张被树影盖住的竹椅。")
    ],
    routes: [
      route("cd-r1", "coffee", "CD-CF-01", "慢下午咖啡回路", "先喝咖啡，再沿街走到一家不催人的小店。", ["院子咖啡", "街角烘焙", "唱片店"], "3h", "¥90", "一个人", 1.5, 91),
      route("cd-r2", "drink", "CD-BR-02", "夜风小酒馆回路", "小酒馆、Livehouse 和散场后的空街。", ["小酒馆", "Livehouse", "空街"], "3.5h", "¥220", "朋友", 2.1, 86),
      route("cd-r3", "theatre", "CD-TH-03", "近距离剧场夜", "不用盛装，只要把一个晚上交给现场。", ["青年剧场", "夜酒", "树影"], "2.5h", "¥180", "工作日", 1.4, 74),
      route("cd-r4", "art", "CD-AR-04", "旧厂房艺术回路", "在旧厂房里看展，再找一杯不着急的咖啡。", ["旧厂房", "展区", "烘焙"], "4h", "¥130", "周末", 3.4, 77),
      route("cd-r5", "bookstore", "CD-BK-05", "唱片和茶影路线", "从唱片店到茶馆，试着听见成都的慢。", ["唱片店", "盖碗", "院子"], "2.5h", "¥110", "想独处", 1.7, 82),
      route("cd-r6", "climb", "CD-CL-06", "抱石后去吹风", "新手抱石，结束后去一条有夜风的路。", ["抱石", "夜风", "小酒"], "3h", "¥170", "想试新事", 2.5, 66),
      route("cd-q1", "quest", "CD-QS-07", "树影下的盖碗", "从茶馆声音、竹椅和旧墙上的字，找一段慢城市线索。", ["竹椅", "旧墙", "茶影"], "50min", "¥35", "快速玩", 0.9, 93)
    ],
    quests: [
      secret("CD-01", "树影下的盖碗", "下午三点，找树影最厚的那张竹椅。", "快速玩", "30min"),
      secret("CD-02", "散场后的空街", "Livehouse 结束后往反方向走三分钟。", "完整秘境", "2h"),
      secret("CD-03", "旧厂房的侧门", "主入口不重要，侧门外的墙更像成都。", "快速玩", "40min")
    ]
  },
  abudhabi: {
    name: "阿布扎比",
    code: "AD",
    number: "11",
    line: "光、海与建筑探索",
    cover: "光影 / 海 / 博物馆",
    weather: "晴 31°",
    location: "Saadiyat 附近",
    art: cityArt.abudhabi,
    hero: {
      title: "今日灵感",
      intro: "从一首歌、一部电影或一本书开始，用建筑、海风和一杯咖啡重新探索城市。"
    },
    districts: ["Saadiyat", "Corniche", "Yas"],
    places: [
      place("ad-c1", "coffee", 24, 58, "白墙咖啡", "适合在强光城市里找到一块阴影。"),
      place("ad-c2", "coffee", 42, 24, "海边浓缩吧", "风很干净，咖啡不需要复杂。"),
      place("ad-b1", "drink", 60, 64, "酒店酒吧露台", "持牌场所里的日落一杯。"),
      place("ad-b2", "night", 80, 44, "海湾夜色酒廊", "安静一点，看海面变暗。"),
      place("ad-t1", "theatre", 52, 76, "文化中心剧场", "建筑很安静，现场很近。"),
      place("ad-a1", "art", 70, 30, "穹顶光影", "日落前后，光会落成地图。"),
      place("ad-s1", "fashion", 30, 38, "设计品店", "把城市的材质带回手里。"),
      place("ad-m1", "riding", 84, 70, "沙地骑行体验", "不是观光，是把身体交给地平线。"),
      place("ad-q1", "quest", 18, 24, "白色边界秘境", "日落前沿着白色建筑的边走。")
    ],
    routes: [
      route("ad-r1", "coffee", "AD-CF-01", "海岛咖啡回路", "一杯咖啡、一个白色街角和去海边的短路。", ["白墙咖啡", "设计店", "海边"], "2h", "AED 80", "清晨", 1.9, 79),
      route("ad-r2", "drink", "AD-BR-02", "日落露台回路", "在持牌酒店露台喝一杯，然后沿海风慢慢走。", ["露台", "海湾", "夜色"], "3h", "AED 240", "傍晚", 2.6, 88),
      route("ad-r3", "art", "AD-AR-03", "光与穹顶回路", "让建筑、海和博物馆光影组成一条路线。", ["穹顶", "白墙", "海风"], "4h", "AED 160", "日落前", 3.2, 92),
      route("ad-r4", "theatre", "AD-TH-04", "安静文化夜", "剧场、露台和不需要赶时间的夜晚。", ["剧场", "露台", "光影"], "3h", "AED 260", "夜晚", 2.9, 70),
      route("ad-r5", "fashion", "AD-DS-05", "白色建筑和设计物", "从建筑边界走到设计小物，收集城市材质。", ["建筑", "设计物", "咖啡"], "2.5h", "AED 120", "午后", 1.8, 81),
      route("ad-r6", "riding", "AD-RD-06", "沙地骑行前后", "骑马或骑行体验之后，用一杯咖啡把身体收回来。", ["沙地骑行", "海边咖啡", "夜酒"], "4h", "AED 360", "想试新事", 4.5, 76),
      route("ad-q1", "quest", "AD-QS-07", "白墙和地平线", "跟随光线变化，找到博物馆建筑旁最安静的一道边界。", ["白墙", "穹顶", "地平线"], "55min", "AED 0", "快速玩", 1.1, 90)
    ],
    quests: [
      secret("AD-01", "穹顶下的斑点光", "不要只看建筑全景，低头看光落在地面上。", "快速玩", "30min"),
      secret("AD-02", "海风最安静的边", "离主入口远一点，风声会盖住人声。", "完整秘境", "2.5h"),
      secret("AD-03", "白墙和地平线", "日落前 20 分钟，白墙会变成另一种颜色。", "快速玩", "45min")
    ]
  }
};

loadRealisticMockData();

function loadRealisticMockData() {
  Object.assign(cityMoodSpots.shanghai, {
    music: spot("在上海听这首歌", "O.P.S. Cafe", "太原路 / 衡复街区", "16:30 后", "小店、窄街和慢慢变低的日光，适合让《Aqua》把城市声音压到很轻。", ["咖啡", "独处", "慢走"]),
    reading: spot("在上海读这本书", "思南书局", "复兴中路", "周日下午", "从花园洋房到旧街转角，适合把熟悉的街区当作另一座城市来读。", ["书店", "建筑", "观察"]),
    film: spot("在上海靠近这部电影", "Speak Low", "复兴中路", "20:30 后", "暗门、楼梯和低声说话，会把夜晚留在更慢、更私人一点的节奏里。", ["微醺", "夜色", "旧楼"]),
    series: spot("在上海进入这部剧的节奏", "YOUNG 剧场外街", "杨浦滨江", "散场后", "现场结束后不要马上回家，沿滨江走一段，会更像一集的结尾。", ["剧场", "滨江", "夜路"]),
    design: spot("在上海看见设计", "LABELHOOD 蕾虎", "新天地 / 淮海中路", "15:00-18:00", "从服装、橱窗、材质和字体开始，看见这座城市被认真处理过的细节。", ["买手店", "橱窗", "物件"]),
    artist: spot("在上海靠近这位艺术家", "西岸美术馆", "徐汇滨江", "日落前", "大片留白、河岸光线和步行节奏，会让秩序感变得更柔和。", ["展览", "水边", "留白"])
  });

  Object.assign(cityMoodSpots.chengdu, {
    music: spot("在成都听这首歌", "麓镇 A4 美术馆旁咖啡", "麓湖", "午后", "湖边、展厅和低声背景音乐，适合慢一点开始今天。", ["湖边", "咖啡", "慢下午"]),
    reading: spot("在成都读这本书", "方所成都店", "太古里", "16:00", "商业街区里藏着足够长的书架，适合一边读一边观察城市的另一面。", ["书店", "阅读", "停留"]),
    film: spot("在成都靠近这部电影", "小酒馆芳沁店", "玉林", "夜晚", "低光、人声和旧街区的生活气，会让夜晚更像私人放映。", ["小酒", "夜色", "低光"]),
    series: spot("在成都进入这部剧的节奏", "NU SPACE", "奎星楼街", "散场前后", "现场能量和街区烟火气连在一起，适合找一点真实热度。", ["现场", "散场", "街区"]),
    design: spot("在成都看见设计", "东郊记忆", "建设南支路", "周末", "粗糙厂房、展览、唱片和市集混在一起，城市更新的材质很清楚。", ["厂房", "展区", "材质"]),
    artist: spot("在成都靠近这位艺术家", "望江楼公园茶座", "九眼桥附近", "下午三点", "竹影、茶声和留白都在一杯盖碗茶旁边慢慢出现。", ["茶馆", "竹影", "安静"])
  });

  Object.assign(cityMoodSpots.abudhabi, {
    music: spot("在阿布扎比听这首歌", "The Espresso Lab", "Qasr Al Hosn", "清晨", "强光城市里的一小块阴影，适合把声音放得很轻。", ["咖啡", "白墙", "清晨"]),
    reading: spot("在阿布扎比读这本书", "Kinokuniya", "The Galleria", "傍晚", "室内长书架和海岛城市的边界感，会让阅读变成一段安静移动。", ["书店", "阅读", "边界"]),
    film: spot("在阿布扎比靠近这部电影", "Ray's Bar", "Etihad Towers", "日落后", "夜色落到海面时，城市会显得克制、柔软，也更有电影感。", ["夜色", "海湾", "微醺"]),
    series: spot("在阿布扎比进入这部剧的节奏", "The Arts Center at NYUAD", "Saadiyat Island", "演出夜", "安静建筑里的现场，会把城市的距离感拉近一点。", ["剧场", "建筑", "现场"]),
    design: spot("在阿布扎比看见设计", "Louvre Abu Dhabi Museum Shop", "Saadiyat Island", "午后", "白色建筑、材质和器物适合一起看，城市质感会变得更清楚。", ["设计", "材质", "物件"]),
    artist: spot("在阿布扎比靠近这位艺术家", "Louvre Abu Dhabi Dome", "Saadiyat Island", "日落前", "光落成细密的秩序，适合看见留白和线条。", ["光影", "穹顶", "留白"])
  });

  Object.assign(cities.shanghai, {
    cover: "衡复 / 西岸 / 淮海路",
    districts: ["衡复街区", "西岸", "苏州河"],
    places: [
      place("sh-p01", "coffee", 22, 66, "O.P.S. Cafe", "太原路小店，适合一个人把节奏放慢。"),
      place("sh-p02", "coffee", 36, 54, "% Arabica 外滩源", "外滩源街区里更适合边走边喝的一杯。"),
      place("sh-p03", "drink", 50, 54, "Speak Low", "暗门、楼梯和不太外露的夜晚。"),
      place("sh-p04", "drink", 62, 40, "J.Boroski Shanghai", "适合把鸡尾酒当作夜晚入口。"),
      place("sh-p05", "theatre", 77, 65, "YOUNG 剧场", "杨浦滨江的剧场夜，适合散场后继续走。"),
      place("sh-p06", "theatre", 42, 72, "上海大剧院", "城市中心的正式演出入口。"),
      place("sh-p07", "art", 68, 78, "西岸美术馆", "日落前后的河岸和展厅很适合连在一起。"),
      place("sh-p08", "art", 28, 36, "Fotografiska 影像艺术中心", "苏州河边，适合晚上也去看展。"),
      place("sh-p09", "fashion", 45, 38, "LABELHOOD 蕾虎", "从本土设计师和橱窗开始看城市潮流。"),
      place("sh-p10", "fashion", 54, 32, "TX 淮海", "青年文化、展陈和快闪密度很高。"),
      place("sh-p11", "bookstore", 31, 63, "思南书局", "花园洋房里的书架和街区气质很贴。"),
      place("sh-p12", "bookstore", 40, 24, "茑屋书店上生新所", "建筑更新、书、杂志和设计物放在一起。"),
      place("sh-p13", "music", 58, 58, "JZ Club", "爵士夜晚，适合微醺之后不要太赶。"),
      place("sh-p14", "cinema", 38, 46, "大光明电影院", "老影院和南京西路夜色仍然成立。"),
      place("sh-p15", "climb", 73, 46, "VITAL 攀岩馆", "从抱石开始，把身体叫醒。"),
      place("sh-p16", "architecture", 24, 58, "武康大楼", "一座楼就能开启衡复街区的建筑观察。"),
      place("sh-p17", "market", 47, 25, "上生新所周末市集", "适合把书店、咖啡和市集串起来。"),
      place("sh-p18", "night", 64, 68, "安福路深夜咖啡", "散场后还能坐一会儿的夜路停留。"),
      place("sh-p19", "wellness", 63, 24, "愚园路香氛小店", "适合用气味把节奏放轻。"),
      place("sh-p20", "quest", 20, 42, "武康路蓝色门牌", "旧楼门牌、楼梯和树影组成线索。")
    ],
    routes: [
      route("sh-r1", "coffee", "SH-CF-01", "太原路慢咖啡", "从 O.P.S. Cafe 到思南书局，把一下午拆成几段安静停留。", ["O.P.S. Cafe", "太原路树影", "思南书局"], "2.5h", "¥120", "一个人", 1.6, 92),
      route("sh-r2", "coffee", "SH-CF-02", "外滩源河岸一杯", "从外滩源咖啡开始，绕到苏州河和影像展厅。", ["% Arabica 外滩源", "圆明园路", "Fotografiska"], "2h", "¥110", "晴天午后", 1.4, 86),
      route("sh-r3", "drink", "SH-BR-03", "复兴中路隐秘酒线", "暗门鸡尾酒、旧街和一段低声夜路。", ["Speak Low", "复兴中路夜路", "J.Boroski"], "3h", "¥360", "微醺", 1.8, 95),
      route("sh-r4", "theatre", "SH-TH-04", "杨浦滨江剧场夜", "看完 YOUNG 剧场后，把散场的情绪交给滨江。", ["YOUNG 剧场", "杨浦滨江", "夜咖啡"], "2.5h", "¥260", "工作日夜晚", 1.9, 83),
      route("sh-r5", "art", "SH-AR-05", "西岸日落艺术线", "美术馆、河岸和一杯咖啡连成很完整的下午。", ["西岸美术馆", "徐汇滨江", "龙美术馆外广场"], "4h", "¥180", "周日下午", 2.7, 90),
      route("sh-r6", "fashion", "SH-FA-06", "淮海路青年设计线", "从 LABELHOOD 到 TX 淮海，看本土设计和青年文化如何进入商业街。", ["LABELHOOD", "淮海中路橱窗", "TX 淮海"], "3h", "¥240", "想看潮流", 1.7, 88),
      route("sh-r7", "bookstore", "SH-BK-07", "思南书局和花园洋房", "读书、老建筑和一段不赶路的街区观察。", ["思南书局", "复兴公园外墙", "香山路"], "2h", "¥80", "想安静", 1.2, 84),
      route("sh-r8", "music", "SH-MU-08", "爵士和夜色", "JZ Club 前后各留一段路，夜晚会更完整。", ["JZ Club", "衡山路", "深夜小酒"], "3.5h", "¥320", "夜晚", 2.0, 91),
      route("sh-r9", "cinema", "SH-CI-09", "老影院电影感", "从大光明电影院到南京西路旧楼，把电影感留到散场后。", ["大光明电影院", "南京西路", "夜咖啡"], "2.5h", "¥150", "电影夜", 1.5, 76),
      route("sh-r10", "climb", "SH-CL-10", "抱石后去河边", "低强度抱石、补一杯咖啡，再去滨江散步。", ["VITAL 攀岩馆", "咖啡补给", "滨江慢走"], "3h", "¥220", "想动一下", 2.4, 72),
      route("sh-r11", "architecture", "SH-AC-11", "武康大楼建筑线", "从武康大楼开始，看窗、转角和沿街比例。", ["武康大楼", "武康路", "上生新所"], "2.5h", "¥60", "初次探索", 2.1, 89),
      route("sh-r12", "market", "SH-MK-12", "上生新所周末市集", "市集、书店和旧厂房空间连在一起，适合把街区当作一本正在翻页的杂志。", ["上生新所周末市集", "茑屋书店上生新所", "哥伦比亚公园"], "2.5h", "¥130", "想试新事", 1.5, 82),
      route("sh-r13", "wellness", "SH-WE-13", "愚园路安静恢复线", "从香氛小店、窄街和咖啡开始，把今天的速度降下来。", ["愚园路香氛小店", "愚园路树影", "安福路深夜咖啡"], "2h", "¥160", "想放松", 1.3, 76),
      route("sh-r14", "night", "SH-NI-14", "低光回家前", "爵士、夜咖啡和一段旧街夜路，适合把电影感留到回家前。", ["JZ Club", "安福路深夜咖啡", "复兴中路夜路"], "2.5h", "¥210", "夜晚", 1.7, 87),
      route("sh-q1", "quest", "SH-QS-12", "蓝色门牌和旧楼梯", "跟着门牌、楼梯扶手和雨后反光找一条衡复秘境。", ["蓝色门牌", "旧楼梯", "雨后反光"], "55min", "¥0", "快速玩", 0.9, 96)
    ],
    quests: [
      secret("SH-01", "蓝色门牌之后", "从武康路一块蓝色门牌开始，找一段向上的旧楼梯。", "快速玩", "35min"),
      secret("SH-02", "雨后四十分钟", "雨停后 40 分钟，衡复街区的反光最好。", "完整秘境", "2h"),
      secret("SH-03", "散场后的滨江灯", "剧场结束后往江边走，找三种不同颜色的路灯。", "快速玩", "30min"),
      secret("SH-04", "外滩源的旧字牌", "不要只看建筑正面，留意墙角和门楣上的旧字。", "完整秘境", "2.5h")
    ]
  });

  Object.assign(cities.chengdu, {
    cover: "玉林 / 太古里 / 东郊记忆",
    districts: ["玉林", "太古里", "东郊记忆"],
    places: [
      place("cd-p01", "coffee", 26, 66, "% Arabica 成都太古里", "商业街区里好进入的一杯。"),
      place("cd-p02", "coffee", 34, 58, "麓湖湖边咖啡", "适合把下午拉长。"),
      place("cd-p03", "drink", 42, 64, "小酒馆芳沁店", "成都夜晚绕不开的现场和酒。"),
      place("cd-p04", "drink", 58, 52, "贰麻酒馆九眼桥", "更热闹的夜生活入口。"),
      place("cd-p05", "theatre", 47, 42, "四川大剧院", "城市中心的正式演出入口。"),
      place("cd-p06", "art", 70, 30, "A4 美术馆", "麓湖边的展览、咖啡和散步。"),
      place("cd-p07", "art", 56, 30, "成都博物馆", "适合把城市历史作为下午入口。"),
      place("cd-p08", "fashion", 38, 34, "成都太古里", "街区、买手店和生活方式店密度高。"),
      place("cd-p09", "bookstore", 36, 28, "方所成都店", "书、展陈和商业空间放在一起。"),
      place("cd-p10", "music", 28, 46, "NU SPACE", "奎星楼街附近的现场音乐入口。"),
      place("cd-p11", "music", 61, 56, "MAO Livehouse 成都", "热烈一点的现场夜晚。"),
      place("cd-p12", "cinema", 52, 36, "峨影 1958", "电影、街区和老厂区气质连在一起。"),
      place("cd-p13", "climb", 76, 54, "岩时攀岩", "新手也可以轻量开始。"),
      place("cd-p14", "architecture", 68, 64, "东郊记忆", "旧厂房改造和展演场景集中。"),
      place("cd-p15", "market", 30, 38, "奎星楼街", "小店、咖啡、现场和夜路都能串起来。"),
      place("cd-p16", "wellness", 18, 28, "望江楼公园茶座", "竹影和盖碗茶是很成都的放松方式。"),
      place("cd-p17", "night", 45, 70, "九眼桥夜路", "适合晚上从热闹走向安静。"),
      place("cd-p18", "quest", 20, 40, "玉林树影竹椅", "从一张被树影盖住的竹椅开始。")
    ],
    routes: [
      route("cd-r1", "coffee", "CD-CF-01", "太古里咖啡和方所", "从一杯咖啡开始，再去方所慢慢读一段。", ["% Arabica 太古里", "太古里街区", "方所成都店"], "2.5h", "¥90", "下午", 1.2, 88),
      route("cd-r2", "drink", "CD-BR-02", "玉林小酒馆夜线", "小酒馆、夜路和一段不必说太多话的散场。", ["小酒馆芳沁店", "玉林夜路", "九眼桥"], "3h", "¥220", "朋友", 2.4, 94),
      route("cd-r3", "theatre", "CD-TH-03", "四川大剧院和夜茶", "正式演出后，不急着走，去附近喝一杯茶或酒。", ["四川大剧院", "天府广场夜色", "夜茶"], "2.5h", "¥200", "演出夜", 1.6, 78),
      route("cd-r4", "art", "CD-AR-04", "麓湖 A4 半日", "展览、湖边咖啡和一段轻松散步。", ["A4 美术馆", "麓湖水边", "湖边咖啡"], "4h", "¥150", "周末", 2.8, 86),
      route("cd-r5", "bookstore", "CD-BK-05", "方所和城市读片", "商业空间里的书架也能成为观察成都的入口。", ["方所成都店", "太古里橱窗", "街角咖啡"], "2h", "¥70", "想安静", 0.9, 80),
      route("cd-r6", "music", "CD-MU-06", "奎星楼现场音乐线", "NU SPACE、奎星楼街和散场后的空街。", ["NU SPACE", "奎星楼街", "深夜小店"], "3.5h", "¥180", "现场", 1.7, 90),
      route("cd-r7", "cinema", "CD-CI-07", "峨影 1958 电影夜", "电影、厂区和晚风，适合把散场留久一点。", ["峨影 1958", "厂区夜路", "咖啡补给"], "2.5h", "¥120", "电影夜", 1.4, 74),
      route("cd-r8", "climb", "CD-CL-08", "抱石后去九眼桥", "运动把身体叫醒，夜路再把节奏放软。", ["岩时攀岩", "轻食补给", "九眼桥夜路"], "3h", "¥170", "想试新事", 2.5, 69),
      route("cd-r9", "architecture", "CD-AC-09", "东郊记忆旧厂房", "旧厂房、唱片、展演和周末市集的混合路线。", ["东郊记忆", "旧厂房墙面", "周末市集"], "3h", "¥100", "看设计", 2.2, 82),
      route("cd-r10", "wellness", "CD-WE-10", "望江楼茶影慢线", "竹影、盖碗茶和一段真正不赶时间的下午。", ["望江楼公园", "茶座", "河边慢走"], "2.5h", "¥60", "想放松", 1.5, 85),
      route("cd-r11", "market", "CD-MK-11", "奎星楼街小店线", "从小吃、咖啡到现场，让别人的兴趣带你走。", ["奎星楼街", "独立小店", "现场入口"], "2.5h", "¥130", "想试新事", 1.2, 87),
      route("cd-r12", "fashion", "CD-FA-12", "太古里街区设计线", "从太古里橱窗到方所，把商业街区里的审美细节重新看一遍。", ["成都太古里", "方所成都店", "街角咖啡"], "2.5h", "¥180", "看设计", 1.1, 84),
      route("cd-r13", "night", "CD-NI-13", "九眼桥慢夜线", "从小酒馆到九眼桥，把热闹和安静之间那段路走出来。", ["小酒馆芳沁店", "九眼桥夜路", "深夜小店"], "3h", "¥190", "夜晚", 1.8, 89),
      route("cd-q1", "quest", "CD-QS-12", "树影下的盖碗", "从茶馆声音、竹椅和旧墙上的字，找一段慢城市线索。", ["竹椅", "旧墙", "茶影"], "50min", "¥35", "快速玩", 0.9, 93)
    ],
    quests: [
      secret("CD-01", "树影下的盖碗", "下午三点，找树影最厚的那张竹椅。", "快速玩", "30min"),
      secret("CD-02", "散场后的空街", "NU SPACE 结束后往反方向走三分钟。", "完整秘境", "2h"),
      secret("CD-03", "旧厂房的侧门", "主入口不重要，侧门外的墙更像成都。", "快速玩", "40min"),
      secret("CD-04", "玉林的第二个门牌", "同一条街上找到两个字体不同的门牌。", "完整秘境", "2h")
    ]
  });

  Object.assign(cities.abudhabi, {
    cover: "Saadiyat / Corniche / Yas",
    districts: ["Saadiyat", "Al Maryah", "Yas"],
    places: [
      place("ad-p01", "coffee", 25, 54, "The Espresso Lab", "适合清晨进入城市的一杯。"),
      place("ad-p02", "coffee", 36, 28, "LOCAL Mamsha", "海边生活方式街区里的咖啡入口。"),
      place("ad-p03", "drink", 62, 55, "Ray's Bar", "高处看城市夜色和海面。"),
      place("ad-p04", "drink", 76, 42, "Buddha-Bar Beach", "更度假感的夜晚和海风。"),
      place("ad-p05", "theatre", 52, 70, "The Arts Center at NYUAD", "Saadiyat 岛上的现场艺术入口。"),
      place("ad-p06", "theatre", 84, 64, "Etihad Arena", "Yas 岛的大型演出场馆。"),
      place("ad-p07", "art", 42, 36, "Louvre Abu Dhabi", "穹顶光影和海边建筑。"),
      place("ad-p08", "art", 48, 30, "Manarat Al Saadiyat", "展览、艺术教育和公共活动。"),
      place("ad-p09", "art", 30, 70, "421 Arts Campus", "Mina Zayed 的当代艺术空间。"),
      place("ad-p10", "fashion", 58, 34, "The Galleria Al Maryah Island", "购物、设计和城市夜景放在一起。"),
      place("ad-p11", "bookstore", 60, 28, "Kinokuniya The Galleria", "适合安静阅读和挑书。"),
      place("ad-p12", "music", 50, 62, "Berklee Abu Dhabi", "音乐教育、现场和城市文化交汇。"),
      place("ad-p13", "cinema", 82, 52, "VOX Cinemas Yas Mall", "Yas 岛更轻松的电影夜。"),
      place("ad-p14", "climb", 88, 58, "CLYMB Abu Dhabi", "室内攀岩和运动体验。"),
      place("ad-p15", "riding", 22, 76, "Abu Dhabi Equestrian Club", "马术体验和开阔场地。"),
      place("ad-p16", "architecture", 34, 80, "Qasr Al Watan", "宫殿建筑和仪式感空间。"),
      place("ad-p17", "market", 26, 66, "Mina Market", "港口、鱼市和生活感更强的城市一面。"),
      place("ad-p18", "night", 68, 62, "Corniche 夜风", "夜晚沿海边慢走，城市会变得更安静。"),
      place("ad-p19", "wellness", 38, 46, "Mamsha 海边瑜伽平台", "适合用呼吸和海风把身体放松下来。"),
      place("ad-p20", "quest", 42, 34, "Louvre 白墙边界", "日落前沿着白色建筑的边走。")
    ],
    routes: [
      route("ad-r1", "coffee", "AD-CF-01", "Qasr Al Hosn 清晨咖啡", "一杯咖啡、白墙和老城核心的清晨光线。", ["The Espresso Lab", "Qasr Al Hosn", "街角阴影"], "2h", "AED 75", "清晨", 1.4, 82),
      route("ad-r2", "coffee", "AD-CF-02", "Mamsha 海边咖啡线", "海边咖啡、白色建筑和去 Louvre 的短路。", ["LOCAL Mamsha", "Mamsha 海边", "Louvre Abu Dhabi"], "2.5h", "AED 95", "午后", 2.0, 85),
      route("ad-r3", "drink", "AD-BR-03", "高处夜色一杯", "在 Etihad Towers 看夜色，再把路走回海风里。", ["Ray's Bar", "Etihad Towers", "Corniche 夜风"], "3h", "AED 260", "傍晚", 2.6, 88),
      route("ad-r4", "theatre", "AD-TH-04", "Saadiyat 现场艺术夜", "NYUAD 的现场演出、海岛建筑和散场后静路。", ["The Arts Center at NYUAD", "Saadiyat 夜路", "Mamsha"], "3h", "AED 180", "演出夜", 2.2, 77),
      route("ad-r5", "art", "AD-AR-05", "Louvre 光影半日", "穹顶、海面和建筑边界组成一条完整路线。", ["Louvre Abu Dhabi", "穹顶光影", "海边步行"], "4h", "AED 160", "日落前", 2.8, 94),
      route("ad-r6", "art", "AD-AR-06", "Mina Zayed 艺术和市场", "421 Arts Campus 到 Mina Market，看艺术空间和生活现场。", ["421 Arts Campus", "Mina Market", "港口边界"], "3h", "AED 90", "想看真实城市", 2.4, 78),
      route("ad-r7", "fashion", "AD-FA-07", "Al Maryah 设计购物线", "从 The Galleria 到书店和海边夜景，看阿布扎比的精致城市面。", ["The Galleria", "Kinokuniya", "Al Maryah Waterfront"], "3h", "AED 180", "想看设计", 1.6, 81),
      route("ad-r8", "bookstore", "AD-BK-08", "Kinokuniya 安静阅读", "在购物中心里找一段安静书架，再去水边透气。", ["Kinokuniya", "咖啡", "Waterfront"], "2h", "AED 85", "想安静", 0.8, 73),
      route("ad-r9", "climb", "AD-CL-09", "Yas 岛运动日", "CLYMB 攀岩之后，用电影或海边晚饭把身体收回来。", ["CLYMB Abu Dhabi", "Yas Mall", "VOX Cinemas"], "4h", "AED 260", "想动一下", 1.8, 84),
      route("ad-r10", "riding", "AD-RD-10", "马术和黄昏咖啡", "马术体验之后，找一杯咖啡把身体慢慢放回城市。", ["Abu Dhabi Equestrian Club", "Qasr Al Hosn", "The Espresso Lab"], "4h", "AED 360", "想试新事", 4.5, 72),
      route("ad-r11", "architecture", "AD-AC-11", "宫殿和白色边界", "Qasr Al Watan、Grand Mosque 和城市仪式感。", ["Qasr Al Watan", "Sheikh Zayed Grand Mosque", "日落车窗"], "5h", "AED 110", "建筑观察", 8.5, 89),
      route("ad-r12", "music", "AD-MU-12", "Berklee 和海岛现场", "从音乐空间到海岛夜路，让阿布扎比的安静现场感靠近一点。", ["Berklee Abu Dhabi", "The Arts Center at NYUAD", "Mamsha 夜路"], "3h", "AED 160", "现场", 2.0, 83),
      route("ad-r13", "market", "AD-MK-13", "Mina Market 生活线", "从艺术园区走到港口市场，看见更真实的城市声音和生活边界。", ["421 Arts Campus", "Mina Market", "港口边界"], "3h", "AED 80", "想看真实城市", 2.3, 80),
      route("ad-r14", "night", "AD-NI-14", "Corniche 夜风短线", "高处一杯、海边夜风和安静的步行，把夜晚收得很轻。", ["Ray's Bar", "Corniche 夜风", "海湾夜色"], "2.5h", "AED 260", "夜晚", 2.4, 86),
      route("ad-r15", "wellness", "AD-WE-15", "海边安静恢复线", "海风、白墙和一段轻运动，让城市从观光变成自己的节奏。", ["Mamsha 海边瑜伽平台", "LOCAL Mamsha", "Louvre 白墙边界"], "2.5h", "AED 95", "想放松", 1.7, 78),
      route("ad-q1", "quest", "AD-QS-12", "白墙和地平线", "跟随光线变化，找到博物馆建筑旁最安静的一道边界。", ["白墙", "穹顶", "地平线"], "55min", "AED 0", "快速玩", 1.1, 90)
    ],
    quests: [
      secret("AD-01", "穹顶下的斑点光", "不要只看建筑全景，低头看光落在地面上。", "快速玩", "30min"),
      secret("AD-02", "海风最安静的边", "离主入口远一点，风声会盖住人声。", "完整秘境", "2.5h"),
      secret("AD-03", "白墙和地平线", "日落前 20 分钟，白墙会变成另一种颜色。", "快速玩", "45min"),
      secret("AD-04", "Mina 的生活声", "在港口市场附近听见三种不同的叫卖和金属声。", "完整秘境", "2h")
    ]
  });
}

const featuredPassMaps = {
  shanghai: [
    featuredPassMap({
      id: "sh-pass-coffee-01",
      city: "shanghai",
      code: "SH-FM-01",
      title: "上海咖啡地图 Vol.01",
      issue: "雨后衡复 / 独立咖啡通行证",
      theme: "咖啡地图",
      desc: "像一本可以走进现实的城市咖啡特刊：沿衡复街区顺路走 5 家店，每家留一杯招牌饮品。",
      duration: "半日",
      distance: 2.4,
      originalPrice: "¥188",
      price: "¥128",
      validDays: 7,
      bestFor: "雨后下午",
      hot: 97,
      benefits: [
        passStop("ops", "O.P.S. Cafe", "太原路", "浓缩特调", "小体量门店，适合从一杯强烈但克制的咖啡开始。", "11:00-17:00", "第 1 站"),
        passStop("manner", "太原路树影咖啡", "太原路", "季节拿铁", "从街边树影过渡到更轻的日常停留。", "09:00-19:00", "第 2 站"),
        passStop("sinan", "思南书局咖啡角", "思南路", "书店美式", "把书架、花园洋房和一杯咖啡放在同一段步行里。", "10:00-20:00", "第 3 站"),
        passStop("window", "复兴中路窗边咖啡", "复兴中路", "手冲单品", "适合坐 30 分钟，看旧楼和人流慢下来。", "10:30-18:30", "第 4 站"),
        passStop("corner", "安福路街角咖啡", "安福路", "冷萃或气泡咖啡", "最后一站留给街角、橱窗和回看的城市状态。", "10:00-21:00", "第 5 站")
      ]
    }),
    featuredPassMap({
      id: "sh-pass-night-01",
      city: "shanghai",
      code: "SH-FM-02",
      title: "上海低光夜游地图",
      issue: "自然酒 / 爵士 / 深夜咖啡",
      theme: "夜游地图",
      desc: "不做热闹夜生活，做一条低光、微醺、可以慢慢走回去的城市夜游线。",
      duration: "3h",
      distance: 1.9,
      originalPrice: "¥268",
      price: "¥198",
      validDays: 5,
      bestFor: "周五夜晚",
      hot: 94,
      benefits: [
        passStop("wine", "复兴中路自然酒小房间", "复兴中路", "杯装自然酒", "第一站先把夜晚放慢。", "18:00-23:00", "第 1 站"),
        passStop("jazz", "衡山路楼上爵士", "衡山路", "入场小杯饮品", "楼梯、暗光和现场感是路线的核心。", "19:30-00:30", "第 2 站"),
        passStop("nightcoffee", "安福路深夜咖啡", "安福路", "夜间咖啡特调", "不急着回家，用一杯咖啡收尾。", "20:00-01:00", "第 3 站")
      ]
    })
  ],
  chengdu: [
    featuredPassMap({
      id: "cd-pass-coffee-01",
      city: "chengdu",
      code: "CD-FM-01",
      title: "成都慢下午咖啡地图",
      issue: "玉林 / 太古里 / 方所",
      theme: "咖啡地图",
      desc: "把成都的慢下午做成一张可走的咖啡特刊，路线从咖啡到书店，不催促用户打卡。",
      duration: "半日",
      distance: 2.1,
      originalPrice: "¥158",
      price: "¥108",
      validDays: 7,
      bestFor: "周末下午",
      hot: 95,
      benefits: [
        passStop("taikoo", "% Arabica 成都太古里", "太古里", "拿铁或美式", "好进入的一杯，适合开始。", "10:00-22:00", "第 1 站"),
        passStop("corner", "太古里街角咖啡", "太古里", "季节特调", "从商业街区切到小一点的街角。", "10:00-20:00", "第 2 站"),
        passStop("fangsuo", "方所成都店咖啡角", "方所", "书店咖啡", "让阅读和咖啡成为路线中段。", "10:00-22:00", "第 3 站"),
        passStop("yulin", "玉林院子咖啡", "玉林", "手冲单品", "最后进入更生活化的成都。", "11:00-19:00", "第 4 站")
      ]
    }),
    featuredPassMap({
      id: "cd-pass-art-01",
      city: "chengdu",
      code: "CD-FM-02",
      title: "成都艺术与小店地图",
      issue: "麓湖 / 东郊记忆 / 奎星楼",
      theme: "艺术地图",
      desc: "不是只看展，而是把展览、旧厂房、小店和现场感串成一段轻旅行。",
      duration: "1日",
      distance: 4.6,
      originalPrice: "¥218",
      price: "¥168",
      validDays: 10,
      bestFor: "周末",
      hot: 91,
      benefits: [
        passStop("a4", "A4 美术馆", "麓湖", "展览饮品券", "先进入展览和湖边的节奏。", "10:00-18:00", "第 1 站"),
        passStop("east", "东郊记忆旧厂房咖啡", "东郊记忆", "厂房咖啡", "看旧厂房和城市更新的材质。", "10:00-20:00", "第 2 站"),
        passStop("kuixing", "奎星楼独立小店", "奎星楼", "主理人推荐饮品", "用小店收束整条艺术生活线。", "12:00-22:00", "第 3 站")
      ]
    })
  ],
  abudhabi: [
    featuredPassMap({
      id: "ad-pass-coffee-01",
      city: "abudhabi",
      code: "AD-FM-01",
      title: "阿布扎比白墙咖啡地图",
      issue: "Qasr Al Hosn / Mamsha / Louvre",
      theme: "咖啡地图",
      desc: "把白墙、强光、海风和一杯咖啡连成一条轻旅行路线。",
      duration: "半日",
      distance: 3.2,
      originalPrice: "AED 165",
      price: "AED 118",
      validDays: 7,
      bestFor: "清晨",
      hot: 89,
      benefits: [
        passStop("espresso", "The Espresso Lab", "Qasr Al Hosn", "Signature espresso drink", "从老城核心附近的一杯咖啡开始。", "08:00-20:00", "第 1 站"),
        passStop("local", "LOCAL Mamsha", "Mamsha", "Iced latte", "把节奏带到海边生活方式街区。", "08:00-22:00", "第 2 站"),
        passStop("louvre", "Louvre 白墙咖啡点", "Saadiyat", "Cold brew", "用建筑边界和海风收尾。", "10:00-18:30", "第 3 站")
      ]
    }),
    featuredPassMap({
      id: "ad-pass-art-01",
      city: "abudhabi",
      code: "AD-FM-02",
      title: "阿布扎比光影艺术地图",
      issue: "Louvre / Manarat / 421",
      theme: "艺术地图",
      desc: "一张更像旅行杂志的艺术通行证，连接穹顶、展览和港口附近的生活现场。",
      duration: "1日",
      distance: 5.4,
      originalPrice: "AED 220",
      price: "AED 168",
      validDays: 10,
      bestFor: "日落前",
      hot: 92,
      benefits: [
        passStop("louvreart", "Louvre Abu Dhabi", "Saadiyat", "馆内咖啡券", "先看穹顶和海面光线。", "10:00-18:30", "第 1 站"),
        passStop("manarat", "Manarat Al Saadiyat", "Saadiyat", "展览饮品", "转入更轻的公共艺术空间。", "10:00-20:00", "第 2 站"),
        passStop("mina", "421 Arts Campus", "Mina Zayed", "艺术园区饮品", "最后靠近真实市场和港口边界。", "10:00-20:00", "第 3 站")
      ]
    })
  ]
};

const sortOptions = [
  { id: "smart", label: "智能推荐" },
  { id: "near", label: "离我最近" },
  { id: "short", label: "路线短" },
  { id: "time", label: "2小时内" },
  { id: "budget", label: "花销低" },
  { id: "hot", label: "热度高" }
];

const mockLiveFeeds = {
  shanghai: [
    { title: "雨后街区", layers: ["coffee", "bookstore", "quest", "architecture"], areas: ["衡复", "思南", "武康路"], tone: "安静、反光、旧楼梯" },
    { title: "夜色散场", layers: ["drink", "music", "theatre", "night"], areas: ["杨浦滨江", "安福路", "外滩源"], tone: "低光、现场、夜风" },
    { title: "城市更新", layers: ["art", "fashion", "market", "citywalk"], areas: ["西岸", "上生新所", "M50"], tone: "展览、橱窗、旧厂房" },
    { title: "手作周末", layers: ["tufting", "pottery", "floristry", "workshop"], areas: ["愚园路", "淮海路", "静安"], tone: "材料、作品、主理人" }
  ],
  chengdu: [
    { title: "慢下午", layers: ["tea", "coffee", "bookstore", "citywalk"], areas: ["玉林", "望江楼", "太古里"], tone: "茶、树影、松弛" },
    { title: "散场后", layers: ["music", "drink", "night", "comedy"], areas: ["奎星楼", "九眼桥", "东郊记忆"], tone: "现场、夜风、小酒" },
    { title: "周末手作", layers: ["market", "workshop", "pottery", "floristry"], areas: ["麓湖", "东郊记忆", "玉林"], tone: "市集、器物、材料" }
  ],
  abudhabi: [
    { title: "白墙清晨", layers: ["coffee", "architecture", "art", "wellness"], areas: ["Saadiyat", "Qasr Al Hosn"], tone: "白墙、强光、安静" },
    { title: "海风夜色", layers: ["drink", "night", "music", "cinema"], areas: ["Corniche", "Yas", "Al Maryah"], tone: "海风、露台、低光" },
    { title: "真实市场", layers: ["market", "foodie", "quest", "photography"], areas: ["Mina", "Al Hosn"], tone: "市场、声音、生活现场" }
  ]
};

// Source URLs keep the public-data seed traceable while the UI stays editorial.
const publicSourceRegistry = {
  shanghai: [
    { label: "Shanghai official tourist attractions", url: "https://www.meet-in-shanghai.net/en/100-recommended-tourist-attractions-in-shanghai/" },
    { label: "Power Station of Art guide", url: "https://www.meet-in-shanghai.net/en/guide/power-station-of-art-the-first-staterun-museum-of-contemporary-art-055343/" },
    { label: "West Bund Museum", url: "https://wbmshanghai.com/" },
    { label: "Fotografiska Shanghai", url: "https://shanghai.fotografiska.com/en" },
    { label: "Tsutaya Books Shanghai government listing", url: "https://english.shanghai.gov.cn/en-BookstoresLibraries/20231220/4b3022baf2eb4265a10d31110a494dcf.html" },
    { label: "Long Museum", url: "https://www.thelongmuseum.org/en/" }
  ],
  chengdu: [
    { label: "A4 Art Museum visit page", url: "https://www.a4artmuseum.com/en/visit/plan-your-visit/" },
    { label: "Chengdu Museum introduction", url: "https://www.cdmuseum.com/en/jianjie.html" },
    { label: "Dongjiao Memory public guide", url: "https://www.chinaexploration.com/TopAttractions/Sichuan-attractions/dongjiao-memory.html" },
    { label: "NU SPACE Chengdu listing", url: "https://chengdu-expat.com/places/nu-space/" },
    { label: "Sichuan Museum collection page", url: "https://artsandculture.google.com/partner/sichuan-museum" },
    { label: "Wangjianglou Park public listing", url: "https://www.trip.com/travel-guide/attraction/chengdu/wangjianglou-park-24653429/" }
  ],
  abudhabi: [
    { label: "Visit Abu Dhabi culture guide", url: "https://visitabudhabi.ae/en/things-to-do/culture" },
    { label: "Louvre Abu Dhabi", url: "https://www.louvreabudhabi.ae/" },
    { label: "Qasr Al Hosn", url: "https://visitabudhabi.ae/en/things-to-do/culture/heritage/qasr-al-hosn" },
    { label: "421 Arts Campus", url: "https://www.421.online/about/" },
    { label: "The Arts Center at NYU Abu Dhabi", url: "https://nyuad.nyu.edu/en/about/the-nyuad-campus/arts-center.html" },
    { label: "CLYMB Abu Dhabi", url: "https://www.clymbabudhabi.com/" }
  ]
};

const publicSourcePois = {
  shanghai: {
    art: ["West Bund Museum", "Power Station of Art", "Long Museum West Bund", "Fotografiska Shanghai", "West Bund Art Center", "Yuz Museum", "Shanghai Museum East", "Rockbund Art Museum"],
    bookstore: ["Tsutaya Books Columbia Circle", "Sinan Books", "Duoyun Books Flagship Store", "Shanghai Library East", "Hengshan Heji", "Jian Tou Bookstore"],
    architecture: ["Wukang Mansion", "Sihang Warehouse", "Rockbund Historical Buildings", "Columbia Circle", "Moller Villa", "Shanghai Grand Theatre", "Zhangyuan", "Shanghai Postal Museum"],
    theatre: ["Shanghai Grand Theatre", "YOUNG Theater", "Theatre YOUNG", "Shanghai Dramatic Arts Centre", "Majestic Theatre", "Asia Building Star Space"],
    music: ["JZ Club", "Blue Note Shanghai", "Modern Sky LAB Shanghai", "MAO Livehouse Shanghai", "Yuyintang", "Jazz at Lincoln Center Shanghai"],
    photography: ["Fotografiska Shanghai", "Sihang Warehouse", "Suzhou Creek bridge view", "Rockbund riverfront", "West Bund riverside", "Shanghai Postal Museum facade"],
    citywalk: ["Wukang Road", "Anfu Road", "Yuanmingyuan Road", "Suzhou Creek Walk", "Columbia Circle", "Sinan Mansions"],
    market: ["M50 Creative Park", "West Bund Art & Design fair area", "TX Huaihai pop-up market", "Columbia Circle weekend market", "Yuyuan Garden Malls", "Zhangyuan lifestyle market"],
    quest: ["Wukang Mansion corner", "Sihang Warehouse river wall", "Rockbund old sign", "Columbia Circle side gate", "Power Station smokestack", "Fotografiska spiral stair"]
  },
  chengdu: {
    art: ["A4 Art Museum", "Chengdu Museum", "Sichuan Museum", "Dongjiao Memory", "Luxelakes Eco Art Center", "Chengdu Contemporary Image Museum", "Blue Roof Museum", "Times Art Museum Chengdu"],
    bookstore: ["Fangsuo Chengdu", "Wenxuan BOOKS", "Sisyphe Books Taikoo Li", "Dokuya Bookstore", "Sanlian Taofen Bookstore Chengdu", "Chengdu Museum book corner"],
    music: ["NU SPACE", "Little Bar Fangqin", "MAO Livehouse Chengdu", "CH8 Livehouse", "Zhenghuo Art Center", "Berklee-style rehearsal room Chengdu"],
    theatre: ["Sichuan Grand Theatre", "Chengdu City Music Hall", "Luhu Water Theatre", "Mahua FunAge Global Center Theatre", "Dongjiao Memory Performance Center", "Jinjiang Theatre"],
    architecture: ["Dongjiao Memory", "Kuanzhai Alley", "Daci Temple", "Taikoo Li Chengdu", "Wangjianglou Park", "Chengdu Museum", "Sichuan University Huaxiba", "Eastern Suburb factory facade"],
    tea: ["Wangjianglou Park", "People's Park Heming Teahouse", "Wenshu Monastery tea courtyard", "Yulin courtyard tea seat", "Huanhuaxi tea stop", "Jiuyan Bridge riverside tea"],
    market: ["Dongjiao Memory market", "Kuixinglou Street", "Yulin lifestyle market", "Luxelakes weekend market", "Wangping Street shops", "Taikoo Li pop-up lane"],
    citywalk: ["Yulin Road", "Kuixinglou Street", "Wangping Street", "Dongjiao Memory", "Wangjianglou Park", "Daci Temple lane"],
    quest: ["Wangjianglou bamboo shadow", "Dongjiao Memory side gate", "Kuixinglou small storefront", "Yulin second doorplate", "Taikoo Li hidden courtyard", "Chengdu Museum evening facade"]
  },
  abudhabi: {
    art: ["Louvre Abu Dhabi", "Manarat Al Saadiyat", "421 Arts Campus", "Cultural Foundation", "NYUAD Art Gallery", "teamLab Phenomena Abu Dhabi", "Natural History Museum Abu Dhabi", "House of Artisans"],
    architecture: ["Qasr Al Hosn", "Qasr Al Watan", "Sheikh Zayed Grand Mosque", "Louvre Abu Dhabi Dome", "Etihad Towers", "Aldar HQ", "Abrahamic Family House", "Zayed National Museum"],
    theatre: ["The Arts Center at NYU Abu Dhabi", "Cultural Foundation Theatre", "Etihad Arena", "Manarat Al Saadiyat Auditorium", "Berklee Abu Dhabi", "Abu Dhabi National Theatre"],
    music: ["Berklee Abu Dhabi", "The Arts Center at NYU Abu Dhabi", "Etihad Arena", "Cultural Foundation", "Manarat Al Saadiyat", "NYUAD Black Box"],
    climb: ["CLYMB Abu Dhabi", "Adventure HQ", "Circuit X Hudayriyat", "Yas Island activity zone", "Al Qana climbing wall", "Hudayriyat sports hub"],
    riding: ["Abu Dhabi Equestrian Club", "Al Forsan Equestrian", "Mandara Equestrian Club", "Dhabian Equestrian Club", "Al Wathba riding experience", "Saadiyat riding trail"],
    market: ["Mina Market", "Al Mina Fish Market", "Mina Zayed plant market", "World Trade Center Souk", "Souq Al Qattara", "Hudayriyat food market"],
    wellness: ["Jubail Mangrove Park", "Corniche Beach", "Saadiyat Beach", "Eastern Mangroves", "Hudayriyat Beach", "Mamsha Al Saadiyat promenade"],
    quest: ["Qasr Al Hosn watchtower", "Louvre Abu Dhabi rain of light", "421 Arts Campus warehouse wall", "Mina Zayed market sound", "Corniche evening wind", "Manarat Al Saadiyat courtyard"]
  }
};

const publicSourcePlaces = {
  shanghai: [
    place("sh-src-wbm", "art", 70, 76, "West Bund Museum", "龙腾大道上的西岸艺术锚点，适合和滨江步行连起来。"),
    place("sh-src-psa", "art", 58, 82, "Power Station of Art", "由旧电厂更新而来的当代艺术场馆。"),
    place("sh-src-fotografiska", "photography", 30, 30, "Fotografiska Shanghai", "苏州河边的影像艺术中心，适合低光和夜间灵感。"),
    place("sh-src-tsutaya", "bookstore", 44, 26, "Tsutaya Books Columbia Circle", "上生新所里的书店、咖啡和建筑更新样本。"),
    place("sh-src-wukang", "architecture", 25, 58, "Wukang Mansion", "衡复街区建筑观察的经典起点。"),
    place("sh-src-sihang", "quest", 34, 34, "Sihang Warehouse", "苏州河边更硬朗的历史墙面和夜色线索。")
  ],
  chengdu: [
    place("cd-src-a4", "art", 70, 30, "A4 Art Museum", "麓湖边的展览、湖面和低饱和街区。"),
    place("cd-src-museum", "art", 48, 42, "Chengdu Museum", "天府广场旁的城市历史入口。"),
    place("cd-src-dongjiao", "architecture", 68, 64, "Dongjiao Memory", "旧厂房、展演和市集混合的城市更新场。"),
    place("cd-src-nuspace", "music", 30, 46, "NU SPACE", "奎星楼附近的现场音乐入口。"),
    place("cd-src-wangjiang", "tea", 18, 28, "Wangjianglou Park", "竹影、茶和河边慢走的成都样本。"),
    place("cd-src-fangsuo", "bookstore", 37, 28, "Fangsuo Chengdu", "太古里地下书店，把阅读和商业街区揉在一起。")
  ],
  abudhabi: [
    place("ad-src-louvre", "art", 42, 34, "Louvre Abu Dhabi", "穹顶、海面和艺术馆组成的 Saadiyat 核心。"),
    place("ad-src-qasrhosn", "architecture", 28, 70, "Qasr Al Hosn", "城市历史和手工艺叙事的老城锚点。"),
    place("ad-src-manarat", "art", 48, 30, "Manarat Al Saadiyat", "Saadiyat 的展览、讲座和社区艺术中心。"),
    place("ad-src-421", "art", 30, 72, "421 Arts Campus", "Mina Zayed 的仓库艺术园区。"),
    place("ad-src-nyuad", "theatre", 52, 64, "The Arts Center at NYU Abu Dhabi", "Saadiyat 岛上的剧场和现场艺术空间。"),
    place("ad-src-clymb", "climb", 88, 58, "CLYMB Abu Dhabi", "Yas 岛的室内攀岩和飞行体验。")
  ]
};

const publicSourceRoutes = {
  shanghai: [
    route("sh-public-art-01", "art", "SH-PUB-01", "西岸艺术馆连线", "从 West Bund Museum 到 Long Museum West Bund，把龙腾大道、展厅和江风排成一条真实艺术线。", ["West Bund Museum", "West Bund Art Center", "Long Museum West Bund", "Yuz Museum", "徐汇滨江"], "4h", "¥160", "看展半日", 2.6, 93),
    route("sh-public-architecture-02", "architecture", "SH-PUB-02", "武康大楼到上生新所", "从 Wukang Mansion 出发，沿衡复街区、安福路和 Columbia Circle 看一条建筑更新线。", ["Wukang Mansion", "Wukang Road", "Anfu Road", "Columbia Circle", "Tsutaya Books Columbia Circle"], "3h", "¥80", "建筑观察", 2.3, 91),
    route("sh-public-photo-03", "photography", "SH-PUB-03", "苏州河影像夜线", "Fotografiska、Sihang Warehouse 和外滩源旧建筑会让苏州河夜色更有层次。", ["Fotografiska Shanghai", "Sihang Warehouse", "Suzhou Creek bridge view", "Rockbund Historical Buildings", "Waibaidu Bridge"], "2.5h", "¥120", "夜间拍照", 2.0, 88),
    route("sh-public-theatre-04", "theatre", "SH-PUB-04", "人民广场剧场前后", "上海大剧院、人民公园和老影院街角，把正式演出后的城市中心留久一点。", ["Shanghai Grand Theatre", "People's Park edge", "Majestic Theatre", "Nanjing West Road", "Da Guangming Cinema"], "3h", "¥220", "演出夜", 1.8, 84)
  ],
  chengdu: [
    route("cd-public-art-01", "art", "CD-PUB-01", "麓湖 A4 与湖边展厅", "从 A4 Art Museum 开始，把湖边、展览和安静街区串成一条不赶路的下午。", ["A4 Art Museum", "Luxelakes Eco Art Center", "麓湖水边", "湖边咖啡", "麓镇小路"], "4h", "¥150", "湖边看展", 2.8, 90),
    route("cd-public-music-02", "music", "CD-PUB-02", "NU SPACE 到小酒馆", "从 NU SPACE 的现场感切到玉林的小酒馆，让成都夜晚从音乐慢慢散开。", ["NU SPACE", "Kuixinglou Street", "Little Bar Fangqin", "Yulin night road", "深夜甜品窗口"], "3.5h", "¥180", "现场散场", 2.1, 92),
    route("cd-public-architecture-03", "architecture", "CD-PUB-03", "东郊记忆旧厂房线", "Dongjiao Memory 的厂房墙面、演出入口和临时市集，很适合看成都城市更新的材质。", ["Dongjiao Memory", "旧厂房墙面", "Dongjiao Memory Performance Center", "周末市集", "建设南支路夜风"], "3h", "¥100", "城市更新", 2.2, 87),
    route("cd-public-tea-04", "tea", "CD-PUB-04", "望江楼竹影茶线", "Wangjianglou Park、竹影和河边慢走，把茶馆生活做成很轻的一条路线。", ["Wangjianglou Park", "竹影茶座", "锦江河边慢走", "Jiuyan Bridge", "Yulin courtyard tea seat"], "2.5h", "¥60", "慢下午", 1.6, 86)
  ],
  abudhabi: [
    route("ad-public-art-01", "art", "AD-PUB-01", "Saadiyat 文化区光影线", "Louvre Abu Dhabi、Manarat 和 NYUAD 的现场空间，把 Saadiyat 从观光点变成一条文化路线。", ["Louvre Abu Dhabi", "Manarat Al Saadiyat", "The Arts Center at NYU Abu Dhabi", "NYUAD Art Gallery", "Mamsha Al Saadiyat promenade"], "4h", "AED 180", "日落前", 3.1, 94),
    route("ad-public-heritage-02", "architecture", "AD-PUB-02", "老城堡到宫殿建筑", "Qasr Al Hosn、House of Artisans 和 Qasr Al Watan 让阿布扎比的历史和仪式感连起来。", ["Qasr Al Hosn", "House of Artisans", "Cultural Foundation", "Qasr Al Watan", "Corniche evening wind"], "5h", "AED 120", "历史建筑", 6.8, 90),
    route("ad-public-art-03", "art", "AD-PUB-03", "Mina Zayed 仓库艺术线", "421 Arts Campus 和 Mina Market 之间，是艺术园区和真实生活现场的连接。", ["421 Arts Campus", "Mina Market", "Al Mina Fish Market", "Mina Zayed plant market", "港口边界"], "3h", "AED 80", "真实城市", 2.4, 86),
    route("ad-public-climb-04", "climb", "AD-PUB-04", "Yas 岛运动后收尾", "CLYMB Abu Dhabi 之后，把运动、电影和海湾夜路串成更轻的一天。", ["CLYMB Abu Dhabi", "Yas Mall", "VOX Cinemas Yas Mall", "Yas Bay Waterfront", "晚餐收尾"], "4h", "AED 260", "想动一下", 2.0, 84)
  ]
};

const publicSourceLiveFeeds = {
  shanghai: [
    { title: "公开来源 / 西岸艺术带", layers: ["art", "architecture", "photography", "citywalk"], areas: ["西岸", "龙腾大道", "苏州河"], tone: "美术馆、江风、旧工业边界" },
    { title: "公开来源 / 衡复建筑散步", layers: ["architecture", "bookstore", "coffee", "quest"], areas: ["武康路", "安福路", "上生新所"], tone: "梧桐、转角、书店和旧楼" },
    { title: "公开来源 / 苏州河夜影像", layers: ["photography", "night", "art", "quest"], areas: ["光复路", "四行仓库", "外滩源"], tone: "仓库、反光、低光影像" }
  ],
  chengdu: [
    { title: "公开来源 / 麓湖展厅下午", layers: ["art", "coffee", "wellness", "citywalk"], areas: ["麓湖", "A4", "麓镇"], tone: "湖边、展厅、低饱和街区" },
    { title: "公开来源 / 东郊旧厂房", layers: ["architecture", "music", "market", "photography"], areas: ["东郊记忆", "建设南支路"], tone: "工业墙面、现场、周末市集" },
    { title: "公开来源 / 玉林和望江楼", layers: ["tea", "drink", "bookstore", "quest"], areas: ["玉林", "望江楼", "九眼桥"], tone: "竹影、盖碗、夜风" }
  ],
  abudhabi: [
    { title: "公开来源 / Saadiyat 文化区", layers: ["art", "architecture", "theatre", "wellness"], areas: ["Saadiyat", "Mamsha", "Louvre"], tone: "穹顶、白墙、海风和现场" },
    { title: "公开来源 / 老城与手工艺", layers: ["architecture", "quest", "art", "market"], areas: ["Qasr Al Hosn", "Cultural Foundation", "Corniche"], tone: "堡垒、手工艺、城市历史" },
    { title: "公开来源 / Yas 运动夜", layers: ["climb", "cinema", "night", "foodie"], areas: ["Yas", "Yas Bay"], tone: "室内攀岩、电影、海湾夜风" }
  ]
};

const publicSourceMoodEntries = {
  shanghai: {
    design: [
      inspirationItem("Tsutaya Books Columbia Circle", "书店、旧建筑、生活方式", ["bookstore", "architecture", "coffee"], "今天适合去看一本书如何住进一栋旧建筑。", ["在上海看见设计", "Tsutaya Books Columbia Circle", "上生新所", "午后", "书店、咖啡和建筑更新放在一起，会让城市有更清楚的层次。", ["书店", "建筑", "咖啡"]])
    ],
    artist: [
      inspirationItem("Power Station of Art", "旧电厂、双年展、当代艺术", ["art", "architecture", "citywalk"], "今天适合从一座旧电厂开始看上海的当代艺术面。", ["在上海靠近艺术现场", "Power Station of Art", "黄浦滨江", "下午", "旧电厂体量和当代展览之间，有一种很上海的城市更新感。", ["当代艺术", "旧电厂", "滨江"]])
    ]
  },
  chengdu: {
    artist: [
      inspirationItem("A4 Art Museum", "湖边、展览、城市文化", ["art", "wellness", "coffee"], "今天适合把展览和湖边慢走放在同一条线上。", ["在成都靠近艺术现场", "A4 Art Museum", "麓湖", "午后", "展厅、湖面和低饱和街区会把成都的慢变得更具体。", ["展厅", "湖边", "慢走"]])
    ],
    music: [
      inspirationItem("NU SPACE 的散场前后", "现场、街区、夜风", ["music", "drink", "night"], "今天适合让现场音乐带你走出惯性夜路。", ["在成都听现场", "NU SPACE", "奎星楼街", "演出夜", "现场结束后沿小街多走十分钟，成都的夜会更有后劲。", ["现场", "散场", "夜风"]])
    ]
  },
  abudhabi: {
    artist: [
      inspirationItem("Louvre Abu Dhabi 的穹顶光", "光影、海面、白墙", ["art", "architecture", "wellness"], "今天适合看光如何把一座城市变安静。", ["在阿布扎比靠近艺术现场", "Louvre Abu Dhabi", "Saadiyat", "日落前", "穹顶光、海面和白墙边界，会让一条路线像一张干净的明信片。", ["光影", "穹顶", "海风"]])
    ],
    design: [
      inspirationItem("Qasr Al Hosn 的手工艺线索", "历史、织物、城市记忆", ["architecture", "quest", "art"], "今天适合从老城堡和手工艺里读一座城市。", ["在阿布扎比看见设计", "Qasr Al Hosn", "老城核心", "上午", "堡垒、手工艺和城市历史会把阿布扎比从现代天际线里拉回来。", ["历史", "手工艺", "老城"]])
    ]
  }
};

const nicheFeedbackSourceRegistry = {
  shanghai: [
    { label: "SmartShanghai fRUITYSHOP Record Store", url: "https://www.smartshanghai.com/venue/34362/fruityshop_record_store" },
    { label: "SmartShanghai Jodo Space record store", url: "https://www.smartshanghai.com/venue/32209/jodo_space" },
    { label: "SmartShanghai record shops collection", url: "https://www.smartshanghai.com/articles/music/the-collection-record-shops-in-shanghai" },
    { label: "TimeOut Shanghai Raccoon Records", url: "https://www.timeoutshanghai.com/features/Music-Music/105194/5-super-chill-venues-to-listen-to-vinyl-records-in-Shanghai.html" },
    { label: "Reddit Shanghai bookstore feedback", url: "https://www.reddit.com/r/shanghai/comments/iu8psm/best_bookshops_for_englishwestern_books/" }
  ],
  chengdu: [
    { label: "Chengdu-Expat Comic Book Ren", url: "https://chengdu-expat.com/places/comic-book-ren/" },
    { label: "Chengdu-Expat NU SPACE", url: "https://chengdu-expat.com/places/nu-space/" },
    { label: "China Books Review Chengdu independent bookstores", url: "https://chinabooksreview.com/2026/01/29/bookstores/" },
    { label: "MCLC You Xing Bookstore reprieve", url: "https://u.osu.edu/mclc/2025/11/12/you-xing-bookstore-gets-reprieve/" },
    { label: "Reddit Chengdu hidden gems", url: "https://www.reddit.com/r/Chengdu/comments/c1mor5/does_anyone_want_to_share_their_hidden_gems_of/" }
  ],
  abudhabi: [
    { label: "Reddit Abu Dhabi third spaces", url: "https://www.reddit.com/r/abudhabi/comments/14anlzz/where_is_your_third_space/" },
    { label: "Tripadvisor Cafe Arabia community reviews", url: "https://www.tripadvisor.com/Restaurant_Review-g294013-d2016671-Reviews-Cafe_Arabia-Abu_Dhabi_Emirate_of_Abu_Dhabi.html" },
    { label: "FLTR Third Place interview", url: "https://fltrmagazine.com/2022/07/13/a-cafe-borne-from-a-need-for-connection-and-disconnection/" },
    { label: "MiZa The Alley community event", url: "https://www.miza.ae/event-details-registration/the-alley-season-04/form" },
    { label: "Tripadvisor Ritual Cafe and Studio review", url: "https://www.tripadvisor.com/Restaurant_Review-g294013-d27454295-Reviews-Ritual_Cafe_And_Studio-Abu_Dhabi_Emirate_of_Abu_Dhabi.html" }
  ]
};

const nicheFeedbackPois = {
  shanghai: {
    music: ["fRUITYSHOP Record Store", "Jōdo Space", "Raccoon Records", "Daily Vinyl call-ahead room", "Uptown Records n' Beer", "The Melting Pot"],
    bookstore: ["The Mix Place", "BOOCUP", "1984 Book Store", "Lekai Books", "Guang Hai Bookstore", "Garden Books"],
    vintage: ["fRUITYSHOP Changle Road", "Uptown Records n' Beer", "Raccoon Records merch shelf", "Daily Vinyl guesthouse crates"],
    quest: ["Jōdo Space industrial park entrance", "Raccoon Records above BOOCUP", "Daily Vinyl call-ahead door", "The Mix Place magazine floor"]
  },
  chengdu: {
    bookstore: ["Comic Book Ren", "You Xing Bookstore", "Laishuxia Bookstore", "UTE Bookshop", "AA Bookstore", "Dunbar lecture bar"],
    anime: ["Comic Book Ren", "Tianfu International Animation City S12", "IFS tiny alley comic route", "Chenghua animation community"],
    music: ["NU SPACE", "MiNTOWN creative workshop", "Little Bar Fangqin", "Sonderia Bar"],
    tea: ["Wangjianglou bamboo tea ground", "Yulin courtyard tea seat", "Sonderia daytime reading corner", "Dunbar outdoor lecture stools"],
    quest: ["Comic Book Ren third-floor entrance", "You Xing apricot-tree story", "Laishuxia reading event board", "Kuixinglou after-gig alley"]
  },
  abudhabi: {
    coffee: ["The Third Place Cafe", "Cafe Arabia library floor", "Ritual Cafe & Studio", "Beans & Pages", "Alkalime", "Art House Cafe"],
    bookstore: ["Cafe Arabia library floor", "Beans & Pages", "The Third Place library room", "Cultural Foundation reading corner"],
    workshop: ["The Alley at MiZa", "MiZa maker containers", "Cultural Foundation classes", "421 Arts Campus talks", "NYUAD Arts Center workshops"],
    boardgame: ["The Third Place upstairs room", "Cafe Arabia rooftop table", "Zayed Sports City bowling", "Ritual Cafe & Studio group table"],
    quest: ["The Alley container row", "Cafe Arabia book-swap shelf", "The Third Place backyard", "Ritual Cafe mangrove view"]
  }
};

const nicheFeedbackPlaces = {
  shanghai: [
    place("sh-niche-fruity", "music", 52, 40, "fRUITYSHOP Record Store", "长乐路上的唱片小店，公开店铺页把它描述成从 hip hop、jazz 到 city pop 都会出现的 curated room。"),
    place("sh-niche-jodo", "music", 57, 74, "Jōdo Space", "局门路工业园里的地下音乐和本土发行小空间，适合做更小众的唱片线索。"),
    place("sh-niche-raccoon", "vintage", 28, 54, "Raccoon Records", "岳阳路 BOOCUP 楼上的唱片点位，社区和媒体反馈都更像熟人推荐。"),
    place("sh-niche-mixplace", "bookstore", 32, 58, "The Mix Place", "把书、杂志、影像和生活方式混在一起的书店空间，比传统景点更适合慢逛。")
  ],
  chengdu: [
    place("cd-niche-comicren", "anime", 44, 38, "Comic Book Ren", "成都二次元和进口漫画的公开口碑点，适合把漫画店做成真实探索锚点。"),
    place("cd-niche-youxing", "bookstore", 36, 46, "You Xing Bookstore", "社区文章里被反复提到的独立书店，重点不是打卡，而是活动和附近居民的停留。"),
    place("cd-niche-laishuxia", "bookstore", 40, 42, "Laishuxia Bookstore", "成都独立书店生态里的女性主义书店信号，适合读书会和小活动路线。"),
    place("cd-niche-sonderia", "coffee", 29, 42, "Sonderia Bar", "旅人社区反馈里更偏松弛社交的 hostel bar，可以承接夜晚但不喧闹的路线。")
  ],
  abudhabi: [
    place("ad-niche-third", "coffee", 54, 58, "The Third Place Cafe", "Corniche 附近的 third-space cafe，公开采访强调社区、后院和 library room。"),
    place("ad-niche-cafearabia", "bookstore", 42, 68, "Cafe Arabia library floor", "用户点评里常提到书、艺术和三层空间，适合做安静读书节点。"),
    place("ad-niche-miza", "workshop", 28, 70, "The Alley at MiZa", "Mina Zayed 的 container alley，公开活动页把它定位成创意人、pop-up 和 workshop 的社区空间。"),
    place("ad-niche-ritual", "coffee", 58, 42, "Ritual Cafe & Studio", "Al Reem 的小型 cafe/studio，点评里有 warm lighting 和 relaxed vibe 的安静信号。")
  ]
};

const nicheFeedbackRoutes = {
  shanghai: [
    route("sh-feedback-vinyl-01", "music", "SH-FB-01", "用户反馈唱片挖掘线", "从长乐路唱片小店到局门路工业园，再绕去岳阳路楼上唱片空间，避开最响亮的景点。", ["fRUITYSHOP Record Store", "Changle Road backstreet", "Jōdo Space", "Raccoon Records", "BOOCUP"], "3h", "¥120", "唱片慢翻", 2.4, 87),
    route("sh-feedback-book-02", "bookstore", "SH-FB-02", "小众书店和杂志墙", "把 The Mix Place、BOOCUP 和老派独立书店放在同一条线，适合用户自己发现架子上的城市。", ["The Mix Place", "BOOCUP", "1984 Book Store", "Lekai Books", "Anfu Road side shelf"], "3.5h", "¥90", "书店绕行", 2.8, 84)
  ],
  chengdu: [
    route("cd-feedback-comic-01", "anime", "CD-FB-01", "漫画人和小巷上楼线", "用 Comic Book Ren 做起点，把成都的二次元、动画社区和小巷上楼感连成一条不大众的路线。", ["Comic Book Ren", "Tianfu International Animation City S12", "Comic Book Ren third-floor entrance", "Chenghua animation community"], "2.5h", "¥70", "漫画店探索", 1.9, 86),
    route("cd-feedback-book-02", "bookstore", "CD-FB-02", "有杏到来树下读书会", "从 You Xing 到 Laishuxia，再接一个户外 lecture bar，把成都独立书店的公共讨论感留出来。", ["You Xing Bookstore", "Laishuxia Bookstore", "Dunbar lecture bar", "UTE Bookshop"], "3h", "¥80", "读书会", 2.2, 85)
  ],
  abudhabi: [
    route("ad-feedback-third-01", "coffee", "AD-FB-01", "第三空间安静工作线", "用户反馈里的 cafe 和 library floor 组合，更适合找一个能停下来的阿布扎比下午。", ["The Third Place Cafe", "Cafe Arabia library floor", "Ritual Cafe & Studio", "Beans & Pages"], "3h", "AED 90", "安静工作", 4.1, 85),
    route("ad-feedback-maker-02", "workshop", "AD-FB-02", "MiZa 和创意社区线", "把 Mina Zayed 的 container alley、421 和 Cultural Foundation 串起来，走创意社区而不是常规观光线。", ["The Alley at MiZa", "MiZa maker containers", "421 Arts Campus talks", "Cultural Foundation classes"], "3.5h", "AED 120", "社区活动", 3.3, 86)
  ]
};

const nicheFeedbackLiveFeeds = {
  shanghai: [
    { title: "用户反馈 / 唱片挖掘", layers: ["music", "vintage", "bookstore", "quest"], areas: ["长乐路", "局门路", "岳阳路"], tone: "楼上唱片、工业园入口、熟人推荐感" },
    { title: "用户反馈 / 小众书店", layers: ["bookstore", "coffee", "vintage", "citywalk"], areas: ["安福路", "衡复", "BOOCUP"], tone: "杂志墙、书架、慢翻和街角咖啡" }
  ],
  chengdu: [
    { title: "用户反馈 / 独立书店", layers: ["bookstore", "tea", "anime", "music"], areas: ["有杏", "来树下", "奎星楼"], tone: "读书会、漫画、户外讲座和夜场前后" },
    { title: "用户反馈 / 漫画与现场", layers: ["anime", "music", "quest", "citywalk"], areas: ["天府动漫城", "奎星楼", "玉林"], tone: "进口漫画、上楼入口、livehouse 散场" }
  ],
  abudhabi: [
    { title: "用户反馈 / 第三空间", layers: ["coffee", "bookstore", "workshop", "boardgame"], areas: ["Corniche", "Reem", "Mina Zayed"], tone: "library room、后院、暖光和安静桌面" },
    { title: "用户反馈 / 创意容器街", layers: ["workshop", "art", "market", "quest"], areas: ["MiZa", "421", "Cultural Foundation"], tone: "container alley、pop-up、talks 和小型演出" }
  ]
};

const nicheFeedbackMoodEntries = {
  shanghai: {
    music: [
      inspirationItem("fRUITYSHOP 到 Jōdo 的唱片线", "长乐路、局门路、楼上空间", ["music", "vintage", "quest"], "今天适合把城市声音从唱片架里翻出来。", ["在上海翻一条唱片线", "fRUITYSHOP Record Store", "长乐路 / 局门路", "下午", "这些点不是地标，而是用户会互相转发的声音入口。", ["唱片", "小店", "地下音乐"]])
    ],
    design: [
      inspirationItem("The Mix Place 的杂志墙", "书、杂志、影像、生活方式", ["bookstore", "fashion", "coffee"], "今天适合去看书架如何替一座城市做排版。", ["在上海找小众书店", "The Mix Place", "衡复街区", "午后", "比起大景点，混合型书店更容易把城市品味暴露出来。", ["杂志", "书店", "街区"]])
    ]
  },
  chengdu: {
    reading: [
      inspirationItem("You Xing 到 Laishuxia 的读书会", "独立书店、公共讨论、社区活动", ["bookstore", "tea", "quest"], "今天适合去一间小书店听城市说话。", ["在成都找新的书店气味", "You Xing Bookstore", "社区街巷", "下午", "独立书店的闪光点常常不是装修，而是它把谁留在了同一张桌上。", ["独立书店", "读书会", "社区"]])
    ],
    series: [
      inspirationItem("Comic Book Ren 的进口漫画架", "漫画、动画社区、上楼入口", ["anime", "bookstore", "quest"], "今天适合从漫画店出发，走一条不太像旅游的路线。", ["在成都翻漫画地图", "Comic Book Ren", "天府动漫城", "周末", "漫画店是很好用的城市雷达，它会指向一群真实存在的人。", ["漫画", "二次元", "小众店"]])
    ]
  },
  abudhabi: {
    reading: [
      inspirationItem("Cafe Arabia 和 Third Place 的安静桌", "书、后院、library room", ["coffee", "bookstore", "wellness"], "今天适合找一个不需要解释自己的第三空间。", ["在阿布扎比停下来阅读", "The Third Place Cafe", "Corniche / Al Nahyan", "上午", "用户反馈里的 library floor 和 backyard 比热门地标更像日常生活的入口。", ["第三空间", "阅读", "咖啡"]])
    ],
    artist: [
      inspirationItem("MiZa The Alley 的创意容器街", "pop-up、talks、workshop", ["workshop", "art", "market"], "今天适合去看创意社区如何临时占领一条巷子。", ["在阿布扎比靠近创意社区", "The Alley at MiZa", "Mina Zayed", "傍晚", "container alley 的价值不只是建筑，而是它允许很多小型活动同时发生。", ["创意社区", "pop-up", "workshop"]])
    ]
  }
};

const homepageCulturalSourceRegistry = {
  shanghai: [
    { label: "SmartShanghai fRUITYSHOP record store", url: "https://www.smartshanghai.com/venue/34362/fruityshop_record_store" },
    { label: "SmartShanghai Blue Note Shanghai", url: "https://www.smartshanghai.com/venue/17577/blue_note_jazz_club_sichuan_bei_lu" },
    { label: "SmartShanghai Theatre YOUNG", url: "https://www.smartshanghai.com/venue/28018/theatre_young" },
    { label: "Meet in Shanghai Theatre YOUNG season", url: "https://www.meet-in-shanghai.net/en/news/a-young-season-of-diversity-and-crossover-705353/" },
    { label: "Shanghai indie bookstore guide", url: "https://english.shanghai.gov.cn/en-BookstoresLibraries/20260422/c2ff0ece50d940838a35422c9629e311.html" }
  ],
  chengdu: [
    { label: "Chengdu-Expat NU SPACE", url: "https://chengdu-expat.com/places/nu-space/" },
    { label: "Chengdu-Expat Comic Book Ren", url: "https://chengdu-expat.com/places/comic-book-ren/" },
    { label: "China Books Review Laishuxia and Chengdu bookstores", url: "https://chinabooksreview.com/2026/01/29/bookstores/" },
    { label: "MCLC You Xing Bookstore", url: "https://u.osu.edu/mclc/2025/11/12/you-xing-bookstore-gets-reprieve/" },
    { label: "Chengdu-Expat English-language bookstore guide", url: "https://chengdu-expat.com/finding-english-language-books-chengdu/" }
  ],
  abudhabi: [
    { label: "Berklee Abu Dhabi public performances", url: "https://www.berklee.edu/berklee-abu-dhabi" },
    { label: "The Arts Center at NYU Abu Dhabi", url: "https://nyuad.nyu.edu/en/about/the-nyuad-campus/arts-center.html" },
    { label: "Manarat Al Saadiyat CineMAS", url: "https://manaratalsaadiyat.ae/en/seeanddo/cinemas/" },
    { label: "Manarat Al Saadiyat weekly cultural schedule", url: "https://manaratalsaadiyat.ae/en/seeanddo/weeklyschedule/" },
    { label: "The Third Place Cafe official site", url: "https://www.thethirdplaceuae.com/" },
    { label: "Cafe Arabia community reviews", url: "https://www.tripadvisor.com/Restaurant_Review-g294013-d2016671-Reviews-Cafe_Arabia-Abu_Dhabi_Emirate_of_Abu_Dhabi.html" }
  ]
};

const homepageCulturalMoodEntries = {
  shanghai: {
    music: [
      inspirationItem("fRUITYSHOP 的 city pop crate", "唱片、DJ、长乐路", ["music", "vintage", "citywalk"], "今天适合从一张唱片开始，让路线自己往小街里长。", ["在上海听这首歌", "fRUITYSHOP Record Store", "长乐路", "下午", "公开店铺页里的 hip hop、jazz、city pop 和电子乐信号，很适合做首页音乐灵感。", ["唱片", "DJ", "长乐路"]]),
      inspirationItem("Blue Note Hongkou 爵士夜", "爵士、灰盒舞台、四川北路", ["music", "drink", "night"], "今天适合把夜晚留给一个真正有舞台感的现场。", ["在上海听这首歌", "Blue Note Jazz Club", "四川北路", "晚间", "这不是热门观光点，而是一个会把城市夜晚压低音量的爵士坐标。", ["爵士", "现场", "夜色"]])
    ],
    reading: [
      inspirationItem("The Mix Place 的混合书架", "英文书、艺术陈列、独立书店", ["bookstore", "coffee", "fashion"], "今天适合去一个会让你随机改阅读方向的书架。", ["在上海读这本书", "The Mix Place", "衡山路 / 陶江路", "午后", "社区反馈说它适合 browsing，这正是首页灵感需要的随机性。", ["独立书店", "艺术书", "慢逛"]]),
      inspirationItem("小众书店清单里的新书页", "独立书店、漫画、二手书", ["bookstore", "citywalk", "quest"], "今天适合把书店当作街区入口，而不是目的地。", ["在上海读这本书", "Muyunji 或 Sinan Books", "城市小街", "周末", "上海官方独立书店清单里有漫画、女性主题和二手书信号，适合刷新阅读池。", ["小众书店", "二手书", "漫画"]])
    ],
    film: [
      inspirationItem("Theatre YOUNG 的舞台放映", "剧场影像、国际制作、散场路", ["theatre", "cinema", "citywalk"], "今天适合把电影感从银幕带到真实散场路。", ["在上海靠近这部电影", "Theatre YOUNG", "杨浦控江路", "演出夜", "舞台影像和剧场散场连在一起，会比普通影院更有城市后劲。", ["舞台影像", "剧场", "散场"]]),
      inspirationItem("Fotografiska 到苏州河影像夜", "影像、河岸、低光", ["photography", "cinema", "night"], "今天适合让一组照片替你决定下一段路。", ["在上海靠近这部电影", "Fotografiska Shanghai", "苏州河", "傍晚", "影像中心、仓库墙和河面反光，适合把电影灵感做得更城市化。", ["影像", "河岸", "低光"]])
    ],
    series: [
      inspirationItem("Theatre YOUNG 跨界剧场季", "青年剧场、电子音乐、公共演出", ["theatre", "music", "art"], "今天适合让一场实验剧变成路线开头。", ["在上海进入这部剧的节奏", "Theatre YOUNG", "杨浦", "演出前后", "新季有跨界和年轻创作信号，正好把剧集推荐从屏幕拉回现场。", ["小剧场", "跨界", "青年创作"]]),
      inspirationItem("GOAT Unit 的新作者感", "小剧场、年轻艺术家、后街", ["theatre", "quest", "drink"], "今天适合去看一场不一定大众、但很可能有锋利边缘的现场。", ["在上海进入这部剧的节奏", "Theatre YOUNG 后街", "控江路", "散场后", "从小剧场出来多走十分钟，剧的情绪会落到街面上。", ["小剧场", "后街", "新作者"]])
    ],
    design: [
      inspirationItem("Sinan Books Poetry Store 的旧教堂", "诗歌书店、历史建筑、钢结构", ["bookstore", "architecture", "art"], "今天适合看一间书店如何把建筑也变成文本。", ["在上海看见设计", "Sinan Books Poetry Store", "皋兰路", "午后", "独立书店和历史建筑的结合，会让阅读推荐更有空间质感。", ["诗歌", "建筑", "书店"]]),
      inspirationItem("Blue Note 的灰盒舞台", "声学、舞台、爵士餐厅", ["music", "architecture", "night"], "今天适合看声音如何改变一个空间。", ["在上海看见设计", "Blue Note Jazz Club", "虹口", "夜晚", "舞台、灯光和座位距离会让设计不只是好看，而是可被听见。", ["舞台", "声学", "爵士"]])
    ],
    artist: [
      inspirationItem("fRUITYSHOP 的 DJ crew 合作", "唱片、服装、地下社区", ["music", "fashion", "vintage"], "今天适合靠近那些正在发生的小型合作。", ["在上海靠近这位艺术家", "fRUITYSHOP Record Store", "长乐路", "下午到夜晚", "唱片店和服装、DJ、音乐设备的合作，比单一展览更像城市文化现场。", ["DJ", "唱片", "合作"]]),
      inspirationItem("Theatre YOUNG 的年轻创作者场", "公共演出、实验舞台、社区", ["theatre", "art", "citywalk"], "今天适合把一位年轻创作者的作品走成一条路。", ["在上海靠近这位艺术家", "Theatre YOUNG", "杨浦", "演出夜", "年轻创作者、公共剧场和散场街区放在一起，会让艺术家灵感更具体。", ["剧场", "青年艺术", "社区"]])
    ]
  },
  chengdu: {
    music: [
      inspirationItem("NU SPACE 奎星楼现场", "livehouse、亚文化、晚饭前后", ["music", "drink", "night"], "今天适合让一场 livehouse 把成都夜晚打开。", ["在成都听这首歌", "NU SPACE", "奎星楼街", "演出夜", "公开介绍里它从咖啡工作空间长成 livehouse 和亚文化中心，很适合做首页音乐入口。", ["现场", "亚文化", "奎星楼"]]),
      inspirationItem("Little Bar Fangqin 的散场", "小酒馆、现场、玉林夜风", ["music", "drink", "citywalk"], "今天适合把音乐留到散场后的街上。", ["在成都听这首歌", "Little Bar Fangqin", "玉林", "夜晚", "成都的现场音乐不只在台上，散场后的街区也会继续发声。", ["小酒馆", "散场", "夜风"]])
    ],
    reading: [
      inspirationItem("Laishuxia 的女性主义书架", "独立书店、公共讨论、2023 新店", ["bookstore", "tea", "quest"], "今天适合读一本会把人留在现场讨论的书。", ["在成都读这本书", "Laishuxia Bookstore", "成都中心街区", "下午", "这类书店的价值是活动、讨论和小社区，不只是书架漂亮。", ["女性主义", "读书会", "社区"]]),
      inspirationItem("You Xing Bookstore 的公共活动", "书店、咖啡、免费公共活动", ["bookstore", "coffee", "citywalk"], "今天适合去一间书店看见城市正在谈什么。", ["在成都读这本书", "You Xing Bookstore", "社区街巷", "周末", "用户不会只为了景点而来，但可能因为一场活动留下。", ["公共活动", "独立书店", "咖啡"]])
    ],
    film: [
      inspirationItem("峨影 1958 的老厂区电影夜", "电影、厂区、散场", ["cinema", "architecture", "night"], "今天适合把电影夜留在厂区和路灯之间。", ["在成都靠近这部电影", "峨影 1958", "厂区街巷", "夜晚", "老厂区的空间感会让电影推荐更像真实路线。", ["电影", "厂区", "散场"]]),
      inspirationItem("NU SPACE 的 viewing session", "放映、音乐、艺术社区", ["cinema", "music", "bookstore"], "今天适合去一个不是影院的地方看影像。", ["在成都靠近这部电影", "NU SPACE", "奎星楼", "活动夜", "公开资料提到 seminar 和 viewing session，这种混合空间比标准影院更有发现感。", ["放映", "音乐", "混合空间"]])
    ],
    series: [
      inspirationItem("Comic Book Ren 的章节感", "漫画、进口书架、动画社区", ["anime", "bookstore", "quest"], "今天适合把一集故事翻成一条现实路线。", ["在成都进入这部剧的节奏", "Comic Book Ren", "天府动漫城", "周末", "漫画店的连续性很适合承接剧集灵感，尤其是用户想要小众入口时。", ["漫画", "动画", "上楼"]]),
      inspirationItem("Dunbar lecture bar 的一集谈话", "讲座、户外桌、读书会", ["bookstore", "tea", "theatre"], "今天适合把剧集感换成一场真实谈话。", ["在成都进入这部剧的节奏", "Dunbar lecture bar", "社区街区", "傍晚", "独立书店生态里的小型讨论，会比屏幕内容更有城市现场感。", ["讲座", "读书会", "对话"]])
    ],
    design: [
      inspirationItem("东郊记忆旧厂房排版", "工业墙面、演出入口、市集", ["architecture", "music", "market"], "今天适合看粗糙墙面如何承接新内容。", ["在成都看见设计", "Dongjiao Memory", "建设南支路", "周末", "旧厂房、现场和市集放在一起，是成都设计感更生活化的一面。", ["旧厂房", "市集", "墙面"]]),
      inspirationItem("A4 湖边展厅的低饱和", "湖面、展厅、咖啡", ["art", "architecture", "coffee"], "今天适合看一个展厅如何把下午降速。", ["在成都看见设计", "A4 Art Museum", "麓湖", "午后", "湖边、展厅和低饱和街区能让设计推荐从物件变成节奏。", ["湖边", "展厅", "低饱和"]])
    ],
    artist: [
      inspirationItem("NU SPACE 的视听混合现场", "电子、影像、新音乐", ["music", "art", "night"], "今天适合靠近一个正在试东西的舞台。", ["在成都靠近这位艺术家", "NU SPACE", "奎星楼", "演出夜", "它的 hybrid audiovisual 信号很适合把艺术家推荐从画廊拓展到现场。", ["视听", "电子", "新音乐"]]),
      inspirationItem("Comic Book Ren 的活动墙", "漫画作者、签名本、同好", ["anime", "bookstore", "art"], "今天适合把漫画店当成城市创作者入口。", ["在成都靠近这位艺术家", "Comic Book Ren", "天府动漫城", "周末", "进口漫画、活动和同好聚集，比普通书店更有角色和作者感。", ["漫画作者", "同好", "活动"]])
    ]
  },
  abudhabi: {
    music: [
      inspirationItem("Berklee Abu Dhabi 的公开演出", "音乐教育、公共表演、MENA 声音", ["music", "theatre", "art"], "今天适合听见阿布扎比不只是安静，也有舞台。", ["在阿布扎比听这首歌", "Berklee Abu Dhabi", "Saadiyat / Cultural District", "演出夜", "Berklee 的公开演出和教育资源，让音乐推荐有真实城市文化支点。", ["Berklee", "公开演出", "音乐教育"]]),
      inspirationItem("NYUAD Blue Hall 的小型音乐会", "小厅、声学、校园艺术", ["music", "theatre", "cinema"], "今天适合把一场小型演出当作海岛夜路开头。", ["在阿布扎比听这首歌", "The Arts Center at NYU Abu Dhabi", "Saadiyat", "夜晚", "Blue Hall 和 Black Box 这种空间，能让首页音乐灵感更具体。", ["小厅", "声学", "Saadiyat"]])
    ],
    reading: [
      inspirationItem("Cafe Arabia library floor", "书、艺术、三层空间", ["bookstore", "coffee", "art"], "今天适合找一层可以读书、看画、慢慢吃饭的空间。", ["在阿布扎比读这本书", "Cafe Arabia library floor", "Al Mushrif", "午后", "用户点评反复提到书和艺术，适合让阅读推荐更贴近日常。", ["书架", "艺术", "咖啡"]]),
      inspirationItem("The Third Place library room", "后院、安静房间、社区咖啡", ["coffee", "bookstore", "wellness"], "今天适合找一个既不是家也不是工作的地方。", ["在阿布扎比读这本书", "The Third Place Cafe", "Corniche 附近", "上午", "官方和社区资料都强调第三空间，很适合首页阅读灵感。", ["第三空间", "library room", "后院"]])
    ],
    film: [
      inspirationItem("CineMAS 的 shared attention", "独立电影、Manarat、七天影像", ["cinema", "art", "citywalk"], "今天适合把看电影变成一次共同注意力练习。", ["在阿布扎比靠近这部电影", "CineMAS at Manarat Al Saadiyat", "Saadiyat", "电影节期间", "CineMAS 把 cinema 写成 place、memory 和 each other，很适合首页电影推荐。", ["独立电影", "Manarat", "电影节"]]),
      inspirationItem("Manarat Family Reel 午后", "国际电影、社区放映、艺术中心", ["cinema", "art", "workshop"], "今天适合去一个艺术中心看一场不那么商业的放映。", ["在阿布扎比靠近这部电影", "Manarat Al Saadiyat", "Saadiyat", "午后", "公开日程里有 film、workshop 和 photography meetup，可以让电影池更有活动感。", ["放映", "社区", "艺术中心"]])
    ],
    series: [
      inspirationItem("NYUAD Black Box 的一集现场", "黑盒、实验剧场、学生和专业制作", ["theatre", "music", "art"], "今天适合让剧集推荐变成一场真实演出。", ["在阿布扎比进入这部剧的节奏", "NYUAD Black Box", "Saadiyat", "演出夜", "黑盒剧场天然适合承接 series 的节奏感，一集结束后还能走进夜风里。", ["黑盒", "实验剧场", "现场"]]),
      inspirationItem("Red Theater 的长篇舞台感", "大剧场、舞蹈、电影放映", ["theatre", "cinema", "music"], "今天适合把一部长剧的重量交给真实舞台。", ["在阿布扎比进入这部剧的节奏", "The Arts Center Red Theater", "NYUAD", "夜晚", "Red Theater 同时适合 music、dance、theater 和 film，能让首页推荐跨类型。", ["大剧场", "舞蹈", "电影"]])
    ],
    design: [
      inspirationItem("MiZa The Alley 的容器街", "container、pop-up、创意摊位", ["workshop", "market", "art"], "今天适合看一条临时巷子如何变成创意界面。", ["在阿布扎比看见设计", "The Alley at MiZa", "Mina Zayed", "傍晚", "container 和 pop-up 的组合适合把设计推荐从物件带到社区。", ["container", "pop-up", "创意社区"]]),
      inspirationItem("Manarat Art Studio 的材料课", "workshop、摄影、家庭项目", ["workshop", "art", "photography"], "今天适合用材料和手，把城市文化摸一遍。", ["在阿布扎比看见设计", "Manarat Al Saadiyat Art Studio", "Saadiyat", "上午", "公开日程里的 studio workshop 和摄影 meetup，让设计池更像可参与的体验。", ["材料", "工作坊", "摄影"]])
    ],
    artist: [
      inspirationItem("Al Qomra Photography Meetup", "摄影社区、workshop、经验分享", ["photography", "art", "workshop"], "今天适合靠近一群正在互相看照片的人。", ["在阿布扎比靠近这位艺术家", "Manarat Al Saadiyat Photography Studio", "Saadiyat", "bi-weekly", "摄影 meetup 把艺术家推荐从名人转向真实社区。", ["摄影", "meetup", "社区"]]),
      inspirationItem("NYUAD Project Space 的学生展", "学生作品、研究、实验空间", ["art", "theatre", "workshop"], "今天适合去看还没被大众熟知的创作。", ["在阿布扎比靠近这位艺术家", "NYUAD Project Space", "Saadiyat", "下午", "学生、教师和社区制作能让艺术家灵感更年轻，也更有发现感。", ["学生展", "实验", "社区制作"]])
    ]
  }
};

const homepageDeepCultureSourceRegistry = {
  shanghai: [
    { label: "Yuyintang Music Town Changning public news", url: "https://www.shcn.gov.cn/english/col1140/20260415/1308356.html" },
    { label: "Sinan Books Poetry Store architecture feature", url: "https://www.archdaily.com/935282/sinan-books-poetry-store-wutopia-lab" },
    { label: "Shanghai indie bookstore guide", url: "https://english.shanghai.gov.cn/en-BookstoresLibraries/20260422/c2ff0ece50d940838a35422c9629e311.html" },
    { label: "Theatre YOUNG new season", url: "https://www.meet-in-shanghai.net/en/news/a-young-season-of-diversity-and-crossover-705353/" },
    { label: "SmartShanghai Theatre YOUNG venue", url: "https://www.smartshanghai.com/venue/28018/theatre_young" }
  ],
  chengdu: [
    { label: "You Xing Bookstore public-space reporting", url: "https://chinadigitaltimes.net/2025/11/translations-as-tributes-pour-in-chengdus-you-xing-bookstore-gets-a-reprieve-from-feared-closure/" },
    { label: "China Books Review Chengdu independent bookstores", url: "https://chinabooksreview.com/2026/01/29/bookstores/" },
    { label: "Chengdu-Expat NU SPACE", url: "https://chengdu-expat.com/places/nu-space/" },
    { label: "Chengdu-Expat Comic Book Ren", url: "https://chengdu-expat.com/places/comic-book-ren/" },
    { label: "Chengdu-Expat English-language bookstores", url: "https://chengdu-expat.com/finding-english-language-books-chengdu/" }
  ],
  abudhabi: [
    { label: "Warehouse421 creative community space", url: "https://www.shf.ae/en/what-we-do/arts-culture-heritage/warehouse421/" },
    { label: "Abu Dhabi Festival and ADMAF culture programs", url: "https://www.abudhabifestival.ae/" },
    { label: "NYU Abu Dhabi Arts Center Season 12", url: "https://en.aletihad.ae/news/culture/4670373/the-arts-center-at-nyu-abu-dhabi-presents-a-festival-of-musi" },
    { label: "Manarat Al Saadiyat CineMAS 2026", url: "https://manaratalsaadiyat.ae/en/seeanddo/cinemas/" },
    { label: "Cultural Foundation Abu Dhabi programmes", url: "https://moc.gov.ae/en/our-initiatives/the-cultural-foundation/" }
  ]
};

const homepageDeepCultureKickers = {
  music: "在城市听这首歌",
  reading: "在城市读这本书",
  film: "在城市靠近这部电影",
  series: "在城市进入这部剧的节奏",
  design: "在城市看见设计",
  artist: "在城市靠近这位艺术家"
};

const homepageDeepCultureSignals = {
  shanghai: {
    music: {
      meta: "地下音乐、唱片、夜间现场",
      layers: ["music", "vintage", "night"],
      line: "今天适合让一条音乐线从地下场地长出来。",
      items: [
        ["Yuyintang Music Town 双厅夜", "Yuyintang Music Town", "Haisu Cultural Plaza", "夜晚", "两个演出空间、地下动线和 emerging bands 的信号，适合把首页音乐推荐做得更年轻。", ["地下", "livehouse", "新乐队"]],
        ["REACTOR techno record library", "REACTOR", "Changning underground", "深夜前", "电子俱乐部和免费黑胶借阅库放在一起，比常规酒吧更像音乐地图入口。", ["techno", "黑胶", "夜场"]],
        ["Specters 舞台回声", "Specters", "Yuyintang Music Town", "周末夜", "老现场记忆转进新地下音乐公园，适合让用户感觉城市还在更新。", ["舞台", "摇滚", "地下"]],
        ["Wigwam 小型演出前", "Wigwam", "Haisu Cultural Plaza", "傍晚", "把 live performance、酒和快餐厨房放在同一条线，能给音乐灵感一点生活感。", ["现场", "晚餐", "小场"]],
        ["Yuyintang public creative space", "Yuyintang public creative space", "Changning", "下午到夜晚", "面向年轻音乐人的开放空间，比热门场馆更像可偶遇的城市线索。", ["创作", "新声音", "青年"]],
        ["fRUITYSHOP DJ shelf", "fRUITYSHOP Record Store", "长乐路", "下午", "唱片店、服装和 DJ crew 合作，可以把音乐推荐从听歌带到真实街角。", ["唱片", "DJ", "长乐路"]],
        ["Blue Note grey-box stage", "Blue Note Jazz Club", "虹口", "晚间", "国际爵士俱乐部的舞台感适合承接慢一点、深一点的夜间灵感。", ["爵士", "舞台", "低光"]],
        ["JZ Club before midnight", "JZ Club", "衡复街区", "22:00 后", "上海老牌爵士夜和衡复夜路能做一条不喧哗的音乐线。", ["爵士", "夜路", "微醺"]],
        ["Yuyintang Cube 小型大舞台", "Yuyintang Cube", "Changning", "周末", "350 人左右的空间保留小场亲密度，又有更完整的声光。", ["新场地", "声光", "乐队"]]
      ]
    },
    reading: {
      meta: "独立书店、杂志、二手书",
      layers: ["bookstore", "coffee", "citywalk"],
      line: "今天适合让书架替你换一条街。",
      items: [
        ["Muyunji 黑石公寓阅读", "Muyunji", "复兴中路", "午后", "AI 阅读、传统书籍、黑石公寓和黑胶墙混在一起，适合首页阅读卡。", ["生活文化", "黑胶", "历史建筑"]],
        ["Yueze manga day", "Yueze Bookstore", "光启城", "周末", "漫画文化、签售和 cafe 区能把阅读推荐做得更年轻。", ["漫画", "签售", "咖啡"]],
        ["Kubrick 电影书窗", "Kubrick", "前滩太古里", "电影前后", "靠近影院的电影与文学书架，让阅读和电影 mood 自然交叉。", ["电影书", "文学", "窗边"]],
        ["Archipelago Books 西岸客厅", "Archipelago Books", "West Bund Dream Center", "下午", "设计对象、展览、咖啡和深阅读放在同一空间，适合不赶路的阅读灵感。", ["设计书", "展览", "客厅"]],
        ["Banana Fish 自出版墙", "Banana Fish Books", "红宝石路", "下午", "独立杂志、自出版和工作坊气质，比大众书店更有发现感。", ["独立杂志", "自出版", "工作坊"]],
        ["Rhino Bookstore 旧版书", "Rhino Bookstore", "北苏州路", "傍晚", "旧版书和收藏书适合把城市读成一条时间线。", ["二手书", "收藏", "苏州河"]],
        ["Paper Moon women topics shelf", "Paper Moon", "天平路", "午后", "女性议题书架和紧凑空间，适合更私人、更明确的阅读推荐。", ["女性议题", "小空间", "独立书店"]],
        ["dododo book 轨道书架", "dododo book", "Power Station of Art", "看展后", "艺术、建筑、设计和哲学书被放进明亮轨道书架，适合展后继续读。", ["艺术书", "设计", "展后"]],
        ["The Mix Place browse hour", "The Mix Place", "衡山路 / 陶江路", "周日下午", "社区反馈里它适合 browsing，这种随机性正好解决首页重复感。", ["英文书", "艺术陈列", "慢逛"]]
      ]
    },
    film: {
      meta: "影像、舞台放映、散场路",
      layers: ["cinema", "theatre", "photography"],
      line: "今天适合把电影感走到街面上。",
      items: [
        ["Kubrick cinema-adjacent shelf", "Kubrick", "前滩太古里", "电影前", "电影书店挨着影院，能把电影推荐变成先读再看的小路线。", ["电影书", "影院旁", "前滩"]],
        ["Theatre YOUNG stage recording", "Theatre YOUNG", "控江路", "演出夜", "舞台影像、国际制作和散场路，比普通影厅更有现场余温。", ["舞台影像", "剧场", "散场"]],
        ["Fotografiska late image walk", "Fotografiska Shanghai", "苏州河", "傍晚", "影像中心和苏州河夜色能让电影 mood 更像摄影散步。", ["影像", "河岸", "低光"]],
        ["大光明老影院散场", "大光明电影院", "南京西路", "夜晚", "老影院门口、招牌和夜咖啡给电影推荐一点城市年代感。", ["老影院", "招牌", "夜咖啡"]],
        ["上海影城片后散步", "上海影城", "新华路", "电影后", "片尾字幕之后多走一段新华路，电影感会留得更久。", ["片后", "新华路", "散步"]],
        ["MAP 光影展后", "Museum of Art Pudong", "陆家嘴滨江", "日落前", "美术馆、江面和极简空间适合承接更安静的电影灵感。", ["光影", "美术馆", "江边"]],
        ["Yuyintang music documentary night", "Yuyintang Music Town", "Changning", "活动夜", "音乐公园和剧场 troupe 信号可以生成音乐纪录片式的首页推荐。", ["音乐纪录片", "地下", "活动"]],
        ["The Pearl tribute poster walk", "The Pearl", "虹口", "周末夜", "复古剧场和 tribute show 海报适合做一张很有戏的电影卡。", ["复古剧场", "海报", "音乐电影"]],
        ["Suzhou Creek afterimage", "Sihang Warehouse river wall", "苏州河", "夜色", "仓库墙、桥和水面反光能把电影 mood 拉回真实街区。", ["反光", "仓库", "桥"]]
      ]
    },
    series: {
      meta: "小剧场、跨界演出、章节感",
      layers: ["theatre", "music", "quest"],
      line: "今天适合把一集内容落到一场现场。",
      items: [
        ["Theatre YOUNG crossover season", "Theatre YOUNG", "杨浦", "演出夜", "跨界剧场、电子音乐和青年创作能让 series 推荐不只停在屏幕里。", ["跨界", "小剧场", "青年"]],
        ["Lumens live music video game", "Theatre YOUNG", "控江路", "周末", "现场音乐、互动科技和游戏感，适合做一条像剧集支线的路线。", ["互动", "电子", "舞台"]],
        ["Vivat Football theatre night", "Theatre YOUNG", "杨浦", "演出前后", "足球、电子音乐和身体剧场混合，可以给 series mood 更意外的入口。", ["身体", "电子", "足球"]],
        ["A Hunger Artist GOAT Unit", "GOAT Unit", "Theatre YOUNG", "演出夜", "新作者单元的锋利感，适合用户不想看大众内容时刷到。", ["新作者", "实验", "小场"]],
        ["Draft My Life musical route", "Theatre YOUNG", "控江路", "夜晚", "原创音乐剧和后街散步，会让一晚像一集完整故事。", ["音乐剧", "后街", "章节"]],
        ["Hong Kong Repertory Theatre debut", "Theatre YOUNG", "杨浦", "演出季", "香港剧团来访信号让上海剧场卡更有流动性。", ["剧团", "来访", "剧场"]],
        ["Shanghai Dramatic Arts Centre rehearsal mood", "Shanghai Dramatic Arts Centre", "安福路", "下午", "安福路剧场和街角咖啡可以生成更日常的 series 灵感。", ["剧场", "安福路", "排练感"]],
        ["YOUNG after-show river walk", "杨浦滨江", "Theatre YOUNG 周边", "散场后", "散场后往滨江走，不赶路，像把剧情延长十分钟。", ["散场", "滨江", "夜路"]],
        ["Black box small audience episode", "黑盒小剧场", "上海街区", "演出夜", "小观众席、近距离和短时长，适合把剧集感变成一晚。", ["黑盒", "近距离", "短剧"]]
      ]
    },
    design: {
      meta: "建筑书店、舞台空间、夜间系统",
      layers: ["design", "architecture", "bookstore"].map((id) => id === "design" ? "fashion" : id),
      line: "今天适合看文化空间怎么被设计出来。",
      items: [
        ["Sinan Books church-in-church", "Sinan Books Poetry Store", "皋兰路", "午后", "旧教堂里的诗歌书店，把建筑、钢结构和阅读揉在一起。", ["诗歌", "教堂", "结构"]],
        ["Muyunji mosaic hallway", "Muyunji", "黑石公寓", "下午", "原始马赛克地面、拱形入口和 AI 阅读，让书店变成空间设计样本。", ["马赛克", "AI 阅读", "历史"]],
        ["Archipelago blue-gray riverside", "Archipelago Books", "西岸", "日落前", "灰蓝色墙面呼应水岸，适合看设计如何接住城市边界。", ["水岸", "灰蓝", "书店"]],
        ["dododo monorail shelves", "dododo book", "Power Station of Art", "看展后", "轨道感圆形书架和亮色设计，会让首页 design 卡更鲜活。", ["轨道", "亮色", "艺术书"]],
        ["Banana Fish workshop office", "Banana Fish Books", "红宝石路", "下午", "书店、画廊、办公室和 workshop 的混合，让空间不只是销售。", ["工作坊", "画廊", "独立出版"]],
        ["Yuyintang underground ecosystem", "Yuyintang Music Town", "Changning", "夜晚", "地下音乐公园把演出、酒、剧团和餐饮做成一个夜间系统。", ["地下", "夜经济", "系统"]],
        ["REACTOR vinyl lending wall", "REACTOR", "Haisu Cultural Plaza", "深夜前", "techno club 加黑胶借阅库，是很明确的声音空间设计。", ["黑胶墙", "techno", "声音"]],
        ["Blue Note seating distance", "Blue Note Jazz Club", "虹口", "晚间", "爵士舞台、座位距离和灯光会让设计变成被听见的东西。", ["舞台", "座位", "灯光"]],
        ["Theatre YOUNG community field", "Theatre YOUNG", "杨浦", "演出季", "剧场被定位为社区和年轻艺术重力场，适合做设计/城市更新推荐。", ["社区", "剧场", "更新"]]
      ]
    },
    artist: {
      meta: "年轻创作者、摄影、独立出版",
      layers: ["art", "photography", "music"],
      line: "今天适合去找还在现场生成的作品。",
      items: [
        ["Yuyintang emerging bands incubator", "Yuyintang public creative space", "Changning", "下午", "向年轻音乐人开放的创作空间，让艺术家推荐更贴近正在发生的人。", ["新乐队", "孵化", "创作"]],
        ["fRUITYSHOP DJ collaboration wall", "fRUITYSHOP Record Store", "长乐路", "下午", "DJ crew、音乐设备和服装品牌合作让唱片店像小型文化工作室。", ["DJ", "合作", "唱片"]],
        ["Banana Fish zine makers", "Banana Fish Books", "红宝石路", "下午", "自出版和独立杂志让艺术家入口不必只靠美术馆。", ["zine", "自出版", "艺术书"]],
        ["Paper Moon topic curators", "Paper Moon", "天平路", "午后", "女性议题书店的小空间适合靠近更明确的策展立场。", ["女性议题", "策展", "小空间"]],
        ["Theatre YOUNG young creators", "Theatre YOUNG", "杨浦", "演出夜", "年轻创作者和公共剧场放在一起，适合生成有现场感的艺术家卡。", ["青年艺术", "剧场", "现场"]],
        ["Fotografiska image makers", "Fotografiska Shanghai", "苏州河", "傍晚", "影像展厅和河岸光线能让艺术家灵感从照片开始。", ["影像", "摄影", "河岸"]],
        ["Power Station artist book corner", "Power Station of Art", "黄浦滨江", "看展后", "艺术书和大体量展厅组合，适合用户从作品走到书页。", ["艺术书", "展厅", "滨江"]],
        ["West Bund artist afternoon", "West Bund Museum", "西岸", "下午", "西岸场馆密度高，适合随机刷到一条艺术家半日线。", ["西岸", "美术馆", "半日"]],
        ["Rhino old-document shelf", "Rhino Bookstore", "北苏州路", "傍晚", "旧书的文献性可以把艺术家灵感变成资料挖掘。", ["旧书", "文献", "资料"]]
      ]
    }
  },
  chengdu: {
    music: {
      meta: "livehouse、亚文化、街巷散场",
      layers: ["music", "drink", "night"],
      line: "今天适合从一个现场走进成都的街巷。",
      items: [
        ["NU SPACE sub-culture center", "NU SPACE", "奎星楼街", "演出夜", "从咖啡工作空间长成 livehouse 和亚文化中心，是成都音乐首页的强锚点。", ["亚文化", "livehouse", "奎星楼"]],
        ["NU SPACE bookstore-livehouse", "纽空间 NU SPACE", "奎星楼街9号", "夜晚", "书店和 livehouse 在同一条街上，让音乐推荐天然带阅读边界。", ["书店", "现场", "夜路"]],
        ["Little Bar Fangqin back row", "Little Bar Fangqin", "玉林", "夜晚", "成都小酒馆现场和玉林夜风，可以把推荐做得不游客。", ["小酒馆", "后排", "玉林"]],
        ["MAO Livehouse Chengdu warm-up", "MAO Livehouse Chengdu", "成都现场街区", "晚间", "更热烈的现场适合给首页音乐池增加能量。", ["热烈", "乐队", "夜晚"]],
        ["CH8 冇独空间 aftershow", "CH8 冇独空间", "成都夜路", "散场后", "小型空间的散场更适合做一条短路线。", ["小空间", "散场", "夜路"]],
        ["Zhenghuo Art Center sound night", "正火艺术中心", "成都", "周末", "艺术中心和现场演出组合，可以把音乐和艺术池打通。", ["艺术中心", "现场", "周末"]],
        ["MiNTOWN creative workshop set", "MiNTOWN 明堂", "奎星楼", "下午到夜晚", "明堂艺术社区让音乐推荐更像一段创意街区探索。", ["创意社区", "明堂", "街区"]],
        ["Dongjiao factory echo", "Dongjiao Memory", "建设南支路", "傍晚", "旧厂房回声和演出入口给音乐 mood 一点工业质感。", ["旧厂房", "回声", "演出"]],
        ["Kuixinglou pre-gig noodles", "Kuixinglou Street", "奎星楼", "演出前", "先吃一碗，再进 livehouse，路线会比单点推荐更像成都。", ["演出前", "小吃", "街巷"]]
      ]
    },
    reading: {
      meta: "独立书店、公共活动、社区桌面",
      layers: ["bookstore", "tea", "coffee"],
      line: "今天适合去一间会发生讨论的书店。",
      items: [
        ["You Xing public event table", "You Xing Bookstore", "成都社区街巷", "周末", "书、咖啡、免费公共活动和社区感，是成都阅读池最真实的信号。", ["公共活动", "咖啡", "社区"]],
        ["You Xing reprieve story", "You Xing Bookstore", "成都", "晚上", "被用户和支持者挽回的书店故事，让推荐有一点真实重量。", ["公共空间", "用户支持", "事件"]],
        ["Laishuxia gingko entrance", "Laishuxia Bookstore", "成都中心街区", "下午", "女性主义书店和门口银杏树，让阅读卡有清楚画面。", ["女性主义", "银杏", "书店"]],
        ["Laishuxia panel night", "Laishuxia Bookstore", "成都", "活动夜", "书店作为公共讨论空间，比单纯买书更能体现项目闪光点。", ["panel", "讨论", "公共生活"]],
        ["Comic Book Ren imported shelves", "Comic Book Ren", "天府动漫城", "周末", "17000+ 进口漫画和活动信号，给阅读池补上二次元入口。", ["漫画", "进口书", "同好"]],
        ["Dunbar lecture bar stools", "Dunbar lecture bar", "成都街区", "傍晚", "lecture bar 让阅读变成户外谈话，而不是安静消费。", ["讲座", "户外", "对话"]],
        ["UTE Bookshop craft beer page", "UTE Bookshop", "双楠", "夜前", "书、咖啡和 craft beer 的混合空间可以承接年轻用户的随机探索。", ["书店", "craft beer", "双楠"]],
        ["AA Bookstore small-stack afternoon", "AA Bookstore", "华兴上街", "下午", "小书店比大店更容易让用户觉得自己找到了一处地方。", ["小书店", "街区", "慢读"]],
        ["Fangsuo after commercial noise", "Fangsuo Chengdu", "太古里", "工作日下午", "商业街区里的长书架适合当一个安静切口。", ["长书架", "太古里", "安静"]]
      ]
    },
    film: {
      meta: "放映、老厂区、影像活动",
      layers: ["cinema", "architecture", "music"],
      line: "今天适合去一个不是标准影院的影像现场。",
      items: [
        ["NU SPACE viewing session", "NU SPACE", "奎星楼", "活动夜", "seminar 和 viewing session 信号让电影推荐不只局限在影院。", ["放映", "seminar", "混合空间"]],
        ["峨影1958 old studio night", "峨影 1958", "成都电影街区", "夜晚", "老影厂和散场街区能让电影卡有真实城市质感。", ["老影厂", "电影夜", "散场"]],
        ["Dongjiao Memory screen wall", "Dongjiao Memory", "旧厂区", "傍晚", "厂房墙面和活动空间适合做影像散步。", ["厂房", "影像", "墙面"]],
        ["A4 moving-image afternoon", "A4 Art Museum", "麓湖", "下午", "湖边展览里的影像作品能把电影 mood 放慢。", ["影像艺术", "湖边", "展览"]],
        ["You Xing documentary talk", "You Xing Bookstore", "成都", "活动夜", "独立书店的讲座桌可以承接纪录片式的城市问题。", ["纪录片", "讲座", "书店"]],
        ["Laishuxia film discussion", "Laishuxia Bookstore", "成都", "周末", "女性主义书店适合生成小型放映和讨论感。", ["影像讨论", "女性议题", "周末"]],
        ["Comic Book Ren anime screening", "Comic Book Ren", "天府动漫城", "周末", "漫画店和动画城让电影推荐有更轻松的二次元入口。", ["动画", "漫画", "放映"]],
        ["Chengdu City Music Hall film score", "Chengdu City Music Hall", "城市中心", "夜晚", "电影配乐感可以把音乐厅纳入 film mood。", ["电影配乐", "音乐厅", "夜晚"]],
        ["Sichuan Grand Theatre stage-to-screen", "Sichuan Grand Theatre", "天府广场", "演出夜", "正式剧场和片后散步能给电影池更完整的夜间动线。", ["剧场", "片后", "广场"]]
      ]
    },
    series: {
      meta: "漫画章节、公共谈话、连载感",
      layers: ["anime", "bookstore", "theatre"],
      line: "今天适合把一集故事翻成一段线下章节。",
      items: [
        ["Comic Book Ren chapter one", "Comic Book Ren", "天府动漫城", "周末", "漫画章节和上楼入口天然适合 series mood。", ["漫画", "章节", "上楼"]],
        ["Comic Book Ren event wall", "Comic Book Ren", "成都", "活动日", "活动墙、签名本和同好人群，让剧集推荐有真实社群。", ["活动", "同好", "漫画"]],
        ["You Xing Saturday lecture", "You Xing Bookstore", "成都", "周六", "高频公共活动像一集一集更新的城市栏目。", ["讲座", "公共生活", "周六"]],
        ["Laishuxia feminist panel", "Laishuxia Bookstore", "成都", "活动夜", "panel 讨论能把剧集感转成真实对话。", ["panel", "女性主义", "对话"]],
        ["Dunbar outdoor episode", "Dunbar lecture bar", "街区树下", "傍晚", "户外讲座像一集城市谈话节目。", ["户外", "讲座", "树下"]],
        ["NU SPACE long night arc", "NU SPACE", "奎星楼", "演出夜", "演出前、开场、散场后，天然是一集三幕结构。", ["三幕", "现场", "散场"]],
        ["Dongjiao performance chapter", "Dongjiao Memory", "旧厂区", "周末", "厂区演出和市集组合适合做连续探索。", ["旧厂房", "演出", "市集"]],
        ["Sichuan Grand Theatre formal episode", "Sichuan Grand Theatre", "天府广场", "晚上", "正式演出给 series mood 一个更完整的夜晚。", ["正式演出", "剧场", "夜晚"]],
        ["Chengdu Museum city-history arc", "Chengdu Museum", "天府广场", "下午", "城市历史展像一条长叙事，适合慢慢进入。", ["城市史", "展览", "章节"]]
      ]
    },
    design: {
      meta: "旧厂房、湖边展厅、书店空间",
      layers: ["architecture", "art", "bookstore"],
      line: "今天适合看成都如何把空间变得松弛。",
      items: [
        ["Dongjiao factory facade", "Dongjiao Memory", "建设南支路", "周末", "旧厂房立面、演出入口和市集能做一条很成都的设计线。", ["旧厂房", "立面", "市集"]],
        ["A4 lakeside white space", "A4 Art Museum", "麓湖", "午后", "湖边展厅和低饱和街区让设计感不那么用力。", ["湖边", "展厅", "低饱和"]],
        ["Luxelakes Eco Art Center slow grid", "Luxelakes Eco Art Center", "麓湖", "下午", "湖面、步道和艺术中心适合做安静的设计卡。", ["湖面", "艺术中心", "慢走"]],
        ["Fangsuo vertical bookshelf", "Fangsuo Chengdu", "太古里", "下午", "商业空间里的长书架和展陈能给设计 mood 加一个大众但有效的入口。", ["书架", "展陈", "商业空间"]],
        ["UTE bookshop beer table", "UTE Bookshop", "双楠", "傍晚", "书、咖啡和 craft beer 混合的小店设计，比景点更有生活感。", ["混合空间", "craft beer", "书店"]],
        ["AA Bookstore street-front stack", "AA Bookstore", "华兴上街", "下午", "街边小书店的尺度适合给设计池降噪。", ["小尺度", "街边", "书店"]],
        ["Comic Book Ren third-floor layout", "Comic Book Ren", "天府动漫城", "周末", "上楼、展柜和进口漫画架能构成明确的动线。", ["展柜", "上楼", "漫画"]],
        ["MiNTOWN creative workshop courtyard", "MiNTOWN 明堂", "奎星楼", "下午", "工作坊、现场和小院落让设计感更像社区。", ["小院", "工作坊", "社区"]],
        ["Chengdu Museum evening facade", "Chengdu Museum", "天府广场", "傍晚", "城市博物馆外立面和广场尺度适合做建筑观察。", ["外立面", "博物馆", "广场"]]
      ]
    },
    artist: {
      meta: "视听现场、独立书店、青年创作",
      layers: ["art", "music", "bookstore"],
      line: "今天适合靠近成都仍在生成的创作者场。",
      items: [
        ["NU SPACE hybrid audiovisual", "NU SPACE", "奎星楼", "演出夜", "混合视听现场让艺术家推荐从画廊走到 livehouse。", ["视听", "livehouse", "实验"]],
        ["A4 resident afternoon", "A4 Art Museum", "麓湖", "下午", "湖边艺术馆适合生成更安静的艺术家灵感。", ["驻留感", "湖边", "展览"]],
        ["Comic Book Ren creator shelf", "Comic Book Ren", "天府动漫城", "周末", "漫画作者、签名本和同好活动让创作者入口更年轻。", ["漫画作者", "签名本", "同好"]],
        ["Laishuxia community curator", "Laishuxia Bookstore", "成都", "活动夜", "书店主理人的选书立场本身就是一种策展。", ["主理人", "选书", "女性主义"]],
        ["You Xing public intellectual table", "You Xing Bookstore", "成都", "晚上", "记者、学者和作家的活动桌能让 artist mood 更像思想现场。", ["公共讨论", "作家", "学者"]],
        ["Dongjiao street performer residue", "Dongjiao Memory", "旧厂区", "周末", "演出入口、墙面和人群残响能生成创作者路线。", ["表演", "厂区", "残响"]],
        ["Luxelakes outdoor installation", "Luxelakes", "麓湖", "日落前", "户外装置和湖边空间适合轻一点的艺术家卡。", ["装置", "湖边", "户外"]],
        ["Blue Roof studio memory", "Blue Roof Museum", "成都", "下午", "艺术聚落记忆能给首页加一点非商业艺术气。", ["艺术聚落", "工作室", "下午"]],
        ["Times Art Museum Chengdu quiet show", "Times Art Museum Chengdu", "成都", "午后", "小型展览和安静街区适合刷到不大众的艺术家灵感。", ["小展", "安静", "艺术"]]
      ]
    }
  },
  abudhabi: {
    music: {
      meta: "公开演出、音乐教育、文化节",
      layers: ["music", "theatre", "art"],
      line: "今天适合听见阿布扎比的舞台和社区声。",
      items: [
        ["Berklee public performance night", "Berklee Abu Dhabi", "Cultural District", "演出夜", "音乐教育和公开表演让音乐推荐有真实文化支点。", ["Berklee", "公开演出", "音乐教育"]],
        ["NYUAD Arts Center Season 12 opener", "The Arts Center at NYU Abu Dhabi", "Saadiyat", "夜晚", "新一季有全球音乐、舞蹈、实验剧场和独立电影信号。", ["Season 12", "全球音乐", "Saadiyat"]],
        ["Dirty Dozen brass second-line", "NYUAD Arts Center", "Saadiyat", "演出夜", "New Orleans brass 和 funk 信号能让音乐池更鲜活。", ["brass", "funk", "现场"]],
        ["Fanfaraï brass street roots", "NYUAD Arts Center", "Saadiyat", "夜晚", "Arab-Berber、Afro-Cuban、Latin 和 jazz 线索适合做跨文化音乐卡。", ["brass", "跨文化", "jazz"]],
        ["ADMAF Spiritual Series", "ADMAF Spiritual Series", "Abu Dhabi", "节庆夜", "精神音乐和节庆演出把城市音乐感做得更庄重。", ["spiritual", "concert", "ADMAF"]],
        ["Abu Dhabi Festival classical route", "Abu Dhabi Festival", "Abu Dhabi", "演出季", "大型文化节能给首页音乐推荐补上城市级舞台。", ["festival", "classical", "城市舞台"]],
        ["Cultural Foundation auditorium set", "Cultural Foundation Auditorium", "Al Hosn", "傍晚", "老城文化中心里的 auditorium 适合接住更本地的演出。", ["auditorium", "老城", "表演"]],
        ["Manarat terrace sound", "Manarat Al Saadiyat", "Saadiyat", "日落后", "艺术中心露台和活动日程可以生成更轻的音乐夜。", ["露台", "艺术中心", "日落"]],
        ["Etihad Arena big-night contrast", "Etihad Arena", "Yas", "大型演出夜", "大型演出后接一条安静海边路，能让推荐有强弱对比。", ["大型演出", "Yas", "海风"]]
      ]
    },
    reading: {
      meta: "library room、二手书、文化中心",
      layers: ["bookstore", "coffee", "wellness"],
      line: "今天适合找一张真正能停下来的桌子。",
      items: [
        ["The Third Place library room", "The Third Place Cafe", "Corniche Road", "上午", "library room、后院和社区咖啡让阅读推荐有日常锚点。", ["library room", "后院", "社区"]],
        ["Cafe Arabia three-floor browse", "Cafe Arabia library floor", "Al Mushrif", "午后", "三层空间、书和艺术让阅读卡更像第三空间。", ["三层", "书", "艺术"]],
        ["Cultural Foundation library pause", "Cultural Foundation Library", "Al Hosn", "下午", "Learning/library、performing arts 和 visual arts 被整合在同一文化中心。", ["library", "文化中心", "学习"]],
        ["Bookends pre-loved stack", "Bookends UAE", "Abu Dhabi / UAE", "周末", "二手书平台和线下 book sale 信号适合补上 thrift reading 感。", ["二手书", "pre-loved", "book sale"]],
        ["House of Prose return-credit shelf", "House of Prose", "Abu Dhabi", "下午", "二手书和回收信用机制让阅读推荐更像本地生活。", ["used books", "回收", "本地"]],
        ["Kinokuniya quiet aisle", "Kinokuniya The Galleria", "Al Maryah", "傍晚", "购物中心里的长书架适合做安静退场。", ["长书架", "安静", "Al Maryah"]],
        ["Louvre museum shop reading", "Louvre Abu Dhabi Museum Shop", "Saadiyat", "看展后", "展后书店能把艺术体验延长到阅读。", ["museum shop", "展后", "艺术书"]],
        ["Qasr Al Hosn store story shelf", "Qasr Al Hosn Store", "Al Hosn", "上午", "老城和手工艺叙事适合承接历史阅读。", ["历史", "手工艺", "老城"]],
        ["Children's Library storytelling", "Cultural Foundation Children's Library", "Al Hosn", "周末", "儿童图书馆和故事活动让阅读池有家庭但不俗套的入口。", ["storytelling", "library", "家庭"]]
      ]
    },
    film: {
      meta: "独立电影、城市影像、艺术中心放映",
      layers: ["cinema", "art", "theatre"],
      line: "今天适合把电影变成共享注意力。",
      items: [
        ["CineMAS shared attention", "CineMAS at Manarat", "Saadiyat", "电影节期间", "CineMAS 明确把电影写成 place、memory 和 each other。", ["CineMAS", "独立电影", "共享"]],
        ["CineMAS mobile filmmaking walk", "Saadiyat Cultural District", "Saadiyat", "International Museum Day", "移动 filmmaking walk 让电影 mood 直接变成城市路线。", ["filmmaking walk", "Saadiyat", "城市影像"]],
        ["Golden Hour short showcase", "Manarat Al Saadiyat", "Saadiyat", "傍晚", "短片 showcase 和金色时刻很适合生成电影首页卡。", ["shorts", "golden hour", "Manarat"]],
        ["CinemaNa Arab cinema night", "The Arts Center at NYUAD", "Saadiyat", "放映夜", "CinemaNa contemporary Arab cinema 给电影池补上地区影像。", ["Arab cinema", "放映", "NYUAD"]],
        ["NYUAD Screening Room quiet seat", "NYUAD Screening Room", "Saadiyat", "夜晚", "艺术中心内的 screening room 让电影推荐更学院也更小众。", ["screening room", "学院", "电影"]],
        ["Manarat Family Reel", "Manarat Al Saadiyat", "Saadiyat", "午后", "国际电影策展和艺术中心活动让家庭向内容也不显大众。", ["Family Reel", "策展", "午后"]],
        ["Taparelle silent film DJ close", "Taparelle", "Saadiyat", "闭幕夜", "无声电影加 live DJ 的收束让电影和音乐自然交叉。", ["silent film", "DJ", "闭幕"]],
        ["Louvre film night by the sea", "Louvre Abu Dhabi", "Saadiyat", "夜晚", "海边博物馆放映能让电影 mood 更有空间记忆。", ["博物馆", "海边", "放映"]],
        ["Cultural Foundation storytelling screen", "Cultural Foundation", "Al Hosn", "周末", "performing arts 和 storytelling 项目适合生成更本地的影像感。", ["storytelling", "文化中心", "本地"]]
      ]
    },
    series: {
      meta: "黑盒、剧场、连续演出",
      layers: ["theatre", "music", "cinema"],
      line: "今天适合把一集内容交给真实舞台。",
      items: [
        ["NYUAD Black Box episode", "NYUAD Black Box", "Saadiyat", "演出夜", "灵活黑盒空间适合把 series mood 从屏幕拉到现场。", ["Black Box", "实验", "现场"]],
        ["Red Theater long-form night", "The Arts Center Red Theater", "NYUAD", "夜晚", "大剧场、音乐、舞蹈和电影能力让推荐跨类型。", ["Red Theater", "舞台", "跨类型"]],
        ["Blue Hall intimate chapter", "NYUAD Blue Hall", "Saadiyat", "晚间", "150 人小厅适合一集很近的音乐或朗读。", ["小厅", "朗读", "音乐"]],
        ["The Butterfly rave episode", "NYUAD Arts Center", "Saadiyat", "Season 12", "高能舞蹈和 Detroit techno 信号可以做一张很不游客的剧集卡。", ["rave", "dance", "techno"]],
        ["Untitled 14km identity arc", "NYUAD Arts Center", "Saadiyat", "Season 12", "跨学科舞蹈剧场和身份议题给 series mood 更深的叙事。", ["身份", "舞蹈剧场", "叙事"]],
        ["Näss hip-hop pulse", "NYUAD Arts Center", "Saadiyat", "演出季", "North African rhythm 和 hip hop 的剧场能量适合做一集现场。", ["hip hop", "North Africa", "dance"]],
        ["Cultural Foundation performance summer", "Cultural Foundation", "Al Hosn", "夏季", "performances 和 storytelling 让老城文化中心像剧集场景。", ["performing arts", "storytelling", "老城"]],
        ["Abu Dhabi Festival chapter night", "Abu Dhabi Festival", "Abu Dhabi", "演出季", "城市级艺术节能给 series mood 补上更长线的文化章节。", ["festival", "章节", "演出"]],
        ["Manarat cinema-to-talk evening", "Manarat Al Saadiyat", "Saadiyat", "活动夜", "电影、talk 和展览接在一起，像一集城市文化节目。", ["talk", "cinema", "展览"]]
      ]
    },
    design: {
      meta: "仓库艺术、容器街、文化建筑",
      layers: ["workshop", "architecture", "art"],
      line: "今天适合看文化空间如何让人留下来。",
      items: [
        ["Warehouse421 creative community", "Warehouse421", "Mina Zayed", "下午", "仓库艺术空间服务创意社区、协作和社会文化活动。", ["warehouse", "社区", "协作"]],
        ["421 Spring public program", "421 Arts Campus", "Mina Zayed", "Spring 2026", "40+ public events 的信号让设计推荐更像可参与日程。", ["public program", "Mina", "活动"]],
        ["421 artist residency studio", "421 Artist Residency", "MiZa", "下午", "驻留工作室和实验时间适合生成创作者空间设计卡。", ["residency", "studio", "实验"]],
        ["MiZa container row", "The Alley at MiZa", "Mina Zayed", "傍晚", "container alley、pop-up 和 workshop 让空间像可更换界面。", ["container", "pop-up", "workshop"]],
        ["Manarat Art Studio material table", "Manarat Al Saadiyat Art Studio", "Saadiyat", "上午", "日常 workshop 和 resident artist 信号让设计池更可触摸。", ["材料", "studio", "workshop"]],
        ["Cultural Foundation universal space", "Cultural Foundation", "Al Hosn", "下午", "learning、performing arts 和 visual arts 被整合进同一现代文化建筑。", ["universal space", "library", "auditorium"]],
        ["Qasr Al Hosn craft geometry", "Qasr Al Hosn", "Al Hosn", "上午", "手工艺、老城墙和现代文化设施适合做设计路线。", ["手工艺", "老城", "几何"]],
        ["Louvre dome rain of light", "Louvre Abu Dhabi Dome", "Saadiyat", "日落前", "穹顶光影是阿布扎比设计池不可少的空间锚。", ["穹顶", "光影", "海面"]],
        ["Third Place backyard expansion", "The Third Place Cafe", "Corniche Road", "上午", "前露台、library room、function space 和后院体现社区型空间扩展。", ["后院", "library room", "社区"]]
      ]
    },
    artist: {
      meta: "驻留、摄影、公共项目",
      layers: ["art", "photography", "workshop"],
      line: "今天适合靠近还没完全被大众知道的创作现场。",
      items: [
        ["Al Qomra photography circle", "Al Qomra Photography Meetup", "Manarat Al Saadiyat", "bi-weekly", "摄影 meetup 把艺术家推荐从名人转向真实社群。", ["摄影", "meetup", "社群"]],
        ["421 residency cohort", "421 Arts Campus", "Mina Zayed", "驻留季", "艺术家驻留支持 UAE 和 SWANA 创作者，适合小众艺术家入口。", ["residency", "SWANA", "创作者"]],
        ["Warehouse421 process glimpse", "Warehouse421", "Mina Zayed", "下午", "展览和活动展示创作过程，比只看作品更能激发探索。", ["过程", "展览", "工作坊"]],
        ["NYUAD Project Space student work", "NYUAD Project Space", "Saadiyat", "下午", "学生和教师策展让艺术家卡更年轻。", ["学生展", "实验", "校园"]],
        ["ADMAF Awards emerging voice", "ADMAF Awards", "Abu Dhabi", "活动季", "奖项和教育项目让创作者生态可被看见。", ["awards", "education", "创作者"]],
        ["Manarat resident artist workshop", "Manarat Art Studio", "Saadiyat", "上午", "resident artists 和 workshop 让用户能靠近创作过程。", ["resident artist", "workshop", "材料"]],
        ["Cultural Foundation exhibition room", "Cultural Foundation Exhibition Hall", "Al Hosn", "午后", "视觉艺术展厅和公共活动能给艺术家推荐一个老城锚点。", ["exhibition", "Al Hosn", "公共活动"]],
        ["Berklee student performance", "Berklee Abu Dhabi", "Cultural District", "演出夜", "学生和专业音乐人同城活动，适合生成更年轻的艺术家卡。", ["student", "performance", "music"]],
        ["MiZa pop-up maker table", "MiZa maker containers", "Mina Zayed", "傍晚", "pop-up、maker table 和街区活动让创作不只在展厅里。", ["maker", "pop-up", "街区"]]
      ]
    }
  }
};

const homepageDeepCultureMoodEntries = Object.fromEntries(
  Object.entries(homepageDeepCultureSignals).map(([cityKey, moodMap]) => [
    cityKey,
    Object.fromEntries(
      Object.entries(moodMap).map(([moodId, group]) => [
        moodId,
        homepageDeepCultureEntries(cityKey, moodId, group)
      ])
    )
  ])
);

function homepageDeepCultureEntries(cityKey, moodId, group) {
  const kicker = homepageDeepCultureKickers[moodId] || cityMoodSpots[cityKey]?.[moodId]?.kicker || "在城市重新探索";
  return group.items.map(([title, placeName, area, time, desc, tags]) => {
    return inspirationItem(title, group.meta, group.layers, group.line, [kicker, placeName, area, time, desc, tags]);
  });
}

loadPublicSourceSeedData();
loadNicheFeedbackSeedData();
loadHomepageCulturalMoodEntries();
loadHomepageDeepCultureMoodEntries();

function loadPublicSourceSeedData() {
  mergePublicPois();
  mergePublicPlaces();
  mergePublicRoutes();
  mergePublicLiveFeeds();
  mergePublicMoodEntries();
}

function mergePublicPois() {
  Object.entries(publicSourcePois).forEach(([cityKey, layerMap]) => {
    Object.entries(layerMap).forEach(([layerId, names]) => {
      const existing = cityPoiPools[cityKey]?.[layerId] || [];
      cityPoiPools[cityKey] = cityPoiPools[cityKey] || {};
      cityPoiPools[cityKey][layerId] = uniqueStops([...existing, ...names]);
    });
  });
}

function mergePublicPlaces() {
  Object.entries(publicSourcePlaces).forEach(([cityKey, places]) => {
    const city = cities[cityKey];
    if (!city) return;
    const seen = new Set(city.places.map((item) => item.id));
    places.forEach((item) => {
      if (seen.has(item.id)) return;
      seen.add(item.id);
      city.places.push(item);
    });
  });
}

function mergePublicRoutes() {
  Object.entries(publicSourceRoutes).forEach(([cityKey, routes]) => {
    const city = cities[cityKey];
    if (!city) return;
    const seen = new Set(city.routes.map((item) => item.id));
    routes.forEach((item) => {
      if (seen.has(item.id)) return;
      seen.add(item.id);
      city.routes.push(item);
    });
  });
}

function mergePublicLiveFeeds() {
  Object.entries(publicSourceLiveFeeds).forEach(([cityKey, feeds]) => {
    const existing = mockLiveFeeds[cityKey] || [];
    const seen = new Set(existing.map((item) => item.title));
    feeds.forEach((item) => {
      if (seen.has(item.title)) return;
      seen.add(item.title);
      existing.push(item);
    });
    mockLiveFeeds[cityKey] = existing;
  });
}

function mergePublicMoodEntries() {
  Object.entries(publicSourceMoodEntries).forEach(([cityKey, moodMap]) => {
    inspirationPools[cityKey] = inspirationPools[cityKey] || {};
    Object.entries(moodMap).forEach(([moodId, entries]) => {
      const existing = inspirationPools[cityKey][moodId] || [];
      const seen = new Set(existing.map((item) => item.title));
      entries.forEach((item) => {
        if (seen.has(item.title)) return;
        seen.add(item.title);
        existing.push(item);
      });
      inspirationPools[cityKey][moodId] = existing;
    });
  });
}

function loadNicheFeedbackSeedData() {
  mergeNicheFeedbackPois();
  mergeNicheFeedbackPlaces();
  mergeNicheFeedbackRoutes();
  mergeNicheFeedbackLiveFeeds();
  mergeNicheFeedbackMoodEntries();
}

function mergeNicheFeedbackPois() {
  Object.entries(nicheFeedbackPois).forEach(([cityKey, layerMap]) => {
    Object.entries(layerMap).forEach(([layerId, names]) => {
      const existing = cityPoiPools[cityKey]?.[layerId] || [];
      cityPoiPools[cityKey] = cityPoiPools[cityKey] || {};
      cityPoiPools[cityKey][layerId] = uniqueStops([...existing, ...names]);
    });
  });
}

function mergeNicheFeedbackPlaces() {
  Object.entries(nicheFeedbackPlaces).forEach(([cityKey, places]) => {
    const city = cities[cityKey];
    if (!city) return;
    const seen = new Set(city.places.map((item) => item.id));
    places.forEach((item) => {
      if (seen.has(item.id)) return;
      seen.add(item.id);
      city.places.push(item);
    });
  });
}

function mergeNicheFeedbackRoutes() {
  Object.entries(nicheFeedbackRoutes).forEach(([cityKey, routes]) => {
    const city = cities[cityKey];
    if (!city) return;
    const seen = new Set(city.routes.map((item) => item.id));
    routes.forEach((item) => {
      if (seen.has(item.id)) return;
      seen.add(item.id);
      city.routes.push(item);
    });
  });
}

function mergeNicheFeedbackLiveFeeds() {
  Object.entries(nicheFeedbackLiveFeeds).forEach(([cityKey, feeds]) => {
    const existing = mockLiveFeeds[cityKey] || [];
    const seen = new Set(existing.map((item) => item.title));
    feeds.forEach((item) => {
      if (seen.has(item.title)) return;
      seen.add(item.title);
      existing.push(item);
    });
    mockLiveFeeds[cityKey] = existing;
  });
}

function mergeNicheFeedbackMoodEntries() {
  Object.entries(nicheFeedbackMoodEntries).forEach(([cityKey, moodMap]) => {
    inspirationPools[cityKey] = inspirationPools[cityKey] || {};
    Object.entries(moodMap).forEach(([moodId, entries]) => {
      const existing = inspirationPools[cityKey][moodId] || [];
      const seen = new Set(existing.map((item) => item.title));
      entries.forEach((item) => {
        if (seen.has(item.title)) return;
        seen.add(item.title);
        existing.push(item);
      });
      inspirationPools[cityKey][moodId] = existing;
    });
  });
}

function loadHomepageCulturalMoodEntries() {
  mergeHomepageCulturalMoodEntries();
}

function mergeHomepageCulturalMoodEntries() {
  Object.entries(homepageCulturalMoodEntries).forEach(([cityKey, moodMap]) => {
    inspirationPools[cityKey] = inspirationPools[cityKey] || {};
    Object.entries(moodMap).forEach(([moodId, entries]) => {
      const existing = inspirationPools[cityKey][moodId] || [];
      const seen = new Set(existing.map((item) => item.title));
      entries.forEach((item) => {
        if (seen.has(item.title)) return;
        seen.add(item.title);
        existing.push(item);
      });
      inspirationPools[cityKey][moodId] = existing;
    });
  });
}

function loadHomepageDeepCultureMoodEntries() {
  mergeHomepageDeepCultureMoodEntries();
}

function mergeHomepageDeepCultureMoodEntries() {
  Object.entries(homepageDeepCultureMoodEntries).forEach(([cityKey, moodMap]) => {
    inspirationPools[cityKey] = inspirationPools[cityKey] || {};
    Object.entries(moodMap).forEach(([moodId, entries]) => {
      const existing = inspirationPools[cityKey][moodId] || [];
      const seen = new Set(existing.map((item) => item.title));
      entries.forEach((item) => {
        if (seen.has(item.title)) return;
        seen.add(item.title);
        existing.push(item);
      });
      inspirationPools[cityKey][moodId] = existing;
    });
  });
}

const state = {
  city: "shanghai",
  view: "home",
  layer: "quest",
  mood: "music",
  currentUser: null,
  authMode: "login",
  pendingRegistration: null,
  registerInterests: ["coffee"],
  routeDetailMode: "preview",
  explorationActive: false,
  explorationRoute: null,
  explorationStartedAt: null,
  inspirationSelected: false,
  routesRevealed: false,
  revealAnimating: false,
  carouselIndex: 0,
  recommendationRound: Math.floor((Date.now() + Math.random() * 10000) % 97),
  feedVersion: Math.floor((Date.now() + Math.random() * 100000) % 997),
  userSignalVersion: 0,
  lastMoodRailInteractionAt: 0,
  aiRecommendations: null,
  aiLoading: false,
  aiError: "",
  aiRequestId: 0,
  mediaCache: {},
  mediaLoading: {},
  sort: "smart",
  filtersOpen: false,
  selectedRouteId: null,
  disliked: 0,
  recordView: "day",
  activeRoute: null,
  routeProgress: 0,
  routeStopFocus: 0,
  photoTaken: false,
  featuredPasses: [],
  completedRouteIds: [],
  activeRedemptionRouteId: null,
  activeRedemptionBenefitId: null,
  expandedFeaturedStopId: null,
  featuredPaymentRouteId: null,
  lastCheckinLocation: null,
  passActionMode: "",
  passActionRouteId: null,
  passActionBenefitId: null,
  orderFilter: "all",
  passLibraryFilter: "active",
  pendingSwitchRouteId: null,
  pendingSwitchAction: "",
  profileRecordLimit: PROFILE_RECORD_PAGE_SIZE,
  profileRecordExpandedAll: false,
  profileRecordControlsDismissed: false,
  records: defaultRecords()
};

const dom = {
  splashScreen: document.getElementById("splashScreen"),
  appFrame: document.getElementById("appFrame"),
  authGate: document.getElementById("authGate"),
  authMessage: document.getElementById("authMessage"),
  loginForm: document.getElementById("loginForm"),
  registerForm: document.getElementById("registerForm"),
  profileForm: document.getElementById("profileForm"),
  interestForm: document.getElementById("interestForm"),
  resetForm: document.getElementById("resetForm"),
  loginAccount: document.getElementById("loginAccount"),
  loginPassword: document.getElementById("loginPassword"),
  rememberMe: document.getElementById("rememberMe"),
  registerName: document.getElementById("registerName"),
  registerAccount: document.getElementById("registerAccount"),
  registerPassword: document.getElementById("registerPassword"),
  registerConfirm: document.getElementById("registerConfirm"),
  registerCity: document.getElementById("registerCity"),
  registerRole: document.getElementById("registerRole"),
  registerRoutine: document.getElementById("registerRoutine"),
  registerInterestList: document.getElementById("registerInterestList"),
  selectAllInterests: document.getElementById("selectAllInterests"),
  agreeTerms: document.getElementById("agreeTerms"),
  resetAccount: document.getElementById("resetAccount"),
  resetPassword: document.getElementById("resetPassword"),
  forgotButton: document.getElementById("forgotButton"),
  demoLoginButton: document.getElementById("demoLoginButton"),
  backToLoginButton: document.getElementById("backToLoginButton"),
  cityEntry: document.getElementById("cityEntry"),
  cityEntryName: document.getElementById("cityEntryName"),
  cityEntryLine: document.getElementById("cityEntryLine"),
  langButton: document.getElementById("langButton"),
  heroVisual: document.getElementById("heroVisual"),
  heroSave: document.getElementById("heroSave"),
  homeKicker: document.getElementById("homeKicker"),
  homeTitle: document.getElementById("homeTitle"),
  homeIntro: document.getElementById("homeIntro"),
  contextRow: document.getElementById("contextRow"),
  moodGrid: document.getElementById("moodGrid"),
  inspirationCard: document.getElementById("inspirationCard"),
  cityResonance: document.getElementById("cityResonance"),
  swipeUpCue: document.getElementById("swipeUpCue"),
  routeReveal: document.getElementById("routeReveal"),
  recommendSection: document.getElementById("recommendSection"),
  recommendTitle: document.getElementById("recommendTitle"),
  recommendHint: document.getElementById("recommendHint"),
  recommendCarousel: document.getElementById("recommendCarousel"),
  goAtlasFromHome: document.getElementById("goAtlasFromHome"),
  atlasTitle: document.getElementById("atlasTitle"),
  atlasIntro: document.getElementById("atlasIntro"),
  secretFeatureButton: document.getElementById("secretFeatureButton"),
  filterToggle: document.getElementById("filterToggle"),
  layerTabs: document.getElementById("layerTabs"),
  sortRow: document.getElementById("sortRow"),
  atlasNumber: document.getElementById("atlasNumber"),
  atlasFeatureTitle: document.getElementById("atlasFeatureTitle"),
  atlasFeatureSub: document.getElementById("atlasFeatureSub"),
  atlasMap: document.getElementById("atlasMap"),
  districtA: document.getElementById("districtA"),
  districtB: document.getElementById("districtB"),
  districtC: document.getElementById("districtC"),
  pinLayer: document.getElementById("pinLayer"),
  routeList: document.getElementById("routeList"),
  secretCover: document.getElementById("secretCover"),
  secretIntro: document.getElementById("secretIntro"),
  secretDock: document.getElementById("secretDock"),
  quickQuestRow: document.getElementById("quickQuestRow"),
  secretStack: document.getElementById("secretStack"),
  profileSubline: document.getElementById("profileSubline"),
  featuredPassSection: document.getElementById("featuredPassSection"),
  featuredPassList: document.getElementById("featuredPassList"),
  passMapButton: document.getElementById("passMapButton"),
  interestMapSection: document.getElementById("interestMapSection"),
  interestMapList: document.getElementById("interestMapList"),
  interestMapButton: document.getElementById("interestMapButton"),
  ordersButton: document.getElementById("ordersButton"),
  settingsButton: document.getElementById("settingsButton"),
  folioCover: document.getElementById("folioCover"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileName: document.getElementById("profileName"),
  profileAccount: document.getElementById("profileAccount"),
  profileLevel: document.getElementById("profileLevel"),
  recordListTitle: document.getElementById("recordListTitle"),
  periodOverview: document.getElementById("periodOverview"),
  recordList: document.getElementById("recordList"),
  recordScrollFloat: document.getElementById("recordScrollFloat"),
  timeLens: document.getElementById("timeLens"),
  logoutButton: document.getElementById("logoutButton"),
  yearSheet: document.getElementById("yearSheet"),
  cityBackdrop: document.getElementById("cityBackdrop"),
  citySheet: document.getElementById("citySheet"),
  cityClose: document.getElementById("cityClose"),
  cityCardList: document.getElementById("cityCardList"),
  routeBackdrop: document.getElementById("routeBackdrop"),
  routeDetailSheet: document.getElementById("routeDetailSheet"),
  routeClose: document.getElementById("routeClose"),
  routeShareButton: document.getElementById("routeShareButton"),
  routeDetailCode: document.getElementById("routeDetailCode"),
  routeDetailTitle: document.getElementById("routeDetailTitle"),
  routeDetailMeta: document.getElementById("routeDetailMeta"),
  routeDetailPhoto: document.getElementById("routeDetailPhoto"),
  virtualMap: document.getElementById("virtualMap"),
  routeProgress: document.getElementById("routeProgress"),
  checkinButton: document.getElementById("checkinButton"),
  photoButton: document.getElementById("photoButton"),
  completeRouteButton: document.getElementById("completeRouteButton"),
  switchConfirmBackdrop: document.getElementById("switchConfirmBackdrop"),
  switchConfirmSheet: document.getElementById("switchConfirmSheet"),
  switchConfirmTitle: document.getElementById("switchConfirmTitle"),
  switchConfirmBody: document.getElementById("switchConfirmBody"),
  switchCurrentRoute: document.getElementById("switchCurrentRoute"),
  switchNextRoute: document.getElementById("switchNextRoute"),
  switchCancelButton: document.getElementById("switchCancelButton"),
  switchConfirmButton: document.getElementById("switchConfirmButton"),
  passActionBackdrop: document.getElementById("passActionBackdrop"),
  passActionSheet: document.getElementById("passActionSheet"),
  passActionClose: document.getElementById("passActionClose"),
  passActionContent: document.getElementById("passActionContent"),
  welcomeBurst: document.getElementById("welcomeBurst"),
  ongoingExploration: document.getElementById("ongoingExploration"),
  ongoingStatus: document.getElementById("ongoingStatus"),
  ongoingTitle: document.getElementById("ongoingTitle"),
  ongoingMeta: document.getElementById("ongoingMeta"),
  ongoingProgressBar: document.getElementById("ongoingProgressBar"),
  dayBackdrop: document.getElementById("dayBackdrop"),
  dayDetailSheet: document.getElementById("dayDetailSheet"),
  dayClose: document.getElementById("dayClose"),
  dayDetailCode: document.getElementById("dayDetailCode"),
  dayDetailTitle: document.getElementById("dayDetailTitle"),
  dayDetailMeta: document.getElementById("dayDetailMeta"),
  dayDetailPhoto: document.getElementById("dayDetailPhoto"),
  dayRecordList: document.getElementById("dayRecordList"),
  accountBackdrop: document.getElementById("accountBackdrop"),
  accountSheet: document.getElementById("accountSheet"),
  accountSheetKicker: document.getElementById("accountSheetKicker"),
  accountSheetTitle: document.getElementById("accountSheetTitle"),
  accountSheetMeta: document.getElementById("accountSheetMeta"),
  accountClose: document.getElementById("accountClose"),
  accountPanel: document.getElementById("accountPanel"),
  toast: document.getElementById("toast")
};

function place(id, layer, x, y, title, desc) {
  return { id, layer, x, y, title, desc };
}

function route(id, layer, code, title, desc, stops, duration, budget, bestFor, distance, hot) {
  return { id, layer, code, title, desc, stops, duration, budget, bestFor, distance, hot };
}

function passStop(id, store, area, benefit, desc, hours, routeRole) {
  return { id, store, area, benefit, desc, hours, routeRole };
}

function featuredPassMap({ id, city, code, title, issue, theme, desc, duration, distance, originalPrice, price, validDays, bestFor, hot, benefits }) {
  return {
    id,
    layer: "featured",
    code,
    title,
    issue,
    theme,
    desc,
    stops: benefits.map((item) => item.store),
    duration,
    budget: price,
    bestFor,
    distance,
    hot,
    city,
    isFeaturedPass: true,
    originalPrice,
    price,
    validDays,
    benefits
  };
}

function recordEntry(offset, title, layer, photo, time, mood, stops, extras = {}) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return {
    id: extras.id || `rec-${Math.abs(offset)}-${stableHash(`${title}-${time}-${layer}`)}`,
    day: dayOfYear(date),
    dateISO: date.toISOString().slice(0, 10),
    title,
    photo,
    layer,
    time,
    mood,
    stops,
    city: extras.city || "shanghai",
    photoSource: extras.photoSource || "",
    duration: extras.duration || "2h",
    budget: extras.budget || "已记录",
    note: extras.note || `${title} 里留下了一段${mood}的城市记忆。`
  };
}

function recordSeed(offset, title, layer, photo, time, mood, stops, extras = {}) {
  return recordEntry(offset, title, layer, photo, time, mood, stops, extras);
}

function passRecordSeed(offset, title, time, stops, price, duration, city = "shanghai") {
  return recordEntry(offset, title, "featured", true, time, "城市通行证完成", stops, {
    city,
    budget: price,
    duration,
    photoSource: "通行证完成",
    note: `${title} 已完成，沿线权益、路线顺序和店家回看都保存在今日探索里。`
  });
}

function defaultRecords() {
  return [
    passRecordSeed(0, "上海低光夜游地图", "21:42", ["复兴中路自然酒小房间", "衡山路楼上爵士", "安福路深夜咖啡"], "¥198", "3h"),
    passRecordSeed(0, "上海咖啡地图 Vol.01", "16:18", ["O.P.S. Cafe", "太原路树影咖啡", "思南书局咖啡角", "复兴中路窗边咖啡", "安福路街角咖啡"], "¥128", "半日"),
    recordSeed(0, "凌晨便利店霓虹短线", "night", true, "00:36", "夜色采样", ["安福路便利店", "乌鲁木齐中路路口", "旧小区门房"], { duration: "42min", budget: "¥23", photoSource: "拍照", note: "雨停后的便利店灯箱、旧小区门房和路面反光组成了一条很短的夜行线。" }),
    recordSeed(0, "武康路蓝色门牌和旧楼梯", "quest", false, "12:38", "谷崎润一郎《阴翳礼赞》", ["武康路蓝色门牌", "复兴中路旧楼梯", "安福路转角灯"], { duration: "55min", budget: "¥0", note: "沿着门牌、楼梯扶手和雨后反光，把熟悉街区重新看了一遍。" }),
    recordSeed(0, "愚园路香氛和手写标签", "wellness", true, "15:07", "恢复一点嗅觉", ["愚园路香氛小店", "镇宁路树影", "小院咖啡窗口"], { duration: "1.5h", budget: "¥86", photoSource: "上传照片", note: "没有赶路，只把香味、纸卡和一个靠窗座位记录下来。" }),
    recordSeed(0, "西岸日落展厅外侧", "art", true, "18:26", "被城市打开了一点", ["西岸美术馆外墙", "徐汇滨江看台", "龙美术馆外广场"], { duration: "2h", budget: "¥68", photoSource: "拍照", note: "展厅外侧、人流和江面一起变慢，适合收进今天的城市格子。" }),
    recordSeed(0, "巨鹿路窄巷咖啡和唱片", "music", false, "20:11", "低拍、旧唱片", ["巨鹿路唱片角", "长乐路咖啡吧台", "富民路小路口"], { duration: "1.2h", budget: "¥52", note: "没有拍照，只记下几首歌名和一段从吧台走出来的路。" }),
    recordSeed(-1, "上生新所白墙和杂志架", "bookstore", true, "14:34", "翻到一页城市", ["茑屋书店上生新所", "哥伦比亚公园", "番禺路街角"], { duration: "2.5h", budget: "¥104", photoSource: "拍照", note: "从杂志封面、老建筑白墙和公园长椅里找到了一个周日下午。" }),
    recordSeed(-1, "小剧场散场后的楼梯", "theatre", true, "22:08", "低声散场", ["长江剧场门口", "人民路旧楼梯", "云南南路夜宵"], { duration: "1h", budget: "¥138", photoSource: "拍照", note: "散场后没有马上回家，顺着楼梯、路灯和夜宵摊多走了一段。" }),
    recordSeed(-2, "淮海路青年设计橱窗", "fashion", true, "16:10", "想看新东西", ["LABELHOOD", "淮海中路橱窗", "TX 淮海"], { duration: "2h", budget: "¥210", photoSource: "上传照片", note: "橱窗、面料和楼上展陈让这条商业街显得没那么标准化。" }),
    recordSeed(-3, "杨浦滨江旧厂房风口", "citywalk", false, "17:28", "风很具体", ["杨树浦电厂遗迹", "滨江栈道", "水厂路码头边"], { duration: "1.8h", budget: "¥0", note: "从旧厂房阴影走到江边风口，城市更新没有被包装得太满。" }),
    recordSeed(-4, "复兴中路隐秘酒线", "drink", true, "21:05", "轻微醺", ["Speak Low", "复兴中路夜路", "J.Boroski"], { duration: "2.2h", budget: "¥248", photoSource: "拍照", note: "只保留了两杯酒、一段夜路和一个不需要热闹的角落。" }),
    recordSeed(-5, "静安寺背后的花店和雨棚", "floristry", true, "11:22", "周末补一点颜色", ["胶州路花店", "静安别墅雨棚", "常德路咖啡窗口"], { duration: "1h", budget: "¥96", photoSource: "拍照", note: "花束、雨棚和窗边咖啡都很短，但适合做本周的一个小标记。" }),
    recordSeed(-6, "人民广场地下通道观察", "architecture", false, "19:14", "非地点", ["人民广场换乘口", "地下通道招牌", "南京西路出口"], { duration: "48min", budget: "¥0", note: "把平时只经过的地下通道当作一个观察对象，路线突然变得陌生。" }),
    recordSeed(-8, "上生新所周末市集", "market", true, "15:44", "热闹但舒服", ["上生新所周末市集", "茑屋书店上生新所", "哥伦比亚公园"], { duration: "2.5h", budget: "¥168", photoSource: "上传照片", note: "摊位没有全部看完，只留下手作香皂、旧海报和一杯冰咖啡。" }),
    recordSeed(-10, "成都玉林院子咖啡", "coffee", true, "15:18", "慢下午", ["玉林院子咖啡", "芳草街树影", "小酒馆门口"], { city: "chengdu", duration: "2h", budget: "¥72", photoSource: "拍照", note: "树影、竹椅和院子里的风，把成都的下午拉得很长。" }),
    recordSeed(-13, "阿布扎比海风白墙记录", "architecture", true, "09:25", "白墙清晨", ["Qasr Al Hosn 白墙", "Corniche 海边步道", "Mina 市场入口"], { city: "abudhabi", duration: "3h", budget: "AED 65", photoSource: "拍照", note: "白墙、强光和海风让路线像一次清晨取样。" }),
    recordSeed(-17, "M50 旧厂房和喷绘墙", "art", false, "17:50", "粗粝一点", ["M50 入口", "莫干山路涂鸦墙", "苏州河桥边"], { duration: "2h", budget: "¥35", note: "没有进太多展，只在旧厂房外侧和河边停留。" }),
    recordSeed(-21, "复兴公园晨间恢复线", "wellness", true, "08:18", "身体醒来", ["复兴公园长椅", "思南路树荫", "瑞金二路面包房"], { duration: "1.2h", budget: "¥34", photoSource: "拍照", note: "早上不做计划，只把长椅、树荫和面包房排成一条轻路线。" }),
    recordSeed(-24, "深夜拉面和电影散场", "cinema", false, "23:32", "散场之后", ["百美汇影城", "静安寺夜路", "胶州路拉面"], { duration: "1.5h", budget: "¥118", note: "电影结束后没有马上回家，夜路和拉面才像真正的结尾。" }),
    recordSeed(-31, "苏州河桥边反光", "photography", true, "18:42", "反光练习", ["浙江路桥", "苏州河步道", "四行仓库外侧"], { duration: "1.6h", budget: "¥0", photoSource: "拍照", note: "只为了练几张反光照片，反而记录下一个很具体的傍晚。" }),
    recordSeed(-42, "麓湖 A4 展厅和湖边", "art", true, "16:06", "湖边展览", ["麓湖 A4 美术馆", "湖边咖啡", "麓镇小路"], { city: "chengdu", duration: "3h", budget: "¥126", photoSource: "上传照片", note: "展厅、湖面和低饱和街区很适合放进全年记录。" }),
    recordSeed(-58, "Saadiyat 白色展厅午后", "art", true, "14:20", "安静展厅", ["Louvre Abu Dhabi 外侧", "Saadiyat 白色展厅", "海边车站"], { city: "abudhabi", duration: "半日", budget: "AED 120", photoSource: "拍照", note: "展厅外墙、海边车站和午后的强光，组成一条不吵的路线。" }),
    recordSeed(-86, "外滩源冬天橱窗", "fashion", true, "19:02", "冷空气和玻璃", ["外滩源橱窗", "圆明园路口", "虎丘路旧楼"], { duration: "1.5h", budget: "¥46", photoSource: "拍照", note: "玻璃、冷空气和旧楼之间，城市显得更清楚。" }),
    recordSeed(-96, "龙华会旧厂区早餐线", "citywalk", true, "09:18", "早起城市", ["龙华会入口", "旧厂房转角", "街边豆浆店"], { duration: "1.4h", budget: "¥28", photoSource: "拍照", note: "早餐摊和旧厂区在同一个清晨出现，适合做成一条很轻的城市样本。" }),
    recordSeed(-103, "静安雕塑公园午休短线", "wellness", false, "12:42", "午休换气", ["静安雕塑公园", "石门二路咖啡窗口", "南京西路背街"], { duration: "38min", budget: "¥36", note: "午休没有走远，只把公园阴影和一杯外带咖啡留进记录。" }),
    recordSeed(-111, "北外滩风口摄影", "photography", true, "17:36", "江面风很大", ["北外滩滨江", "提篮桥老街", "公平路码头"], { duration: "1.7h", budget: "¥0", photoSource: "拍照", note: "风口、桥墩和老街招牌让照片有了更硬一点的城市边界。" }),
    recordSeed(-119, "番禺路小酒和书页", "drink", true, "20:48", "轻微社交", ["番禺路小酒馆", "幸福路转角", "上生新所夜门"], { duration: "2h", budget: "¥176", photoSource: "拍照", note: "没有安排很满，一杯酒、一页书和夜门口的光就够了。" }),
    recordSeed(-128, "前滩蓝色玻璃路线", "architecture", false, "16:20", "新城区采样", ["前滩太古里外侧", "东方体育中心步道", "黄浦江边台阶"], { duration: "2.3h", budget: "¥42", note: "新城区不一定无聊，玻璃反光和空台阶让尺度变得清楚。" }),
    recordSeed(-139, "徐家汇唱片店补给", "vintage", true, "18:12", "旧物时间", ["衡山坊唱片角", "徐家汇天桥", "小路咖啡"], { duration: "1.8h", budget: "¥152", photoSource: "上传照片", note: "为了找一张黑胶多走了两条小路，最后把天桥晚光也收进来了。" }),
    recordSeed(-151, "南翔古镇非游客线", "quest", true, "10:56", "远一点的上海", ["南翔老街背面", "檀园外墙", "河边茶座"], { duration: "半日", budget: "¥88", photoSource: "拍照", note: "绕开最热闹的入口，古镇背面反而更像一段城市外延。" }),
    recordSeed(-166, "成都望江楼竹影茶线", "tea", true, "14:05", "盖碗茶影", ["望江楼公园", "竹影茶座", "河边慢走"], { city: "chengdu", duration: "2.5h", budget: "¥58", photoSource: "拍照", note: "茶碗、竹影和河边风一起把下午拉慢。" }),
    recordSeed(-179, "成都奎星楼开放麦夜", "comedy", false, "21:34", "笑完再散步", ["奎星楼开放麦", "小通巷夜路", "深夜甜品窗口"], { city: "chengdu", duration: "2h", budget: "¥96", note: "笑完以后没有马上打车，沿着小通巷又走了十几分钟。" }),
    recordSeed(-193, "东郊记忆旧厂房声场", "music", true, "19:26", "现场残响", ["东郊记忆旧厂房", "演出入口", "厂区咖啡"], { city: "chengdu", duration: "3h", budget: "¥168", photoSource: "拍照", note: "旧厂房的回声和演出前人群，比正式开场还像一条路线。" }),
    recordSeed(-207, "Abu Dhabi Mina 市场生活线", "market", true, "11:12", "真实市场", ["Mina Market", "港口边界", "421 Arts Campus"], { city: "abudhabi", duration: "3h", budget: "AED 72", photoSource: "拍照", note: "市场声音、港口边界和艺术园区之间，是比景点更真实的一段城市。" }),
    recordSeed(-221, "Abu Dhabi Corniche 夜风", "night", false, "22:18", "海边夜色", ["Ray's Bar", "Corniche 夜风", "海湾夜色"], { city: "abudhabi", duration: "2.5h", budget: "AED 260", note: "高处一杯之后去海边走路，夜晚就没有那么像游客行程。" }),
    recordSeed(-236, "Saadiyat 白色边界慢走", "architecture", true, "08:45", "强光边界", ["Saadiyat 白墙", "Mamsha 海边", "Louvre 外侧"], { city: "abudhabi", duration: "2h", budget: "AED 48", photoSource: "拍照", note: "白墙和海风让路线非常干净，像一张没有写满的城市卡。" }),
    recordSeed(-258, "浦东美术馆和江边台阶", "art", true, "15:50", "展后发呆", ["浦东美术馆", "滨江台阶", "陆家嘴背街咖啡"], { duration: "3h", budget: "¥118", photoSource: "上传照片", note: "展览之后在江边坐了一会儿，比展厅本身更像今天的重点。" }),
    recordSeed(-284, "金桥周末宠物友好线", "pet", true, "13:28", "带狗慢走", ["金桥宠物友好咖啡", "碧云社区公园", "面包店外摆"], { duration: "2.2h", budget: "¥92", photoSource: "拍照", note: "宠物友好店、公园和外摆座位让周末变成很容易开始的一条线。" })
  ];
}

function demoFeaturedPasses() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    demoPass("sh-pass-coffee-01", "active", now - 2 * day, 3),
    demoPass("sh-pass-night-01", "completed", now - 11 * day),
    demoPass("cd-pass-art-01", "active", now - 4 * day, 1),
    demoPass("ad-pass-coffee-01", "completed", now - 19 * day),
    demoPass("ad-pass-art-01", "expired", now - 28 * day, 1)
  ].filter(Boolean);
}

function demoPass(routeId, status, createdAt, redeemedCount = 0) {
  const routeItem = featuredRouteById(routeId);
  if (!routeItem) return null;
  const allBenefitIds = routeItem.benefits.map((item) => item.id);
  const redeemed = status === "completed"
    ? allBenefitIds
    : allBenefitIds.slice(0, Math.min(redeemedCount, allBenefitIds.length - 1));
  const expiresAt = status === "expired"
    ? Date.now() - 2 * 24 * 60 * 60 * 1000
    : createdAt + routeItem.validDays * 24 * 60 * 60 * 1000;
  return {
    id: `demo-pass-${routeId}`,
    orderNo: orderNumberForPass(routeItem),
    routeId,
    city: routeItem.city || "shanghai",
    status,
    createdAt,
    paidAt: createdAt,
    purchasedAt: createdAt,
    completedAt: status === "completed" ? createdAt + 2 * 60 * 60 * 1000 : null,
    expiresAt,
    redeemed
  };
}

function demoCompletedRouteIds() {
  return ["sh-r1", "sh-r3", "sh-r5", "sh-r7", "cd-r4", "cd-r10", "ad-r5", "ad-r13"];
}

function demoUserSnapshot(seedUser = {}) {
  return {
    ...seedUser,
    name: "Vera",
    account: DEMO_ACCOUNT,
    password: encodePassword(DEMO_PASSWORD),
    city: "shanghai",
    interests: ["coffee", "art", "quest", "featured", "bookstore", "music", "night", "architecture", "market", "photography"],
    role: "creative",
    routine: "flexible",
    onboardingComplete: true,
    demoDataVersion: LOOP_DATA_VERSION,
    records: defaultRecords(),
    featuredPasses: demoFeaturedPasses(),
    completedRouteIds: demoCompletedRouteIds(),
    explorationState: {
      active: true,
      routeId: "sh-r12",
      city: "shanghai",
      routeProgress: 1,
      routeStopFocus: 1,
      photoTaken: true,
      startedAt: Date.now() - 46 * 60 * 1000
    },
    updatedAt: new Date().toISOString()
  };
}

function secret(code, title, clue, mode, duration, distance = 1.2, area = "附近") {
  return { code, title, clue, mode, duration, distance, area };
}

function spot(kicker, title, area, time, desc, tags) {
  return { kicker, title, area, time, desc, tags };
}

function inspirationItem(title, meta, layers, line, spotArgs, art = "") {
  return { title, meta, layers, line, spot: spot(...spotArgs), art };
}

function stableHash(value) {
  return String(value).split("").reduce((sum, char) => ((sum << 5) - sum + char.charCodeAt(0)) | 0, 0);
}

function seededJitter(seed, max = 1) {
  return pseudoRandom(Math.abs(stableHash(seed)) + 17) * max;
}

function liveFeedFor(cityKey = state.city, version = state.feedVersion) {
  const feeds = mockLiveFeeds[cityKey] || mockLiveFeeds.shanghai;
  return feeds[Math.abs(version) % feeds.length];
}

function refreshDiscoveryFeed({ advanceMood = true, keepReveal = true } = {}) {
  state.recommendationRound += 1;
  state.feedVersion += 1;
  state.userSignalVersion += 1;
  state.selectedRouteId = null;
  state.disliked = 0;
  if (advanceMood) {
    const moodList = personalizedMoods();
    state.carouselIndex = (state.carouselIndex + 1) % moodList.length;
    state.mood = moodList[state.carouselIndex].id;
    state.inspirationSelected = true;
  }
  if (!keepReveal) resetRevealState();
  renderHome();
  renderAtlas();
  if (state.inspirationSelected) void requestAiRecommendations("refresh");
}

function currentRecommendationKey() {
  const activeMood = moodById(state.mood);
  return [
    state.city,
    state.mood,
    activeMood.assetKey || activeMood.title,
    state.recommendationRound,
    state.feedVersion,
    state.userSignalVersion,
    state.currentUser?.id || "guest"
  ].join("|");
}

function aiPackForCurrentContext() {
  return state.aiRecommendations?.key === currentRecommendationKey() ? state.aiRecommendations : null;
}

function clearAiRecommendations() {
  state.aiRecommendations = null;
  state.aiError = "";
  state.aiLoading = false;
  state.aiRequestId += 1;
}

async function requestAiRecommendations(reason = "selection") {
  if (!state.inspirationSelected || typeof fetch !== "function" || window.location.protocol === "file:") return;
  const city = currentCity();
  const mood = moodById(state.mood);
  const context = recommendationContext(city, mood);
  const key = currentRecommendationKey();
  const requestId = state.aiRequestId + 1;
  state.aiRequestId = requestId;
  state.aiLoading = true;
  state.aiError = "";
  renderHome();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        system: [
          "你是 LOOP 城市回路的城市策展推荐引擎。",
          "请基于用户偏好、城市、天气、时间、当天信息流和候选 POI，生成安静、时尚、非同质化的私人城市探索路线。",
          "只返回 JSON，不要 Markdown，不要解释。"
        ].join(" "),
        messages: [
          {
            role: "user",
            content: JSON.stringify(buildAiRecommendationPayload(city, mood, context, reason))
          }
        ],
        temperature: 0.78,
        max_tokens: 1200
      })
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    const parsed = extractJsonFromText(data.reply || "");
    const pack = normalizeAiPack(parsed, city, mood, context, key);
    if (state.aiRequestId !== requestId || currentRecommendationKey() !== key) return;
    state.aiRecommendations = pack;
    state.aiLoading = false;
    renderHome();
    if (state.routesRevealed) renderAtlas();
  } catch (error) {
    if (state.aiRequestId !== requestId) return;
    state.aiError = error.message || "AI_SERVICE_UNAVAILABLE";
    state.aiLoading = false;
    renderHome();
  } finally {
    clearTimeout(timeout);
  }
}

function buildAiRecommendationPayload(city, mood, context, reason) {
  const candidateLayerIds = recommendedLayerSequence(city, mood, context, 8);
  const visitedStops = visitedStopSet();
  const poiByLayer = Object.fromEntries(candidateLayerIds.map((layerId) => {
    const layerPlaces = city.places
      .filter((placeItem) => placeItem.layer === layerId)
      .map((placeItem) => placeItem.title)
      .filter((title) => !visitedStops.has(normalizeStop(title)));
    const poolPlaces = poiPoolForLayer(state.city, layerId)
      .filter((title) => !visitedStops.has(normalizeStop(title)));
    return [layerId, uniqueStops([...layerPlaces, ...poolPlaces]).slice(0, 14)];
  }));
  return {
    task: "为 LOOP 首页生成新的个性化城市探索路线",
    reason,
    requiredSchema: {
      tone: "一句整体氛围",
      spot: { kicker: "推荐地点类型", title: "地点名", area: "区域", time: "适合时段", desc: "一句说明", tags: ["标签"] },
      routes: [
        {
          layer: "必须使用候选 layer id",
          title: "路线名，不要重复分类名",
          desc: "一句具体路线说明",
          stops: ["4 到 6 个真实或合理 POI，按不走回头路的顺序"],
          duration: "例如 2.5h",
          budget: "例如 ¥160 / AED 120",
          bestFor: "适合状态",
          distance: 1.8
        }
      ]
    },
    city: {
      name: city.name,
      code: city.code,
      weather: city.weather,
      location: city.location,
      districts: city.districts,
      date: new Date().toISOString().slice(0, 10)
    },
    user: {
      interests: context.userInterests.map((id) => layerName(id).name),
      interestIds: context.userInterests,
      role: context.role,
      routine: context.routine
    },
    inspiration: {
      id: mood.id,
      type: mood.type,
      title: mood.title,
      meta: mood.meta,
      line: mood.line,
      layerIds: mood.layers
    },
    liveFeed: context.feed,
    visitedStops: [...visitedStops].slice(0, 80),
    candidateLayers: candidateLayerIds.map((id) => ({ id, name: layerName(id).name, desc: layerName(id).desc })),
    poiByLayer,
    localStartingPoint: mood.spot || currentMoodSpot(mood.id),
    localRouteExamples: localRecommendedRoutes(5).map((item) => ({
      layer: item.layer,
      title: item.title,
      stops: item.stops,
      duration: item.duration,
      budget: item.budget
    })),
    constraints: [
      "返回 5 条路线",
      "每条路线至少 4 个地点，最多 6 个地点",
      "不要使用模板化标题，不要把分类名直接当路线名",
      "不要重复同一地点",
      "不要推荐用户已经去过或已经保存在历史记录里的地点",
      "语气面向真实用户，不要暴露推荐算法或开发要求"
    ]
  };
}

function extractJsonFromText(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("EMPTY_AI_REPLY");
  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced?.[1] || raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    return JSON.parse(candidate);
  }
}

function normalizeAiPack(parsed, city, mood, context, key) {
  const routes = Array.isArray(parsed.routes)
    ? parsed.routes
        .map((item, index) => normalizeAiRoute(item, index, city, mood, context, key))
        .filter(Boolean)
    : [];
  if (!routes.length) throw new Error("EMPTY_AI_ROUTES");
  return {
    key,
    source: "api",
    tone: cleanAiText(parsed.tone, context.feed.tone, 48),
    spot: normalizeAiSpot(parsed.spot, mood),
    routes,
    updatedAt: Date.now()
  };
}

function normalizeAiSpot(spot, mood) {
  const fallbackSpot = mood.spot || currentMoodSpot(mood.id);
  if (!spot || typeof spot !== "object") return null;
  return {
    kicker: cleanAiText(spot.kicker, `在${currentCity().name}靠近${mood.type}`, 24),
    title: cleanAiText(spot.title, fallbackSpot.title, 28),
    area: cleanAiText(spot.area, fallbackSpot.area, 28),
    time: cleanAiText(spot.time, fallbackSpot.time, 24),
    desc: cleanAiText(spot.desc, fallbackSpot.desc, 90),
    tags: Array.isArray(spot.tags) ? spot.tags.map((tag) => cleanAiText(tag, "", 10)).filter(Boolean).slice(0, 4) : fallbackSpot.tags
  };
}

function normalizeAiRoute(item, index, city, mood, context, key) {
  if (!item || typeof item !== "object") return null;
  const layerId = resolveLayerId(item.layer) || context.liveLayers[index % context.liveLayers.length] || mood.layers[index % mood.layers.length] || "quest";
  const visitedStops = visitedStopSet();
  const baseStops = normalizeStopList(item.stops).filter((stop) => !visitedStops.has(normalizeStop(stop)));
  const durationText = cleanAiText(item.duration, `${2 + (index % 4) * 0.5}h`, 12);
  const routeSeed = { ...item, layer: layerId, stops: baseStops, duration: durationText };
  const stopTarget = Math.max(4, Math.min(6, baseStops.length || targetStopCount(routeSeed) + (index % 2)));
  let expandedStops = routeStopsForLayer(layerId, baseStops, {
    routeItem: routeSeed,
    preferLayerPlaces: baseStops.length < 4,
    usedStops: new Set(visitedStops),
    strictUsedStops: true,
    city,
    cityKey: state.city
  });
  if (expandedStops.length < stopTarget) {
    const extraStops = [
      ...expandedStops,
      ...poiPoolForLayer(state.city, layerId),
      ...city.places.filter((placeItem) => placeItem.layer === layerId).map((placeItem) => placeItem.title),
      ...city.places.map((placeItem) => placeItem.title)
    ];
    expandedStops = uniqueStops(extraStops.filter((stop) => !visitedStops.has(normalizeStop(stop)))).slice(0, stopTarget);
  } else {
    expandedStops = expandedStops.slice(0, stopTarget);
  }
  const title = cleanAiText(item.title, generatedRouteTitle(city, layerId, expandedStops, index + state.recommendationRound + 1), 32);
  const budgetFallback = city.code === "AD" ? `AED ${90 + index * 35}` : `¥${90 + index * 35}`;
  const routeItem = route(
    `ai-${state.city}-${state.mood}-${Math.abs(stableHash(`${key}-${title}-${index}`))}`,
    layerId,
    `${city.code}-AI-${String(index + 1).padStart(2, "0")}`,
    title,
    cleanAiText(item.desc, `${expandedStops.slice(0, 3).join("、")}会连成一段更贴近今天状态的城市探索。`, 96),
    expandedStops,
    durationText,
    cleanAiText(item.budget, budgetFallback, 16),
    cleanAiText(item.bestFor, mood.type, 18),
    normalizeDistance(item.distance, index),
    90 - index * 2 + Math.round(seededJitter(`${key}-hot-${index}`, 8))
  );
  return {
    ...routeItem,
    aiGenerated: true,
    matchLabel: routeMatchLabel(mood, layerId, index, context),
    matchSource: mood.title
  };
}

function normalizeStopList(value) {
  const list = Array.isArray(value) ? value : String(value || "").split(/[、,，>→\-]/);
  return uniqueStops(list.map((item) => cleanAiText(item, "", 28)).filter(Boolean));
}

function resolveLayerId(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  const direct = layers.find((layer) => layer.id === text || layer.name.toLowerCase() === text);
  if (direct) return direct.id;
  const aliases = {
    cafe: "coffee",
    coffee: "coffee",
    bar: "drink",
    drink: "drink",
    art: "art",
    museum: "art",
    book: "bookstore",
    reading: "bookstore",
    bookstore: "bookstore",
    music: "music",
    film: "cinema",
    movie: "cinema",
    cinema: "cinema",
    design: "fashion",
    fashion: "fashion",
    hidden: "quest",
    secret: "quest",
    quest: "quest",
    walk: "citywalk",
    citywalk: "citywalk",
    architecture: "architecture"
  };
  if (aliases[text]) return aliases[text];
  return layers.find((layer) => text.includes(layer.id) || text.includes(layer.name.toLowerCase()))?.id || "";
}

function cleanAiText(value, fallback, max = 80) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function normalizeDistance(value, index) {
  const number = Number.parseFloat(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(number) && number > 0 ? Number(number.toFixed(1)) : Number((1.2 + index * 0.45).toFixed(1));
}

function mockImageUrl(keywords, seed, width = 900, height = 700) {
  const keywordPath = String(keywords)
    .split(",")
    .map((item) => encodeURIComponent(item.trim()))
    .join(",");
  const lock = Math.abs(stableHash(seed)) % 90000 + 1000;
  return `https://loremflickr.com/${width}/${height}/${keywordPath}?lock=${lock}`;
}

function unsplashImage(photoId, width = 900, height = 700) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=82`;
}

function imageFromPool(pool, seed, width = 900, height = 700) {
  const list = pool?.length ? pool : unsplashPhotoIds.city;
  const index = Math.abs(stableHash(seed)) % list.length;
  return unsplashImage(list[index], width, height);
}

function cssImage(url) {
  return `url("${url}")`;
}

function photoStyle(url, variable = "--photo-url") {
  return `${variable}: ${cssImage(url)};`;
}

function photoForLayer(layerId, seed, cityKey = state.city, width = 900, height = 700) {
  if (unsplashPhotoIds[layerId]) return imageFromPool(unsplashPhotoIds[layerId], `${cityKey}-${layerId}-${seed}`, width, height);
  const keywords = `${cityImageKeywords[cityKey] || cityImageKeywords.shanghai},${layerImageKeywords[layerId] || "city"}`;
  return mockImageUrl(keywords, `${cityKey}-${layerId}-${seed}`, width, height);
}

function photoForRoute(routeItem, width = 900, height = 700) {
  if (routeItem?.isFeaturedPass && routeItem.benefits?.[0]) {
    return stopPhotoForPass(routeItem, routeItem.benefits[0], 0, width, height);
  }
  return routeItem.photo || photoForLayer(routeItem.layer, routeItem.id, state.city, width, height);
}

function photoForMood(mood, width = 900, height = 700) {
  const primaryLayer = mood.layers[0] || "coffee";
  return photoForLayer(primaryLayer, `mood-${mood.assetKey || mood.title || mood.id}`, state.city, width, height);
}

function cachedMediaForMood(mood) {
  return state.mediaCache[mood.assetKey] || "";
}

function visualForMood(mood, width = 900, height = 700) {
  return cachedMediaForMood(mood) || photoForMood(mood, width, height);
}

function applyMoodMedia(mood, target = dom.heroVisual) {
  const url = visualForMood(mood, 900, 900);
  target.style.setProperty("--hero-photo", cssImage(url));
  target.dataset.mediaKey = mood.assetKey;
  void resolveInspirationMedia(mood).then((resolvedUrl) => {
    if (!resolvedUrl) return;
    if (target.dataset.mediaKey === mood.assetKey) {
      target.style.setProperty("--hero-photo", cssImage(resolvedUrl));
      const resonancePhoto = dom.cityResonance.querySelector(".resonance-photo");
      const resonanceImage = dom.cityResonance.querySelector(".resonance-photo img");
      if (resonancePhoto) resonancePhoto.style.setProperty("--photo-url", cssImage(resolvedUrl));
      if (resonanceImage) resonanceImage.src = resolvedUrl;
    }
    document.querySelectorAll(`[data-mood-key="${cssEscapeValue(mood.assetKey)}"] .mood-thumb`).forEach((thumb) => {
      thumb.style.setProperty("--mood-thumb", cssImage(resolvedUrl));
    });
  });
}

async function resolveInspirationMedia(mood) {
  if (!mood?.assetKey) return "";
  if (state.mediaCache[mood.assetKey]) return state.mediaCache[mood.assetKey];
  if (state.mediaLoading[mood.assetKey]) return state.mediaLoading[mood.assetKey];
  const request = fetchInspirationMedia(mood)
    .then((url) => {
      if (url) state.mediaCache[mood.assetKey] = url;
      return url || "";
    })
    .catch(() => "")
    .finally(() => {
      delete state.mediaLoading[mood.assetKey];
    });
  state.mediaLoading[mood.assetKey] = request;
  return request;
}

async function fetchInspirationMedia(mood) {
  const hint = inspirationMediaHints[mood.title] || { query: mediaQueryFromTitle(mood.title), type: mood.id };
  if (hint.type === "music") {
    return await fetchItunesArtwork(hint.query) || await fetchWikipediaImage(hint.query, "en");
  }
  if (hint.type === "book") {
    return await fetchOpenLibraryCover(hint.query) || await fetchWikipediaImage(hint.query, "en");
  }
  return await fetchWikipediaImage(hint.query, "en") || await fetchWikipediaImage(hint.query, "zh");
}

async function fetchWikipediaImage(query, language = "en") {
  if (!query || typeof fetch !== "function") return "";
  const endpoint = `https://${language}.wikipedia.org/w/api.php`;
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: query,
    gsrlimit: "1",
    prop: "pageimages",
    piprop: "thumbnail|original",
    pithumbsize: "1200",
    pilicense: "any"
  });
  const response = await fetch(`${endpoint}?${params.toString()}`);
  if (!response.ok) return "";
  const data = await response.json();
  const page = Object.values(data.query?.pages || {})[0];
  return page?.thumbnail?.source || page?.original?.source || "";
}

async function fetchItunesArtwork(query) {
  if (!query || typeof fetch !== "function") return "";
  const params = new URLSearchParams({
    term: query,
    media: "music",
    entity: "song",
    limit: "1",
    country: "US"
  });
  const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`);
  if (!response.ok) return "";
  const data = await response.json();
  const artwork = data.results?.[0]?.artworkUrl100 || "";
  return artwork.replace("100x100bb", "1000x1000bb");
}

async function fetchOpenLibraryCover(query) {
  if (!query || typeof fetch !== "function") return "";
  const params = new URLSearchParams({ q: query, limit: "1", fields: "cover_i,title,author_name" });
  const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
  if (!response.ok) return "";
  const data = await response.json();
  const coverId = data.docs?.[0]?.cover_i;
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : "";
}

function mediaQueryFromTitle(title) {
  return String(title || "")
    .replace(/《|》|“|”|"/g, " ")
    .replace(/的.+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cssEscapeValue(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function photoForCity(cityKey, width = 900, height = 700) {
  return imageFromPool(cityPhotoIds[cityKey], `cover-${cityKey}`, width, height);
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function resetPrototypeStorageIfNeeded() {
  const savedVersion = localStorage.getItem(LOOP_DATA_VERSION_KEY);
  if (savedVersion === LOOP_DATA_VERSION) return;
  localStorage.removeItem(AUTH_USERS_KEY);
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.setItem(LOOP_DATA_VERSION_KEY, LOOP_DATA_VERSION);
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(user, remember) {
  const session = JSON.stringify({ id: user.id, savedAt: Date.now() });
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  (remember ? localStorage : sessionStorage).setItem(AUTH_SESSION_KEY, session);
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

function normalizeAccount(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidAccount(value) {
  const account = normalizeAccount(value);
  const digitCount = account.replace(/\D/g, "").length;
  return /^\S+@\S+\.\S+$/.test(account) || (/^\+?[\d\s-]{7,}$/.test(account) && digitCount >= 7);
}

function encodePassword(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function findUser(accountOrId, by = "account") {
  const value = by === "account" ? normalizeAccount(accountOrId) : accountOrId;
  return readUsers().find((user) => user[by] === value);
}

function updateUser(id, patch) {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) return { ...state.currentUser, ...patch };
  users[index] = { ...users[index], ...patch };
  saveUsers(users);
  return users[index];
}

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value));
}

function hydrateUserState(user) {
  state.featuredPasses = Array.isArray(user.featuredPasses) ? clonePlain(user.featuredPasses) : [];
  state.completedRouteIds = Array.isArray(user.completedRouteIds) ? clonePlain(user.completedRouteIds) : [];
  if (Array.isArray(user.records) && user.records.length) state.records = clonePlain(user.records);

  const savedExploration = user.explorationState;
  const routeItem = savedExploration?.active ? routeById(savedExploration.routeId, savedExploration.city || user.city) : null;
  if (!routeItem) {
    clearExplorationStateOnly();
    return;
  }
  state.explorationActive = true;
  state.explorationRoute = routeItem;
  state.explorationStartedAt = savedExploration.startedAt || Date.now();
  state.routeProgress = savedExploration.routeProgress || 0;
  state.routeStopFocus = savedExploration.routeStopFocus || state.routeProgress;
  state.photoTaken = Boolean(savedExploration.photoTaken);
}

function serializeExplorationState() {
  if (!state.explorationActive || !state.explorationRoute) return { active: false };
  return {
    active: true,
    routeId: state.explorationRoute.id,
    city: state.explorationRoute.city || state.city,
    routeProgress: state.routeProgress || 0,
    routeStopFocus: state.routeStopFocus || 0,
    photoTaken: Boolean(state.photoTaken),
    startedAt: state.explorationStartedAt || Date.now()
  };
}

function persistUserState() {
  if (!state.currentUser?.id) return;
  const user = updateUser(state.currentUser.id, {
    featuredPasses: clonePlain(state.featuredPasses),
    completedRouteIds: clonePlain(state.completedRouteIds),
    records: clonePlain(state.records),
    explorationState: serializeExplorationState(),
    updatedAt: new Date().toISOString()
  });
  state.currentUser = user;
}

function maskAccount(account) {
  if (!account) return "仅自己可见";
  if (account.includes("@")) {
    const [name, domain] = account.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  }
  const clean = account.replace(/\s/g, "");
  return clean.length > 7 ? `${clean.slice(0, 3)}****${clean.slice(-4)}` : account;
}

function setAuthMessage(message, tone = "muted") {
  dom.authMessage.textContent = message || "";
  dom.authMessage.dataset.tone = tone;
}

const roleRoutineOptions = {
  student: [
    ["campus", "校园生活"],
    ["flexible", "时间自由"],
    ["regular", "规律上课"]
  ],
  creative: [
    ["flexible", "项目制 / 弹性"],
    ["late", "经常晚归"],
    ["regular", "规律通勤"],
    ["travel", "常跑活动 / 出差"]
  ],
  tech: [
    ["regular", "规律通勤"],
    ["late", "经常加班晚归"],
    ["flexible", "弹性办公"],
    ["travel", "经常出差"]
  ],
  finance: [
    ["regular", "规律通勤"],
    ["late", "高强度晚归"],
    ["travel", "经常出差"],
    ["flexible", "弹性安排"]
  ],
  service: [
    ["late", "轮班 / 晚归"],
    ["regular", "固定班次"],
    ["flexible", "不固定休息"],
    ["travel", "跨店 / 外勤"]
  ],
  freelance: [
    ["flexible", "时间自由"],
    ["late", "夜间工作"],
    ["travel", "经常旅行"],
    ["regular", "自定规律"]
  ],
  other: [
    ["regular", "规律通勤"],
    ["flexible", "时间自由"],
    ["late", "经常晚归"],
    ["travel", "经常出差 / 旅行"]
  ]
};

function syncRoutineOptions(preferredValue = dom.registerRoutine?.value) {
  if (!dom.registerRole || !dom.registerRoutine) return;
  const options = roleRoutineOptions[dom.registerRole.value] || roleRoutineOptions.other;
  dom.registerRoutine.replaceChildren();
  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    dom.registerRoutine.append(option);
  });
  dom.registerRoutine.value = options.some(([value]) => value === preferredValue) ? preferredValue : options[0][0];
}

function switchAuthMode(mode) {
  state.authMode = mode;
  if (mode === "login" || mode === "reset") state.pendingRegistration = null;
  dom.loginForm.hidden = mode !== "login";
  dom.registerForm.hidden = mode !== "register";
  dom.profileForm.hidden = mode !== "profile";
  dom.interestForm.hidden = mode !== "interests";
  dom.resetForm.hidden = mode !== "reset";
  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authMode === mode);
  });
  setAuthMessage(mode === "reset" ? "在原型中可直接重设本机账号密码。" : "");
  dom.authGate.dataset.mode = mode;
  renderAuthCover(mode);
  if (mode === "profile") syncRoutineOptions(state.currentUser?.routine);
  if (mode === "interests") {
    renderRegisterInterestButtons();
    syncInterestButtons();
  }
  dom.authGate.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAuthCover(mode) {
  const coverCopy = {
    login: {
      eyebrow: "WELCOME",
      title: "先把你的城市回路留住。",
      body: "登录后，今日灵感、探索路线、打卡照片和年度记录会只保存在你的个人空间里。"
    },
    register: {
      eyebrow: "STEP 01",
      title: "先创建账号，别急着填偏好。",
      body: "账号创建成功后，再用首次设置补全城市、身份和兴趣。注册过程保持足够快。"
    },
    profile: {
      eyebrow: "STEP 02",
      title: "让 LOOP 认识你的日常。",
      body: "城市、身份和作息只用于推荐：一半贴近你，一半带你离开惯性路线。"
    },
    interests: {
      eyebrow: "STEP 03",
      title: "选择你想打开的城市入口。",
      body: "这些入口会影响首页灵感、地图路线和秘境推荐，之后可以随时调整。"
    },
    reset: {
      eyebrow: "RECOVERY",
      title: "把账号找回来。",
      body: "输入已注册账号和新密码，即可继续保留你的个人探索记录。"
    }
  };
  const copy = coverCopy[mode] || coverCopy.login;
  const eyebrow = dom.authGate.querySelector(".auth-cover .eyebrow");
  const paragraph = dom.authGate.querySelector(".auth-cover p:not(.eyebrow)");
  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  const title = document.getElementById("authTitle");
  if (title) title.textContent = copy.title;
  if (paragraph) paragraph.textContent = copy.body;
}

function syncInterestButtons() {
  if (!dom.registerInterestList) return;
  document.querySelectorAll("[data-register-interest]").forEach((button) => {
    button.classList.toggle("is-active", state.registerInterests.includes(button.dataset.registerInterest));
  });
  const allSelected = layers.every((layer) => state.registerInterests.includes(layer.id));
  if (dom.selectAllInterests) dom.selectAllInterests.textContent = allSelected ? "已全选" : "全选";
}

function renderRegisterInterestButtons() {
  if (!dom.registerInterestList) return;
  dom.registerInterestList.replaceChildren();
  layers.forEach((layer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.registerInterest = layer.id;
    button.innerHTML = `<span>${layer.symbol}</span>${layer.name}`;
    dom.registerInterestList.append(button);
  });
}

function setAuthenticatedUser(user, remember = true) {
  state.currentUser = user;
  state.city = user.city || state.city;
  hydrateUserState(user);
  saveSession(user, remember);
  if (!user.onboardingComplete) {
    dom.appFrame.hidden = true;
    dom.authGate.hidden = false;
    dom.registerName.value = user.name && user.name !== "城市探索者" ? user.name : "";
    if (dom.registerCity) dom.registerCity.value = user.city || state.city;
    if (dom.registerRole) dom.registerRole.value = user.role || "student";
    if (dom.registerRoutine) dom.registerRoutine.value = user.routine || "regular";
    state.registerInterests = user.interests?.length ? [...user.interests] : ["coffee"];
    switchAuthMode("profile");
    setAuthMessage("账号已创建，先完成首次设置。", "success");
    return;
  }
  dom.authGate.hidden = true;
  dom.appFrame.hidden = false;
  render();
  scrollToTop();
}

function showAuthGate(mode = "login") {
  state.currentUser = null;
  dom.appFrame.hidden = true;
  dom.authGate.hidden = false;
  switchAuthMode(mode);
}

function ensureDemoUser() {
  const existing = findUser(DEMO_ACCOUNT);
  if (existing?.demoDataVersion === LOOP_DATA_VERSION) return existing;
  const users = readUsers();
  if (existing) {
    const upgraded = demoUserSnapshot(existing);
    saveUsers(users.map((user) => user.id === existing.id ? upgraded : user));
    return upgraded;
  }
  const user = demoUserSnapshot({
    id: `loop-${Date.now()}`,
    createdAt: new Date().toISOString()
  });
  users.push(user);
  saveUsers(users);
  return user;
}

function initAuth() {
  const session = readSession();
  const user = session ? findUser(session.id, "id") : null;
  if (user) {
    setAuthenticatedUser(user, true);
    return;
  }
  clearSession();
  showAuthGate("login");
}

function loginWithCredentials(accountValue, passwordValue, remember = true) {
  const account = normalizeAccount(accountValue);
  if (!isValidAccount(account)) return setAuthMessage("请输入有效的邮箱或手机号。", "error");
  if (!passwordValue || passwordValue.length < 6) return setAuthMessage("密码至少需要 6 位。", "error");
  const user = account === DEMO_ACCOUNT && passwordValue === DEMO_PASSWORD
    ? ensureDemoUser()
    : findUser(account);
  if (!user || user.password !== encodePassword(passwordValue)) return setAuthMessage("账号或密码不正确。", "error");
  setAuthenticatedUser(user, remember);
  showToast("已登录。");
}

function screenshotScenarioFromURL() {
  try {
    return new URLSearchParams(window.location.search).get("loopScreenshotScenario") || "";
  } catch {
    return "";
  }
}

function knownScreenshotScenario(value) {
  return SCREENSHOT_SCENARIOS.includes(value) ? value : "";
}

function scrollProfileRecordsForScreenshot() {
  const stickyHead = document.querySelector(".profile-record-sticky-head");
  if (!stickyHead) return;
  const frameBox = dom.appFrame.getBoundingClientRect();
  const headBox = stickyHead.getBoundingClientRect();
  const targetTop = dom.appFrame.scrollTop + headBox.top - frameBox.top - 2;
  dom.appFrame.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
  syncRecordScrollFloat();
}

function afterScreenshotRender(callback) {
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

function applyScreenshotScenario() {
  const requestedScenario = screenshotScenarioFromURL().trim().toLowerCase();
  const scenario = knownScreenshotScenario(requestedScenario) || "login";
  if (!requestedScenario) return;
  document.documentElement.dataset.screenshotScenarioRequested = requestedScenario;

  if (scenario === "login") {
    clearSession();
    showAuthGate("login");
    document.documentElement.dataset.screenshotScenario = "login";
    return;
  }

  const demoUser = ensureDemoUser();
  setAuthenticatedUser(demoUser, true);
  if (scenario === "home") switchView("home");
  else if (scenario === "atlas") switchView("atlas");
  else switchView("folio");

  afterScreenshotRender(() => {
    if (scenario === "profile-records") scrollProfileRecordsForScreenshot();
    document.documentElement.dataset.screenshotScenario = scenario;
  });
}

function continueRegisterAccount() {
  const account = normalizeAccount(dom.registerAccount.value);
  const password = dom.registerPassword.value;
  const confirm = dom.registerConfirm.value;
  if (!isValidAccount(account)) return setAuthMessage("请输入有效的邮箱或手机号。", "error");
  if (findUser(account)) return setAuthMessage("这个账号已经注册过，可以直接登录。", "error");
  if (!password || password.length < 6) return setAuthMessage("密码至少需要 6 位。", "error");
  if (password !== confirm) return setAuthMessage("两次输入的密码不一致。", "error");
  if (!dom.agreeTerms.checked) return setAuthMessage("请先确认账号和记录保存说明。", "error");
  const users = readUsers();
  const user = {
    id: `loop-${Date.now()}`,
    name: "城市探索者",
    account,
    password: encodePassword(password),
    city: "shanghai",
    role: "",
    routine: "",
    interests: [],
    onboardingComplete: false,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveUsers(users);
  state.currentUser = user;
  saveSession(user, true);
  state.pendingRegistration = null;
  dom.registerName.value = "";
  dom.registerCity.value = "shanghai";
  state.registerInterests = ["coffee"];
  switchAuthMode("profile");
  setAuthMessage("账号已创建。再用 30 秒完成首次设置。", "success");
}

function continueRegisterProfile() {
  const name = dom.registerName.value.trim();
  if (!state.currentUser) return switchAuthMode("login");
  if (name.length < 2) return setAuthMessage("昵称至少需要 2 个字。", "error");
  const user = updateUser(state.currentUser.id, {
    name,
    city: dom.registerCity.value,
    role: dom.registerRole.value,
    routine: dom.registerRoutine.value
  });
  state.currentUser = user;
  state.city = user.city || state.city;
  switchAuthMode("interests");
}

function registerAccount() {
  if (!state.currentUser) return switchAuthMode("login");
  if (!state.registerInterests.length) return setAuthMessage("至少选择一个想探索的入口。", "error");
  const user = updateUser(state.currentUser.id, {
    interests: [...state.registerInterests],
    onboardingComplete: true,
    updatedAt: new Date().toISOString()
  });
  state.currentUser = user;
  state.pendingRegistration = null;
  setAuthenticatedUser(user, true);
  showWelcomeBurst();
  showToast("首次设置已完成。");
}

function closeFirstSetup() {
  switchAuthMode("login");
  setAuthMessage("首次设置进度已保留，下次登录会继续。", "success");
}

function resetPassword() {
  const account = normalizeAccount(dom.resetAccount.value);
  const password = dom.resetPassword.value;
  if (!isValidAccount(account)) return setAuthMessage("请输入已注册的邮箱或手机号。", "error");
  if (!password || password.length < 6) return setAuthMessage("新密码至少需要 6 位。", "error");
  const users = readUsers();
  const index = users.findIndex((user) => user.account === account);
  if (index < 0) return setAuthMessage("没有找到这个账号。", "error");
  users[index] = { ...users[index], password: encodePassword(password), updatedAt: new Date().toISOString() };
  saveUsers(users);
  dom.loginAccount.value = account;
  dom.loginPassword.value = "";
  switchAuthMode("login");
  setAuthMessage("密码已更新，可以重新登录。", "success");
}

function logout() {
  clearSession();
  resetRevealState();
  clearAiRecommendations();
  clearExploration();
  state.view = "home";
  state.pendingRegistration = null;
  showAuthGate("login");
  showToast("已退出登录。");
}

function currentCity() {
  return cities[state.city];
}

function currentLayer() {
  return layers.find((item) => item.id === state.layer) || layers[0];
}

function routeById(id, preferredCity = state.city) {
  const featured = featuredRouteById(id);
  if (featured) return featured;
  const cityKeys = [preferredCity, state.city, ...Object.keys(cities)].filter(Boolean);
  for (const cityKey of [...new Set(cityKeys)]) {
    const city = cities[cityKey];
    if (!city) continue;
    const direct = city.routes.find((item) => item.id === id);
    if (direct) return direct;
    for (const layer of layers) {
      const route = routesForLayer(city, layer.id, 14).find((item) => item.id === id);
      if (route) return route;
    }
  }
  return null;
}

function selectedRoute() {
  return routeById(state.selectedRouteId) || recommendedRoutes()[0] || currentCity().routes[0];
}

function render() {
  renderHeader();
  renderViews();
  renderOngoingExploration();
  renderHome();
  renderAtlas();
  renderSecrets();
  renderProfile();
}

function renderHeader() {
  const city = currentCity();
  dom.cityEntryName.textContent = city.name;
  dom.cityEntryLine.textContent = city.line;
}

function renderViews() {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.id === `view-${state.view}`);
  });
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === state.view);
  });
}

function renderHome() {
  const city = currentCity();
  const moodList = personalizedMoods();
  const mood = state.inspirationSelected
    ? moodList.find((item) => item.id === state.mood) || moodList[0]
    : moodList[state.carouselIndex % moodList.length] || moodList[0];
  if (state.mood !== mood.id) state.mood = mood.id;
  dom.heroVisual.style.setProperty("--city-art", mood.art);
  applyMoodMedia(mood);
  dom.heroVisual.dataset.mood = mood.id;
  dom.homeKicker.textContent = `${mood.type} / ${mood.title}`;
  dom.homeTitle.textContent = mood.type;
  dom.homeIntro.textContent = mood.meta;
  dom.contextRow.replaceChildren();
  dom.contextRow.hidden = true;

  dom.moodGrid.replaceChildren();
  moodList.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = item.id === state.mood ? "is-active" : "";
    button.dataset.moodId = item.id;
    button.dataset.moodKey = item.assetKey;
    button.style.setProperty("--mood-thumb", cssImage(visualForMood(item, 360, 260)));
    button.setAttribute("aria-pressed", String(item.id === state.mood && state.inspirationSelected));
    button.innerHTML = `
      <i class="mood-thumb" aria-hidden="true"></i>
      <span>${item.type}</span>
      <strong>${item.title}</strong>
      <small>${item.meta}</small>
    `;
    void resolveInspirationMedia(item);
    button.addEventListener("click", () => {
      state.mood = item.id;
      state.inspirationSelected = true;
      state.recommendationRound += 1;
      state.userSignalVersion += 1;
      resetRevealState();
      state.carouselIndex = moodList.findIndex((moodItem) => moodItem.id === item.id);
      state.selectedRouteId = null;
      state.disliked = 0;
      renderHome();
      void requestAiRecommendations("selection");
    });
    dom.moodGrid.append(button);
  });
  requestAnimationFrame(() => syncMoodRailFocus(state.mood));

  const inspiration = mood;
  const context = recommendationContext(city, inspiration);
  const aiPack = aiPackForCurrentContext();
  const closeLayers = recommendedLayerSequence(city, inspiration, context, 5)
    .slice(0, 3)
    .map((item) => layerName(item).name)
    .join(" / ");
  const inspirationStatus = state.aiLoading
    ? "正在生成新的城市路线。"
    : aiPack
      ? `已生成 ${aiPack.routes.length} 条新的城市路线。`
      : `今天更适合靠近：${closeLayers}。`;
  dom.inspirationCard.innerHTML = `
    <span>${state.inspirationSelected ? "今日倾向" : liveFeedFor(state.city).title}</span>
    <strong>${inspiration.line}</strong>
    <small>${state.inspirationSelected ? inspirationStatus : "从音乐、阅读、电影、剧集、设计或艺术家里选一个今天靠近的入口。"}</small>
  `;

  const resonance = aiPack?.spot || mood.spot || currentMoodSpot(mood.id);
  const resonancePhoto = visualForMood(mood, 360, 360);
  dom.cityResonance.innerHTML = `
    <div class="resonance-photo" style="${photoStyle(resonancePhoto)}">
      <img class="mock-photo" src="${resonancePhoto}" alt="${resonance.title}" loading="lazy" />
    </div>
    <div>
      <span>${resonance.kicker}</span>
      <strong>${resonance.title}</strong>
      <p>${resonance.desc}</p>
    </div>
    <div class="resonance-meta">
      <span>${city.name}</span>
      <span>${resonance.area}</span>
      <span>${resonance.time}</span>
    </div>
    <div class="resonance-tags">${resonance.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
  `;

  dom.recommendCarousel.replaceChildren();
  const cueTitle = dom.swipeUpCue.querySelector("strong");
  const cueMeta = dom.swipeUpCue.querySelector("small");
  const cueReady = true;
  if (cueTitle) cueTitle.textContent = "向下滑动生成地图";
  if (cueMeta) cueMeta.textContent = "当前灵感会自动生成路线";
  dom.swipeUpCue.hidden = state.routesRevealed || state.revealAnimating;
  dom.swipeUpCue.classList.toggle("is-ready", cueReady);
  dom.swipeUpCue.setAttribute("aria-disabled", "false");
  dom.routeReveal.hidden = !state.revealAnimating;
  dom.routeReveal.classList.toggle("is-opening", state.revealAnimating);
  dom.recommendSection.hidden = !state.routesRevealed;
  dom.recommendCarousel.hidden = !state.routesRevealed;
  if (state.routesRevealed) {
    const routeItems = recommendedRoutes(5);
    dom.recommendTitle.textContent = "今日路线";
    dom.recommendHint.textContent = state.aiLoading
      ? "新的路线还在生成，先显示当前最合适的城市探索。"
      : `${mood.type}里的灵感已经展开，先看氛围，再决定今天要不要出门。`;
    routeItems.forEach((item, index) => {
      dom.recommendCarousel.append(recommendCard(item, index + 1, mood));
    });
  }
}

function recommendCard(routeItem, index, mood) {
  const selected = state.selectedRouteId === routeItem.id;
  const routePhoto = photoForRoute(routeItem, 720, 480);
  const ordinaryActive = isOrdinaryRouteActive(routeItem);
  const card = document.createElement("article");
  card.className = `recommend-card${selected ? " is-selected" : ""}`;
  card.innerHTML = `
    <div class="recommend-art" style="--route-art: ${routeArt[routeItem.layer] || routeArt.default}; ${photoStyle(routePhoto)}">
      <img class="mock-photo" src="${routePhoto}" alt="${routeItem.title}" loading="lazy" />
      <span>${String(index).padStart(2, "0")}</span>
    </div>
    <div class="recommend-copy">
      <span>${routeItem.matchLabel}</span>
      <h3>${routeItem.title}</h3>
      <p>${routeItem.desc}</p>
      <div class="route-stop-line" aria-label="路线地点">
        ${routeItem.stops.slice(0, 3).map((stop) => `<span>${stop}</span>`).join("")}
      </div>
      <div class="loop-tags">
        <span>${routeItem.stops.length}站</span>
        <span>${routeItem.duration}</span>
        <span>${routeItem.budget}</span>
        <span>${routeItem.distance}km</span>
      </div>
    </div>
    <div class="recommend-actions">
      <button class="ghost-button" type="button">查看详情</button>
      <button class="card-button${ordinaryActive ? " is-paid" : ""}" type="button">${ordinaryActive ? "继续下一站" : "开启探索"}</button>
    </div>
  `;
  const [detail, action] = card.querySelectorAll("button");
  detail.addEventListener("click", () => {
    state.selectedRouteId = routeItem.id;
    openRouteFromCard(routeItem);
  });
  action.addEventListener("click", () => {
    state.selectedRouteId = routeItem.id;
    if (ordinaryActive) openRouteFromCard(routeItem);
    else startExploration(routeItem);
  });
  return card;
}

function recommendedRoutes(limit = 5) {
  const aiPack = aiPackForCurrentContext();
  const localRoutes = localRecommendedRoutes(limit);
  if (!aiPack?.routes?.length) return localRoutes;
  const visitedStops = visitedStopSet();
  const merged = [];
  const used = new Set();
  [...aiPack.routes, ...localRoutes].forEach((item) => {
    if (routeHasVisitedStop(item, visitedStops)) return;
    const key = `${item.title}-${item.stops?.slice(0, 2).join("/")}`;
    if (used.has(key)) return;
    used.add(key);
    merged.push(item);
  });
  return merged.slice(0, limit);
}

function visitedStopSet(cityKey = state.city) {
  const stops = new Set();
  state.records.forEach((record) => {
    if (record.city && record.city !== cityKey) return;
    (record.stops || []).forEach((stop) => stops.add(normalizeStop(stop)));
  });
  if (state.explorationActive && state.explorationRoute) {
    const routeCity = state.explorationRoute.city || cityKey;
    if (routeCity === cityKey) {
      const progress = Math.min(Math.max(state.routeProgress || 0, 0), Math.max((state.explorationRoute.stops || []).length - 1, 0));
      (state.explorationRoute.stops || []).slice(0, progress + 1).forEach((stop) => stops.add(normalizeStop(stop)));
    }
  }
  return stops;
}

function routeHasVisitedStop(routeItem, visitedStops = visitedStopSet()) {
  if (!routeItem || routeItem.isFeaturedPass) return false;
  return (routeItem.stops || []).some((stop) => visitedStops.has(normalizeStop(stop)));
}

function routeRecommendationEligible(routeItem, visitedStops = visitedStopSet()) {
  return Boolean(routeItem && !routeItem.isFeaturedPass && !isRouteCompleted(routeItem) && !routeHasVisitedStop(routeItem, visitedStops));
}

function localRecommendedRoutes(limit = 5) {
  const city = currentCity();
  const mood = moodById(state.mood);
  const context = recommendationContext(city, mood);
  const visitedStops = visitedStopSet();
  const usedRouteIds = new Set();
  const usedStops = new Set(visitedStops);
  return recommendedLayerSequence(city, mood, context, limit)
    .map((layerId, index) => recommendationForLayer(city, mood, layerId, index, context, usedRouteIds, usedStops, visitedStops))
    .filter(Boolean);
}

function recommendationForLayer(city, mood, layerId, index, context, usedRouteIds, usedStops, visitedStops = new Set()) {
  const candidates = routesForLayer(city, layerId, 12)
    .filter((item) => item.layer === layerId && !usedRouteIds.has(item.id) && routeRecommendationEligible(item, visitedStops))
    .map((item) => ({
      item,
      score: recommendationRouteScore(item, mood, context) - stopOverlapScore(item, usedStops) * 22
    }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
  const pickIndex = candidates.length ? (index + state.recommendationRound) % Math.min(candidates.length, 7) : 0;
  const routeItem = candidates.length ? candidates[pickIndex] : generatedRoute(layerId);
  usedRouteIds.add(routeItem.id);
  const enriched = enrichRecommendedRoute(routeItem, mood, layerId, context, candidates.length === 0, usedStops, index, { strictUsedStops: Boolean(visitedStops.size) });
  enriched.stops.forEach((stop) => usedStops.add(normalizeStop(stop)));
  return enriched;
}

function enrichRecommendedRoute(routeItem, mood, layerId, context, preferLayerPlaces = false, usedStops = new Set(), index = 0, options = {}) {
  const requiredStops = routeStopsForLayer(layerId, routeItem.stops, {
    routeItem,
    preferLayerPlaces,
    usedStops,
    strictUsedStops: Boolean(options.strictUsedStops)
  });
  return {
    ...routeItem,
    stops: requiredStops,
    matchLabel: routeMatchLabel(mood, layerId, index, context),
    matchSource: mood.title,
    bestFor: recommendationBestFor(mood, layerId, routeItem.bestFor),
    desc: recommendationReason(mood, layerId, routeItem, context)
  };
}

function stopOverlapScore(routeItem, usedStops) {
  return (routeItem.stops || []).reduce((score, stop) => score + (usedStops.has(normalizeStop(stop)) ? 1 : 0), 0);
}

function routeStopsForLayer(layerId, stops = [], options = {}) {
  const { routeItem = {}, preferLayerPlaces = false, usedStops = new Set(), strictUsedStops = false, city = currentCity(), cityKey = state.city } = options;
  const cleanStops = stops.filter(Boolean);
  const layerPlaces = city.places
    .filter((placeItem) => placeItem.layer === layerId)
    .map((placeItem) => placeItem.title);
  const poolPlaces = poiPoolForLayer(cityKey, layerId);
  const backupPlaces = city.places
    .filter((placeItem) => placeItem.layer !== layerId)
    .map((placeItem) => placeItem.title);
  const orderedStops = preferLayerPlaces
    ? [...poolPlaces, ...layerPlaces, ...backupPlaces, ...cleanStops]
    : [...cleanStops, ...poolPlaces, ...layerPlaces, ...backupPlaces];
  const fallbackStops = [
    `${layerName(layerId).name}停留`,
    "街区观察",
    "拍照记录",
    "短暂停留",
    "步行收尾",
    "回看今天"
  ];
  return selectStops([...orderedStops, ...fallbackStops], usedStops, targetStopCount(routeItem), strictUsedStops);
}

function uniqueStops(stops) {
  const seen = new Set();
  return stops.filter((stop) => {
    const key = normalizeStop(stop);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function selectStops(stops, usedStops, targetCount, strictUsedStops = false) {
  const unique = uniqueStops(stops);
  const fresh = unique.filter((stop) => !usedStops.has(normalizeStop(stop)));
  const picked = fresh.slice(0, targetCount);
  if (strictUsedStops) return picked;
  if (picked.length >= targetCount) return picked;
  unique.forEach((stop) => {
    if (picked.length < targetCount && !picked.includes(stop)) picked.push(stop);
  });
  return picked.slice(0, targetCount);
}

function targetStopCount(routeItem) {
  const hours = durationNumber(routeItem.duration || "2h");
  if (hours >= 4) return 6;
  if (hours >= 2.5) return 5;
  return 4;
}

function normalizeStop(stop) {
  const compact = String(stop || "")
    .trim()
    .toLowerCase()
    .replace(/[\s.·・'’\-_/]/g, "")
    .replace(/上海|成都|阿布扎比|abudhabi|china|中国/g, "");
  const aliases = [
    ["jboroski", "jboroski"],
    ["fotografiska", "fotografiska"],
    ["arabica", "arabica"],
    ["opscafe", "opscafe"],
    ["ops", "opscafe"],
    ["jzclub", "jzclub"],
    ["bluenote", "bluenote"],
    ["young剧场", "youngtheatre"],
    ["西岸美术馆", "westbundmuseum"],
    ["龙美术馆", "longmuseum"],
    ["思南书局", "sinanbooks"],
    ["茑屋书店", "tsutayabooks"],
    ["武康大楼", "wukangmansion"],
    ["上生新所", "columbiacircle"],
    ["小酒馆芳沁店", "littlebarfangqin"],
    ["nuspace", "nuspace"],
    ["a4美术馆", "a4artmuseum"],
    ["louvreabudhabi", "louvreabudhabi"],
    ["421artscampus", "421artscampus"],
    ["theartscenteratnyuad", "nyuadartscenter"],
    ["berkleeabudhabi", "berkleeabudhabi"],
    ["theespressolab", "theespressolab"]
  ];
  return aliases.find(([needle]) => compact.includes(needle))?.[1] || compact;
}

function recommendationContext(city = currentCity()) {
  const userInterests = state.currentUser?.interests?.length ? state.currentUser.interests : state.registerInterests;
  const hour = new Date().getHours();
  const weather = city.weather || "";
  const feed = liveFeedFor(state.city, state.feedVersion);
  const activeMood = moodById(state.mood);
  return {
    userInterests,
    role: state.currentUser?.role || "student",
    routine: state.currentUser?.routine || "regular",
    hour,
    weather,
    feed,
    liveLayers: feed.layers,
    liveAreas: feed.areas,
    seed: `${state.city}-${state.mood}-${activeMood.assetKey || activeMood.title}-${state.feedVersion}-${state.recommendationRound}-${state.userSignalVersion}-${state.currentUser?.id || "guest"}`,
    timeLayers: timeLayerHints(hour),
    weatherLayers: weatherLayerHints(weather),
    contrastLayers: contrastLayerHints(state.currentUser?.role || "student", state.currentUser?.routine || "regular")
  };
}

function timeLayerHints(hour) {
  if (hour < 10) return ["coffee", "wellness", "architecture"];
  if (hour < 15) return ["bookstore", "art", "market", "coffee"];
  if (hour < 19) return ["art", "fashion", "coffee", "quest"];
  return ["drink", "music", "theatre", "night", "cinema"];
}

function weatherLayerHints(weather) {
  if (/雨|阴|云/.test(weather)) return ["bookstore", "cinema", "coffee", "art"];
  if (/晴|热|31|32|33|34|35/.test(weather)) return ["art", "bookstore", "coffee", "wellness"];
  return ["quest", "architecture", "market"];
}

function contrastLayerHints(role, routine) {
  const byRole = {
    student: ["theatre", "art", "coffee", "workshop"],
    creative: ["architecture", "market", "outdoor", "foodie"],
    tech: ["art", "tea", "photography", "workshop"],
    finance: ["quest", "vintage", "music", "wellness"],
    service: ["bookstore", "cinema", "tea", "photography"],
    freelance: ["market", "boardgame", "cycling", "workshop"],
    other: ["quest", "art", "coffee", "market"]
  };
  const byRoutine = {
    regular: ["night", "music", "drink", "comedy"],
    late: ["wellness", "tea", "bookstore", "outdoor"],
    flexible: ["cycling", "market", "photography", "workshop"],
    campus: ["vintage", "boardgame", "comedy", "climb"],
    travel: ["architecture", "foodie", "quest", "coffee"]
  };
  return [...(byRole[role] || byRole.other), ...(byRoutine[routine] || [])];
}

function moodCatalog() {
  return moods.map((base, index) => hydrateMood(base, index));
}

function moodById(id) {
  const catalog = moodCatalog();
  return catalog.find((item) => item.id === id) || catalog[0] || moods[0];
}

function hydrateMood(base, index = 0) {
  const pool = inspirationPoolFor(base.id);
  if (!pool.length) return base;
  const profileSeed = [
    state.city,
    base.id,
    state.currentUser?.role || "guest",
    state.currentUser?.routine || "unknown",
    state.currentUser?.interests?.join("-") || state.registerInterests.join("-"),
    index
  ].join("|");
  const entry = pool[(Math.abs(stableHash(profileSeed)) + state.feedVersion) % pool.length];
  return {
    ...base,
    ...entry,
    id: base.id,
    type: base.type,
    art: entry.art || base.art,
    baseTitle: base.title,
    assetKey: `${state.city}-${base.id}-${state.feedVersion}-${entry.title}`
  };
}

function inspirationPoolFor(moodId) {
  const defaultPool = inspirationPools.default?.[moodId] || [];
  const cityPool = inspirationPools[state.city]?.[moodId] || [];
  return [...cityPool, ...defaultPool];
}

function personalizedMoods() {
  const city = currentCity();
  const context = recommendationContext(city);
  return moodCatalog().sort((a, b) => moodScore(b, context) - moodScore(a, context));
}

function moodRankSeed(context) {
  return [
    state.city,
    state.feedVersion,
    state.currentUser?.id || "guest",
    context.role,
    context.routine,
    context.userInterests.join("-")
  ].join("|");
}

function moodScore(mood, context) {
  const preferred = new Set([...context.userInterests, ...context.timeLayers, ...context.weatherLayers, ...context.contrastLayers, ...context.liveLayers]);
  return mood.layers.reduce((score, layerId) => score + (preferred.has(layerId) ? 8 : 2), 0) + seededJitter(`${moodRankSeed(context)}-${mood.id}`, 5);
}

function recommendedLayerSequence(city, mood, context, limit = 5) {
  const layerIds = layers.map((item) => item.id);
  const scoredLayers = layerIds
    .filter((layerId) => cityLayerAvailable(city, layerId))
    .map((layerId) => ({ id: layerId, score: layerRecommendationScore(city, mood, context, layerId) }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.id);
  return uniqueStops([...mood.layers, ...context.liveLayers, ...context.userInterests, ...context.contrastLayers, ...context.timeLayers, ...context.weatherLayers, ...scoredLayers])
    .filter((layerId) => cityLayerAvailable(city, layerId))
    .slice(0, limit);
}

function cityLayerAvailable(city, layerId) {
  return Boolean(
    city.routes.some((item) => item.layer === layerId) ||
    city.places.some((item) => item.layer === layerId) ||
    poiPoolForLayer(state.city, layerId).length
  );
}

function layerRecommendationScore(city, mood, context, layerId) {
  let score = 0;
  if (mood.layers.includes(layerId)) score += 80;
  if (context.liveLayers.includes(layerId)) score += 42;
  if (context.userInterests.includes(layerId)) score += 32;
  if (context.contrastLayers.includes(layerId)) score += 24;
  if (context.timeLayers.includes(layerId)) score += 18;
  if (context.weatherLayers.includes(layerId)) score += 14;
  score += city.routes.filter((item) => item.layer === layerId).length * 6;
  score += city.places.filter((item) => item.layer === layerId).length * 2;
  return score + seededJitter(`${context.seed}-layer-${layerId}`, 12);
}

function recommendationRouteScore(routeItem, mood, context) {
  let score = routeItem.hot || 0;
  if (mood.layers.includes(routeItem.layer)) score += 80;
  if (context.liveLayers.includes(routeItem.layer)) score += 38;
  if (context.userInterests.includes(routeItem.layer)) score += 28;
  if (context.contrastLayers.includes(routeItem.layer)) score += 20;
  if (context.timeLayers.includes(routeItem.layer)) score += 16;
  if (context.weatherLayers.includes(routeItem.layer)) score += 12;
  if (routeItem.stops?.some((stop) => context.liveAreas.some((area) => String(stop).includes(area)))) score += 18;
  score -= Math.min(routeItem.distance || 0, 8) * 1.4;
  return score + seededJitter(`${context.seed}-route-${routeItem.id}`, 16);
}

function recommendationBestFor(mood, layerId, fallback) {
  const layer = layerName(layerId).name;
  const map = {
    music: `像 ${topicTitle(mood)} 一样移动`,
    reading: `把${layer}当成一页城市文本`,
    film: `用${layer}延长电影感`,
    series: `让${layer}接住今天的节奏`,
    design: `从${layer}看见尺度和触感`,
    artist: `靠近${layer}里的光和线索`
  };
  return map[mood.id] || fallback;
}

function recommendationReason(mood, layerId, routeItem, context) {
  const stops = routeItem.stops || [];
  if (!stops.length) return routeItem.desc;
  const layer = layerName(layerId).name;
  const templates = [
    `从「${topicTitle(mood)}」的${mood.meta.split("、")[0] || "气质"}出发，先到 ${stops[0]}，再把${layer}、街区和短暂停留串起来。`,
    `${stops[0]}负责进入状态，${stops[1] || stops[0]}负责换一个视角，最后留一段路给今天的心情收尾。`,
    `这条线不追热闹，会把 ${stops.slice(0, 3).join("、")} 放成一段更私人、更有画面感的城市移动。`,
    `适合想离开惯性路线的时候走：从${layer}开始，但中途会切到更日常的街角和停留点。`
  ];
  return templates[Math.abs(stableHash(`${context.seed}-${routeItem.id}-${layerId}`)) % templates.length];
}

function routeMatchLabel(mood, layerId, index, context) {
  const layer = layerName(layerId).name;
  const labels = [
    `来自 ${topicTitle(mood)}`,
    `${layer} / ${context.feed.title}`,
    `${mood.meta.split("、")[0] || mood.type}路线`,
    `第 ${index + 1} 个城市切片`,
    `${layer}里的反日常`
  ];
  return labels[Math.abs(stableHash(`${context.seed}-${layerId}-${index}`)) % labels.length];
}

function topicTitle(mood) {
  return String(mood?.title || "")
    .replace(/^《(.+)》$/, "$1")
    .replace(/ 的.+$/, "")
    .slice(0, 18);
}

function currentMoodSpot(moodId) {
  return cityMoodSpots[state.city]?.[moodId] || cityMoodSpots.shanghai[moodId] || cityMoodSpots.shanghai.music;
}

function renderAtlas() {
  const city = currentCity();
  const layer = currentLayer();
  dom.atlasTitle.textContent = `${city.name}兴趣地图`;
  dom.atlasIntro.textContent = layer.id === "featured"
    ? "城市通行证像一本可以走进现实的城市特刊：主题路线、顺路规划和到店权益会一起出现。"
    : `${layer.name}里收着适合出门的地点和路线，可以按热度、时间、距离和花销慢慢挑。`;
  dom.atlasNumber.textContent = city.number;
  dom.atlasFeatureTitle.textContent = layer.id === "featured" ? "城市通行证" : `${layer.name}地图`;
  dom.atlasFeatureSub.textContent = layer.desc;
  dom.atlasMap.style.setProperty("--city-art", city.art);
  const [a, b, c] = city.districts;
  dom.districtA.textContent = a;
  dom.districtB.textContent = b;
  dom.districtC.textContent = c;

  dom.layerTabs.classList.toggle("is-collapsed", !state.filtersOpen);
  dom.filterToggle.textContent = state.filtersOpen ? "收起" : "展开全部";
  dom.layerTabs.replaceChildren();
  const visibleLayers = state.filtersOpen ? layers : layers.slice(0, 8);
  visibleLayers.forEach((item) => {
    const button = document.createElement("button");
    button.className = [
      item.id === state.layer ? "is-active" : "",
      featuredLayerVisual(item)
    ].filter(Boolean).join(" ");
    button.type = "button";
    button.innerHTML = `<span>${item.symbol}</span>${item.name}`;
    button.addEventListener("click", () => {
      state.layer = item.id;
      state.recommendationRound += 1;
      state.userSignalVersion += 1;
      renderAtlas();
    });
    dom.layerTabs.append(button);
  });

  dom.sortRow.replaceChildren();
  sortOptions.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = item.id === state.sort ? "is-active" : "";
    button.textContent = item.label;
    button.addEventListener("click", () => {
      state.sort = item.id;
      renderAtlas();
    });
    dom.sortRow.append(button);
  });

  dom.pinLayer.replaceChildren();
  city.places.forEach((item) => {
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = `map-pin${item.layer !== state.layer && !["quest", "featured"].includes(state.layer) ? " is-muted" : ""}`;
    pin.dataset.layer = item.layer;
    pin.style.left = `${item.x}%`;
    pin.style.top = `${item.y}%`;
    pin.textContent = layerName(item.layer).symbol;
    pin.setAttribute("aria-label", item.title);
    pin.addEventListener("click", () => showToast(`${item.title}：${item.desc}`));
    dom.pinLayer.append(pin);
  });

  dom.routeList.replaceChildren();
  sortedRoutes().forEach((item, index) => {
    dom.routeList.append(routeCard(item, index + 1));
  });
}

function featuredLayerVisual(item) {
  return item.id === "featured" ? "is-featured-layer" : "";
}

function isOrdinaryRouteActive(routeItem) {
  return Boolean(routeItem && !routeItem.isFeaturedPass && state.explorationActive && state.explorationRoute?.id === routeItem.id);
}

function ordinaryRouteCardActionText(routeItem) {
  if (isOrdinaryRouteActive(routeItem)) return "继续下一站";
  return "查看路线";
}

function openRouteFromCard(routeItem) {
  openRouteDetail(routeItem, isOrdinaryRouteActive(routeItem) ? "active" : "preview");
}

function routeCard(routeItem, index) {
  const routePhoto = photoForRoute(routeItem, 780, 480);
  const card = document.createElement("article");
  const pass = routeItem.isFeaturedPass ? getFeaturedPass(routeItem.id) : null;
  const passStatus = pass ? featuredPassStatus(pass) : "";
  const ordinaryActive = isOrdinaryRouteActive(routeItem);
  card.className = [
    "loop-card",
    "route-result-card",
    routeItem.isFeaturedPass ? "featured-pass-card" : "",
    pass ? "is-owned" : "",
    ordinaryActive ? "is-active-route" : ""
  ].filter(Boolean).join(" ");
  const cardMeta = routeItem.isFeaturedPass
    ? `<span>${routeItem.benefits.length}家权益</span><span>${routeItem.validDays}天有效</span><span>${routeItem.distance}km</span><span>${pass ? passStatusLabel(passStatus) : `原价 ${routeItem.originalPrice}`}</span>`
    : `<span>${routeItem.duration}</span><span>${routeItem.distance}km</span><span>${routeItem.budget}</span><span>热度 ${routeItem.hot}</span>`;
  card.innerHTML = `
    <div class="loop-image" style="--route-art: ${routeArt[routeItem.layer] || routeArt.default}; ${photoStyle(routePhoto)}">
      <img class="mock-photo" src="${routePhoto}" alt="${routeItem.title}" loading="lazy" />
      <span class="loop-index">${String(index).padStart(2, "0")}</span>
      ${pass ? `<span class="pass-owned">${passStatusLabel(passStatus)}</span>` : ""}
    </div>
    <div class="loop-card-head">
      <span class="loop-type">${layerName(routeItem.layer).name}</span>
      <span class="route-code">${routeItem.code}</span>
    </div>
    ${routeItem.isFeaturedPass
      ? `<div class="pass-card-title-row"><h3>${routeItem.title}</h3><strong><small>通行证价</small>${routeItem.price}</strong></div><small class="pass-issue">${routeItem.issue}</small>`
      : `<h3>${routeItem.title}</h3>`}
    <p>${routeItem.desc}</p>
    <div class="loop-tags">${cardMeta}</div>
    <button class="card-button${passStatus === "active" || ordinaryActive ? " is-paid" : ""}" type="button">${routeItem.isFeaturedPass ? featuredPassCardActionText(passStatus) : ordinaryRouteCardActionText(routeItem)}</button>
  `;
  card.querySelector("button").addEventListener("click", () => openRouteFromCard(routeItem));
  return card;
}

function sortedRoutes() {
  const city = currentCity();
  const visitedStops = visitedStopSet();
  const list = (state.layer === "featured"
    ? featuredRoutesForCity(state.city)
    : routesForLayer(city, state.layer, 14).filter((route) => routeRecommendationEligible(route, visitedStops))).slice(0, 12);
  const mood = moodById(state.mood);
  const context = recommendationContext(city, mood);
  return [...list].sort((a, b) => {
    if (state.sort === "near" || state.sort === "short") return a.distance - b.distance;
    if (state.sort === "budget") return priceNumber(a.budget) - priceNumber(b.budget);
    if (state.sort === "hot") return b.hot - a.hot;
    if (state.sort === "time") return durationNumber(a.duration) - durationNumber(b.duration);
    return recommendationRouteScore(b, mood, context) - recommendationRouteScore(a, mood, context);
  });
}

function isRouteCompleted(routeItem) {
  return Boolean(routeItem && !routeItem.isFeaturedPass && state.completedRouteIds.includes(routeItem.id));
}

function featuredRoutesForCity(cityKey = state.city) {
  return featuredPassMaps[cityKey] || featuredPassMaps.shanghai || [];
}

function featuredRouteById(routeId) {
  return Object.values(featuredPassMaps).flat().find((item) => item.id === routeId);
}

function getFeaturedPass(routeId) {
  return state.featuredPasses.find((pass) => pass.routeId === routeId);
}

function featuredPassStatus(pass) {
  if (!pass) return "";
  if (!pass.status) pass.status = "active";
  if (pass.status === "active" && isFeaturedPassFullyRedeemed(pass)) pass.status = "completed";
  if (pass.status === "active" && isFeaturedPassPastExpiry(pass)) completeExpiredFeaturedPass(pass);
  return pass.status;
}

function isFeaturedPassFullyRedeemed(pass, routeItem = featuredRouteById(pass?.routeId)) {
  return Boolean(pass && routeItem?.benefits?.length && (pass.redeemed?.length || 0) >= routeItem.benefits.length);
}

function isFeaturedPassPastExpiry(pass) {
  return Boolean(pass?.expiresAt && Date.now() > pass.expiresAt);
}

function completeExpiredFeaturedPass(pass) {
  const completedAt = Date.now();
  pass.status = "completed";
  pass.completedAt = pass.completedAt || completedAt;
  pass.expiredCompletedAt = pass.expiredCompletedAt || pass.completedAt;
}

function passStatusLabel(status) {
  const labels = {
    active: "已购买",
    completed: "已完成",
    expired: "已过期"
  };
  return labels[status] || "未购买";
}

function featuredPassCardActionText(status) {
  const labels = {
    active: "继续下一站",
    completed: "查看完成地图",
    expired: "查看过期通行证"
  };
  return labels[status] || "查看通行证";
}

function passSortTime(pass) {
  return pass.completedAt || pass.paidAt || pass.purchasedAt || pass.createdAt || 0;
}

function profilePassProgress(pass, route, status) {
  const total = route.benefits.length || 1;
  const redeemed = pass.redeemed?.length || 0;
  return Math.max(8, Math.round((redeemed / total) * 100));
}

function profilePassMeta(pass, route, status) {
  const total = route.benefits.length;
  const redeemed = pass.redeemed?.length || 0;
  if (status === "completed" && pass.expiredCompletedAt) return `已完成 · ${redeemed}/${total} 已核销 · 其余权益已过期`;
  if (status === "completed") return `已完成 · ${redeemed}/${total} 已核销 · 已保存到今日探索`;
  if (status === "expired") return `已过期 · ${redeemed}/${total} 已核销`;
  if (pass.explorationCompletedAt) return `路线已完成 · 还剩 ${daysRemaining(pass)} 天 · 已核销 ${redeemed}/${total}`;
  return `已支付 · 还剩 ${daysRemaining(pass)} 天 · 已核销 ${redeemed}/${total}`;
}

function profilePassHint(pass, route, status) {
  if (status === "expired") return "有效期已结束，未使用权益会失效；路线仍可回看。";
  const nextStop = route.benefits.find((item) => !pass.redeemed.includes(item.id));
  return nextStop ? `下一站：${nextStop.store} · ${nextStop.benefit}` : "这张地图已经走完，可以沉淀成你的城市记录。";
}

function orderNumberForPass(routeItem) {
  const seed = Math.abs(stableHash(`${routeItem.id}-${Date.now()}-${state.currentUser?.id || "guest"}`));
  return `LOOP-${String(seed).slice(0, 3)}-${String(Date.now()).slice(-5)}`;
}

function generatedRoute(layerId) {
  const layer = layerName(layerId);
  const city = currentCity();
  return route(
    `${city.code}-${layerId}`,
    layerId,
    `${city.code}-${layer.symbol}-00`,
    `${layer.name}城市探索`,
    `${city.name}的一段${layer.name}主题探索，适合留一点时间慢慢走。`,
    [layer.name, "街区停留", "拍照记录", "步行收尾"],
    "2h",
    "¥120",
    "可自选",
    1.6,
    61
  );
}

function poiPoolForLayer(cityKey, layerId) {
  const cityPool = cityPoiPools[cityKey]?.[layerId];
  if (cityPool?.length) return cityPool;
  return fallbackPoiPools[layerId] || [];
}

function routesForLayer(city, layerId, minCount = 10) {
  const cityKey = cityKeyForCity(city);
  const direct = city.routes
    .filter((item) => item.layer === layerId)
    .map((item) => withExpandedStops(item, city, layerId, cityKey));
  if (direct.length >= minCount) return direct;
  return [...direct, ...generatedLayerRoutes(city, layerId, minCount - direct.length, direct.length, cityKey)];
}

function cityKeyForCity(city) {
  return Object.entries(cities).find(([, item]) => item === city)?.[0] || state.city;
}

function withExpandedStops(routeItem, city, layerId, cityKey) {
  const target = targetStopCount(routeItem);
  if ((routeItem.stops?.length || 0) >= target) return routeItem;
  return {
    ...routeItem,
    stops: routeStopsForLayer(layerId, routeItem.stops, { routeItem, city, cityKey, usedStops: new Set() })
  };
}

function generatedLayerRoutes(city, layerId, count, offset = 0, cityKey = state.city) {
  const layer = layerName(layerId);
  const pool = poiPoolForLayer(cityKey, layerId);
  const baseStops = pool.length ? pool : city.places.map((item) => item.title);
  const safeStops = baseStops.length ? baseStops : [`${layer.name}停留`, "街区观察", "拍照记录", "步行收尾"];
  const descTemplates = [
    (stops) => `从${stops[0]}开始，经过${stops[1]}，最后留一段时间给${stops[stops.length - 1]}。`,
    (stops) => `${stops[0]}和${stops[1]}之间的节奏很轻，适合把今天从固定路线里拿出来。`,
    (stops) => `这条线不追求打满行程，会把${stops.slice(0, 3).join("、")}串成一段可呼吸的出门计划。`,
    (stops) => `适合想换个日常的人：先到${stops[0]}，再把后面的停留慢慢走完。`,
    (stops) => `路线里有${stops[0]}的主线，也有${stops[2] || stops[1]}这种更适合临时停下来的点。`
  ];
  return Array.from({ length: count }, (_, index) => {
    const routeIndex = offset + index + 1 + (state.recommendationRound % 7);
    const shift = state.feedVersion % Math.max(safeStops.length, 1);
    const stopCount = 4 + ((routeIndex + layerId.length) % 3);
    const stops = uniqueStops(Array.from({ length: stopCount + 3 }, (__, stopIndex) => {
      return safeStops[(routeIndex + stopIndex + shift) % safeStops.length] || `${layer.name}停留 ${stopIndex + 1}`;
    })).slice(0, stopCount);
    return route(
      `${city.code}-${layerId}-auto-${routeIndex}`,
      layerId,
      `${city.code}-${layer.symbol}-${String(routeIndex).padStart(2, "0")}`,
      generatedRouteTitle(city, layerId, stops, routeIndex),
      descTemplates[index % descTemplates.length](stops),
      stops,
      `${2 + (routeIndex % 4) * 0.5}h`,
      city.code === "AD" ? `AED ${80 + routeIndex * 12}` : `¥${70 + routeIndex * 18}`,
      routeIndex % 2 ? "反日常" : "兴趣相近",
      Number((1.1 + routeIndex * 0.23).toFixed(1)),
      62 + ((routeIndex * 7) % 34)
    );
  });
}

function generatedRouteTitle(city, layerId, stops, routeIndex) {
  const cityMood = {
    shanghai: ["雨后", "楼上", "慢下午", "散场后", "窄街", "旧厂房", "河岸", "低光", "主理人", "反日常"],
    chengdu: ["树影", "盖碗旁", "院子里", "散场后", "慢下午", "小街", "旧厂房", "夜风", "松弛", "反日常"],
    abudhabi: ["白墙", "日落前", "海风里", "穹顶下", "清晨", "低光", "边界", "露台", "地平线", "反日常"]
  };
  const layerTitles = {
    coffee: ["窗边留白", "第一杯以后", "街角降速", "靠窗坐一会儿", "不赶路的一杯"],
    drink: ["低声夜路", "一杯以后再走", "微醺楼梯", "散场后的灯", "夜色慢下来"],
    theatre: ["散场不要回头", "黑盒外的路", "剧场后门", "最后一幕之后", "人声慢慢散开"],
    art: ["展厅外的风", "留白和水边", "看完再走", "墙面与光", "一下午的空白"],
    fashion: ["橱窗里的街区", "材质和路口", "青年设计散步", "试衣间之外", "主理人小路"],
    bookstore: ["翻到城市另一页", "书架后的街", "纸页和树影", "杂志墙以外", "慢读一个下午"],
    music: ["声音从楼上来", "唱片之后的夜", "低音和路灯", "爵士之前", "散场还不回家"],
    cinema: ["电影散场以后", "旧影院旁边", "镜头像夜路", "银幕外的街", "片尾不要走"],
    quest: ["线索开始的地方", "门牌背面", "被忽略的一角", "城市暗号", "反光里的答案"],
    architecture: ["看窗和转角", "立面之间", "入口和比例", "老楼不说话", "建筑的侧脸"],
    citywalk: ["绕一条小路", "路口换个方向", "慢走三十分钟", "街角观察", "今天不走主路"],
    market: ["摊位之间", "周末人群里", "主理人的桌", "临时热闹", "买一点生活感"],
    wellness: ["把速度降下来", "香气和安静", "树影恢复", "轻一点的下午", "呼吸回到身体"],
    night: ["夜路有余温", "低光回家前", "深夜不要太吵", "最后一盏灯", "城市音量变小"],
    default: ["另一种日常", "陌生半径", "今天的另一面", "绕路也值得", "重新打开街区"]
  };
  const cityKey = cityKeyForCity(city);
  const mood = cityMood[cityKey] || cityMood.shanghai;
  const titles = layerTitles[layerId] || layerTitles.default;
  const prefix = mood[routeIndex % mood.length];
  const core = titles[(routeIndex + stops.length) % titles.length];
  const stopHint = stops[0] && routeIndex % 3 === 0 ? ` · ${stops[0]}` : "";
  return `${prefix}${core}${stopHint}`;
}

function renderSecrets() {
  const city = currentCity();
  const quickTasks = quickSecretTasksForCity(state.city).sort((a, b) => a.distance - b.distance);
  dom.secretCover.style.setProperty("--secret-art", city.art);
  dom.secretIntro.textContent = `在${city.name}，秘境分成附近单个任务和完整城市探险游戏。`;
  dom.secretDock.replaceChildren();
  quickTasks.slice(0, 6).forEach((item) => {
    const thumb = document.createElement("button");
    thumb.className = "dock-thumb";
    thumb.type = "button";
    thumb.innerHTML = `<strong>${item.code.split("-")[1]}</strong><span>${item.distance.toFixed(1)}km</span>`;
    thumb.addEventListener("click", () => showToast(`已选择快速任务：${item.title}`));
    dom.secretDock.append(thumb);
  });

  dom.quickQuestRow.replaceChildren();
  quickTasks.forEach((item) => {
    dom.quickQuestRow.append(questCard(item, true));
  });

  dom.secretStack.replaceChildren();
  fullQuestGamesForCity(state.city).forEach((game) => {
    dom.secretStack.append(fullQuestGameCard(game));
  });
}

function questCard(item, compact) {
  const taskPhoto = photoForLayer("quest", item.code, state.city, 620, 440);
  const card = document.createElement("article");
  card.className = compact ? "quest-card compact-quest" : "secret-card";
  card.style.setProperty("--quest-photo", cssImage(taskPhoto));
  card.innerHTML = `
    <div class="quest-visual" aria-hidden="true">
      <img class="mock-photo" src="${taskPhoto}" alt="" loading="lazy" />
      <span>${item.distance.toFixed(1)}km</span>
    </div>
    <div class="secret-meta">
      <span>${item.area} / 单个任务</span>
      <button type="button">快速开始</button>
    </div>
    <h3>${item.title}</h3>
    <p>${item.clue}</p>
    <div class="loop-tags"><span>${item.duration}</span><span>1 个任务</span><span>${item.distance.toFixed(1)}km</span></div>
  `;
  card.querySelector("button").addEventListener("click", () => {
    const questRoute = currentCity().routes.find((routeItem) => routeItem.layer === "quest") || generatedRoute("quest");
    openRouteDetail({ ...questRoute, code: item.code, title: item.title, desc: item.clue, duration: item.duration, stops: [`到达：${item.title}`, "观察线索", "拍照打卡", "完成任务"] });
  });
  return card;
}

function quickSecretTasksForCity(cityKey) {
  const tasks = {
    shanghai: [
      secret("SH-Q01", "蓝色门牌之后", "从武康路一块蓝色门牌开始，找到同一条街上第二种门牌字体。", "快速玩", "22min", 0.4, "武康路"),
      secret("SH-Q02", "梧桐影子的切口", "在衡复街区找一处树影刚好落在建筑转角的位置。", "快速玩", "18min", 0.6, "衡复"),
      secret("SH-Q03", "外滩源旧字牌", "沿圆明园路向南走，找一块不在主视线里的旧字牌。", "快速玩", "26min", 0.8, "外滩源"),
      secret("SH-Q04", "苏州河反光点", "在桥边找一处水面、玻璃或金属形成的反光。", "快速玩", "20min", 0.9, "苏州河"),
      secret("SH-Q05", "M50 墙面拼图", "在莫干山路找到三种不同年代感的墙面材质。", "快速玩", "28min", 1.1, "M50"),
      secret("SH-Q06", "思南小门", "从思南路绕到复兴中路，找一个容易错过的小门或侧入口。", "快速玩", "24min", 1.3, "思南"),
      secret("SH-Q07", "愚园路橱窗暗号", "选三个橱窗，只记录颜色、字体和物件，不记录品牌名。", "快速玩", "30min", 1.5, "愚园路"),
      secret("SH-Q08", "山阴路石库门纹理", "找一处石库门门框，拍下纹理但不要拍到住户。", "快速玩", "26min", 1.8, "山阴路"),
      secret("SH-Q09", "西岸风的方向", "在滨江找一处能看见风的画面：旗、树、衣角或水面。", "快速玩", "25min", 2.1, "西岸"),
      secret("SH-Q10", "上生新所的侧脸", "不要拍主广场，找一处侧面入口或旧墙和新店的交界。", "快速玩", "32min", 2.4, "上生新所")
    ],
    chengdu: [
      secret("CD-Q01", "树影下的盖碗", "下午三点，找树影最厚的那张竹椅。", "快速玩", "30min", 0.5, "玉林"),
      secret("CD-Q02", "玉林第二个门牌", "在同一条街上找到两个字体不同的门牌。", "快速玩", "24min", 0.7, "玉林"),
      secret("CD-Q03", "旧厂房侧门", "主入口不重要，侧门外的墙更像成都。", "快速玩", "40min", 1.3, "东郊记忆"),
      secret("CD-Q04", "奎星楼小店声音", "在三家小店门口记录三种不同声音。", "快速玩", "28min", 1.6, "奎星楼街"),
      secret("CD-Q05", "望江竹影", "找一段竹影落在茶桌或墙面的角度。", "快速玩", "26min", 2.0, "望江楼")
    ],
    abudhabi: [
      secret("AD-Q01", "穹顶下的斑点光", "不要只看建筑全景，低头看光落在地面上。", "快速玩", "30min", 0.6, "Saadiyat"),
      secret("AD-Q02", "白墙和地平线", "日落前 20 分钟，白墙会变成另一种颜色。", "快速玩", "45min", 0.9, "Louvre"),
      secret("AD-Q03", "海风最安静的边", "离主入口远一点，风声会盖住人声。", "快速玩", "35min", 1.2, "Corniche"),
      secret("AD-Q04", "Mina 的生活声", "在港口市场附近听见三种不同的叫卖和金属声。", "快速玩", "30min", 1.8, "Mina"),
      secret("AD-Q05", "白色转角", "沿建筑阴影走，找到最干净的一处白色转角。", "快速玩", "22min", 2.3, "Qasr Al Hosn")
    ]
  };
  return tasks[cityKey] || tasks.shanghai;
}

function fullQuestGameCard(game) {
  const gamePhoto = photoForLayer("quest", game.code, state.city, 760, 500);
  const card = document.createElement("article");
  card.className = "secret-card full-quest-card";
  card.style.setProperty("--quest-photo", cssImage(gamePhoto));
  card.innerHTML = `
    <div class="full-quest-cover" aria-hidden="true">
      <img class="mock-photo" src="${gamePhoto}" alt="" loading="lazy" />
      <span>${game.tasks.length} TASKS</span>
    </div>
    <div class="secret-meta">
      <span>${game.code} / 完整路线任务</span>
      <button type="button">查看路线</button>
    </div>
    <h3>${game.title}</h3>
    <p>${game.desc}</p>
    <div class="loop-tags">
      <span>${game.tasks.length} 个任务</span>
      <span>${game.duration}</span>
      <span>${game.difficulty}</span>
    </div>
  `;
  card.querySelector("button").addEventListener("click", () => {
    const questRoute = currentCity().routes.find((routeItem) => routeItem.layer === "quest") || generatedRoute("quest");
    openRouteDetail({
      ...questRoute,
      id: game.code,
      code: game.code,
      title: game.title,
      desc: game.desc,
      duration: game.duration,
      bestFor: game.difficulty,
      taskDetails: game.tasks,
      stops: game.tasks.map((task) => task.title)
    });
  });
  return card;
}

function fullQuestGamesForCity(cityKey) {
  const games = {
    shanghai: [
      questGame("SH-GAME-01", "衡复蓝门与花园洋房", "从武康大楼向东南慢走到思南街区，沿梧桐、门牌和花园洋房完成一条不回头的建筑观察线。", "2.5h", "建筑观察", [
        ["武康大楼转角定位", "从红砖转角开始"],
        ["武康路蓝色门牌", "记录门牌字体"],
        ["上海老房子艺术中心", "观察老房子展示窗口"],
        ["衡复风貌馆", "看一眼风貌区历史线索"],
        ["复兴西路树影", "拍下梧桐和建筑立面"],
        ["思南公馆侧门", "找一处花园洋房入口"],
        ["思南书局收尾", "写下今天看到的建筑细节"]
      ]),
      questGame("SH-GAME-02", "外滩源旧字牌夜线", "从圆明园路一路向南到外白渡桥，找旧字牌、门楣、桥影和苏州河夜色。", "2h", "夜间线索", [
        ["圆明园路起点", "找到第一处旧建筑立面"],
        ["益丰外滩源门楣", "观察门楣和石材"],
        ["洛克外滩源街角", "拍一个低光转角"],
        ["虎丘路旧字牌", "找被忽略的字"],
        ["乍浦路桥视角", "看苏州河反光"],
        ["外白渡桥收尾", "完成夜色定位"]
      ]),
      questGame("SH-GAME-03", "苏州河工业墙面", "从 M50 沿苏州河向东，把涂鸦、老厂房和河岸更新连成一条工业美学路线。", "2.5h", "工业艺术", [
        ["M50 正门定位", "从莫干山路 50 号进入"],
        ["涂鸦墙找三种颜色", "只记录墙面，不拍人脸"],
        ["旧厂房窗框", "观察工业建筑痕迹"],
        ["画廊门口停留", "选择一处免费展览入口"],
        ["莫干山路桥下", "找桥下阴影"],
        ["苏州河步道", "沿河向东走"],
        ["天安千树外立面", "观察新旧城市对照"],
        ["河岸收尾", "记录一处水面反光"]
      ]),
      questGame("SH-GAME-04", "山阴路文学暗线", "从多伦路向山阴路和鲁迅公园推进，沿文学旧址、石库门和街区肌理完成虹口线索。", "3h", "文学街区", [
        ["多伦路文化名人街", "找到街区起点"],
        ["老电影咖啡馆外立面", "观察招牌和窗"],
        ["山阴路入口", "拍一处石库门纹理"],
        ["大陆新村附近", "留意街巷尺度"],
        ["鲁迅故居外侧", "只做外部观察"],
        ["鲁迅公园边界", "记录树影和人声"],
        ["鲁迅纪念馆收尾", "写下这条线的关键词"]
      ]),
      questGame("SH-GAME-05", "西岸美术馆大道", "沿徐汇滨江由北向南走，把龙美术馆、西岸美术馆、油罐和江边风串成一条艺术线。", "4h", "艺术滨江", [
        ["龙美术馆外广场", "从建筑体量开始"],
        ["徐汇滨江步道", "沿江向南，不回头"],
        ["西岸美术馆入口", "观察白色建筑和广场"],
        ["美术馆书店停留", "找一本和今天有关的书"],
        ["油罐艺术中心外侧", "拍圆形结构"],
        ["江边风向点", "找一处能看见风的画面"],
        ["日落收尾", "保存最后一张照片"]
      ]),
      questGame("SH-GAME-06", "愚园路生活橱窗", "从中山公园向静安方向走，沿社区小店、橱窗和生活方式空间完成一条轻路线。", "2.5h", "社区小店", [
        ["中山公园出口", "确认步行起点"],
        ["愚园路第一扇橱窗", "记录颜色和字体"],
        ["社区小店门口", "找一个主理人感物件"],
        ["愚园公共市集", "观察摊位和人流"],
        ["街角咖啡停留", "补一次状态记录"],
        ["静安寺方向收尾", "完成城市噪音对比"]
      ]),
      questGame("SH-GAME-07", "上生新所侧脸", "从延安西路入口进入上生新所，沿旧建筑、书店、庭院和新华路完成一条空间更新路线。", "2h", "城市更新", [
        ["延安西路入口", "不要从主广场开始"],
        ["哥伦比亚总会外侧", "观察旧建筑比例"],
        ["茑屋书店入口", "记录书店和建筑关系"],
        ["孙科别墅外侧", "找一处安静边界"],
        ["哥伦比亚公园", "停留 3 分钟"],
        ["新华路出口", "从街区另一侧离开"]
      ]),
      questGame("SH-GAME-08", "人民广场旧电影感", "从大光明电影院向人民公园和南京西路走，完成一条老影院、饭店和城市中心的电影感任务。", "2h", "老派电影", [
        ["大光明电影院门口", "从老影院招牌开始"],
        ["国际饭店外立面", "看高度和街角关系"],
        ["人民公园边界", "记录人群和树影"],
        ["上海博物馆外侧", "找一个几何构图"],
        ["南京西路夜色", "以一张低光照片收尾"]
      ]),
      questGame("SH-GAME-09", "淮海路青年文化切片", "从 TX 淮海向新天地移动，沿快闪、橱窗、青年品牌和街区更新完成一条商业文化线。", "2.5h", "青年商业", [
        ["TX 淮海入口", "记录第一个快闪信息"],
        ["淮海中路橱窗", "选择一处字体细节"],
        ["K11 外侧", "看艺术和商业的接口"],
        ["街角小店", "找到一个非连锁停留点"],
        ["新天地北里边界", "观察石库门更新"],
        ["太仓路收尾", "写下最有城市感的一处"]
      ]),
      questGame("SH-GAME-10", "浦东滨江光影线", "从浦东美术馆沿陆家嘴滨江向南，观察玻璃、江面、桥和夜景反光。", "3h", "滨江光影", [
        ["浦东美术馆外侧", "从白色建筑和江面开始"],
        ["陆家嘴滨江步道", "沿江向南走"],
        ["东方明珠外广场视角", "拍一张非正面构图"],
        ["船厂 1862 附近", "找工业更新痕迹"],
        ["江面反光点", "记录水面和灯"],
        ["滨江收尾长椅", "完成夜景心情记录"]
      ])
    ],
    chengdu: [
      questGame("CD-GAME-01", "树影、盖碗和第二个门牌", "玉林附近的一整套慢城市任务，从茶声、树影和门牌开始。", "2h", "慢城市", [
        ["找到树影最厚的竹椅", "坐下观察 3 分钟"],
        ["记录一只盖碗的声音", "拍照或写一句听感"],
        ["找到两个不同字体门牌", "比较字体和墙面"],
        ["绕进一条不熟的小巷", "保持 5 分钟慢走"],
        ["拍下生活小摊", "记录最有烟火气的一处"],
        ["寻找一面旧墙", "拍纹理，不拍人脸"],
        ["完成街角定位", "打卡当前坐标"],
        ["写下成都的慢", "给这条路留一句话"]
      ]),
      questGame("CD-GAME-02", "旧厂房侧门游戏", "东郊记忆周边的完整路线任务，围绕厂房、侧门、音乐和市集。", "3h", "厂房现场", [
        ["从侧门进入", "不要走最明显入口"],
        ["找到一面粗糙墙面", "记录材质和颜色"],
        ["听见一个现场声音", "音乐、人声或设备声都可以"],
        ["逛一个临时摊位", "找出最有主理人感的物件"],
        ["拍下旧厂房窗口", "观察新旧空间关系"],
        ["在散场路上收尾", "完成最后定位"]
      ])
    ],
    abudhabi: [
      questGame("AD-GAME-01", "白墙、穹顶和地平线", "Saadiyat 的完整光影任务，用建筑边界和日落完成一条路线。", "2.5h", "光影建筑", [
        ["找到第一道白墙边界", "观察光线落点"],
        ["记录穹顶斑点光", "拍下地面或墙面光斑"],
        ["沿建筑阴影慢走", "保持安静移动"],
        ["找到海风最轻的位置", "停留 2 分钟"],
        ["拍下白墙颜色变化", "日落前后对比"],
        ["完成地平线定位", "在视野开阔处打卡"],
        ["保存一条光影笔记", "写下城市给你的感觉"]
      ]),
      questGame("AD-GAME-02", "Mina 的生活声", "从艺术园区到港口市场，完成声音、气味和生活现场的路线任务。", "2h", "真实城市", [
        ["从艺术园区出发", "记录第一处公共艺术"],
        ["听见三种市场声音", "叫卖、金属、车辆或海风"],
        ["找到一个生活摊位", "观察颜色和摆放"],
        ["走到港口边界", "拍下城市另一面"],
        ["完成收尾记录", "写下最真实的一处细节"]
      ])
    ]
  };
  return games[cityKey] || games.shanghai;
}

function questGame(code, title, desc, duration, difficulty, tasks) {
  return {
    code,
    title,
    desc,
    duration,
    difficulty,
    tasks: tasks.map(([taskTitle, brief]) => ({ title: taskTitle, brief }))
  };
}

function renderProfile() {
  const user = state.currentUser;
  const records = recordsForView(state.recordView);
  const level = userLevel();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "L";
  dom.profileAvatar.textContent = initial;
  dom.profileName.textContent = user?.name || "城市探索者";
  dom.profileAccount.textContent = maskAccount(user?.account);
  dom.profileSubline.textContent = `${level.title} / 本周记录 ${recordsForView("week").length} 次 / 连续 ${streakDays()} 天`;
  dom.profileLevel.textContent = `LV.${String(level.level).padStart(2, "0")}`;
  dom.folioCover.hidden = true;
  dom.folioCover.replaceChildren();
  renderFeaturedPasses();
  renderOngoingInterestMap();
  dom.recordListTitle.textContent = recordListTitle();
  renderPeriodOverview();
  renderRecordList(records);
  renderTimeLens();
  renderYearSheet();
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function syncMoodRailFocus(moodId, behavior = "smooth") {
  const activeButton = dom.moodGrid.querySelector(`[data-mood-id="${CSS.escape(moodId)}"]`);
  if (!activeButton) return;
  const gridRect = dom.moodGrid.getBoundingClientRect();
  const buttonRect = activeButton.getBoundingClientRect();
  const targetLeft = dom.moodGrid.scrollLeft + buttonRect.left - gridRect.left;
  const maxLeft = Math.max(0, dom.moodGrid.scrollWidth - dom.moodGrid.clientWidth);
  dom.moodGrid.scrollTo({
    left: clampNumber(targetLeft, 0, maxLeft),
    behavior
  });
}

function recordTitle() {
  const map = {
    day: "今日回路",
    week: "本周回看",
    month: "本月轨迹",
    year: "全年生活图",
    places: "所有站点"
  };
  return map[state.recordView];
}

function recordSummary(records) {
  if (!records.length) return "还没有记录。选一条路线出门，今天就会多一个小格。";
  const layersText = [...new Set(records.map((item) => layerName(item.layer).name))].slice(0, 3).join(" / ");
  const map = {
    day: `今天保存了 ${records.length} 段探索，主要靠近 ${layersText}。`,
    week: `本周有 ${records.length} 次探索，熟悉街区正在变得更有层次。`,
    month: `本月记录了 ${records.length} 次出门，兴趣从 ${layersText} 慢慢展开。`,
    year: `这一年已经留下 ${records.length} 个城市切片，有照片的日子会在小格里亮起来。`,
    places: `所有站点按停留本身排列，照片、无图打卡和空位会被区分开。`
  };
  return map[state.recordView];
}

function recordListTitle() {
  const map = {
    day: "今日探索",
    week: "本周记录",
    month: "本月记录",
    year: "全年记录",
    places: "所有站点"
  };
  return map[state.recordView];
}

function periodLabel() {
  const map = {
    week: "本周 5 次记录",
    month: "本月 18 次记录",
    year: "2026 年度",
    places: "所有站点"
  };
  return map[state.recordView] || "今天";
}

function renderPeriodOverview() {
  const stationCells = stationGridCells().filter((item) => item.recordId);
  const summary = [
    { label: "今天", value: recordsForView("day").length, meta: "条路线" },
    { label: "本周", value: recordsForView("week").length, meta: "次探索" },
    { label: "本月", value: recordsForView("month").length, meta: "个切片" },
    { label: "全年", value: recordsForView("year").length, meta: "格被点亮" },
    { label: "所有站点", value: stationCells.length, meta: "个停留" }
  ];
  dom.periodOverview.replaceChildren();
  summary.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = item.label === recordTabLabel(state.recordView) ? "is-active" : "";
    card.innerHTML = `<span>${item.label}</span><strong>${item.value}</strong><small>${item.meta}</small>`;
    card.addEventListener("click", () => {
      state.recordView = recordViewFromLabel(item.label);
      resetProfileRecordFold();
      renderProfile();
    });
    dom.periodOverview.append(card);
  });
}

function renderFeaturedPasses() {
  const passItems = state.featuredPasses
    .map((pass) => ({ pass, route: featuredRouteById(pass.routeId) }))
    .filter((item) => item.route)
    .map((item) => ({ ...item, status: featuredPassStatus(item.pass) }))
    .sort((a, b) => passSortTime(b.pass) - passSortTime(a.pass));
  const activeItems = passItems.filter((item) => item.status === "active");
  renderOngoingFeaturedPasses(demoPreviewFeaturedPassItems(activeItems));
}

function isDemoPreviewUser() {
  return state.currentUser?.account === DEMO_ACCOUNT;
}

function demoPreviewFeaturedPassItems(passItems) {
  if (!isDemoPreviewUser() || passItems.length >= DEMO_PREVIEW_PASS_TARGET) return passItems;
  const existingRouteIds = new Set(passItems.map((item) => item.route.id));
  const routes = Object.values(featuredPassMaps)
    .flat()
    .sort((a, b) => Number(b.city === state.city) - Number(a.city === state.city))
    .filter((route) => !existingRouteIds.has(route.id));
  const now = Date.now();
  const previews = routes.slice(0, DEMO_PREVIEW_PASS_TARGET - passItems.length).map((route, index) => {
    const redeemed = route.benefits.slice(0, Math.min(index + 1, Math.max(route.benefits.length - 1, 0))).map((item) => item.id);
    const pass = {
      id: `demo-preview-pass-${route.id}`,
      orderNo: `DEMO-${route.code}`,
      routeId: route.id,
      city: route.city,
      status: "active",
      createdAt: now - (index + 2) * 3600 * 1000,
      paidAt: now - (index + 2) * 3600 * 1000,
      purchasedAt: now - (index + 2) * 3600 * 1000,
      expiresAt: now + route.validDays * 24 * 60 * 60 * 1000,
      redeemed,
      preview: true
    };
    return { pass, route, status: "active", preview: true };
  });
  return [...passItems, ...previews];
}

function renderOngoingFeaturedPasses(passItems) {
  dom.featuredPassSection.hidden = !passItems.length;
  dom.passMapButton.textContent = "看更多";
  dom.featuredPassList.replaceChildren();
  dom.featuredPassList.className = `profile-pass-list is-compact has-tilted-covers${passItems.length > 1 ? " has-multiple" : ""}`;
  dom.featuredPassList.setAttribute("aria-label", passItems.length > 1 ? "进行中的城市通行证，可左右滑动" : "进行中的城市通行证");
  passItems.forEach(({ pass, route, status }) => {
    const card = document.createElement("article");
    card.className = `profile-pass has-tilted-cover is-${status.replace("_", "-")}`;
    const redeemed = pass.redeemed?.length || 0;
    const total = route.benefits.length;
    card.innerHTML = `
      <figure class="profile-pass-cover">
        <img src="${photoForRoute(route, 360, 460)}" alt="${route.title}封面" loading="lazy" />
      </figure>
      <div class="profile-pass-body">
        <div class="profile-pass-head">
          <div class="profile-pass-topline">
            <span>${passStatusLabel(status)} · ${redeemed}/${total}</span>
            <em class="profile-pass-price">${route.price || route.budget}</em>
          </div>
          <strong>${route.title}</strong>
          <small>${profilePassMeta(pass, route, status)}</small>
        </div>
        <div class="profile-pass-progress" aria-hidden="true"><i style="width:${profilePassProgress(pass, route, status)}%"></i></div>
        <div class="profile-pass-actions">
          <button type="button" data-pass-action="map" data-pass-id="${pass.id}" data-pass-route-id="${route.id}">查看</button>
        </div>
      </div>
    `;
    dom.featuredPassList.append(card);
  });
  dom.featuredPassList.querySelectorAll("[data-pass-action]").forEach((button) => {
    button.addEventListener("click", () => openFeaturedPassFromProfile(button.dataset.passId, button.dataset.passRouteId));
  });
}

function renderOngoingInterestMap() {
  const routeItem = state.explorationActive && state.explorationRoute && !state.explorationRoute.isFeaturedPass
    ? state.explorationRoute
    : null;
  const routeItems = demoPreviewInterestMapItems(routeItem);
  const activeRouteId = routeItem?.id || "";
  dom.interestMapSection.hidden = !routeItems.length;
  dom.interestMapList.replaceChildren();
  dom.interestMapList.className = `profile-pass-list interest-map-list is-compact has-tilted-covers${routeItems.length > 1 ? " has-multiple" : ""}`;
  dom.interestMapList.setAttribute("aria-label", routeItems.length > 1 ? "进行中的兴趣地图，可左右滑动" : "进行中的兴趣地图");
  if (!routeItems.length) return;

  routeItems.forEach((item, index) => {
    const isCurrent = item.id === activeRouteId;
    const total = item.stops.length;
    const currentIndex = isCurrent
      ? Math.min(Math.max(state.routeProgress || 0, 0), total - 1)
      : Math.min(index + 1, total - 1);
    const currentStop = item.stops[currentIndex] || item.title;
    const progress = isCurrent
      ? Math.max(8, explorationProgress(item))
      : Math.max(18, Math.round((currentIndex / Math.max(total - 1, 1)) * 100));
    const startedAt = isCurrent
      ? state.explorationStartedAt || Date.now()
      : Date.now() - (index + 2) * 28 * 60 * 1000;
    const layer = layerName(item.layer).name;
    const card = document.createElement("article");
    card.className = `profile-pass has-tilted-cover is-interest-map${isCurrent ? "" : " is-preview"}`;
    card.innerHTML = `
      <figure class="profile-pass-cover">
        <img src="${photoForRoute(item, 360, 460)}" alt="${item.title}封面" loading="lazy" />
      </figure>
      <div class="profile-pass-body">
        <div class="profile-pass-head">
          <span>${isCurrent ? "正在探索" : "模拟进行中"} · 第 ${currentIndex + 1}/${total} 站</span>
          <strong>${item.title}</strong>
          <small>${layer} · 当前站 ${currentStop} · 已进行 ${formatElapsed(Date.now() - startedAt)}</small>
        </div>
        <div class="profile-pass-progress" aria-hidden="true"><i style="width:${progress}%"></i></div>
        <div class="profile-pass-actions">
          <button type="button" data-interest-map-action="${isCurrent ? "continue" : "preview"}" data-interest-route-id="${item.id}">${isCurrent ? "继续下一站" : "查看路线"}</button>
        </div>
      </div>
    `;
    dom.interestMapList.append(card);
    card.querySelector("[data-interest-map-action]")?.addEventListener("click", () => {
      if (isCurrent) {
        switchView("atlas");
        openOngoingExploration();
        return;
      }
      state.layer = item.layer;
      state.selectedRouteId = item.id;
      switchView("atlas");
      openRouteDetail(item, "preview");
    });
  });
}

function demoPreviewInterestMapItems(activeRouteItem) {
  const items = activeRouteItem ? [activeRouteItem] : [];
  if (!isDemoPreviewUser() || items.length >= DEMO_PREVIEW_INTEREST_MAP_TARGET) return items;
  const existingRouteIds = new Set(items.map((item) => item.id));
  const candidates = [...localRecommendedRoutes(6), ...(currentCity().routes || [])]
    .filter((route) => route && !route.isFeaturedPass && !existingRouteIds.has(route.id));
  const uniqueCandidates = [];
  candidates.forEach((route) => {
    if (uniqueCandidates.some((item) => item.id === route.id)) return;
    uniqueCandidates.push(route);
  });
  return [...items, ...uniqueCandidates.slice(0, DEMO_PREVIEW_INTEREST_MAP_TARGET - items.length)];
}

function openFeaturedPassFromProfile(passId, routeId = "") {
  const pass = state.featuredPasses.find((item) => item.id === passId);
  const routeItem = pass ? featuredRouteById(pass.routeId) : featuredRouteById(routeId);
  if (!routeItem) return;
  state.city = pass?.city || routeItem.city || state.city;
  state.layer = "featured";
  state.selectedRouteId = routeItem.id;
  switchView("atlas");
  openRouteDetail(routeItem, "preview");
}

function renderRecordList(records) {
  dom.recordList.replaceChildren();
  if (!records.length) {
    const empty = document.createElement("article");
    empty.className = "record-empty";
    empty.innerHTML = `<strong>今天还没有记录</strong><span>从首页或地图开启一条路线，完成后会出现在这里。</span>`;
    dom.recordList.append(empty);
    return;
  }
  const visibleRecords = visibleProfileRecords(records);
  visibleRecords.forEach((record) => dom.recordList.append(recordCard(record)));
  if (records.length > PROFILE_RECORD_PAGE_SIZE && !state.profileRecordControlsDismissed) {
    dom.recordList.append(recordListControls(records.length, visibleRecords.length));
  }
  syncRecordScrollFloat();
}

function visibleProfileRecords(records) {
  if (state.profileRecordExpandedAll) return records;
  return records.slice(0, Math.min(state.profileRecordLimit, records.length));
}

function resetProfileRecordFold() {
  state.profileRecordLimit = PROFILE_RECORD_PAGE_SIZE;
  state.profileRecordExpandedAll = false;
  state.profileRecordControlsDismissed = false;
}

function recordListControls(total, visible) {
  const controls = document.createElement("article");
  controls.className = "record-list-controls";
  const hasMore = visible < total;
  controls.innerHTML = `
    <button class="record-list-dismiss" type="button" data-record-list-action="dismiss" aria-label="关闭记录展开选项">×</button>
    <div>
      <strong>${visible}/${total} 条记录</strong>
      <span>${hasMore ? "继续展开可以再加载 6 条，展开全部会显示当前周期所有记录。" : "当前周期记录已全部展开。"}</span>
    </div>
    <div class="record-list-actions">
      ${hasMore ? `<button type="button" data-record-list-action="more">继续展开</button>` : ""}
      ${hasMore ? `<button type="button" data-record-list-action="all">展开全部</button>` : ""}
      <button type="button" data-record-list-action="top">一键到顶</button>
      <button type="button" data-record-list-action="collapse">恢复折叠</button>
    </div>
  `;
  controls.addEventListener("click", handleRecordListAction);
  return controls;
}

function handleRecordListAction(event) {
  const button = event.target.closest("[data-record-list-action]");
  if (!button) return;
  const action = button.dataset.recordListAction;
  const records = recordsForView(state.recordView);
  if (action === "dismiss") {
    state.profileRecordControlsDismissed = true;
    renderRecordList(records);
    return;
  }
  if (action === "more") {
    state.profileRecordLimit = Math.min(records.length, state.profileRecordLimit + PROFILE_RECORD_PAGE_SIZE);
    state.profileRecordExpandedAll = state.profileRecordLimit >= records.length;
    renderRecordList(records);
    return;
  }
  if (action === "all") {
    state.profileRecordExpandedAll = true;
    state.profileRecordLimit = records.length;
    renderRecordList(records);
    return;
  }
  if (action === "collapse") {
    resetProfileRecordFold();
    renderRecordList(records);
    dom.periodOverview.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (action === "top") {
    dom.periodOverview.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function shouldShowRecordScrollFloat() {
  if (state.view !== "folio") return false;
  const records = recordsForView(state.recordView);
  const maxScroll = dom.appFrame.scrollHeight - dom.appFrame.clientHeight;
  return records.length > PROFILE_RECORD_PAGE_SIZE && maxScroll > 220 && dom.appFrame.scrollTop > 80;
}

function syncRecordScrollFloat() {
  const float = dom.recordScrollFloat;
  if (!float) return;
  window.clearTimeout(recordScrollFloatTimer);
  const canShow = shouldShowRecordScrollFloat();
  float.hidden = !canShow;
  if (canShow) {
    recordScrollFloatTimer = window.setTimeout(() => {
      dom.recordScrollFloat.hidden = true;
    }, 1800);
  }
}

function scrollRecordListTo(edge) {
  if (edge !== "top") return;
  dom.periodOverview.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleProfileScrollFloat(event) {
  const button = event.target.closest("[data-record-float-action]");
  if (!button) return;
  scrollRecordListTo(button.dataset.recordFloatAction);
}

function recordCard(record) {
  const isFeaturedPassRecord = record.layer === "featured" && record.mood === "城市通行证完成";
  const card = document.createElement("article");
  card.className = `record-card${isFeaturedPassRecord ? " is-featured-pass-record" : ""}`;
  card.style.setProperty("--record-photo", cssImage(photoForRecord(record, 460, 320)));
  const recordType = layerName(record.layer).name;
  const statusPill = isFeaturedPassRecord
    ? `<em class="record-status-pill">通行证完成</em>`
    : "";
  const summary = isFeaturedPassRecord
    ? `完成凭证 · ${record.stops.slice(0, 3).join(" / ")}`
    : `${record.mood || "留下了一段城市记录"} · ${record.stops.slice(0, 3).join(" / ")}`;
  card.innerHTML = `
    <button class="record-thumb" type="button" aria-label="查看${record.title}照片"></button>
    <div class="record-main">
      <div class="record-meta-row">
        <span>${record.time} / ${recordType}</span>
        ${statusPill}
      </div>
      <strong>${record.title}</strong>
      <p>${summary}</p>
      <div class="record-actions">
        <button type="button">查看详情</button>
        <small>${isFeaturedPassRecord ? `${record.stops.length}站已完成 · ${record.budget || "已记录"}` : (record.photo ? (record.photoSource || "有照片") : "无照片")}</small>
      </div>
    </div>
  `;
  card.querySelector(".record-thumb").addEventListener("click", () => openRecordDetail(record.id));
  card.querySelector(".record-actions button").addEventListener("click", () => openRecordDetail(record.id));
  return card;
}

function renderTimeLens() {
  const todayCount = recordsForView("day").length;
  const weekCount = recordsForView("week").length;
  const monthCount = recordsForView("month").length;
  const yearCount = recordsForView("year").length;
  const items = [
    { label: "今日", value: todayCount, width: Math.min(100, todayCount * 28 + 18) },
    { label: "本周", value: weekCount, width: Math.min(100, weekCount * 14 + 12) },
    { label: "本月", value: monthCount, width: Math.min(100, monthCount * 5 + 10) },
    { label: "全年", value: yearCount, width: Math.min(100, yearCount * 3 + 12) }
  ];
  dom.timeLens.innerHTML = items.map((item) => `
    <div>
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <i style="width:${item.width}%"></i>
    </div>
  `).join("");
}

function renderYearSheet() {
  const colors = {
    coffee: palette.orange,
    drink: palette.ink,
    theatre: palette.blue,
    art: palette.blue,
    quest: palette.orange,
    default: "#d9dde6"
  };
  const today = dayOfYear(new Date());
  const boardTitle = document.querySelector(".year-label strong");
  const boardSub = document.querySelector(".year-label span");
  const config = recordGridConfig(today);
  if (boardTitle) boardTitle.textContent = config.title;
  if (boardSub) boardSub.textContent = config.sub;
  dom.yearSheet.dataset.view = state.recordView;
  dom.yearSheet.replaceChildren();
  config.cells.forEach((info, index) => {
    const cell = document.createElement("button");
    const dayRecords = info.records || [];
    const record = dayRecords[0];
    const hasPhoto = Boolean(info.photoUrl) || dayRecords.some((item) => recordPhotos(item).length);
    const hasEntry = dayRecords.length > 0 || info.filled || info.checkinOnly;
    cell.className = [
      "day-cell",
      hasEntry ? "has-entry" : "",
      hasPhoto ? "has-photo" : "",
      info.checkinOnly && !hasPhoto ? "has-checkin-no-photo" : "",
      info.placeholder ? "is-placeholder" : "",
      info.day === today && state.recordView !== "places" ? "is-today" : ""
    ].filter(Boolean).join(" ");
    if (hasEntry) {
      const layer = record?.layer || layers[(index + state.city.length) % layers.length].id;
      cell.style.setProperty("--day-color", colors[layer] || colors.default);
      if (hasPhoto) {
        cell.style.setProperty("--day-photo", cssImage(info.photoUrl || photoForRecord(dayRecords.find((item) => recordPhotos(item).length) || record, 160, 160)));
      }
    }
    if (info.label) cell.innerHTML = `<span>${info.label}</span>`;
    cell.setAttribute("aria-label", `${info.aria}，${dayRecords.length} 条探索`);
    cell.addEventListener("click", () => {
      if (info.recordId) openRecordDetail(info.recordId);
      else if (dayRecords.length) openDayDetail(info.day);
      else showToast(`${info.aria}：暂无详细记录`);
    });
    dom.yearSheet.append(cell);
  });
}

function recordGridConfig(today) {
  const current = new Date();
  if (state.recordView === "places") {
    return {
      title: "所有站点",
      sub: "PHOTO / CHECK-IN / EMPTY",
      cells: stationGridCells()
    };
  }
  if (state.recordView === "day") {
    const records = recordsForDay(today);
    const cells = records.length
      ? records.map((record, index) => ({ day: today, records: [record], label: String(index + 1), aria: `今日第 ${index + 1} 条探索` }))
      : Array.from({ length: 6 }, (_, index) => ({ day: today, records: [], label: String(index + 1), aria: `今日预留格 ${index + 1}`, filled: index === 0 }));
    return { title: "TODAY", sub: "TODAY'S LOOP GRID", cells };
  }
  if (state.recordView === "week") {
    const weekLabels = ["一", "二", "三", "四", "五", "六", "日"];
    const start = new Date(current);
    const day = current.getDay() || 7;
    start.setDate(current.getDate() - day + 1);
    const cells = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const dayNumber = dayOfYear(date);
      return {
        day: dayNumber,
        records: recordsForDay(dayNumber),
        label: weekLabels[index],
        aria: `本周周${weekLabels[index]}`
      };
    });
    return { title: "WEEK", sub: "7 DAYS IN LOOPS", cells };
  }
  if (state.recordView === "month") {
    const days = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const cells = Array.from({ length: days }, (_, index) => {
      const date = new Date(current.getFullYear(), current.getMonth(), index + 1);
      const dayNumber = dayOfYear(date);
      return {
        day: dayNumber,
        records: recordsForDay(dayNumber),
        label: String(index + 1),
        aria: `本月 ${index + 1} 日`,
        filled: pseudoRandom((index + 1) * 17 + state.city.length) > 0.84
      };
    });
    return { title: "MONTH", sub: "MONTHLY LOOP MAP", cells };
  }
  return {
    title: String(current.getFullYear()),
    sub: "MY YEAR IN LOOPS",
    cells: Array.from({ length: 365 }, (_, index) => {
      const day = index + 1;
      return {
        day,
        records: recordsForDay(day),
        aria: `第 ${day} 天记录`,
        filled: pseudoRandom(day * 19 + state.city.length) > 0.81 || day === today
      };
    })
  };
}

function recordPhotoUrl(record, station, index, width = 900, height = 700) {
  return photoForLayer(record?.layer || "city", `${record?.id || record?.title || "record"}-${station}-${index}`, record?.city || state.city, width, height);
}

function normalizeRecordPhotos(record, stops, width = 900, height = 700) {
  const seen = new Set();
  if (Array.isArray(record?.photos) && record.photos.length) {
    return record.photos
      .map((photo, index) => {
        const stopIndex = Number.isFinite(Number(photo.stopIndex)) ? Number(photo.stopIndex) : index;
        const station = photo.station || stops[stopIndex] || stops[index] || record.title;
        const key = `${stopIndex}-${station}`;
        if (seen.has(key)) return null;
        seen.add(key);
        return {
          station,
          stopIndex,
          source: photo.source || record.photoSource || "拍照",
          url: photo.url || recordPhotoUrl(record, station, stopIndex, width, height)
        };
      })
      .filter(Boolean);
  }
  if (!record?.photo) return [];
  return stops.map((station, index) => ({
    station,
    stopIndex: index,
    source: record.photoSource || "拍照",
    url: recordPhotoUrl(record, station, index, width, height)
  }));
}

function recordPhotos(record, width = 900, height = 700) {
  const stops = record?.stops?.length ? record.stops : [record?.title || "街区停留"];
  return normalizeRecordPhotos(record, stops, width, height);
}

function normalizeRecord(record) {
  if (!record) return null;
  const stops = record.stops?.length ? record.stops : [record.title, "街区停留", "拍照记录"];
  const photos = normalizeRecordPhotos(record, stops);
  return {
    id: record.id || `rec-${record.day}-${stableHash(record.title)}`,
    day: record.day,
    dateISO: record.dateISO || dateISOForDay(record.day),
    title: record.title,
    photo: Boolean(record.photo || photos.length),
    photoSource: record.photoSource || photos[0]?.source || "",
    photos,
    layer: record.layer || "quest",
    time: record.time || "19:30",
    mood: record.mood || "城市被重新打开",
    stops,
    city: record.city || state.city,
    note: record.note || `${record.title} 留下了一段城市记忆。`,
    duration: record.duration || "2h",
    budget: record.budget || "已记录"
  };
}

function recordPriority(record) {
  return record?.layer === "featured" && record?.mood === "城市通行证完成" ? 2 : 0;
}

function allRecords() {
  return state.records.map(normalizeRecord).filter(Boolean).sort((a, b) => {
    if (b.day !== a.day) return b.day - a.day;
    const priority = recordPriority(b) - recordPriority(a);
    if (priority) return priority;
    return String(b.time).localeCompare(String(a.time));
  });
}

function recordsForDay(day) {
  return allRecords().filter((record) => record.day === day);
}

function latestRecord() {
  return allRecords()[0];
}

function recordsForView(view) {
  const today = dayOfYear(new Date());
  if (view === "places") return allRecords();
  const ranges = {
    day: 0,
    week: 6,
    month: 30,
    year: 365
  };
  const range = ranges[view] ?? 0;
  return allRecords().filter((record) => today - record.day >= 0 && today - record.day <= range);
}

function stationGridCells() {
  const entries = allRecords().flatMap((record) => {
    const photos = recordPhotos(record, 180, 180);
    return record.stops.map((station, index) => {
      const photo = photos.find((item) => item.stopIndex === index || item.station === station);
      return {
        recordId: record.id,
        records: [record],
        station,
        label: photo ? "" : "",
        aria: `${record.title} · ${station}`,
        photoUrl: photo?.url || "",
        checkinOnly: !photo
      };
    });
  });
  const minimumCells = Math.max(84, Math.ceil(entries.length / 7) * 7);
  const placeholders = Array.from({ length: Math.max(0, minimumCells - entries.length) }, (_, index) => ({
    records: [],
    aria: `空白站点占位 ${index + 1}`,
    placeholder: true
  }));
  return [...entries, ...placeholders];
}

function photoForRecord(record, width = 900, height = 700) {
  const item = normalizeRecord(record);
  const firstPhoto = recordPhotos(item, width, height)[0];
  if (firstPhoto) return firstPhoto.url;
  return photoForLayer(item?.layer || "city", item?.title || "record", item?.city || state.city, width, height);
}

function recordTabLabel(view) {
  return { day: "今天", week: "本周", month: "本月", year: "全年", places: "所有站点" }[view] || "今天";
}

function recordViewFromLabel(label) {
  return { 今天: "day", 本周: "week", 本月: "month", 全年: "year", 所有站点: "places" }[label] || "day";
}

function userLevel() {
  const count = allRecords().length;
  const level = Math.max(1, Math.min(12, Math.floor(count / 3) + 1));
  const titles = ["初次出门", "街区观察者", "城市感知者", "路线收藏家", "夜色采样者", "城市策展人"];
  return { level, title: titles[Math.min(titles.length - 1, Math.floor(level / 2))] };
}

function streakDays() {
  const days = [...new Set(allRecords().map((item) => item.day))].sort((a, b) => b - a);
  let streak = 0;
  let expected = dayOfYear(new Date());
  days.forEach((day) => {
    if (day === expected) {
      streak += 1;
      expected -= 1;
    }
  });
  return Math.max(1, streak);
}

function dateISOForDay(day) {
  const date = new Date(new Date().getFullYear(), 0, day);
  return date.toISOString().slice(0, 10);
}

function openDayDetail(day, focusId = null) {
  const records = recordsForDay(day);
  if (!records.length) return;
  const focused = records.find((item) => item.id === focusId) || records.find((item) => item.photo) || records[0];
  renderRecordDetailSheet(focused, records, "day");
}

function openRecordDetail(recordId) {
  const record = allRecords().find((item) => item.id === recordId);
  if (!record) return;
  renderRecordDetailSheet(record, [record], "record");
}

function recordPhotoCarouselHTML(record) {
  const photos = recordPhotos(record, 900, 620);
  if (!photos.length) {
    return `
      <div class="detail-photo-empty">
        <strong>没有保存照片</strong>
        <span>这次探索只有打卡记录，暂时没有现场照片。</span>
      </div>
    `;
  }
  return `
    <div class="detail-photo-track" aria-label="本次探索照片">
      ${photos.map((photo, index) => `
        <figure class="detail-photo-slide" style="${photoStyle(photo.url, "--detail-photo-url")}">
          <figcaption>${String(index + 1).padStart(2, "0")} / ${photos.length} · ${photo.station} · ${photo.source}</figcaption>
        </figure>
      `).join("")}
    </div>
  `;
}

function renderRecordDetailSheet(focused, records, mode = "day") {
  const focusedPhotos = recordPhotos(focused);
  const totalPhotos = records.reduce((sum, record) => sum + recordPhotos(record).length, 0);
  dom.dayBackdrop.hidden = false;
  dom.dayDetailSheet.hidden = false;
  dom.dayDetailCode.textContent = focused.dateISO.replace(/-/g, " / ");
  dom.dayDetailTitle.textContent = mode === "record"
    ? focused.title
    : `${focused.dateISO.slice(5).replace("-", " / ")} 的探索`;
  dom.dayDetailMeta.textContent = mode === "record"
    ? `${focused.time} / ${layerName(focused.layer).name} / ${focused.stops.length}站 / ${focusedPhotos.length}张照片`
    : `${records.length} 条路线 / ${totalPhotos} 张照片`;
  dom.dayDetailPhoto.innerHTML = recordPhotoCarouselHTML(focused);
  dom.dayRecordList.replaceChildren();
  records.forEach((record) => {
    const photos = recordPhotos(record);
    const item = document.createElement("article");
    item.className = `day-record-card${record.id === focused.id ? " is-active" : ""}`;
    item.innerHTML = `
      <span>${record.time} / ${layerName(record.layer).name}</span>
      <strong>${record.title}</strong>
      <p>${record.note}</p>
      <div class="loop-tags">
        <span>${record.mood}</span>
        <span>${photos.length ? `${photos.length}张照片` : "无照片"}</span>
        <span>${record.stops.length}站</span>
      </div>
    `;
    item.addEventListener("click", () => {
      if (mode === "record") return;
      openDayDetail(record.day, record.id);
    });
    dom.dayRecordList.append(item);
  });
}

function closeDayDetail() {
  dom.dayBackdrop.hidden = true;
  dom.dayDetailSheet.hidden = true;
}

function openRouteDetail(routeItem, mode = "preview") {
  if (state.activeRoute?.id !== routeItem.id) {
    state.expandedFeaturedStopId = null;
    state.activeRedemptionRouteId = null;
    state.activeRedemptionBenefitId = null;
    state.featuredPaymentRouteId = null;
  }
  const ownedFeaturedPass = routeItem.isFeaturedPass ? getFeaturedPass(routeItem.id) : null;
  const ownedFeaturedStatus = ownedFeaturedPass ? featuredPassStatus(ownedFeaturedPass) : "";
  state.activeRoute = routeItem;
  state.routeDetailMode = ownedFeaturedPass && ownedFeaturedStatus === "active" ? "active" : mode;
  if (ownedFeaturedPass && ownedFeaturedStatus === "active") {
    const nextIndex = routeItem.benefits.findIndex((item) => !ownedFeaturedPass.redeemed.includes(item.id));
    const isCurrentExploration = state.explorationActive && state.explorationRoute?.id === routeItem.id;
    state.routeStopFocus = isCurrentExploration ? state.routeProgress : Math.max(0, nextIndex);
  } else {
    state.routeStopFocus = state.routeDetailMode === "active" ? state.routeProgress : 0;
  }
  dom.routeBackdrop.hidden = false;
  dom.routeDetailSheet.hidden = false;
  renderRouteDetail();
}

function closeRouteDetail() {
  state.featuredPaymentRouteId = null;
  closePassActionSheet();
  dom.routeBackdrop.hidden = true;
  dom.routeDetailSheet.hidden = true;
  renderOngoingExploration();
}

function renderRouteDetail() {
  const routeItem = state.activeRoute;
  if (!routeItem) return;
  dom.routeDetailCode.textContent = routeItem.code;
  dom.routeDetailTitle.textContent = routeItem.title;
  dom.routeDetailMeta.textContent = `${routeItem.duration} / ${routeItem.distance || 1.4}km / ${routeItem.budget}`;
  dom.routeDetailPhoto.style.setProperty("--photo-url", cssImage(photoForRoute(routeItem, 900, 520)));
  dom.routeDetailSheet.dataset.mode = state.routeDetailMode;
  delete dom.routeDetailSheet.dataset.passState;
  dom.completeRouteButton.hidden = false;
  dom.completeRouteButton.disabled = false;
  if (routeItem.isFeaturedPass) {
    renderFeaturedPassDetail(routeItem);
    return;
  }
  state.activeRedemptionRouteId = null;
  state.activeRedemptionBenefitId = null;
  state.featuredPaymentRouteId = null;
  const focusIndex = Math.min(state.routeStopFocus || 0, routeItem.stops.length - 1);
  dom.virtualMap.innerHTML = routeStopCarouselHTML(routeItem, focusIndex);
  dom.virtualMap.querySelectorAll("[data-stop-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.routeStopFocus = Number(button.dataset.stopIndex);
      renderRouteDetail();
    });
  });
  bindRouteCarouselControls();
  dom.checkinButton.hidden = state.routeDetailMode === "preview";
  dom.photoButton.hidden = state.routeDetailMode === "preview";
  dom.completeRouteButton.textContent = ordinaryRouteActionText(routeItem);
  if (state.routeDetailMode === "preview") {
    dom.routeProgress.innerHTML = "";
    return;
  }
  dom.routeProgress.innerHTML = "";
  renderOngoingExploration();
}

function isRouteAtLastStop(routeItem) {
  return Boolean(routeItem?.stops?.length && state.routeProgress >= routeItem.stops.length - 1);
}

function routeFocusedIndex(routeItem) {
  const total = Math.max(routeItem?.isFeaturedPass ? routeItem.benefits?.length || 0 : routeItem?.stops?.length || 0, 1);
  return Math.min(Math.max(state.routeStopFocus || 0, 0), total - 1);
}

function ordinaryRouteActionText(routeItem) {
  if (state.routeDetailMode === "preview") return "开启探索";
  if (routeFocusedIndex(routeItem) !== Math.min(Math.max(state.routeProgress || 0, 0), routeItem.stops.length - 1)) return "回到当前站";
  if (!isRouteAtLastStop(routeItem)) return "继续下一站";
  return "完成探索";
}

function updateRouteActionButtons() {
  const routeItem = state.activeRoute;
  if (!routeItem || dom.routeDetailSheet.hidden) return;
  if (routeItem.isFeaturedPass) {
    const pass = getFeaturedPass(routeItem.id);
    const passStatus = pass ? featuredPassStatus(pass) : "";
    const isPaymentPreview = !pass && state.featuredPaymentRouteId === routeItem.id;
    dom.completeRouteButton.disabled = passStatus === "completed" || passStatus === "expired";
    dom.completeRouteButton.textContent = isPaymentPreview
      ? `模拟支付 ${routeItem.price}`
      : featuredPassDetailActionText(passStatus, routeItem, pass);
    return;
  }
  dom.completeRouteButton.disabled = false;
  dom.completeRouteButton.textContent = ordinaryRouteActionText(routeItem);
}

function renderFeaturedPassDetail(routeItem) {
  const pass = getFeaturedPass(routeItem.id);
  const passStatus = pass ? featuredPassStatus(pass) : "";
  const isPaymentPreview = !pass && state.featuredPaymentRouteId === routeItem.id;
  const focusIndex = Math.min(state.routeStopFocus || 0, routeItem.benefits.length - 1);
  const isExploringPass = passStatus === "active" && state.routeDetailMode === "active";
  dom.routeDetailMeta.textContent = `${routeItem.issue} / ${routeItem.price} / ${routeItem.validDays}天有效`;
  dom.routeDetailSheet.dataset.mode = "featured";
  dom.routeDetailSheet.dataset.passState = passStatus || (isPaymentPreview ? "payment" : "none");
  dom.checkinButton.hidden = !isExploringPass;
  dom.photoButton.hidden = !isExploringPass;
  dom.completeRouteButton.hidden = false;
  dom.completeRouteButton.disabled = passStatus === "completed" || passStatus === "expired";
  dom.completeRouteButton.textContent = featuredPassDetailActionText(passStatus, routeItem, pass);
  if (isPaymentPreview) {
    dom.checkinButton.hidden = true;
    dom.photoButton.hidden = true;
    dom.completeRouteButton.disabled = false;
    dom.completeRouteButton.textContent = `模拟支付 ${routeItem.price}`;
    renderFeaturedPaymentPreview(routeItem);
    return;
  }
  dom.virtualMap.innerHTML = `
    ${featuredPriceRowHTML(routeItem, pass, passStatus)}
    ${passStopCarouselHTML(routeItem, pass, focusIndex)}
  `;
  dom.virtualMap.querySelectorAll(".pass-redeem").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openRedemptionCode(routeItem, button.dataset.benefitId);
    });
  });
  bindRouteCarouselControls();

  const archivePanel = pass && passStatus !== "active"
    ? passArchivePanelHTML(routeItem, pass, passStatus)
    : "";
  const ruleGrid = passStatus === "active"
    ? ""
    : `<div class="pass-rule-grid">
        <span>每店可核销一次</span>
        <span>不可重复使用</span>
        <span>过期后未用权益失效</span>
      </div>`;

  dom.routeProgress.innerHTML = `
    <section class="featured-pass${passStatus === "active" ? " is-exploring-pass" : ""}">
      ${archivePanel}
      ${ruleGrid}
    </section>
  `;
  if (passStatus === "active") dom.routeProgress.innerHTML = "";
}

function renderFeaturedPaymentPreview(routeItem) {
  state.activeRedemptionRouteId = null;
  state.activeRedemptionBenefitId = null;
  dom.virtualMap.innerHTML = `
    ${featuredPriceRowHTML(routeItem, null, "payment_preview")}
    ${passPaymentPreviewCardHTML(routeItem)}
  `;
  dom.routeProgress.innerHTML = passPaymentPreviewHTML(routeItem);
}

function passPaymentPreviewHTML(routeItem) {
  return `
    <section class="featured-pass pass-payment-preview">
      <div class="pass-kicker">
        <span>${routeItem.theme}</span>
        <strong>订单摘要</strong>
      </div>
      <div class="order-summary">
        <span>${routeItem.benefits.length} 家店权益</span>
        <span>${routeItem.distance}km 顺路规划</span>
        <span>确认后 ${routeItem.validDays} 天内可用</span>
      </div>
    </section>
  `;
}

function passPaymentPreviewCardHTML(routeItem) {
  const firstBenefit = routeItem.benefits[0];
  return `
    <article class="pass-payment-hero">
      <img class="pass-payment-hero-media" src="${photoForRoute(routeItem, 720, 420)}" alt="${routeItem.title}" loading="lazy" />
      <div class="pass-payment-hero-copy">
        <span class="pass-payment-eyebrow">即将开启</span>
        <strong>${routeItem.title}</strong>
        <p>${routeItem.desc}</p>
        <div class="order-summary pass-payment-summary">
          <span>${routeItem.benefits.length} 家店</span>
          <span>${routeItem.validDays} 天有效</span>
          <span>${firstBenefit?.benefit || "主题权益"}</span>
        </div>
      </div>
    </article>
  `;
}

function featuredPriceRowHTML(routeItem, pass, status) {
  const priceLabel = status === "active"
      ? `已支付 ${routeItem.price}`
      : `通行证价 ${routeItem.price}`;
  return `
    <article class="pass-price-row">
      <div>
        <span class="pass-price-meta">城市通行证</span>
        <small>${passStatusLine(pass, routeItem, status)}</small>
      </div>
      <strong class="pass-price-main">${priceLabel}</strong>
      <em>原价合计 ${routeItem.originalPrice}</em>
    </article>
  `;
}

function passStopCarouselHTML(routeItem, pass, focusIndex) {
  const passStatus = pass ? featuredPassStatus(pass) : "";
  const cardTag = "article";
  return routeCarouselShellHTML(
    routeItem.benefits.map((item, index) => {
        const status = featuredStopStatus(pass, item.id);
        const liveDetails = passStationLiveDetails(routeItem, item, index, pass, status);
        const canRedeem = passStatus === "active" && status === "未使用";
        const action = canRedeem
          ? `<button class="pass-station-action pass-redeem" type="button" data-benefit-id="${item.id}">核销码</button>`
          : `<span class="pass-station-action is-muted">${pass ? status : "购买后可用"}</span>`;
        const classes = [
          "route-stop-card",
          "pass-stop-card",
          index === focusIndex ? "is-focused" : "",
          status === "已核销" ? "is-current" : "",
          status === "已过期" ? "is-muted" : ""
        ].filter(Boolean).join(" ");
        return `
          <${cardTag} class="${classes}" data-stop-index="${index}" aria-label="${item.store}权益">
            <div class="pass-card-main">
              <div class="pass-card-topline">
                <span class="pass-card-kicker">第 ${index + 1} 站</span>
                <span class="pass-card-state">${status}</span>
              </div>
              <div class="pass-card-titleline">
                <strong class="pass-card-title">${item.store}</strong>
                ${action}
              </div>
              <small class="pass-card-meta">${item.area} · ${item.hours}</small>
              <p class="pass-card-desc">${item.desc}</p>
              <div class="pass-benefit-inline">
                <span>权益</span>
                <b>${item.benefit}</b>
              </div>
              <div class="pass-live-details" aria-label="${item.store}实时信息">
                ${liveDetails.map((detail) => `
                  <span>
                    <small>${detail.label}</small>
                    <b>${detail.value}</b>
                  </span>
                `).join("")}
              </div>
            </div>
            <div class="pass-card-media" aria-label="${item.store}图片">
              <figure class="pass-store-photo">
                <img src="${stopPhotoForPass(routeItem, item, index)}" alt="${item.store}店铺环境" loading="lazy" />
                <figcaption>店铺环境</figcaption>
              </figure>
              <figure class="pass-benefit-photo">
                <img src="${benefitPhotoForPass(routeItem, item, index)}" alt="${item.benefit}" loading="lazy" />
                <figcaption>权益商品</figcaption>
              </figure>
            </div>
          </${cardTag}>
        `;
      }).join(""),
    "pass-stop-carousel",
    "城市通行证站点",
    routeItem.benefits.map((item) => item.store),
    focusIndex
  );
}

function passStationLiveDetails(routeItem, item, index, pass, status) {
  const segmentCount = Math.max(routeItem.benefits.length - 1, 1);
  const segmentKm = Math.max(0.2, routeItem.distance / segmentCount);
  const walkMinutes = index === 0 ? 0 : Math.max(4, Math.round((segmentKm * 1000) / 72));
  const redemptionText = !pass
    ? "开启后可用"
    : status === "未使用"
      ? "到店出示码"
      : status;
  return [
    { label: "营业", value: item.hours },
    { label: "预计步行", value: index === 0 ? "起点" : `${walkMinutes}min` },
    { label: "核销窗口", value: redemptionText }
  ];
}

function passArchivePanelHTML(routeItem, pass, status) {
  const total = routeItem.benefits.length;
  const redeemed = pass.redeemed.length;
  return `
    <article class="route-overview-panel pass-archive-panel">
      <div>
        <span>${passStatusLabel(status)}</span>
        <strong>${routeItem.title}</strong>
        <p>${status === "completed" ? "这张城市通行证已经保存到我的 LOOP。" : "通行证已过期，路线和已核销记录仍可回看。"}</p>
      </div>
      <div class="route-compact-tags">
        <span>${redeemed}/${total} 已核销</span>
        <span>${routeItem.price}</span>
        <span>${routeItem.distance}km</span>
        <span>${routeItem.duration}</span>
      </div>
    </article>
  `;
}

function passNextActionPanelHTML(routeItem, pass, benefit) {
  const index = routeItem.benefits.findIndex((item) => item.id === benefit.id);
  return `
    <article class="pass-next-action">
      <div>
        <span>正在使用城市通行证 · 下一站 ${index + 1}/${routeItem.benefits.length}</span>
        <strong>${benefit.store}</strong>
        <p>${benefit.area} · ${benefit.benefit} · ${benefit.hours}</p>
      </div>
      <button type="button" data-next-redeem="${benefit.id}">出示这一站核销码</button>
    </article>
  `;
}

function passStoreDetailPanelHTML(routeItem, pass, benefit, index) {
  const status = featuredStopStatus(pass, benefit.id);
  const passStatus = pass ? featuredPassStatus(pass) : "";
  const canRedeem = passStatus === "active" && status === "未使用";
  const action = canRedeem
    ? `<button class="pass-redeem" type="button" data-benefit-id="${benefit.id}">出示核销码</button>`
    : `<span class="pass-detail-state">${storeDetailStateText(pass, status)}</span>`;
  return `
    <article class="pass-stop pass-stop-detail ${status === "已核销" ? "is-redeemed" : ""}">
      <div>
        <span>${String(index + 1).padStart(2, "0")} · ${benefit.routeRole}</span>
        <strong>${benefit.store}</strong>
        <p>${benefit.desc}</p>
        <small>${benefit.area} · ${benefit.hours}</small>
      </div>
      <div class="pass-benefit">
        <em>${benefit.benefit}</em>
        ${action}
      </div>
    </article>
  `;
}

function storeDetailStateText(pass, status) {
  if (!pass) return "开启后显示核销码";
  return status;
}

function featuredPassDetailActionText(status, routeItem, pass) {
  if (status === "active") {
    if (routeFocusedIndex(routeItem) !== featuredPassPrimaryIndex(routeItem, pass)) return "回到当前站";
    if (!isFeaturedPassAtLastActionStop(routeItem, pass)) return "继续下一站";
    return canCompleteFeaturedPass(pass, routeItem) ? "完成通行证" : "结束路线";
  }
  if (status === "completed") return "已完成";
  if (status === "expired") return "已过期";
  return "开启这张地图";
}

function featuredPassPrimaryIndex(routeItem, pass) {
  const total = Math.max(routeItem?.stops?.length || 0, routeItem?.benefits?.length || 0, 1);
  if (state.explorationActive && state.explorationRoute?.id === routeItem?.id) {
    return Math.min(Math.max(state.routeProgress || 0, 0), total - 1);
  }
  const nextIndex = pass?.redeemed
    ? routeItem.benefits.findIndex((item) => !pass.redeemed.includes(item.id))
    : 0;
  return Math.min(Math.max(nextIndex < 0 ? total - 1 : nextIndex, 0), total - 1);
}

function isFeaturedPassAtLastActionStop(routeItem, pass) {
  const total = Math.max(routeItem?.stops?.length || 0, routeItem?.benefits?.length || 0, 1);
  return featuredPassPrimaryIndex(routeItem, pass) >= total - 1;
}

function canCompleteFeaturedPass(pass, routeItem) {
  return isFeaturedPassFullyRedeemed(pass, routeItem);
}

function passStatusLine(pass, routeItem, status) {
  if (!pass) return `${routeItem.benefits.length} 家店 · 每家 1 次权益 · 购买后 ${routeItem.validDays} 天内可用`;
  const redeemed = pass.redeemed?.length || 0;
  const total = routeItem.benefits.length;
  if (status === "completed" && pass.expiredCompletedAt) return `已完成 · ${redeemed}/${total} 已核销 · 其余权益已过期`;
  if (status === "completed") return `已完成 · ${redeemed}/${total} 已核销`;
  if (status === "expired") return `已过期 · ${redeemed}/${total} 已核销`;
  if (pass.explorationCompletedAt) return `路线已完成 · ${redeemed}/${total} 已核销 · 还剩 ${daysRemaining(pass)} 天`;
  return `已支付 · ${redeemed}/${total} 已核销 · 还剩 ${daysRemaining(pass)} 天`;
}

function featuredStopActionText(pass, stopStatus) {
  if (!pass) return "查看权益";
  if (stopStatus === "未使用") return "出示核销码";
  return stopStatus;
}

function currentActionStop(routeItem) {
  const stops = routeItem.isFeaturedPass ? routeItem.benefits.map((item) => item.store) : routeItem.stops;
  const total = Math.max(stops.length, 1);
  const index = Math.min(Math.max(state.routeProgress || 0, 0), total - 1);
  const isLast = index >= total - 1;
  return {
    index,
    total,
    name: stops[index] || routeItem.title,
    next: stops[index + 1] || "",
    isLast
  };
}

function finalActionHint(stop) {
  if (stop.isLast) return "最后一站：确认后可以结束这条路线。";
  return `下一站：${stop.next}`;
}

function openPassActionSheet(mode, routeItem, benefitId = null) {
  if (!routeItem) return;
  state.passActionMode = mode;
  state.passActionRouteId = routeItem.id;
  state.passActionBenefitId = benefitId;
  renderPassActionSheet();
}

function closePassActionSheet() {
  state.passActionMode = "";
  state.passActionRouteId = null;
  state.passActionBenefitId = null;
  state.activeRedemptionRouteId = null;
  state.activeRedemptionBenefitId = null;
  dom.passActionSheet.hidden = true;
  dom.passActionBackdrop.hidden = true;
  dom.passActionSheet.dataset.mode = "";
  dom.passActionContent.innerHTML = "";
}

function renderPassActionSheet() {
  const routeItem = routeById(state.passActionRouteId);
  if (!routeItem) {
    closePassActionSheet();
    return;
  }
  let content = "";
  if (state.passActionMode === "redemption") {
    const pass = getFeaturedPass(routeItem.id);
    const benefit = routeItem.benefits?.find((item) => item.id === state.passActionBenefitId);
    if (!pass || !benefit) {
      closePassActionSheet();
      return;
    }
    content = redemptionCodePanelHTML(routeItem, pass, benefit);
  } else if (state.passActionMode === "checkin") {
    content = checkinActionPanelHTML(routeItem);
  } else if (state.passActionMode === "photo") {
    content = photoActionPanelHTML(routeItem);
  } else if (state.passActionMode === "camera") {
    content = cameraActionPanelHTML(routeItem);
  } else if (state.passActionMode === "upload") {
    content = uploadActionPanelHTML(routeItem);
  }
  if (!content) {
    closePassActionSheet();
    return;
  }
  dom.passActionSheet.dataset.mode = state.passActionMode;
  dom.passActionContent.innerHTML = content;
  dom.passActionBackdrop.hidden = false;
  dom.passActionSheet.hidden = false;
}

function checkinActionPanelHTML(routeItem) {
  const stop = currentActionStop(routeItem);
  return `
    <article class="pass-action-card checkin-action-card">
      <p class="eyebrow">LOCATION CHECK-IN</p>
      <h2 id="passActionTitle">定位打卡</h2>
      <p>确认你已经到达这一站后，路线才会推进到下一站。</p>
      <div class="action-mini-map">
        <span>第 ${stop.index + 1}/${stop.total} 站</span>
        <strong>${stop.name}</strong>
        <small>${finalActionHint(stop)}</small>
      </div>
      <div class="pass-action-buttons">
        <button class="secondary-button" type="button" data-pass-action-cancel>稍后打卡</button>
        <button class="primary-button" type="button" data-pass-action-confirm>确认到达本站</button>
      </div>
    </article>
  `;
}

function photoActionPanelHTML(routeItem) {
  const stop = currentActionStop(routeItem);
  return `
    <article class="pass-action-card photo-action-card">
      <p class="eyebrow">PHOTO LOG</p>
      <h2 id="passActionTitle">拍照记录</h2>
      <p>你要现场拍一张，还是从相册上传？保存后会进入“我的”的今天、本周、本月和全年记录。</p>
      <div class="photo-source-grid">
        <button type="button" data-photo-source="camera">
          <span>拍照</span>
          <strong>打开拍照框</strong>
          <small>第 ${stop.index + 1}/${stop.total} 站 · ${stop.name}</small>
        </button>
        <button type="button" data-photo-source="upload">
          <span>上传照片</span>
          <strong>从相册选择</strong>
          <small>把已有照片保存到这一站</small>
        </button>
      </div>
    </article>
  `;
}

function photoPreviewForRoute(routeItem) {
  const stop = currentActionStop(routeItem);
  if (routeItem.isFeaturedPass) return stopPhotoForPass(routeItem, routeItem.benefits[stop.index] || routeItem.benefits[0], stop.index, 720, 460);
  return stopPhotoForRoute(routeItem, stop.index);
}

function cameraActionPanelHTML(routeItem) {
  const stop = currentActionStop(routeItem);
  const photo = photoPreviewForRoute(routeItem);
  return `
    <article class="pass-action-card photo-action-card">
      <p class="eyebrow">CAMERA</p>
      <h2 id="passActionTitle">拍照</h2>
      <p>对准这一站的现场，按下快门后保存到今日回路。</p>
      <figure class="camera-frame">
        <img class="mock-photo" src="${photo}" alt="${stop.name}" loading="lazy" />
        <i></i>
        <figcaption>第 ${stop.index + 1}/${stop.total} 站 · ${stop.name}</figcaption>
      </figure>
      <div class="pass-action-buttons">
        <button class="secondary-button" type="button" data-pass-action-cancel>取消</button>
        <button class="primary-button camera-shutter" type="button" data-pass-action-confirm>按下快门并保存</button>
      </div>
    </article>
  `;
}

function uploadActionPanelHTML(routeItem) {
  const stop = currentActionStop(routeItem);
  const photo = photoPreviewForRoute(routeItem);
  return `
    <article class="pass-action-card photo-action-card">
      <p class="eyebrow">UPLOAD</p>
      <h2 id="passActionTitle">上传照片</h2>
      <p>选择一张和这一站有关的照片，保存后会同步进入个人记录。</p>
      <figure class="upload-drop">
        <img class="mock-photo" src="${photo}" alt="${stop.name}" loading="lazy" />
        <figcaption>已选择模拟照片 · ${stop.name}</figcaption>
      </figure>
      <div class="pass-action-buttons">
        <button class="secondary-button" type="button" data-pass-action-cancel>取消</button>
        <button class="primary-button" type="button" data-pass-action-confirm>保存上传照片</button>
      </div>
    </article>
  `;
}

function redemptionCodePanelHTML(routeItem, pass, benefit) {
  const code = redemptionCode(pass, benefit.id);
  return `
    <article class="redemption-code-panel">
      <div>
        <span>到店核销凭证</span>
        <h2 id="passActionTitle">${benefit.store}</h2>
        <p>${benefit.benefit} · ${benefit.hours}</p>
      </div>
      <div class="redemption-code-body">
        <div class="qr-code" aria-label="核销二维码">${qrCodeHTML(code)}</div>
        <div>
          <small>核销码</small>
          <b>${code}</b>
          <em>${routeItem.title} · ${pass.orderNo}</em>
        </div>
      </div>
      <div class="pass-action-buttons">
        <button class="secondary-button" type="button" data-pass-action-cancel>稍后使用</button>
        <button class="primary-button simulate-scan" type="button" data-pass-action-confirm data-benefit-id="${benefit.id}">模拟店员扫码核销</button>
      </div>
    </article>
  `;
}

function redemptionCode(pass, benefitId) {
  const seed = Math.abs(stableHash(`${pass.id}-${pass.orderNo}-${benefitId}`)) % 1000000;
  return String(seed).padStart(6, "0").replace(/(\d{3})(\d{3})/, "$1 $2");
}

function qrCodeHTML(code) {
  const compact = code.replace(/\s/g, "");
  return Array.from({ length: 49 }, (_, index) => {
    const fixedCorner = index < 3 || index % 7 < 2 || index > 39;
    const bit = (stableHash(`${compact}-${index}`) + index) % 3 !== 0;
    return `<span class="${fixedCorner || bit ? "is-on" : ""}"></span>`;
  }).join("");
}

function openRedemptionCode(routeItem, benefitId) {
  const pass = getFeaturedPass(routeItem.id);
  if (!pass) {
    showToast("先开启这张地图，再到店核销。");
    return;
  }
  const status = featuredPassStatus(pass);
  if (status === "expired") {
    showToast("这张通行证已过期。");
    renderRouteDetail();
    return;
  }
  if (status === "completed") {
    showToast("这张城市通行证已经完成。");
    return;
  }
  if (pass.redeemed.includes(benefitId)) {
    showToast("这一站已经核销过。");
    return;
  }
  state.activeRedemptionRouteId = routeItem.id;
  state.activeRedemptionBenefitId = benefitId;
  state.expandedFeaturedStopId = benefitId;
  openPassActionSheet("redemption", routeItem, benefitId);
}

function openCheckinSheet() {
  const routeItem = state.explorationRoute || state.activeRoute;
  if (!routeItem) return;
  openPassActionSheet("checkin", routeItem);
}

function openPhotoSheet() {
  const routeItem = state.explorationRoute || state.activeRoute;
  if (!routeItem) return;
  openPassActionSheet("photo", routeItem);
}

function confirmPassAction() {
  const mode = state.passActionMode;
  const routeItem = routeById(state.passActionRouteId);
  const benefitId = state.passActionBenefitId;
  closePassActionSheet();
  if (!routeItem) return;
  if (mode === "redemption") {
    redeemFeaturedStop(routeItem, benefitId);
    return;
  }
  if (mode === "checkin") {
    if (requestNativeLocation(routeItem)) return;
    confirmCheckinAction(routeItem);
    return;
  }
  if (mode === "camera" || mode === "upload") confirmPhotoAction(routeItem, mode);
}

function confirmCheckinAction(routeItem, locationAsset = null) {
  const total = routeItem.stops.length;
  const lastIndex = total - 1;
  if (state.routeProgress < lastIndex) {
    state.routeProgress += 1;
    state.routeStopFocus = state.routeProgress;
    state.photoTaken = false;
    showToast(`已完成本站定位，下一站：${routeItem.stops[state.routeProgress]}`);
  } else {
    showToast("已到最后一站，可以完成探索。");
  }
  if (locationAsset) {
    state.lastCheckinLocation = {
      ...locationAsset,
      routeId: routeItem.id,
      routeTitle: routeItem.title
    };
  }
  persistUserState();
  renderRouteDetail();
  renderOngoingExploration();
}

function confirmPhotoAction(routeItem, source = "camera") {
  const result = savePhotoRecord(routeItem, source);
  const saved = Boolean(result.saved);
  state.photoTaken = saved || state.photoTaken;
  if (saved && result.record && result.photo) {
    const payload = buildPhotoRecordPayload(routeItem, source, null, result.record, result.photo);
    void syncPhotoRecord(payload, result.record, result.photo);
  }
  showToast(saved ? `${currentActionStop(routeItem).name} 的照片已保存到我的 LOOP。` : "这一站已经保存过照片，每个站点只能保留一张。");
  persistUserState();
  renderRouteDetail();
  renderOngoingExploration();
  if (state.view === "folio") renderProfile();
}

function savePhotoRecord(routeItem, source = "camera", photoAsset = null) {
  const fallbackStop = currentActionStop(routeItem);
  const stop = Number.isInteger(photoAsset?.stopIndex)
    ? {
      ...fallbackStop,
      index: photoAsset.stopIndex,
      name: photoAsset.station || fallbackStop.name
    }
    : fallbackStop;
  const sourceText = source === "upload" ? "上传照片" : "拍照";
  const day = dayOfYear(new Date());
  const dateISO = new Date().toISOString().slice(0, 10);
  const recordId = `rec-photo-${day}-${routeItem.id}`;
  const routeStops = routeItem.isFeaturedPass ? routeItem.benefits.map((item) => item.store) : routeItem.stops;
  const photoUrl = photoAsset?.imageDataUrl || photoPreviewForRoute(routeItem);
  const photo = {
    station: stop.name,
    stopIndex: stop.index,
    source: sourceText,
    url: photoUrl,
    mimeType: photoAsset?.mimeType || "",
    width: photoAsset?.width || 0,
    height: photoAsset?.height || 0,
    capturedAt: photoAsset?.capturedAt || new Date().toISOString()
  };
  const existing = state.records.find((record) => record.id === recordId);
  if (existing) {
    const existingPhotos = Array.isArray(existing.photos) ? existing.photos : [];
    const existingPhoto = existingPhotos.some((item) => item.stopIndex === stop.index || item.station === stop.name);
    if (existingPhoto) return { saved: false, record: existing, photo: null };
    existing.photos = [...existingPhotos, photo];
    existing.photo = true;
    existing.photoSource = sourceText;
    existing.routeId = existing.routeId || routeItem.id;
    existing.updatedAt = new Date().toISOString();
    existing.note = `${routeItem.title} 已保存 ${existing.photos.length} 个站点照片。`;
    return { saved: true, record: existing, photo };
  }
  const record = {
    id: recordId,
    day,
    dateISO,
    title: routeItem.title,
    routeId: routeItem.id,
    photo: true,
    photoSource: sourceText,
    photos: [photo],
    layer: routeItem.layer,
    time: currentTimeText(),
    mood: sourceText,
    stops: routeStops?.length ? routeStops : [stop.name],
    city: routeItem.city || state.city,
    duration: routeItem.duration || "即时记录",
    budget: "照片记录",
    note: `${sourceText}已保存：${stop.name} 会出现在今天、本周、本月、全年和所有站点里。`
  };
  state.records.unshift(record);
  return { saved: true, record, photo };
}

function continueFeaturedPass(routeItem) {
  const pass = getFeaturedPass(routeItem.id);
  if (!pass || featuredPassStatus(pass) !== "active") return;
  const nextIndex = Math.max(0, routeItem.benefits.findIndex((item) => !pass.redeemed.includes(item.id)));
  if (!startFeaturedPassExploration(routeItem)) return;
  state.routeStopFocus = nextIndex;
  state.routeProgress = Math.min(nextIndex, routeItem.stops.length - 1);
  state.expandedFeaturedStopId = null;
  state.activeRedemptionRouteId = null;
  state.activeRedemptionBenefitId = null;
  renderRouteDetail();
  const nextStop = routeItem.benefits[nextIndex];
  showToast(nextStop ? `已定位到下一站：${nextStop.store}` : "这张城市通行证已经走完。");
}

function handleActiveFeaturedPassPrimaryAction(routeItem, pass) {
  const sameRoute = state.explorationActive && state.explorationRoute?.id === routeItem.id;
  if (!sameRoute) {
    const started = startFeaturedPassExploration(routeItem);
    if (started) showToast("已回到这张城市通行证路线。");
    return;
  }
  const actionIndex = featuredPassPrimaryIndex(routeItem, pass);
  if (routeFocusedIndex(routeItem) !== actionIndex) {
    state.routeStopFocus = actionIndex;
    renderRouteDetail();
    showToast("已回到当前可行动站。");
    return;
  }
  if (!isRouteAtLastStop(routeItem)) {
    openCheckinSheet();
    return;
  }
  if (canCompleteFeaturedPass(pass, routeItem)) {
    completeFeaturedPass(routeItem, pass);
    return;
  }
  completeFeaturedPassExploration(routeItem, pass);
}

function stopDetail(stop, routeItem, index) {
  const task = routeItem.taskDetails?.[index];
  if (task) {
    return {
      role: `任务 ${String(index + 1).padStart(2, "0")}`,
      feature: task.brief,
      use: "到达后可定位打卡，也可以拍一张照片解锁这一段任务。",
      tip: `${stop} 会在实际探索中支持定位打卡和照片记录。`
    };
  }
  const layer = layerName(routeItem.layer).name;
  const roles = ["进入状态", "主要停留", "观察切换", "补充体验", "拍照记录", "收尾回看"];
  const layerFeatures = {
    coffee: "适合坐下来调整节奏，观察街区人流和店内细节。",
    drink: "适合把夜晚放慢，用一杯酒打开更私人的城市状态。",
    theatre: "适合进入现场情绪，散场后保留一点余味。",
    art: "适合看展、看空间和光线，让路线不只是移动。",
    fashion: "适合看橱窗、材质和年轻品牌如何表达城市审美。",
    bookstore: "适合翻书、看杂志，也适合给今天找一个安静主题。",
    music: "适合用声音进入街区，现场或唱片都能改变出门状态。",
    cinema: "适合把城市当成电影外景，散场后继续走一段。",
    architecture: "适合看立面、尺度、入口和建筑如何改变街道气质。",
    citywalk: "适合慢走、绕路、观察日常里容易被忽略的细节。",
    market: "适合看摊位、主理人和周末人群，让路线更有生活感。",
    wellness: "适合恢复体力和情绪，把城市探索变得更轻。",
    night: "适合低光、夜路和安静收尾，不用把夜晚过得很吵。",
    anime: "适合逛周边、漫画、手办和主题空间，看年轻文化密度。",
    tufting: "适合动手完成一块小作品，把探索变成可以带走的物件。",
    pottery: "适合拉坯、上釉和看器物，让时间变慢。",
    floristry: "适合选花、包花和拍照，把日常换成更有仪式感的一段。",
    dance: "适合用身体进入城市，公开课或舞室会让节奏完全不同。"
  };
  const uses = [
    "作为路线的第一步，先把今天的状态从日常里切出来。",
    "这里是路线的核心停留点，建议留出更完整的时间。",
    "这里负责换一个视角，让路线从单一兴趣延伸到街区。",
    "这里适合补充照片、短暂停留或临时改变节奏。",
    "这里适合把今天留下来，拍照、记录心情或完成打卡。",
    "这里是收尾点，适合回看刚才经过的城市线索。"
  ];
  return {
    role: roles[Math.min(index, roles.length - 1)],
    feature: layerFeatures[routeItem.layer] || `适合靠近${layer}，也适合观察这座城市的另一面。`,
    use: uses[Math.min(index, uses.length - 1)],
    tip: `${stop} 会在实际探索中支持定位打卡和照片记录。`
  };
}

function routeStopInsightHTML(routeItem, index) {
  const stop = routeItem.stops[index] || routeItem.stops[0];
  const detail = stopDetail(stop, routeItem, index);
  return `
    <article class="stop-insight">
      <span>${String(index + 1).padStart(2, "0")} / ${detail.role}</span>
      <strong>${stop}</strong>
      <p>${detail.feature}</p>
      <small>${detail.use}</small>
    </article>
  `;
}

function routeStopCarouselHTML(routeItem, focusIndex) {
  return routeCarouselShellHTML(
    routeItem.stops.map((stop, index) => {
        const detail = stopDetail(stop, routeItem, index);
        const classes = [
          "route-stop-card",
          index === focusIndex ? "is-focused" : "",
          state.routeDetailMode === "active" && index <= state.routeProgress ? "is-current" : ""
        ].filter(Boolean).join(" ");
        return `
          <button class="${classes}" type="button" data-stop-index="${index}" aria-label="查看${stop}详情">
            <img class="route-card-photo" src="${stopPhotoForRoute(routeItem, index)}" alt="${stop}" loading="lazy" />
            <div class="route-card-copy">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${stop}</strong>
              <small>${detail.role}</small>
              <p>${detail.feature}</p>
              <em>${detail.use}</em>
            </div>
          </button>
        `;
      }).join(""),
    "",
    "路线站点",
    routeItem.stops,
    focusIndex
  );
}

function routeCarouselShellHTML(cardsHTML, className, label, lineItems = [], focusIndex = 0) {
  return `
    <div class="route-stop-stage ${className}" data-route-stage style="--stop-count:${Math.max(lineItems.length, 1)}">
      ${routeLineMapHTML(lineItems, focusIndex)}
      <div class="route-card-rail">
        <button class="route-scroll-button is-prev" type="button" data-route-scroll="-1" aria-label="上一站">‹</button>
        <div class="route-stop-carousel ${className}" aria-label="${label}">
          ${cardsHTML}
        </div>
        <button class="route-scroll-button is-next" type="button" data-route-scroll="1" aria-label="下一站">›</button>
      </div>
      <small class="route-swipe-hint">左右滑动查看全部站点</small>
    </div>
  `;
}

function routeLineMapHTML(items, focusIndex) {
  if (!items.length) return "";
  return `
    <div class="route-line-map" aria-label="路线顺序">
      ${items.map((item, index) => {
          const label = typeof item === "string" ? item : item?.store || item?.routeRole || `第 ${index + 1} 站`;
          const shortLabel = String(label).replace(/^第\s*/, "").replace(/\s*站$/, "站");
          return `
            <button class="route-line-stop${index === focusIndex ? " is-active" : ""}" type="button" data-route-line-index="${index}" aria-label="切到第 ${index + 1} 站">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${shortLabel}</strong>
            </button>
          `;
        }).join("")}
    </div>
  `;
}

function bindRouteCarouselControls() {
  const stage = dom.virtualMap.querySelector("[data-route-stage]");
  const carousel = stage?.querySelector(".route-stop-carousel");
  if (!carousel) return;
  const cards = Array.from(carousel.querySelectorAll(".route-stop-card"));
  const lineStops = Array.from(stage.querySelectorAll("[data-route-line-index]"));
  let routeScrollLock = false;
  let routeScrollLockTimer = 0;
  const syncRouteLineFocus = (index) => {
    const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
    stage.dataset.focusIndex = String(safeIndex);
    state.routeStopFocus = safeIndex;
    cards.forEach((card, cardIndex) => card.classList.toggle("is-focused", cardIndex === safeIndex));
    lineStops.forEach((stop, stopIndex) => stop.classList.toggle("is-active", stopIndex === safeIndex));
    updateRouteActionButtons();
  };
  const releaseRouteScrollLock = () => {
    window.clearTimeout(routeScrollLockTimer);
    routeScrollLockTimer = window.setTimeout(() => {
      routeScrollLock = false;
      delete carousel.dataset.routeScrollTarget;
      syncRouteLineFocus(nearestRouteCardIndex(carousel, cards));
    }, 620);
  };
  const scrollCarouselToIndex = (index, behavior = "smooth") => {
    const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
    const target = cards[safeIndex];
    if (!target) return;
    if (scrollFrame) {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
    }
    carousel.dataset.routeScrollTarget = String(Number(target.dataset.stopIndex || safeIndex));
    syncRouteLineFocus(Number(target.dataset.stopIndex || safeIndex));
    routeScrollLock = behavior !== "auto";
    carousel.scrollTo({
      left: target.offsetLeft - carousel.offsetLeft,
      behavior
    });
    if (routeScrollLock) releaseRouteScrollLock();
    else delete carousel.dataset.routeScrollTarget;
  };
  stage.querySelectorAll("[data-route-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.routeScroll || 1);
      scrollCarouselToIndex(nearestRouteCardIndex(carousel, cards) + direction);
    });
  });
  lineStops.forEach((button) => {
    button.addEventListener("click", () => scrollCarouselToIndex(Number(button.dataset.routeLineIndex || 0)));
  });
  let scrollFrame = 0;
  carousel.addEventListener("scroll", () => {
    const targetIndex = carousel.dataset.routeScrollTarget;
    if (targetIndex !== undefined) {
      syncRouteLineFocus(Number(targetIndex));
      return;
    }
    if (routeScrollLock) return;
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      if (routeScrollLock) {
        scrollFrame = 0;
        return;
      }
      syncRouteLineFocus(nearestRouteCardIndex(carousel, cards));
      scrollFrame = 0;
    });
  }, { passive: true });
  const focused = carousel.querySelector(".route-stop-card.is-focused");
  if (focused) {
    requestAnimationFrame(() => {
      scrollCarouselToIndex(Number(focused.dataset.stopIndex || 0), "auto");
    });
  }
}

function nearestRouteCardIndex(carousel, cards) {
  if (!cards.length) return 0;
  const carouselBox = carousel.getBoundingClientRect();
  const center = carouselBox.left + carouselBox.width / 2;
  return cards.reduce((bestIndex, card, index) => {
    const bestCard = cards[bestIndex];
    const cardBox = card.getBoundingClientRect();
    const bestBox = bestCard.getBoundingClientRect();
    const distance = Math.abs(cardBox.left + cardBox.width / 2 - center);
    const bestDistance = Math.abs(bestBox.left + bestBox.width / 2 - center);
    return distance < bestDistance ? index : bestIndex;
  }, 0);
}

function stopPhotoForRoute(routeItem, index) {
  const stop = routeItem.stops?.[index] || index;
  return photoForLayer(routeItem.layer, `${routeItem.id}-${stop}-${index}`, routeItem.city || state.city, 720, 420);
}

function stopPhotoForPass(routeItem, benefit, index, width = 720, height = 420) {
  const title = `${routeItem.theme || routeItem.title}-${benefit?.store || index}`;
  const layer = routeItem.theme?.includes("咖啡")
    ? "coffee"
    : routeItem.theme?.includes("夜") || routeItem.theme?.includes("酒")
      ? "drink"
      : routeItem.theme?.includes("艺术")
        ? "art"
        : "city";
  return photoForLayer(layer, title, routeItem.city || state.city, width, height);
}

function benefitPhotoForPass(routeItem, benefit, index) {
  const benefitText = `${routeItem.theme || ""}-${benefit?.benefit || ""}-${benefit?.store || ""}`;
  const layer = /酒|wine|jazz|自然酒|爵士/i.test(benefitText)
    ? "drink"
    : /展|艺术|art|museum|gallery/i.test(benefitText)
      ? "art"
      : /咖啡|拿铁|美式|手冲|冷萃|espresso|latte|brew/i.test(benefitText)
        ? "coffee"
        : routeItem.layer || "city";
  return photoForLayer(layer, `benefit-${routeItem.id}-${benefit?.id || index}`, routeItem.city || state.city, 520, 520);
}

function routeOverviewPanelHTML(routeItem) {
  return `
    <article class="route-overview-panel">
      <div>
        <span>${layerName(routeItem.layer).name}路线</span>
        <strong>${routeItem.desc}</strong>
      </div>
      <div class="route-compact-tags">
        <span>${routeItem.stops.length}站</span>
        <span>${routeItem.duration}</span>
        <span>${routeItem.distance || 1.4}km</span>
        <span>${routeItem.budget}</span>
      </div>
    </article>
  `;
}

function activeRoutePanelHTML(routeItem, current, total, currentStop, elapsed) {
  return `
    <article class="route-overview-panel is-active-route">
      <div>
        <span>正在探索 · 第 ${current}/${total} 站</span>
        <strong>${currentStop}</strong>
        <p>到达后可定位打卡，也可以拍照把这一站留进今日回路。</p>
      </div>
      <div class="route-compact-tags">
        <span>${elapsed}</span>
        <span>${state.photoTaken ? "本站已拍照" : "等待拍照"}</span>
        <span>${Math.round(explorationProgress(routeItem))}%</span>
      </div>
    </article>
  `;
}

function needsExplorationSwitch(nextRoute) {
  return Boolean(state.explorationActive && state.explorationRoute && state.explorationRoute.id !== nextRoute.id);
}

function confirmExplorationSwitch(nextRoute, action = "start-route") {
  if (!state.explorationActive || !state.explorationRoute) return true;
  if (state.explorationRoute.id === nextRoute.id) return true;
  openExplorationSwitchConfirm(nextRoute, action);
  return false;
}

function openExplorationSwitchConfirm(nextRoute, action = "start-route") {
  if (!nextRoute) return;
  state.pendingSwitchRouteId = nextRoute.id;
  state.pendingSwitchAction = action;
  dom.switchCurrentRoute.textContent = `正在探索：${state.explorationRoute?.title || "当前地图"}`;
  dom.switchNextRoute.textContent = `即将开启：${nextRoute.title}`;
  dom.switchConfirmBody.textContent = "当前进度会保存到历史记录，不会丢失；确认后再切换到新地图。";
  dom.switchConfirmBackdrop.hidden = false;
  dom.switchConfirmSheet.hidden = false;
}

function closeExplorationSwitchConfirm() {
  state.pendingSwitchRouteId = null;
  state.pendingSwitchAction = "";
  dom.switchConfirmBackdrop.hidden = true;
  dom.switchConfirmSheet.hidden = true;
}

function resolveExplorationSwitch() {
  const routeItem = routeById(state.pendingSwitchRouteId);
  const action = state.pendingSwitchAction;
  if (!routeItem || !action) {
    closeExplorationSwitchConfirm();
    return;
  }
  archiveInterruptedExploration(state.explorationRoute, "切换地图");
  closeExplorationSwitchConfirm();
  if (action === "pay-featured") {
    payFeaturedPass(routeItem, { confirmedSwitch: true });
    return;
  }
  if (action === "start-featured" || action === "continue-featured") {
    startFeaturedPassExploration(routeItem, { confirmedSwitch: true });
    return;
  }
  startExploration(routeItem, { confirmedSwitch: true });
}

function archiveInterruptedExploration(routeItem, reason = "阶段保存") {
  if (!routeItem) return;
  const total = routeItem.stops?.length || routeItem.benefits?.length || 1;
  const progress = Math.min((state.routeProgress || 0) + 1, total);
  const stops = routeItem.stops?.length
    ? routeItem.stops
    : routeItem.benefits?.map((item) => item.store) || [routeItem.title];
  state.records.push({
    id: `rec-switch-${Date.now()}`,
    day: dayOfYear(new Date()),
    dateISO: new Date().toISOString().slice(0, 10),
    title: routeItem.title,
    photo: state.photoTaken,
    layer: routeItem.layer,
    time: currentTimeText(),
    mood: reason,
    stops,
    city: routeItem.city || state.city,
    duration: formatElapsed(Date.now() - (state.explorationStartedAt || Date.now())),
    budget: routeItem.isFeaturedPass ? routeItem.price : routeItem.budget,
    note: `${routeItem.title} 已阶段保存：进行到第 ${progress}/${total} 站，之后可从历史记录回看。`,
    partial: true
  });
  persistUserState();
}

function beginRouteExploration() {
  if (!state.activeRoute) return;
  startExploration(state.activeRoute);
}

function startExploration(routeItem, options = {}) {
  const sameRoute = state.explorationActive && state.explorationRoute?.id === routeItem.id;
  if (!sameRoute && !options.confirmedSwitch && !confirmExplorationSwitch(routeItem, "start-route")) return false;
  state.explorationActive = true;
  state.explorationRoute = routeItem;
  state.activeRoute = routeItem;
  state.routeDetailMode = "active";
  state.selectedRouteId = routeItem.id;
  if (!sameRoute) {
    state.routeProgress = 0;
    state.routeStopFocus = 0;
    state.photoTaken = false;
    state.explorationStartedAt = Date.now();
  }
  dom.routeBackdrop.hidden = false;
  dom.routeDetailSheet.hidden = false;
  renderRouteDetail();
  renderOngoingExploration();
  persistUserState();
  showToast(sameRoute ? "已回到正在探索的路线。" : "探索已开始，可以随时从底部继续。");
  return true;
}

function openOngoingExploration() {
  if (!state.explorationActive || !state.explorationRoute) return;
  state.activeRoute = state.explorationRoute;
  state.routeDetailMode = "active";
  dom.routeBackdrop.hidden = false;
  dom.routeDetailSheet.hidden = false;
  renderRouteDetail();
}

function renderOngoingExploration() {
  const routeItem = state.explorationRoute;
  const visible = Boolean(state.explorationActive && routeItem);
  dom.ongoingExploration.hidden = !visible;
  dom.appFrame.classList.toggle("has-ongoing", visible);
  if (!visible) {
    if (state.view === "folio") renderOngoingInterestMap();
    return;
  }
  const total = routeItem.stops.length;
  const current = Math.min(state.routeProgress + 1, total);
  const currentStop = routeItem.stops[state.routeProgress] || routeItem.stops[total - 1];
  dom.ongoingStatus.textContent = `正在探索 · ${formatElapsed(Date.now() - (state.explorationStartedAt || Date.now()))}`;
  dom.ongoingTitle.textContent = routeItem.title;
  dom.ongoingMeta.textContent = `第 ${current}/${total} 站 · ${currentStop}`;
  dom.ongoingProgressBar.style.width = `${Math.max(8, explorationProgress(routeItem))}%`;
  dom.ongoingExploration.style.setProperty("--route-art", routeArt[routeItem.layer] || routeArt.default);
  if (state.view === "folio") renderOngoingInterestMap();
}

function explorationProgress(routeItem) {
  const total = routeItem?.stops?.length || 1;
  return Math.round((state.routeProgress / Math.max(total - 1, 1)) * 100);
}

function buyFeaturedPass(routeItem) {
  if (!routeItem?.isFeaturedPass) return;
  const existing = getFeaturedPass(routeItem.id);
  if (existing) {
    showToast("这张城市通行证已经在你的地图里。");
    state.featuredPaymentRouteId = null;
    state.routeDetailMode = featuredPassStatus(existing) === "active" ? "active" : "preview";
    renderRouteDetail();
    return;
  }
  state.featuredPaymentRouteId = routeItem.id;
  renderRouteDetail();
}

function payFeaturedPass(routeItem, options = {}) {
  const existing = getFeaturedPass(routeItem.id);
  if (existing) {
    showToast("这张通行证已经支付过。");
    return;
  }
  if (needsExplorationSwitch(routeItem) && !options.confirmedSwitch) {
    confirmExplorationSwitch(routeItem, "pay-featured");
    return false;
  }
  const now = Date.now();
  const pass = {
    id: `pass-${now}`,
    orderNo: orderNumberForPass(routeItem),
    routeId: routeItem.id,
    city: routeItem.city || state.city,
    status: "active",
    createdAt: now,
    paidAt: now,
    purchasedAt: now,
    expiresAt: now + routeItem.validDays * 24 * 60 * 60 * 1000,
    redeemed: []
  };
  state.featuredPasses.unshift(pass);
  state.featuredPaymentRouteId = null;
  persistUserState();
  const started = startFeaturedPassExploration(routeItem, { confirmedSwitch: options.confirmedSwitch });
  showToast(started ? "已支付，已进入第一站探索。" : "已支付，稍后可从我的订单继续。");
  if (!started) renderRouteDetail();
  renderAtlas();
  if (state.view === "folio") renderProfile();
}

function startFeaturedPassExploration(routeItem, options = {}) {
  const pass = getFeaturedPass(routeItem.id);
  if (!pass || featuredPassStatus(pass) !== "active") return false;
  const nextIndex = Math.max(0, routeItem.benefits.findIndex((item) => !pass.redeemed.includes(item.id)));
  const sameRoute = state.explorationActive && state.explorationRoute?.id === routeItem.id;
  if (!sameRoute && !options.confirmedSwitch && !confirmExplorationSwitch(routeItem, "start-featured")) return false;
  state.explorationActive = true;
  state.explorationRoute = routeItem;
  state.activeRoute = routeItem;
  state.routeDetailMode = "active";
  state.selectedRouteId = routeItem.id;
  if (!sameRoute) {
    state.routeProgress = Math.min(nextIndex, routeItem.stops.length - 1);
    state.routeStopFocus = state.routeProgress;
  } else {
    state.routeStopFocus = Math.min(state.routeProgress, routeItem.stops.length - 1);
  }
  state.expandedFeaturedStopId = null;
  state.activeRedemptionRouteId = null;
  state.activeRedemptionBenefitId = null;
  if (!sameRoute) {
    state.photoTaken = false;
    state.explorationStartedAt = Date.now();
  }
  dom.routeBackdrop.hidden = false;
  dom.routeDetailSheet.hidden = false;
  renderRouteDetail();
  renderOngoingExploration();
  persistUserState();
  return true;
}

function redeemFeaturedStop(routeItem, benefitId) {
  const pass = getFeaturedPass(routeItem.id);
  if (!pass) {
    showToast("先开启这张地图，再到店核销。");
    return;
  }
  const status = featuredPassStatus(pass);
  if (status === "expired") {
    showToast("这张通行证已过期。");
    renderRouteDetail();
    return;
  }
  if (status === "completed") {
    showToast("这张城市通行证已经完成。");
    return;
  }
  if (pass.redeemed.includes(benefitId)) {
    showToast("这一站已经核销过。");
    return;
  }
  pass.redeemed.push(benefitId);
  state.activeRedemptionRouteId = null;
  state.activeRedemptionBenefitId = null;
  const benefit = routeItem.benefits.find((item) => item.id === benefitId);
  showToast(`${benefit?.store || "这一站"} 已核销。`);
  if (pass.redeemed.length === routeItem.benefits.length && !pass.completedAt) {
    completeFeaturedPass(routeItem, pass);
  }
  persistUserState();
  renderRouteDetail();
  renderAtlas();
  if (state.view === "folio") renderProfile();
}

function completeFeaturedPass(routeItem, pass) {
  pass.status = "completed";
  pass.completedAt = Date.now();
  if (pass.recordId) return;
  const recordId = `rec-pass-${Date.now()}`;
  pass.recordId = recordId;
  state.records.push({
    id: recordId,
    day: dayOfYear(new Date()),
    dateISO: new Date().toISOString().slice(0, 10),
    title: routeItem.title,
    photo: true,
    layer: "featured",
    time: currentTimeText(),
    mood: "城市通行证完成",
    stops: routeItem.stops,
    city: routeItem.city || state.city,
    duration: routeItem.duration,
    budget: routeItem.price,
    note: `${routeItem.title} 已完成，${routeItem.benefits.length} 家店的权益都留进了我的 LOOP。`
  });
  if (state.explorationActive && state.explorationRoute?.id === routeItem.id) {
    clearExplorationStateOnly({ keepActiveRoute: true });
    state.routeDetailMode = "preview";
  }
  persistUserState();
  showToast("城市通行证已完成，已保存到我的 LOOP。");
}

function completeFeaturedPassExploration(routeItem, pass) {
  if (!pass) return;
  const now = Date.now();
  pass.explorationCompletedAt = pass.explorationCompletedAt || now;
  if (state.explorationActive && state.explorationRoute?.id === routeItem.id) {
    clearExplorationStateOnly({ keepActiveRoute: true });
    state.routeDetailMode = "preview";
  }
  persistUserState();
  closeRouteDetail();
  renderOngoingExploration();
  renderAtlas();
  if (state.view === "folio") renderProfile();
  showToast("路线已走完，未核销权益仍可继续使用。");
}

function isFeaturedPassExpired(pass) {
  return featuredPassStatus(pass) === "expired";
}

function daysRemaining(pass) {
  if (!pass?.expiresAt) return 0;
  const ms = Math.max(0, pass.expiresAt - Date.now());
  return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

function featuredStopStatus(pass, benefitId) {
  if (!pass) return "未购买";
  const status = featuredPassStatus(pass);
  if (pass.redeemed.includes(benefitId)) return "已核销";
  if (status === "expired") return "已过期";
  if (status === "completed" && pass.expiredCompletedAt) return "已过期";
  if (status === "completed") return "已核销";
  return "未使用";
}

function formatElapsed(ms) {
  const minutes = Math.max(0, Math.floor(ms / 60000));
  if (minutes < 1) return "刚刚开始";
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`;
}

function completeRoute() {
  const routeItem = state.explorationRoute || state.activeRoute;
  if (!routeItem) return;
  if (!isRouteAtLastStop(routeItem)) {
    openCheckinSheet();
    return;
  }
  state.selectedRouteId = routeItem.id;
  if (!state.completedRouteIds.includes(routeItem.id)) state.completedRouteIds.unshift(routeItem.id);
  state.records.push({
    id: `rec-${Date.now()}`,
    day: dayOfYear(new Date()),
    dateISO: new Date().toISOString().slice(0, 10),
    title: routeItem.title,
    photo: state.photoTaken,
    layer: routeItem.layer,
    time: currentTimeText(),
    mood: moodById(state.mood)?.title || "今日探索",
    stops: routeItem.stops,
    city: state.city,
    duration: routeItem.duration,
    budget: routeItem.budget,
    note: `${routeItem.title} 已完成，位置、心情和照片会留在我的 LOOP。`
  });
  state.explorationActive = false;
  state.explorationRoute = null;
  state.explorationStartedAt = null;
  persistUserState();
  closeRouteDetail();
  renderOngoingExploration();
  renderAtlas();
  switchView("folio");
  showToast("探索完成。已保存到我的 LOOP。");
}

function layerName(id) {
  return layers.find((item) => item.id === id) || { symbol: "路", name: "路线", desc: "" };
}

function todayText() {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  }).format(new Date()).replace(/\//g, " / ");
}

function currentTimeText() {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

function durationNumber(value) {
  if (value.includes("min")) return parseFloat(value) / 60;
  return parseFloat(value) || 2;
}

function priceNumber(value) {
  const number = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function pseudoRandom(seed) {
  const value = Math.sin(seed * 999) * 10000;
  return value - Math.floor(value);
}

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

function switchView(view) {
  state.view = view;
  renderViews();
  if (view === "folio") renderProfile();
  scrollToTop();
  syncRecordScrollFloat();
}

function showToast(message) {
  clearTimeout(showToast.timer);
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  showToast.timer = setTimeout(() => dom.toast.classList.remove("is-visible"), 1900);
}

function showWelcomeBurst() {
  if (!dom.welcomeBurst) return;
  clearTimeout(showWelcomeBurst.timer);
  dom.welcomeBurst.hidden = false;
  dom.welcomeBurst.classList.remove("is-leaving");
  requestAnimationFrame(() => dom.welcomeBurst.classList.add("is-visible"));
  showWelcomeBurst.timer = setTimeout(() => {
    dom.welcomeBurst.classList.add("is-leaving");
    setTimeout(() => {
      dom.welcomeBurst.hidden = true;
      dom.welcomeBurst.classList.remove("is-visible", "is-leaving");
    }, 420);
  }, 1900);
}

function scrollToTop() {
  dom.appFrame.scrollTo({ top: 0, behavior: "smooth" });
  dom.authGate.scrollTo({ top: 0, behavior: "smooth" });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openCitySheet() {
  dom.cityBackdrop.hidden = false;
  dom.citySheet.hidden = false;
  dom.cityCardList.replaceChildren();
  Object.entries(cities).forEach(([key, item]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-card";
    button.style.setProperty("--city-art", item.art);
    button.style.setProperty("--city-photo", cssImage(photoForCity(key, 900, 700)));
    button.innerHTML = `
      <small>${item.cover}</small>
      <strong>${item.name}</strong>
      <span>${item.line}</span>
    `;
    button.addEventListener("click", () => {
      state.city = key;
      state.layer = "quest";
      state.selectedRouteId = null;
      clearExploration();
      state.inspirationSelected = false;
      resetRevealState();
      clearAiRecommendations();
      state.carouselIndex = 0;
      state.mood = moods[0].id;
      closeCitySheet();
      render();
      showToast(`已切换到${item.name}`);
      scrollToTop();
    });
    dom.cityCardList.append(button);
  });
}

function closeCitySheet() {
  dom.cityBackdrop.hidden = true;
  dom.citySheet.hidden = true;
}

function openAccountSheet(mode = "orders") {
  dom.accountBackdrop.hidden = false;
  dom.accountSheet.hidden = false;
  if (mode === "settings") renderSettingsPanel();
  else if (mode === "passes") renderPassLibraryPanel();
  else renderOrdersPanel();
}

function closeAccountSheet() {
  dom.accountBackdrop.hidden = true;
  dom.accountSheet.hidden = true;
}

function featuredPassOrderItems() {
  return state.featuredPasses
    .map((pass) => ({ pass, route: featuredRouteById(pass.routeId), status: featuredPassStatus(pass) }))
    .filter((item) => item.route)
    .sort((a, b) => passSortTime(b.pass) - passSortTime(a.pass));
}

function passItemsForFilter(passItems, filter) {
  if (filter === "active") return passItems.filter((item) => item.status === "active");
  if (filter === "completed") return passItems.filter((item) => item.status === "completed");
  if (filter === "expired") return passItems.filter((item) => item.status === "expired");
  return passItems;
}

function renderPassLibraryPanel() {
  dom.accountSheetKicker.textContent = "CITY PASS";
  dom.accountSheetTitle.textContent = "城市通行证";
  dom.accountSheetMeta.textContent = "进行中 / 已购买 / 已完成 / 已过期";
  const passItems = featuredPassOrderItems();
  const tabs = [
    ["active", "进行中"],
    ["owned", "已购买"],
    ["completed", "已完成"],
    ["expired", "已过期"]
  ];
  const visibleItems = passItemsForFilter(passItems, state.passLibraryFilter);
  dom.accountPanel.innerHTML = `
    <div class="pass-library-tabs" aria-label="城市通行证分类">
      ${tabs.map(([id, label]) => `<button class="${state.passLibraryFilter === id ? "is-active" : ""}" type="button" data-pass-library-filter="${id}">${label}</button>`).join("")}
    </div>
    <div class="pass-library-list">
      ${visibleItems.length ? visibleItems.map(({ pass, route, status }) => {
        const redeemed = pass.redeemed?.length || 0;
        const total = route.benefits.length;
        return `
          <article class="account-row pass-library-row is-${status.replace("_", "-")}">
            <div>
              <span>${cities[pass.city]?.name || currentCity().name} · ${passStatusLabel(status)}</span>
              <strong>${route.title}</strong>
              <p>${redeemed}/${total} 已核销 · ${profilePassMeta(pass, route, status)}</p>
            </div>
            <button type="button" data-library-pass="${pass.id}">查看地图</button>
          </article>
        `;
      }).join("") : `<article class="account-empty"><strong>暂无通行证</strong><p>这个分类里还没有城市通行证。</p></article>`}
    </div>
  `;
  dom.accountPanel.querySelectorAll("[data-pass-library-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.passLibraryFilter = button.dataset.passLibraryFilter;
      renderPassLibraryPanel();
    });
  });
  dom.accountPanel.querySelectorAll("[data-library-pass]").forEach((button) => {
    button.addEventListener("click", () => {
      closeAccountSheet();
      openFeaturedPassFromProfile(button.dataset.libraryPass);
    });
  });
}

function renderOrdersPanel() {
  dom.accountSheetKicker.textContent = "ORDERS";
  dom.accountSheetTitle.textContent = "订单中心";
  dom.accountSheetMeta.textContent = "全部 / 使用中 / 已完成 / 已过期";
  const passItems = featuredPassOrderItems();
  if (!passItems.length) {
    dom.accountPanel.innerHTML = `
      <article class="account-empty">
        <strong>还没有城市通行证</strong>
        <p>你购买城市通行证后，会在这里看到有效期、核销进度和回看入口。</p>
      </article>
    `;
    return;
  }
  const tabs = [
    ["all", "全部"],
    ["active", "使用中"],
    ["completed", "已完成"],
    ["expired", "已过期"]
  ];
  const visibleItems = passItemsForFilter(passItems, state.orderFilter);
  dom.accountPanel.innerHTML = `
    <div class="order-filter-tabs" aria-label="订单状态">
      ${tabs.map(([id, label]) => `<button class="${state.orderFilter === id ? "is-active" : ""}" type="button" data-order-filter="${id}">${label}</button>`).join("")}
    </div>
    <div class="account-list">
      ${visibleItems.length ? visibleItems.map(({ pass, route, status }) => {
        const redeemed = pass.redeemed?.length || 0;
        const total = route.benefits.length;
        return `
          <article class="account-row is-${status.replace("_", "-")}">
            <div>
              <span>${passStatusLabel(status)} · ${pass.orderNo}</span>
              <strong>${route.title}</strong>
              <p>${route.price} · ${redeemed}/${total} 已核销 · ${status === "active" ? `还剩 ${daysRemaining(pass)} 天` : profilePassMeta(pass, route, status)}</p>
            </div>
            <em>${passStatusLabel(status)}</em>
          </article>
        `;
      }).join("") : `<article class="account-empty"><strong>暂无订单</strong><p>这个状态下还没有城市通行证订单。</p></article>`}
    </div>
  `;
  dom.accountPanel.querySelectorAll("[data-order-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.orderFilter = button.dataset.orderFilter;
      renderOrdersPanel();
    });
  });
}

function renderSettingsPanel() {
  dom.accountSheetKicker.textContent = "SETTINGS";
  dom.accountSheetTitle.textContent = "偏好设置";
  dom.accountSheetMeta.textContent = "城市 / 兴趣 / 通知 / 隐私 / 账号";
  const city = currentCity();
  const user = state.currentUser;
  const interests = user?.interests?.length
    ? user.interests.map((id) => layerName(id).name).slice(0, 5).join(" / ")
    : "咖啡 / 艺术 / 秘境";
  dom.accountPanel.innerHTML = `
    <div class="settings-list">
      <button type="button" data-setting-action="city">
        <span>默认城市</span>
        <strong>${city.name}</strong>
        <small>可切换到上海、成都、阿布扎比等城市</small>
      </button>
      <button type="button" data-setting-action="interests">
        <span>兴趣偏好</span>
        <strong>${interests}</strong>
        <small>影响首页灵感、地图排序和精选推荐</small>
      </button>
      <button type="button" data-setting-action="notify">
        <span>通知</span>
        <strong>路线提醒 / 到期提醒</strong>
        <small>城市通行证到期前提醒用户继续探索</small>
      </button>
      <button type="button" data-setting-action="privacy">
        <span>隐私</span>
        <strong>仅自己可见</strong>
        <small>探索记录、订单和核销状态默认只保存在个人空间</small>
      </button>
      <button type="button" data-setting-action="account">
        <span>账号</span>
        <strong>${maskAccount(user?.account)}</strong>
        <small>登录、退出和未来会员体系会放在这里</small>
      </button>
    </div>
  `;
  dom.accountPanel.querySelectorAll("[data-setting-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.settingAction;
      if (action === "city") {
        closeAccountSheet();
        openCitySheet();
        return;
      }
      if (action === "notify") {
        if (requestNativeNotificationReminder()) return;
        showToast("iOS app 中会使用本地通知提醒你继续探索。");
        return;
      }
      const messages = {
        interests: "兴趣偏好编辑会接到首次设置里的兴趣选择。",
        privacy: "隐私设置会管理探索记录、照片和订单可见范围。",
        account: "账号设置会管理登录、退出和未来会员身份。"
      };
      showToast(messages[action] || "设置入口已预留。");
    });
  });
}

let revealTimer;
let recordScrollFloatTimer;
let touchStartY = null;

function resetRevealState() {
  clearTimeout(revealTimer);
  state.routesRevealed = false;
  state.revealAnimating = false;
}

function clearExplorationStateOnly(options = {}) {
  state.explorationActive = false;
  state.explorationRoute = null;
  state.explorationStartedAt = null;
  if (!options.keepActiveRoute) state.activeRoute = null;
  state.routeProgress = 0;
  state.routeStopFocus = 0;
  state.photoTaken = false;
}

function clearExploration() {
  clearExplorationStateOnly();
  persistUserState();
  renderOngoingExploration();
}

function startRouteReveal() {
  if (state.routesRevealed || state.revealAnimating) return;
  if (!state.inspirationSelected) {
    const moodList = personalizedMoods();
    state.inspirationSelected = true;
    state.carouselIndex = Math.max(0, moodList.findIndex((item) => item.id === state.mood));
    state.recommendationRound += 1;
    state.userSignalVersion += 1;
  }
  if (!aiPackForCurrentContext() && !state.aiLoading) void requestAiRecommendations("reveal");
  clearTimeout(revealTimer);
  state.revealAnimating = true;
  renderHome();
  requestAnimationFrame(keepRouteRevealInView);
  revealTimer = setTimeout(() => {
    state.revealAnimating = false;
    state.routesRevealed = true;
    renderHome();
    requestAnimationFrame(() => {
      dom.recommendSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, 1050);
}

function keepRouteRevealInView() {
  if (dom.routeReveal.hidden) return;
  const revealRect = dom.routeReveal.getBoundingClientRect();
  const frameRect = dom.appFrame.getBoundingClientRect();
  const bottomSafe = frameRect.bottom - 92;
  const overflow = revealRect.bottom - bottomSafe;
  if (overflow <= 0) return;
  dom.appFrame.scrollBy({ top: overflow + 14, behavior: "smooth" });
}

function bindEvents() {
  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => switchAuthMode(button.dataset.authMode));
  });
  document.querySelectorAll("[data-setup-close]").forEach((button) => {
    button.addEventListener("click", closeFirstSetup);
  });
  dom.registerRole.addEventListener("change", () => syncRoutineOptions());
  dom.registerInterestList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-register-interest]");
    if (!button) return;
      const interest = button.dataset.registerInterest;
      const hasInterest = state.registerInterests.includes(interest);
      if (hasInterest && state.registerInterests.length === 1) {
        setAuthMessage("至少保留一个城市入口。", "error");
        return;
      }
      state.registerInterests = hasInterest
        ? state.registerInterests.filter((item) => item !== interest)
        : [...state.registerInterests, interest];
      syncInterestButtons();
      setAuthMessage("");
  });
  dom.selectAllInterests.addEventListener("click", () => {
    const allIds = layers.map((layer) => layer.id);
    const allSelected = allIds.every((id) => state.registerInterests.includes(id));
    state.registerInterests = allSelected ? ["coffee"] : allIds;
    syncInterestButtons();
    setAuthMessage(allSelected ? "已保留咖啡作为默认入口。" : "已选择全部城市入口。", "success");
  });
  dom.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginWithCredentials(dom.loginAccount.value, dom.loginPassword.value, dom.rememberMe.checked);
  });
  dom.registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    continueRegisterAccount();
  });
  dom.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    continueRegisterProfile();
  });
  dom.interestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    registerAccount();
  });
  dom.resetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    resetPassword();
  });
  dom.forgotButton.addEventListener("click", () => {
    dom.resetAccount.value = normalizeAccount(dom.loginAccount.value);
    switchAuthMode("reset");
  });
  dom.backToLoginButton.addEventListener("click", () => switchAuthMode("login"));
  dom.demoLoginButton.addEventListener("click", () => {
    const demoUser = ensureDemoUser();
    dom.loginAccount.value = demoUser.account;
    dom.loginPassword.value = DEMO_PASSWORD;
    loginWithCredentials(demoUser.account, DEMO_PASSWORD, true);
  });
  dom.logoutButton.addEventListener("click", logout);

  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.viewTarget));
  });
  setTimeout(() => dom.splashScreen.classList.add("is-leaving"), 2300);
  setTimeout(() => {
    dom.splashScreen.classList.add("is-hidden");
    dom.splashScreen.setAttribute("aria-hidden", "true");
  }, 2800);
  dom.cityEntry.addEventListener("click", openCitySheet);
  dom.cityClose.addEventListener("click", closeCitySheet);
  dom.cityBackdrop.addEventListener("click", closeCitySheet);
  dom.routeClose.addEventListener("click", closeRouteDetail);
  dom.routeShareButton.addEventListener("click", shareActiveRoute);
  dom.routeBackdrop.addEventListener("click", closeRouteDetail);
  dom.switchCancelButton.addEventListener("click", () => {
    closeExplorationSwitchConfirm();
    showToast("已保留当前探索。");
  });
  dom.switchConfirmBackdrop.addEventListener("click", () => {
    closeExplorationSwitchConfirm();
    showToast("已保留当前探索。");
  });
  dom.switchConfirmButton.addEventListener("click", resolveExplorationSwitch);
  dom.dayClose.addEventListener("click", closeDayDetail);
  dom.dayBackdrop.addEventListener("click", closeDayDetail);
  dom.accountClose.addEventListener("click", closeAccountSheet);
  dom.accountBackdrop.addEventListener("click", closeAccountSheet);
  dom.ongoingExploration.addEventListener("click", openOngoingExploration);
  dom.heroSave.addEventListener("click", () => {
    refreshDiscoveryFeed({ advanceMood: true, keepReveal: state.routesRevealed });
    showToast("已更新今日信息流和路线。");
  });
  dom.moodGrid.addEventListener("pointerdown", () => {
    state.lastMoodRailInteractionAt = Date.now();
  }, { passive: true });
  dom.swipeUpCue.addEventListener("click", startRouteReveal);
  document.getElementById("heroCard").addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0]?.clientY ?? null;
  }, { passive: true });
  document.getElementById("heroCard").addEventListener("touchend", (event) => {
    const endY = event.changedTouches[0]?.clientY ?? touchStartY;
    if (touchStartY !== null && touchStartY - endY > 44) startRouteReveal();
    touchStartY = null;
  }, { passive: true });
  document.getElementById("heroCard").addEventListener("wheel", (event) => {
    if (event.deltaY > 36) startRouteReveal();
  }, { passive: true });
  dom.goAtlasFromHome.addEventListener("click", () => switchView("atlas"));
  dom.secretFeatureButton.addEventListener("click", () => {
    state.layer = "quest";
    switchView("secrets");
  });
  dom.filterToggle.addEventListener("click", () => {
    state.filtersOpen = !state.filtersOpen;
    renderAtlas();
  });
  dom.checkinButton.addEventListener("click", () => openCheckinSheet());
  dom.photoButton.addEventListener("click", () => openPhotoSheet());
  dom.passActionClose.addEventListener("click", closePassActionSheet);
  dom.passActionBackdrop.addEventListener("click", closePassActionSheet);
  dom.passActionSheet.addEventListener("click", (event) => {
    const photoSourceButton = event.target.closest("[data-photo-source]");
    if (photoSourceButton) {
      const source = photoSourceButton.dataset.photoSource;
      const routeItem = routeById(state.passActionRouteId);
      if (routeItem && requestNativePhoto(source, routeItem)) return;
      state.passActionMode = source;
      renderPassActionSheet();
      return;
    }
    if (event.target.closest("[data-pass-action-cancel]")) {
      closePassActionSheet();
      return;
    }
    if (event.target.closest("[data-pass-action-confirm]")) confirmPassAction();
  });
  dom.completeRouteButton.addEventListener("click", () => {
    if (state.activeRoute?.isFeaturedPass) {
      const pass = getFeaturedPass(state.activeRoute.id);
      const status = pass ? featuredPassStatus(pass) : "";
      if (!pass && state.featuredPaymentRouteId === state.activeRoute.id) payFeaturedPass(state.activeRoute);
      else if (!pass) buyFeaturedPass(state.activeRoute);
      else if (status === "active") {
        handleActiveFeaturedPassPrimaryAction(state.activeRoute, pass);
      }
      else if (status === "completed") showToast("这张城市通行证已经完成。");
      else if (status === "expired") showToast("这张通行证已过期，路线仍可回看。");
      return;
    }
    if (state.routeDetailMode === "preview") beginRouteExploration();
    else if (routeFocusedIndex(state.activeRoute) !== Math.min(Math.max(state.routeProgress || 0, 0), state.activeRoute.stops.length - 1)) {
      state.routeStopFocus = Math.min(Math.max(state.routeProgress || 0, 0), state.activeRoute.stops.length - 1);
      renderRouteDetail();
      showToast("已回到当前可行动站。");
    }
    else if (!isRouteAtLastStop(state.activeRoute)) openCheckinSheet();
    else completeRoute();
  });
  dom.passMapButton.addEventListener("click", () => openAccountSheet("passes"));
  dom.interestMapButton.addEventListener("click", () => {
    switchView("atlas");
    openOngoingExploration();
  });
  dom.ordersButton.addEventListener("click", () => openAccountSheet("orders"));
  dom.settingsButton.addEventListener("click", () => openAccountSheet("settings"));
  dom.appFrame.addEventListener("scroll", syncRecordScrollFloat);
  dom.recordScrollFloat.addEventListener("click", handleProfileScrollFloat);
  dom.langButton.addEventListener("click", () => showToast("英文入口保留在这里，当前先做中文版。"));
  setInterval(() => {
    if (state.view !== "home" || state.inspirationSelected || !dom.splashScreen.classList.contains("is-hidden")) return;
    if (Date.now() - state.lastMoodRailInteractionAt < 9000) return;
    state.feedVersion += 1;
    const moodList = personalizedMoods();
    state.carouselIndex = (state.carouselIndex + 1) % moodList.length;
    state.mood = moodList[state.carouselIndex].id;
    renderHome();
  }, 12000);
}

function installAppInteractionGuards() {
  ["copy", "cut", "paste", "selectstart", "contextmenu", "dragstart"].forEach((eventName) => {
    document.addEventListener(eventName, (event) => event.preventDefault(), { capture: true });
  });

  ["gesturestart", "gesturechange", "gestureend", "dblclick"].forEach((eventName) => {
    document.addEventListener(eventName, (event) => event.preventDefault(), { capture: true });
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && ["a", "c", "v", "x"].includes(key)) event.preventDefault();
  }, { capture: true });

  let lastTouchEndAt = 0;
  document.addEventListener("touchend", (event) => {
    const now = Date.now();
    if (now - lastTouchEndAt < 320) event.preventDefault();
    lastTouchEndAt = now;
  }, { capture: true, passive: false });
}

const LOOP_NATIVE_BRIDGE_MESSAGES = Object.freeze(["ready", "haptic", "camera.capture", "photo.pick", "location.request", "share.open", "notification.schedule"]);
const LOOP_SHARE_URL = "https://verarun33.github.io/loop-city-prototype/";
const nativePhotoRequests = new Map();
let nativePhotoRequestCounter = 0;
const nativeLocationRequests = new Map();
let nativeLocationRequestCounter = 0;
const nativeShareRequests = new Map();
let nativeShareRequestCounter = 0;
const nativeNotificationRequests = new Map();
let nativeNotificationRequestCounter = 0;
const PHOTO_SYNC_RETRY_DELAY_MS = 1800;
const photoSyncInFlight = new Set();
let photoSyncRetryTimer = null;

function photoRecordApiBase() {
  let localApiBase = "";
  try {
    localApiBase = localStorage.getItem("loop.apiBase") || "";
  } catch {
    localApiBase = "";
  }
  const configured = window.LOOP_API_BASE_URL || document.documentElement.dataset.apiBase || localApiBase || "";
  return String(configured || "").replace(/\/+$/, "");
}

function routeIdForPhotoRecord(record) {
  if (record?.routeId) return record.routeId;
  const match = String(record?.id || "").match(/^rec-photo-\d+-(.+)$/);
  return match?.[1] || "";
}

function photoSyncClientId(record, photo) {
  return `${record.id}-${photo.stopIndex}-${Math.abs(stableHash(photo.station || ""))}`;
}

function routeContextForPhotoRecord(record) {
  const routeId = routeIdForPhotoRecord(record);
  return routeById(routeId, record.city || state.city) || {
    id: routeId,
    title: record.title || "照片记录",
    city: record.city || state.city,
    layer: record.layer || "",
    stops: Array.isArray(record.stops) ? record.stops : []
  };
}

function buildPhotoRecordPayload(routeItem, source, photoAsset, record, photo) {
  return {
    clientRecordId: record.id,
    clientPhotoId: photoSyncClientId(record, photo),
    userId: state.currentUser?.id || "prototype-user",
    city: record.city || routeItem.city || state.city,
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    layer: record.layer || routeItem.layer || "",
    station: photo.station,
    stopIndex: photo.stopIndex,
    source: photo.source || source,
    capturedAt: photo.capturedAt || photoAsset?.capturedAt || new Date().toISOString(),
    mimeType: photo.mimeType || photoAsset?.mimeType || "image/jpeg",
    width: photo.width || photoAsset?.width || 0,
    height: photo.height || photoAsset?.height || 0,
    imageDataUrl: photo.url || photoAsset?.imageDataUrl || ""
  };
}

async function syncPhotoRecord(payload, record, photo) {
  const apiBase = photoRecordApiBase();
  if (!apiBase || !payload.imageDataUrl.startsWith("data:image/")) return;

  const clientPhotoId = payload.clientPhotoId || photoSyncClientId(record, photo);
  if (photoSyncInFlight.has(clientPhotoId)) return;
  photoSyncInFlight.add(clientPhotoId);
  photo.syncStatus = "pending";
  try {
    const response = await fetch(`${apiBase}/api/photo-records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 409 && data.error === "DUPLICATE_PHOTO") {
      photo.syncStatus = "synced";
      delete photo.syncError;
      delete photo.syncAttempts;
      record.updatedAt = new Date().toISOString();
      persistUserState();
      return;
    }
    if (!response.ok || !data.ok) throw new Error(data.error || "PHOTO_SYNC_FAILED");
    photo.syncStatus = "synced";
    photo.remotePhotoUrl = data.record?.photoUrl || "";
    delete photo.syncError;
    delete photo.syncAttempts;
    record.updatedAt = new Date().toISOString();
    persistUserState();
  } catch (error) {
    photo.syncStatus = "pending";
    photo.syncAttempts = Math.min((Number(photo.syncAttempts) || 0) + 1, 3);
    photo.syncError = error?.message || "PHOTO_SYNC_FAILED";
    persistUserState();
    if (photo.syncAttempts < 3) schedulePhotoSyncRetry(PHOTO_SYNC_RETRY_DELAY_MS * photo.syncAttempts);
  } finally {
    photoSyncInFlight.delete(clientPhotoId);
  }
}

function collectPendingPhotoSyncs() {
  if (!photoRecordApiBase()) return [];
  return state.records.flatMap((record) => {
    const photos = Array.isArray(record.photos) ? record.photos : [];
    const routeItem = routeContextForPhotoRecord(record);
    if (!routeItem.id) return [];
    return photos
      .filter((photo) => photo?.syncStatus !== "synced" && String(photo.url || "").startsWith("data:image/"))
      .map((photo) => ({ record, photo, routeItem }));
  });
}

async function retryPendingPhotoSync() {
  const pending = collectPendingPhotoSyncs();
  for (const item of pending) {
    const clientPhotoId = photoSyncClientId(item.record, item.photo);
    if (photoSyncInFlight.has(clientPhotoId)) continue;
    const payload = buildPhotoRecordPayload(item.routeItem, item.photo.source || "camera", null, item.record, item.photo);
    await syncPhotoRecord(payload, item.record, item.photo);
  }
}

function schedulePhotoSyncRetry(delayMs = PHOTO_SYNC_RETRY_DELAY_MS) {
  if (photoSyncRetryTimer || !photoRecordApiBase()) return;
  photoSyncRetryTimer = window.setTimeout(() => {
    photoSyncRetryTimer = null;
    void retryPendingPhotoSync();
  }, delayMs);
}

function nativeBridgeCanPost(messageName) {
  const native = window.LoopNative;
  return Boolean(
    native &&
    native.platform === "ios" &&
    typeof native.post === "function" &&
    LOOP_NATIVE_BRIDGE_MESSAGES.includes(messageName)
  );
}

function nativePhotoPayload(routeItem, source) {
  const stop = currentActionStop(routeItem);
  nativePhotoRequestCounter += 1;
  const requestId = `photo-${Date.now()}-${nativePhotoRequestCounter}`;
  nativePhotoRequests.set(requestId, {
    routeId: routeItem.id,
    stopIndex: stop.index,
    station: stop.name,
    source,
    createdAt: Date.now()
  });
  return {
    requestId,
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    stopIndex: stop.index,
    stopName: stop.name,
    maxDimension: 1280,
    jpegQuality: 0.78
  };
}

function requestNativePhoto(source, routeItem) {
  const messageName = source === "upload" ? "photo.pick" : "camera.capture";
  if (!nativeBridgeCanPost(messageName)) return false;
  const payload = nativePhotoPayload(routeItem, source);
  window.LoopNative.post(messageName, payload);
  closePassActionSheet();
  showToast(source === "upload" ? "正在打开系统相册..." : "正在打开系统相机...");
  return true;
}

function nativeLocationPayload(routeItem) {
  const stop = currentActionStop(routeItem);
  nativeLocationRequestCounter += 1;
  const requestId = `location-${Date.now()}-${nativeLocationRequestCounter}`;
  nativeLocationRequests.set(requestId, {
    routeId: routeItem.id,
    stopIndex: stop.index,
    station: stop.name,
    createdAt: Date.now()
  });
  return {
    requestId,
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    stopIndex: stop.index,
    stopName: stop.name,
    timeoutMs: 12000
  };
}

function requestNativeLocation(routeItem) {
  if (!nativeBridgeCanPost("location.request")) return false;
  const payload = nativeLocationPayload(routeItem);
  window.LoopNative.post("location.request", payload);
  closePassActionSheet();
  showToast("正在确认定位...");
  return true;
}

function handleNativeLocationResult(event) {
  const detail = event.detail || {};
  const requestId = detail.requestId || "";
  const request = nativeLocationRequests.get(requestId);
  if (!request) return;
  nativeLocationRequests.delete(requestId);
  const routeItem = routeById(request.routeId);
  if (!routeItem) return;
  if (!detail.ok) {
    if (detail.reason === "denied" || detail.reason === "restricted") showToast("定位权限未开启，暂时不能确认到站。");
    else if (detail.reason === "timeout") showToast("定位超时，请再试一次。");
    else showToast(detail.message || "定位失败，请稍后重试。");
    return;
  }
  const locationAsset = {
    requestId,
    latitude: Number(detail.latitude),
    longitude: Number(detail.longitude),
    accuracy: Number(detail.accuracy) || 0,
    authorizationStatus: detail.authorizationStatus || "",
    capturedAt: detail.capturedAt || new Date().toISOString(),
    stopIndex: request.stopIndex,
    station: request.station
  };
  confirmCheckinAction(routeItem, locationAsset);
}

function shareRouteText(routeItem) {
  const city = cities[routeItem.city || state.city]?.name || currentCity().name;
  if (routeItem.isFeaturedPass) {
    return `我在 LOOP 城市回路发现了${routeItem.title}：${routeItem.price}，${routeItem.validDays}天有效，${routeItem.benefits.length} 个城市站点。`;
  }
  return `我在 LOOP 城市回路发现了${routeItem.title}：${city} ${routeItem.stops.length} 站，适合${routeItem.bestFor || "今天出门"}。`;
}

function shareRoutePayload(routeItem) {
  nativeShareRequestCounter += 1;
  const requestId = `share-${Date.now()}-${nativeShareRequestCounter}`;
  nativeShareRequests.set(requestId, {
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    createdAt: Date.now()
  });
  return {
    requestId,
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    title: routeItem.title,
    text: shareRouteText(routeItem),
    url: LOOP_SHARE_URL,
    subject: "LOOP 城市回路"
  };
}

function requestNativeShare(routeItem) {
  if (!nativeBridgeCanPost("share.open")) return false;
  const payload = shareRoutePayload(routeItem);
  window.LoopNative.post("share.open", payload);
  showToast("正在打开系统分享...");
  return true;
}

async function fallbackWebShare(routeItem) {
  const payload = shareRoutePayload(routeItem);
  nativeShareRequests.delete(payload.requestId);
  const shareData = { title: payload.title, text: payload.text, url: payload.url };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast("分享面板已打开。");
    } catch (error) {
      showToast(error?.name === "AbortError" ? "已取消分享。" : "暂时无法分享，请稍后再试。");
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(`${payload.text}\n${payload.url}`);
    showToast("分享文案已复制。");
  } catch {
    showToast("分享文案已准备好，可以手动复制。");
  }
}

function handleNativeShareResult(event) {
  const detail = event.detail || {};
  const requestId = detail.requestId || "";
  const request = nativeShareRequests.get(requestId);
  if (!request) return;
  nativeShareRequests.delete(requestId);
  if (detail.ok && detail.completed) {
    showToast("已完成分享。");
    return;
  }
  if (detail.reason === "cancelled") showToast("已取消分享。");
  else showToast(detail.message || "暂时无法分享，请稍后再试。");
}

function notificationReminderPayload() {
  nativeNotificationRequestCounter += 1;
  const requestId = `notification-${Date.now()}-${nativeNotificationRequestCounter}`;
  nativeNotificationRequests.set(requestId, { createdAt: Date.now(), kind: "route-reminder" });
  return {
    requestId,
    kind: "route-reminder",
    title: "LOOP 城市回路",
    body: "明天可以继续完成一条城市路线。",
    delaySeconds: 86400
  };
}

function requestNativeNotificationReminder() {
  if (!nativeBridgeCanPost("notification.schedule")) return false;
  const payload = notificationReminderPayload();
  window.LoopNative.post("notification.schedule", payload);
  showToast("正在打开系统通知授权...");
  return true;
}

function handleNativeNotificationResult(event) {
  const detail = event.detail || {};
  const requestId = detail.requestId || "";
  if (!nativeNotificationRequests.has(requestId)) return;
  nativeNotificationRequests.delete(requestId);
  if (detail.ok && detail.scheduled) {
    showToast("已为你开启一条本地路线提醒。");
    return;
  }
  if (detail.reason === "denied") showToast("通知权限未开启，暂时不能发送提醒。");
  else showToast(detail.message || "通知提醒暂时无法开启。");
}

function shareActiveRoute() {
  const routeItem = state.activeRoute;
  if (!routeItem) {
    showToast("先打开一张地图再分享。");
    return;
  }
  if (requestNativeShare(routeItem)) return;
  void fallbackWebShare(routeItem);
}

function handleNativePhotoResult(event) {
  const detail = event.detail || {};
  const requestId = detail.requestId || "";
  const request = nativePhotoRequests.get(requestId);
  if (!request) return;
  nativePhotoRequests.delete(requestId);
  const routeItem = routeById(request.routeId);
  if (!routeItem) return;
  if (!detail.ok) {
    if (detail.reason === "cancelled") showToast("已取消照片记录。");
    else if (detail.reason === "unavailable") showToast("当前设备无法打开这个系统入口。");
    else showToast(detail.message || "照片没有保存，请稍后再试。");
    return;
  }
  const photoAsset = {
    imageDataUrl: detail.imageDataUrl || "",
    mimeType: detail.mimeType || "image/jpeg",
    width: Number(detail.width) || 0,
    height: Number(detail.height) || 0,
    capturedAt: detail.capturedAt || new Date().toISOString(),
    stopIndex: request.stopIndex,
    station: request.station
  };
  if (!photoAsset.imageDataUrl.startsWith("data:image/")) {
    showToast("照片格式暂时无法保存。");
    return;
  }
  const result = savePhotoRecord(routeItem, request.source, photoAsset);
  const saved = Boolean(result.saved);
  state.photoTaken = saved || state.photoTaken;
  if (saved && result.record && result.photo) {
    const payload = buildPhotoRecordPayload(routeItem, request.source, photoAsset, result.record, result.photo);
    void syncPhotoRecord(payload, result.record, result.photo);
  }
  showToast(saved ? `${photoAsset.station} 的照片已保存到我的 LOOP。` : "这一站已经保存过照片，每个站点只能保留一张。");
  persistUserState();
  renderRouteDetail();
  renderOngoingExploration();
  if (state.view === "folio") renderProfile();
}

function installNativeShellBridge() {
  const markNativeShell = () => {
    const native = window.LoopNative;
    if (!native || native.platform !== "ios") return;
    document.documentElement.dataset.nativeShell = native.platform;
    document.documentElement.dataset.nativeShellVersion = native.shellVersion || "";
    if (LOOP_NATIVE_BRIDGE_MESSAGES.includes("ready")) {
      native.post("ready", { href: window.location.href, dataVersion: LOOP_DATA_VERSION });
    }
    schedulePhotoSyncRetry();
  };

  window.addEventListener("loopnative:ready", markNativeShell, { once: true });
  markNativeShell();
}

window.addEventListener("loopnative:photo-result", handleNativePhotoResult);
window.addEventListener("loopnative:location-result", handleNativeLocationResult);
window.addEventListener("loopnative:share-result", handleNativeShareResult);
window.addEventListener("loopnative:notification-result", handleNativeNotificationResult);
window.addEventListener("online", schedulePhotoSyncRetry);
installNativeShellBridge();
installAppInteractionGuards();
resetPrototypeStorageIfNeeded();
initAuth();
bindEvents();
schedulePhotoSyncRetry();
render();
applyScreenshotScenario();
