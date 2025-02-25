import { useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function TopUsersPage() {
  // 狀態管理
  const [startDate, setStartDate] = useState("2021-01-01");
  const [endDate, setEndDate] = useState("2021-02-01");
  const [limit, setLimit] = useState(1);
  const [topUsers, setTopUsers] = useState([]);
  const [error, setError] = useState("");

  // 送出查詢
  const fetchTopUsers = () => {
    // 條件檢查
    if (!startDate || !endDate) {
      setError("請選擇開始日期與結束日期");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("結束日不能早於開始日");
      return;
    }
    if (limit < 1) {
      setError("請輸入至少 1 名使用者");
      return;
    }
    
    setError(null);

    axios
      .get("http://localhost:8080/api/transactions/top-users", {
        params: { startDate, endDate, limit },
      })
      .then((res) => setTopUsers(res.data))
      .catch((err) => {
        console.error("獲取交易排名錯誤:", err);
        setError("查詢失敗，請稍後再試");
      });
  };

  return (
    <div>
      <h1>最高交易金額的使用者</h1>
      <Navigation /> {/* 導航連結 */}

      <div>
        <label>列出</label>
        <input
          type="number"
          min="1"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value, 10))}
        />
        <label>名最高金額的使用者</label>
      </div>

      <div>
        <label>時間區間：</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>至</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={fetchTopUsers}>搜尋</button>

      <h2>結果列表</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.filter(user => user.totalAmt > 0).length > 0 ? (
            topUsers
              .filter(user => user.totalAmt > 0) // 過濾 totalAmt > 0 的用戶
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>${user.totalAmt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>未找到符合條件的用戶</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopUsersPage;
