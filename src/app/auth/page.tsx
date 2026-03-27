"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { Config } from "../config/config";
import axios from "axios";
import { useProfileStore } from "../packages/zustand/profile";
import { useRouter } from "next/navigation";

export default function Auth() {
  const profile = useProfileStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) return alert("Please enter your email and password.");
    setLoading(true);
    try {
      const res = await axios.post(
        `${Config.BACKEND_URL}:${Config.BACKEND_PORT}/account/api/oauth/token`,
        { grant_type: "password", username: email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      profile.login({
        accountId: res.data.account_id,
        displayName: res.data.displayName,
        email,
        password,
      });
      router.replace("/");
    } catch (err: any) {
      alert(err.response?.data?.error_description || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-[340px] flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-white">{Config.NAME}</h1>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Email</label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-zinc-900 text-white text-sm border border-zinc-800 focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full p-2.5 rounded-lg bg-zinc-900 text-white text-sm border border-zinc-800 focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <LogIn size={15} />
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}
