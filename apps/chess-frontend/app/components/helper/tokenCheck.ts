import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  userId: string;
  exp: number;
  iat: number;
};

export function isTokenExpired() {
  const token = localStorage.getItem("token");
  if (!token) return true;

  const decoded = jwtDecode<DecodedToken>(token);

  const now = Date.now() / 1000;

  return decoded.exp < now;
}