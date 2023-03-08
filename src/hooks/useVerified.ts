export default function useVerified() {
  const { email_verified_at } = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return {
    verified: !!email_verified_at,
  };
}
