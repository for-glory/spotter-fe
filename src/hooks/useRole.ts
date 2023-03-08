export default function useRoles() {
  const { role } = JSON.parse(localStorage.getItem("user") || "{}");

  return {
    role,
  };
}
