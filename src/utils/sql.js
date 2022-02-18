// 因为搜索框需求导致写了很多if-else语句，将这部分内容抽离出来会让代码好看些
const connection = require('../app/database')

//获取商品信息的sql逻辑判断 
const goodsSearchSql = async (offset, size, title, catName, min, max) => {
  
  // 基本的sql
  let statement = `
  SELECT *,(SELECT COUNT(*) FROM items_stats) totalCount
  FROM items_stats
  LIMIT ?,?;
  `

  if(title && catName && min && max) {
    // 如果传入了标题、类目和销量范围
    statement = `
    SELECT *,(SELECT COUNT(*) FROM items_stats WHERE title LIKE ? AND catName = ? AND liveQuantity BETWEEN ? AND ?) totalCount
    FROM items_stats
    WHERE title LIKE ? AND catName = ? AND liveQuantity BETWEEN ? AND ?
    LIMIT ?,?;
    `
    title = "%" + title + "%";
    const result = await connection.execute(statement, [ title, catName, min, max, title, catName, min, max, offset, size])
    return result[0]
  } 
  else if(title && catName) {
    // 如果传入了标题、类目
    statement = `
    SELECT *,(SELECT COUNT(*) FROM items_stats WHERE title LIKE ? AND catName = ?) totalCount
    FROM items_stats
    WHERE title LIKE ? AND catName = ? 
    LIMIT ?,?;
    `
    title = "%" + title + "%";
    const result = await connection.execute(statement, [ title, catName, title, catName, offset, size])
    return result[0]
  }
  else if(title && min && max) {
    // 如果传入了标题销量范围
    statement = `
    SELECT *,(SELECT COUNT(*) FROM items_stats WHERE title LIKE ? AND liveQuantity BETWEEN ? AND ?) totalCount
    FROM items_stats
    WHERE title LIKE ? AND liveQuantity BETWEEN ? AND ?
    LIMIT ?,?;
    `
    title = "%" + title + "%";
    const result = await connection.execute(statement, [ title, min, max, title, min, max, offset, size])
    return result[0]
  }
  else if(catName && min && max) {
    // 如果传入了类目和销量范围
    statement = `
    SELECT *,(SELECT COUNT(*) FROM items_stats WHERE  catName = ? AND liveQuantity BETWEEN ? AND ?) totalCount
    FROM items_stats
    WHERE  catName = ? AND liveQuantity BETWEEN ? AND ?
    LIMIT ?,?;
    `
    const result = await connection.execute(statement, [ catName, min, max, catName, min, max, offset, size])
    return result[0]
  }
  else if(title) {
    // 如果传入了标题
    statement = `
    SELECT *,(SELECT COUNT(*) FROM items_stats WHERE title LIKE ?) totalCount
    FROM items_stats
    WHERE title LIKE ?
    LIMIT ?,?;
    `
    title = "%" + title + "%";
    const result = await connection.execute(statement, [ title, title, offset, size])
    return result[0]
  }
  else if (catName) {
    // 如果传入了类目
    statement = `
    SELECT *,(SELECT COUNT(*) FROM items_stats WHERE  catName = ? ) totalCount
    FROM items_stats
    WHERE  catName = ? 
    LIMIT ?,?;
    `
    const result = await connection.execute(statement, [ catName, catName, offset, size])
    return result[0]
  }
  else if( min && max) {
    // 如果传入了销量范围
    statement = `
    SELECT *,(SELECT COUNT(*) FROM items_stats WHERE liveQuantity BETWEEN ? AND ?) totalCount
    FROM items_stats
    WHERE liveQuantity BETWEEN ? AND ?
    LIMIT ?,?;
    `
    const result = await connection.execute(statement, [ min, max, min, max, offset, size ])
    return result[0]
  }
  else {
    const result = await connection.execute(statement, [ offset, size ])
    return result[0]
  }
}

