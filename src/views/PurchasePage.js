import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function PurchasePage() {
  const [users, setUsers] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [masks, setMasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [selectedMask, setSelectedMask] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:8080/api/pharmacies").then((res) => setPharmacies(res.data));
  }, []);

  useEffect(() => {
    if (selectedPharmacy) {
      axios
        .get(`http://localhost:8080/api/pharmacies/${selectedPharmacy}/masks`)
        .then((res) => setMasks(res.data));
    }
  }, [selectedPharmacy]);

  const handlePurchase = () => {
    if (!selectedUser || !selectedPharmacy || !selectedMask || quantity <= 0) {
      alert("請選擇完整的購買資訊");
      return;
    }

    axios
      .post("http://localhost:8080/api/purchase", {
        userId: selectedUser,
        pharmacyId: selectedPharmacy,
        maskId: selectedMask,
        quantity,
      })
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(err.response?.data?.error || "購買失敗"));
  };

  return (
    <div>
      <h1>購買口罩</h1>
      <Navigation /> {/* 導航連結 */}
      <label>選擇用戶：</label>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">請選擇</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} (餘額: {user.cashBalance})
          </option>
        ))}
      </select>

      <label>選擇藥局：</label>
      <select value={selectedPharmacy} onChange={(e) => setSelectedPharmacy(e.target.value)}>
        <option value="">請選擇</option>
        {pharmacies.map((pharmacy) => (
          <option key={pharmacy.id} value={pharmacy.id}>
            {pharmacy.name}
          </option>
        ))}
      </select>

      <label>選擇口罩：</label>
      <select value={selectedMask} onChange={(e) => setSelectedMask(e.target.value)} disabled={!selectedPharmacy}>
        <option value="">請選擇</option>
        {masks.map((mask) => (
          <option key={mask.id} value={mask.id}>
            {mask.name} (${mask.price})
          </option>
        ))}
      </select>

      <label>購買數量：</label>
      <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" />

      <button onClick={handlePurchase}>購買</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default PurchasePage;
