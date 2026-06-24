(() => {
  const data = {
    version: "20260624-phase1-v1",
    cities: [
      { id: "shanghai", name: "上海", code: "SH", timezone: "Asia/Shanghai", currency: "CNY", status: "active" },
      { id: "chengdu", name: "成都", code: "CD", timezone: "Asia/Shanghai", currency: "CNY", status: "active" },
      { id: "abudhabi", name: "阿布扎比", code: "AD", timezone: "Asia/Dubai", currency: "AED", status: "active" }
    ],
    sourceGroups: [
      { id: "shanghai-official-culture", cityId: "shanghai", label: "上海官方文化与旅行来源", sourceType: "open_data", sourceUrl: "https://www.meet-in-shanghai.net/" },
      { id: "shanghai-community-culture", cityId: "shanghai", label: "上海社区文化信号", sourceType: "community_signal", sourceUrl: "https://www.smartshanghai.com/" },
      { id: "chengdu-official-culture", cityId: "chengdu", label: "成都官方文化与博物馆来源", sourceType: "open_data", sourceUrl: "https://www.chengdumuseum.com/" },
      { id: "chengdu-community-culture", cityId: "chengdu", label: "成都音乐、书店与社交空间信号", sourceType: "community_signal", sourceUrl: "https://www.tripadvisor.com/" },
      { id: "abudhabi-official-culture", cityId: "abudhabi", label: "阿布扎比官方文化与旅行来源", sourceType: "open_data", sourceUrl: "https://visitabudhabi.ae/" },
      { id: "abudhabi-community-culture", cityId: "abudhabi", label: "阿布扎比第三空间与创意社区信号", sourceType: "community_signal", sourceUrl: "https://www.timeoutabudhabi.com/" }
    ]
  };

  window.LOOP_DATA_V01 = Object.freeze({
    ...data,
    cities: Object.freeze(data.cities.map((city) => Object.freeze({ ...city }))),
    sourceGroups: Object.freeze(data.sourceGroups.map((group) => Object.freeze({ ...group })))
  });
})();