// 获取直播信息的sql逻辑判断
const livesSearchSql = async (offset, size, anchorName, liveTitle) => {
  let statement = `
  SELECT 
  l.ID ID,anchorName,l.anchorId anchorId,liveId,liveTitle,visitNum,totalNum,liveQuantity,
  totalAmount,l.ifShow ifShow,item_done,
  (SELECT COUNT(*) FROM anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId) totalCount
  from anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId
  LIMIT ?,?;
  `
  if(anchorName && liveTitle) {
    // 如果主播名和直播标题都有值
    statement = `
    SELECT 
    l.ID ID,anchorName,l.anchorId anchorId,liveId,liveTitle,visitNum,totalNum,liveQuantity,
    totalAmount,l.ifShow ifShow,item_done,
    (SELECT COUNT(*) FROM anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId WHERE anchorName LIKE ? AND liveTitle LIKE ?) totalCount
    from anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId
    WHERE anchorName LIKE ? AND liveTitle LIKE ?
    LIMIT ?,?;
    `
    anchorName = "%" + anchorName + "%";
    liveTitle = "%" + liveTitle + "%";
    const result = await connection.execute(statement, [ anchorName, liveTitle, anchorName, liveTitle, offset, size])
    return result
  } 
  else if (anchorName) {
    // 如果有直播名
    statement = `
    SELECT 
    l.ID ID,anchorName,l.anchorId anchorId,liveId,liveTitle,visitNum,totalNum,liveQuantity,
    totalAmount,l.ifShow ifShow,item_done,
    (SELECT COUNT(*) FROM anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId WHERE anchorName LIKE ?) totalCount
    from anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId
    WHERE anchorName LIKE ?
    LIMIT ?,?;
    `
    anchorName = "%" + anchorName + "%";
    const result = await connection.execute(statement, [ anchorName, anchorName, offset, size ])
    return result
  }
  else if(liveTitle) {
    // 如果有直播标题
    statement = `
    SELECT 
    l.ID ID,anchorName,l.anchorId anchorId,liveId,liveTitle,visitNum,totalNum,liveQuantity,
    totalAmount,l.ifShow ifShow,item_done,
    (SELECT COUNT(*) FROM anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId WHERE liveTitle LIKE ?) totalCount
    from anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId
    WHERE liveTitle LIKE ?
    LIMIT ?,?;
    `
    liveTitle = "%" + liveTitle + "%";
    const result = await connection.execute(statement, [ liveTitle, liveTitle, offset, size])
    return result
  }
  else {
    const result = await connection.execute(statement, [offset, size])
    return result
  }
}

const anchorsSearchSql = async (offset, size, anchorName, fansNum) => {
    // sql语句
    let statement = `
    SELECT 
    ID,anchorId,startBuildModel,ifShow,done,updateTime,anchorName,saleAbility,fansNum,agencyName,anchorType,liveTag,weight,picUrl,anchorClass,telephone,email,serviceFee,pgLiveQuantity,medianPrice,pgAudienceNum,pgVisitNum,pgLikedNum,hasShop,shopType,
    (SELECT COUNT(*) FROM anchors) totalCount
    FROM anchors
    LIMIT ?,?;
    `;
    if (!offset && !size) {
      // 如果没有传值，则直接返回10条数据
      const result = await connection.execute(statement, ["0", "10"]);
      return result;
    } else if (fansNum && anchorName && offset && size) {
      //都有值，说明要既符合主播名搜索，也符合范围搜索
      statement = `
      SELECT 
      ID,anchorId,startBuildModel,ifShow,done,updateTime,anchorName,saleAbility,fansNum,agencyName,anchorType,liveTag,weight,picUrl,anchorClass,telephone,email,serviceFee,pgLiveQuantity,medianPrice,pgAudienceNum,pgVisitNum,pgLikedNum,hasShop,shopType,
      (SELECT COUNT(*) FROM anchors where anchorName LIKE ? && fansNum BETWEEN ? AND ?) totalCount
      FROM anchors
      where anchorName LIKE ? && fansNum BETWEEN ? AND ?
      LIMIT ?, ?;
      `;
      anchorName = "%" + anchorName + "%";
      const result = await connection.execute(statement, [
        anchorName,
        fansNum[0],
        fansNum[1],
        anchorName,
        fansNum[0],
        fansNum[1],
        offset,
        size,
      ]);
      return result;
    } else if (anchorName && offset && size) {
      //如果都有值，按名字搜索
      statement = `SELECT 
      ID,anchorId,startBuildModel,ifShow,done,updateTime,anchorName,saleAbility,fansNum,agencyName,anchorType,liveTag,weight,picUrl,anchorClass,telephone,email,serviceFee,pgLiveQuantity,medianPrice,pgAudienceNum,pgVisitNum,pgLikedNum,hasShop,shopType,
      (SELECT COUNT(*) FROM anchors) totalCount
      FROM anchors
      where anchorName LIKE ?
      LIMIT ?, ?;`;
      anchorName = "%" + anchorName + "%";
      const result = await connection.execute(statement, [anchorName, offset, size]);
      return result;
    } else if (offset && size && fansNum) {
      // 如果范围有值
      statement = `
      SELECT 
      ID,anchorId,startBuildModel,ifShow,done,updateTime,anchorName,saleAbility,fansNum,agencyName,anchorType,liveTag,weight,picUrl,anchorClass,telephone,email,serviceFee,pgLiveQuantity,medianPrice,pgAudienceNum,pgVisitNum,pgLikedNum,hasShop,shopType,
      (SELECT COUNT(*) FROM anchors where fansNum BETWEEN ? AND ?) totalCount
      FROM anchors
      where fansNum BETWEEN ? AND ?
      LIMIT ?, ?;
      `;
      // 有传值，则根据传值获取数据
      const result = await connection.execute(statement, [
        fansNum[0],
        fansNum[1],
        fansNum[0],
        fansNum[1],
        offset,
        size,
      ]);
      return result;
    } else {
      // 有传值，则根据传值获取数据
      const result = await connection.execute(statement, [offset, size]);
      return result;
    }
}

