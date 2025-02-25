import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function PharmacyFilter() {
  const [comparison, setComparison] = useState("greater"); // "greater" 或 "less"
  const [quantity, setQuantity] = useState(1);
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(99);
  const [pharmacies, setPharmacies] = useState([]);

  const fetchFilteredPharmacies = () => {
    axios
      .get("http://localhost:8080/api/pharmacies/filter", {
        params: {
          comparison,
          qty: quantity,
          minPrice: minPrice || 0,
          maxPrice: maxPrice || Number.MAX_VALUE,
        },
      })
      .then((res) => setPharmacies(res.data))
      .catch((err) => console.error("Error fetching pharmacies:", err));
  };

  return (
    <div>
      <h1>篩選藥局</h1>
      <Navigation /> {/* 導航連結 */}

      <div>
        <label>口罩商品</label>
        <select value={comparison} onChange={(e) => setComparison(e.target.value)}>
          <option value="greater">大於</option>
          <option value="less">小於</option>
        </select>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        種
      </div>

      <div>
        <label>價格範圍：</label>
        <input
          type="number"
          min="0"
          placeholder="最小值"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        至
        <input
          type="number"
          min="0"
          placeholder="最大值"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <button onClick={fetchFilteredPharmacies}>搜尋</button>

      <h2>符合條件的藥局</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>Pharmacy Name</th>
              <th>Masks Type</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.length > 0 ? (
              pharmacies.map((pharmacy) => (
                <tr key={pharmacy.id}>
                  <td>{pharmacy.name}</td>
                  <td>{pharmacy.masks.length} 種</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>未找到符合條件的藥局</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PharmacyFilter;
