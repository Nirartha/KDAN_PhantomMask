/**
 * 解析 JSON 營業時間，檢查是否營業中
 */
const isPharmacyOpen = (openingHours, day, time) => {
  if (!openingHours || !openingHours[day]) return false;

  // 以分鐘比對
  const timeToMinutes = (t) => {
    const [hours, minutes] = t.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const queryTime = timeToMinutes(time);

  return openingHours[day].some((slot) => {
    const openTime = timeToMinutes(slot.open);
    const closeTime = timeToMinutes(slot.close);
    return queryTime >= openTime && queryTime <= closeTime;
  });
};

module.exports = { isPharmacyOpen };
