export default function useId() {
  const { id } = JSON.parse(localStorage.getItem("user") || "{}");

  return {
    id,
  };
}