// 前端_类别与价格匹配网红
const getMatchAnchorDataSql = async (category, price, offset, size) => {
  offset = String(offset)
  size = String(size)
  //价格区间10以内
  const minPrice = String((price - 5))
  const maxPrice = String((price + 5))

  let statement = `
  SELECT aca.ID id, aca.anchorId anchorId,
  (SELECT anchorName FROM anchors WHERE anchorId = aca.anchorId ) celebrity_name,
  catName category, pgItemSalePrice, fansNum fans_num,catSaleAbility ,ifShow,0 as match_index,
  `;
  if(category && price) {
    statement = 
    `${statement}   
    (SELECT count(*) FROM anchor_cat_ability aca LEFT JOIN anchors a
    ON aca.anchorId = a.anchorId WHERE catName = ? AND pgItemSalePrice BETWEEN ? AND ?) total
    FROM anchor_cat_ability aca LEFT JOIN anchors a
    ON aca.anchorId = a.anchorId
    WHERE catName = ? AND pgItemSalePrice BETWEEN ? AND ?
    LIMIT ?, ?;`
    const arr = [category, minPrice, maxPrice, category, minPrice, maxPrice, offset, size]
    const result = await connection.execute(statement, arr);
    return result[0];
  } 
  else if(category) {
    statement = 
    `${statement}   
    (SELECT count(*) FROM anchor_cat_ability aca LEFT JOIN anchors a
    ON aca.anchorId = a.anchorId WHERE catName = ?) total
    FROM anchor_cat_ability aca LEFT JOIN anchors a
    ON aca.anchorId = a.anchorId
    WHERE catName = ? 
    LIMIT ?, ?;`
    const arr = [category, category, offset, size]
    const result = await connection.execute(statement, arr);
    return result[0];
  }
  else if(price) {
    statement = 
    `${statement}   
    (SELECT count(*) FROM anchor_cat_ability aca LEFT JOIN anchors a
    ON aca.anchorId = a.anchorId WHERE pgItemSalePrice BETWEEN ? AND ?) total
    FROM anchor_cat_ability aca LEFT JOIN anchors a
    ON aca.anchorId = a.anchorId
    WHERE pgItemSalePrice BETWEEN ? AND ?
    LIMIT ?, ?;`
    const arr = [ minPrice, maxPrice, minPrice, maxPrice, offset, size]
    const result = await connection.execute(statement, arr);
    return result[0];
  }
  else {
    statement = 
    `${statement}   
    (SELECT count(*) FROM anchor_cat_ability aca LEFT JOIN anchors a
    ON aca.anchorId = a.anchorId ) total
    FROM anchor_cat_ability aca LEFT JOIN anchors a
    ON aca.anchorId = a.anchorId
    LIMIT ?, ?;`
    const result = await connection.execute(statement, [offset, size]);
    return result[0];
  }
}

module.exports = {
  goodsSearchSql,
  livesSearchSql,
  anchorsSearchSql,
  getMatchAnchorDataSql
}