export default function useUser() {
  const {first_name, last_name, email} = JSON.parse(localStorage.getItem("user") || "{}");

  return {
    first_name, last_name, email
  };
}
