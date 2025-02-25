import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav>
      <Link to="/homepage">回到藥局列表</Link> ｜ 
      <Link to="/users">查看使用者資料</Link> ｜ 
      <Link to="/openpharmacies">查詢營業中的藥局</Link> ｜ 
      <Link to="/masklist">藥局口罩列表</Link> ｜ 
      <Link to="/pharmacyfilter">價格範圍與口罩數量篩選列表</Link> ｜ 
      <Link to="/topusers">最高交易金額的使用者查詢</Link> ｜ 
      <Link to="/transactiontotal">期間交易總結</Link> ｜ 
      <Link to="/searchkeyword">關鍵字搜尋</Link> ｜ 
      <Link to="/purchase">購買口罩</Link>
    </nav>
  );
};

export default Navigation;
