const handleFanNumRange = (range) => {
  let fansNum = [];
  switch (range) {
    case "5000W以上":
      fansNum = ["50000000", "200000000"];
      break;
    case "1000W-5000W":
      fansNum = ["10000000", "50000000"];
      break;
    case "500W-1000W":
      fansNum = ["5000000", "10000000"];
      break;
    case "100W-500W":
      fansNum = ["1000000", "5000000"];
      break;
    case "50W-100W":
      fansNum = ["500000", "1000000"];
      break;
    case "1W-50W":
      fansNum = ["10000", "500000"];
      break;
    case "小于10000":
        fansNum = ["0", "10000"];
        break;
    default:
      fansNum = undefined;
      break;
  }
  return fansNum
};

module.exports = {
  handleFanNumRange
};
