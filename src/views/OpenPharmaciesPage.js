import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function OpenPharmaciesPage() {
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("00:00");
  const [pharmacies, setPharmacies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (day) {
      fetchPharmacies();
    }
  }, [day, time]);

  const fetchPharmacies = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/pharmacies/open", {
        params: { day, time },
      });
      setPharmacies(response.data);
      setError("");
    } catch (err) {
      setError("無法取得營業藥局，請檢查 API 是否可用");
    }
  };

  const formatOpeningHours = (openingHours, selectedDay) => {
    if (!openingHours[selectedDay]) return "今日未營業";

    return openingHours[selectedDay]
      .map(({ open, close }) => `${open} - ${close}`)
      .join(", ");
  };


  return (
    <div>
      <h1>查詢營業中的藥局</h1>
      <Navigation /> {/* 導航連結 */}
      <div>
        <label>選擇星期：</label>
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>選擇時間：</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)}/>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>營業中的藥局</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>Pharmacy Name</th>
              <th>Opening Hours</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.length > 0 ? (
              pharmacies.map((pharmacy) => (
                <tr key={pharmacy.id}>
                  <td>{pharmacy.name}</td>
                  <td>{formatOpeningHours(pharmacy.opening_hours, day)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  沒有符合條件的藥局
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OpenPharmaciesPage;
