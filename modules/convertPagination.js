const converPagination = (resource, currentPage) => {
  // 分頁邏輯
  const totalResult = resource.length; // 總資料
  const perpage = 3; // 每頁數量
  const pageTotal = Math.ceil(totalResult / perpage); // 總頁數
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }
  const minItem = (currentPage * perpage) - perpage + 1;
  const maxItem = (currentPage * perpage);
  const data = [];
  resource.forEach((item, i) => {
    const itemNum = i + 1;
    if (itemNum >= minItem && itemNum <= maxItem) {
      data.push(item);
    }
  });
  const page = {
    pageTotal,
    currentPage,
    hasPre: currentPage > 1,
    hasNext: currentPage < pageTotal,
  };
  return {
    page,
    data,
  }
};

module.exports = converPagination;
