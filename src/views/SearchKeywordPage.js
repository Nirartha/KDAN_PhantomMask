import { useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function SearchKeywordPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("pharmacy");
  const [results, setResults] = useState({ pharmacies: [], masks: [] });

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("請輸入搜尋關鍵字");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/pharmacies/search", {
        params: { query, type },
      });
      setResults(response.data);
    } catch (error) {
      console.error("搜尋錯誤:", error);
    }
  };

  return (
    <div>
      <h1>搜尋藥局或口罩</h1>
      <Navigation /> {/* 導航連結 */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="輸入關鍵字..."
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="pharmacy">藥局</option>
        <option value="mask">口罩</option>
      </select>
      <button onClick={handleSearch}>搜尋</button>

      <h2>搜尋結果</h2>

      {/* 如果選擇 "pharmacy"，只顯示藥局 */}
      {type === "pharmacy" && results.pharmacies.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Pharmacy Name</th>
              </tr>
            </thead>
            <tbody>
              {results.pharmacies.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 如果選擇 "mask"，只顯示口罩 */}
      {type === "mask" && results.masks.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Mask(s)</th>
              </tr>
            </thead>
            <tbody>
              {results.masks.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 若無結果時顯示 */}
      {((type === "pharmacy" && results.pharmacies.length === 0) ||
        (type === "mask" && results.masks.length === 0)) && (
        <p>沒有找到相關結果</p>
      )}
    </div>
  );
}

export default SearchKeywordPage;
