"use client";

import Image from "next/image";
import { useState, useMemo } from "react";

type Props = {
  imageUrl?: string | null;
  fullName?: string | null;
  size?: number;
};

export default function UserAvatar({ imageUrl, fullName, size = 40 }: Props) {
  const [error, setError] = useState(false);

  const initials = useMemo(() => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }, [fullName]);

  const bg = useMemo(() => {
    const colors = [
      "bg-indigo-500",
      "bg-emerald-500",
      "bg-rose-500",
      "bg-amber-500",
      "bg-sky-500",
      "bg-violet-500",
    ];
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [initials]);

  const src = useMemo(() => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    console.log("BACKEND URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
  }, [imageUrl]);

  return (
    <div
      className="relative overflow-hidden rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {!src || error ? (
        <div
          className={`absolute inset-0 flex items-center justify-center text-white font-semibold ${bg}`}
        >
          {initials}
        </div>
      ) : (
        <Image
          src={src}
          alt={fullName ?? "User avatar"}
          fill
          className="object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
