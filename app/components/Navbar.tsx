"use client"
import Link from "next/link";

export default function Navbar() {

  return (
    <div className="nav-row">
    <Link href="/"><img src="/home.png" alt="home page" width="25" height="10"/></Link>
      <div className="auth-buttons">
      <Link href="/login"><button className="auth-button">Login</button></Link>
      <Link href="/signup"><button className="auth-button">Signup</button></Link>
      </div>
    </div>
  );
}
