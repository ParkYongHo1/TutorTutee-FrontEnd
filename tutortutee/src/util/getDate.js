function formatDate(noticeDate) {
  const now = new Date();
  const noticeTime = new Date(noticeDate);
  const timeDiff = now - noticeTime;

  if (timeDiff < 60000) {
    return "방금 전";
  }

  const year = noticeTime.getFullYear();
  const month = String(noticeTime.getMonth() + 1).padStart(2, "0");
  const day = String(noticeTime.getDate()).padStart(2, "0");
  const hours = String(noticeTime.getHours()).padStart(2, "0");
  const minutes = String(noticeTime.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export default formatDate;
