import { useRouter } from "next/router";
import { useEffect } from "react";

// pages/404.js
export default function Custom404() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);

  return <></>;
}
