import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>使用者資料</h1>
      <Navigation /> {/* 導航連結 */}

      <div>
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Cash Balance</th>
              <th>Purchase History</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>$ {user.cashBalance}</td>
                <td>
                  {user.purchaseHistories.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Mask</th>
                          <th>Total Amount</th>
                          <th>Transaction Date</th>
                          <th>Pharmacy Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.purchaseHistories.map((history, index) => (
                          <tr key={index}>
                            <td>{history.maskName}</td>
                            <td>$ {history.transactionAmount}</td>
                            <td>{new Date(history.transactionDate).toLocaleString()}</td>
                            <td>
                              {history.pharmacy?.name || "未知藥局"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span>無購買紀錄</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;
