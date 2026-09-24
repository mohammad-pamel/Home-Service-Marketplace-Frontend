"use client";

import Logo from "@/assests/svg/logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const routes = [
    { name: "Home", url: "/" },
    { name: "About us", url: "/about-us" },
  ];

  const {data, isLoading} = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const router = useRouter();


  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Logout",
          description: "Logged out successfully",
          type: "success",
        });
        router.push('/login')
        queryClient.removeQueries({ queryKey: ["user"] });
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something Went Wrong",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="w-full h-16 border border-b">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Logo />
          <span>Home Service Marketplace</span>
        </div>
        <nav className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.url} href={route.url}>
              {route.name}
            </Link>
          ))}
        </nav>
        <div>
            {!isLoading && !data && (
            <Button
            variant="outline"
            render={<Link href="/login">Login</Link>}
            nativeButton={false}
          >
            login
          </Button>
        )}
            {!isLoading && data && (
            <Button
            variant="destructive"
            onClick={handleLogout}
          >
            logout
          </Button>
        )}
          
        </div>
      </div>
    </header>
  );
}