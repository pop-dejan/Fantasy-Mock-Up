export default function getCookie(cookieName) {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];

  return cookieValue ? decodeURIComponent(cookieValue) : null;
}
