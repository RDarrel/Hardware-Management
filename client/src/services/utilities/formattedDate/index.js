function formattedDate(date) {
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

  return `${month} ${day}, ${year}`;
}

export default formattedDate;
