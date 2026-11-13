
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

import Logo from "@/assests/svg/logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { UserRole } from "@/types";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const queryClient = useQueryClient();

  const routes = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "About us", url: "/about-us" },
    { name: "Contact", url: "/contact" },
  ];

  const dashboardRoute: Record<UserRole, string> = {
    SUPER_ADMIN: "/admin",
    ADMIN: "/admin",
    PROVIDER: "/provider",
    CUSTOMER: "/customer",
  };

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();

  const role: UserRole | undefined = data?.data?.role;
  const dashboardUrl = role ? dashboardRoute[role] : undefined;

  // Check active route
  const isActiveRoute = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  // Close mobile menu
  const closeMenu = () => setIsMenuOpen(false);

  // Logout handler
  const handleLogout = () => {
    if (isLogoutLoading) return;

    setIsLogoutLoading(true);

    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Tata",
          description: "Logged out successfully",
          type: "success",
        });

        queryClient.removeQueries({ queryKey: ["user"] });
        setIsMenuOpen(false);
        router.push("/");
      },

      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something Went Wrong",
          type: "error",
        });
      },

      onSettled: () => {
        setIsLogoutLoading(false);
      },
    });
  };

  // Login navigation handler
  const handleLoginNavigation = () => {
    if (isLoginLoading) return;

    setIsLoginLoading(true);
    closeMenu();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-2"
        >
          <Logo />

          <span className="truncate text-base font-bold text-gray-900 sm:text-lg">
            Home Service Marketplace
          </span>
        </Link>

        {/* Desktop & Tablet Navigation */}
        <nav className="hidden items-center gap-3 md:flex lg:gap-5">
          {routes.map((route) => {
            const active = isActiveRoute(route.url);

            return (
              <Link
                key={route.url}
                href={route.url}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-all lg:text-base ${
                  active
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {route.name}

                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-green-600" />
                )}
              </Link>
            );
          })}

          {/* Dashboard */}
          {dashboardUrl && (
            <Link
              href={dashboardUrl}
              aria-current={
                pathname.startsWith(dashboardUrl) ? "page" : undefined
              }
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all lg:text-base ${
                pathname.startsWith(dashboardUrl)
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center md:flex">
          {!isLoading && !data && (
            <Button
              variant="outline"
              onClick={handleLoginNavigation}
              disabled={isLoginLoading}
              className="border-green-600 text-green-700 hover:bg-green-50"
            >
              {isLoginLoading ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </Button>
          )}

          {!isLoading && data && (
            <Button
              onClick={handleLogout}
              variant="destructive"
              disabled={isLogoutLoading}
            >
              {isLogoutLoading ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-md md:hidden">
          <nav className="flex flex-col gap-1">

            {routes.map((route) => {
              const active = isActiveRoute(route.url);

              return (
                <Link
                  key={route.url}
                  href={route.url}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {route.name}

                    {active && (
                      <span className="size-2 rounded-full bg-green-600" />
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Mobile Dashboard */}
            {dashboardUrl && (
              <Link
                href={dashboardUrl}
                onClick={closeMenu}
                aria-current={
                  pathname.startsWith(dashboardUrl) ? "page" : undefined
                }
                className={`rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                  pathname.startsWith(dashboardUrl)
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <span className="flex items-center justify-between">
                  Dashboard

                  {pathname.startsWith(dashboardUrl) && (
                    <span className="size-2 rounded-full bg-green-600" />
                  )}
                </span>
              </Link>
            )}

            {/* Mobile Login */}
            {!isLoading && !data && (
              <Button
                type="button"
                onClick={handleLoginNavigation}
                disabled={isLoginLoading}
                className="mt-2 w-full bg-green-600 text-white hover:bg-green-700"
              >
                {isLoginLoading ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            )}

            {/* Mobile Logout */}
            {!isLoading && data && (
              <div className="mt-2">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                  disabled={isLogoutLoading}
                >
                  {isLogoutLoading ? (
                    <>
                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    "Logout"
                  )}
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
