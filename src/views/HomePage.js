import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function HomePage() {
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/pharmacies")
      .then(res => setPharmacies(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>藥局列表</h1>
      <Navigation /> {/* 導航連結 */}

      <div>
        <table>
          <thead>
            <tr>
              <th>Pharmacy Name</th>
              <th>Cash Balance</th>
              <th>Opening Hours</th>
              <th>Masks Available</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.map((pharmacy) => (
              <tr key={pharmacy.id}>
                <td>{pharmacy.name}</td>
                <td>${pharmacy.cashBalance}</td>
                <td>
                  <p>
                    {Object.entries(pharmacy.opening_hours).map(([day, periods]) => (
                      <tr key={day}>
                        <strong>{day}</strong>: {periods.map(({ open, close }) => `${open} - ${close}`).join(", ")}
                      </tr>
                    ))}
                  </p>
                </td>
                <td>
                  <p>
                    {pharmacy.masks.map((product, index) => (
                      <tr key={index} className="text-sm">
                        <span>{product.name}</span> - ${product.price}
                      </tr>
                    ))}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;
