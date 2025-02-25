import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function MaskListPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [masks, setMasks] = useState([]);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    axios.get("http://localhost:8080/api/pharmacies")
      .then(res => setPharmacies(res.data))
      .catch(err => console.error("獲取藥局列表失敗:", err));
  }, []);

  useEffect(() => {
    if (selectedPharmacy) {
      axios.get(`http://localhost:8080/api/pharmacies/${selectedPharmacy}/masks?sortBy=${sortBy}`)
        .then(res => setMasks(res.data))
        .catch(err => console.error("獲取口罩列表失敗:", err));
    }
  }, [selectedPharmacy, sortBy]);

  return (
    <div>
      <h1>選擇藥局並查看口罩</h1>
      <Navigation /> {/* 導航連結 */}

      <div htmlFor="pharmacy">選擇藥局：</div>
      <select id="pharmacy" value={selectedPharmacy} onChange={(e) => setSelectedPharmacy(e.target.value)}>
        <option value="">請選擇藥局</option>
        {pharmacies.map(pharmacy => (
          <option key={pharmacy.id} value={pharmacy.id}>{pharmacy.name}</option>
        ))}
      </select>

      <label htmlFor="sort">排序方式：</label>
      <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">名稱</option>
        <option value="price">價格</option>
      </select>

      {selectedPharmacy && (
        <>
          <h2>口罩列表</h2>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Mask</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {masks.length > 0 ? (
                  masks.map((mask) => (
                    <tr key={mask.id}>
                      <td>{mask.name}</td>
                      <td>${mask.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>
                      該藥局沒有販賣口罩
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default MaskListPage;
