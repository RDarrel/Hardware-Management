function formattedDate(date, withHour = false) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date(date ? new Date(date) : new Date());
  const month = months[now.getMonth()];
  const day = now.getDate().toString().padStart(2, "0");
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  return withHour
    ? `${hours}:${minutes}  ${ampm}`
    : `${month} ${day}, ${year} `;
}

export default formattedDate;
