import { useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function TransactionTotalPage() {
  const [startDate, setStartDate] = useState("2021-01-01");
  const [endDate, setEndDate] = useState("2021-02-01");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    // 確保日期有效
    if (!startDate || !endDate) {
      setError("請選擇開始日期和結束日期");
      return;
    }
    if (endDate < startDate) {
      setError("結束日期不能早於開始日期");
      return;
    }

    setError(null);

    axios
      .get(`http://localhost:8080/api/transactions/total?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => {
        setError("查詢失敗，請稍後再試");
        console.error(err);
      });
  };

  return (
    <div>
      <h1>期間交易總結</h1>
      <Navigation /> {/* 導航連結 */}

      <div>
        <label>開始日期: </label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div>
        <label>結束日期: </label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button onClick={handleSearch}>查詢</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
      <div>
      <h2>查詢結果</h2>
        <table>
          <thead>
            <tr>
              <th>Total Amount</th>
              <th>Total Mask Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${summary.totalAmount}</td>
              <td>{summary.totalMasks} 個</td>
            </tr>
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

export default TransactionTotalPage;
