
"use client";

import { useState } from "react";
import Logo from "@/assests/svg/logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { UserRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const routes = [
    { name: "Home", url: "/" },
    // { name: "About us", url: "/about-us" },
    { name: "Services", url: "/services" },
  ];

  const dashboardRoute: Record<UserRole, string> = {
    SUPER_ADMIN: "/admin",
    ADMIN: "/admin",
    PROVIDER: "/provider",
    CUSTOMER: "/customer",
  };

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const role: UserRole | undefined = data?.data?.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Tata",
          description: "Logged out successfully",
          type: "success",
        });

        queryClient.removeQueries({ queryKey: ["user"] });
        setIsMenuOpen(false);
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

  const closeMenu = () => setIsMenuOpen(false);

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
        <nav className="hidden items-center gap-5 md:flex lg:gap-8">
          {routes.map((route) => (
            <Link
              key={route.url}
              href={route.url}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-green-600 lg:text-base"
            >
              {route.name}
            </Link>
          ))}

          {role && (
            <Link
              href={dashboardRoute[role]}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-green-600 lg:text-base"
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
              render={<Link href="/login">Login</Link>}
              nativeButton={false}
              className="border-green-600 text-green-700 hover:bg-green-50"
            >
              Login
            </Button>
          )}

          {!isLoading && data && (
            <Button onClick={handleLogout} variant="destructive">
              Logout
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
            // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
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
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
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
            {routes.map((route) => (
              <Link
                key={route.url}
                href={route.url}
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
              >
                {route.name}
              </Link>
            ))}

            {role && (
              <Link
                href={dashboardRoute[role]}
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
              >
                Dashboard
              </Link>
            )}

            {!isLoading && !data && (
              <Link
                href="/login"
                onClick={closeMenu}
                className="mt-2 rounded-md bg-green-600 px-3 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Login
              </Link>
            )}

            {!isLoading && data && (
              <div className="mt-2">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}















// "use client";

// import Logo from "@/assests/svg/logo";
// // import Logo from "@/assets/svg/Logo";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/toast";
// import { useGetMe, useLogout } from "@/hooks";
// import { UserRole } from "@/types";
// import { useQueryClient } from "@tanstack/react-query";
// import Link from "next/link";

// export default function Header() {
//   const routes = [
//     { name: "Home", url: "/" },
//     { name: "About us", url: "/about-us" },
//   ];

//   const dashboardRoute: Record<UserRole, string> = {
//     SUPER_ADMIN: "/admin",
//     ADMIN: "/admin",
//     PROVIDER: "/provider",
//     CUSTOMER: "/customer",
//   };

//   const { data, isLoading } = useGetMe();
//   const { mutate: logout } = useLogout();
//   const queryClient = useQueryClient();

//   const role: UserRole = !!data?.data && data?.data.role;

//   const handleLogout = () => {
//     logout(undefined, {
//       onSuccess: () => {
//         toast.add({
//           title: "Tata",
//           description: "Logged out successfully",
//           type: "success",
//         });
//         queryClient.removeQueries({ queryKey: ["user"] });
//       },
//       onError: () => {
//         toast.add({
//           title: "Logout failed",
//           description: "Something Went Wrong",
//           type: "error",
//         });
//       },
//     });
//   };

//   return (
//     <header className="w-full h-16 border border-b">
//       <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
//         <div className="flex items-center gap-2">
//           <Logo />
//           <span>Home Service Marketplace</span>
//         </div>

//         <nav className="flex gap-5">
//           {routes.map((route) => (
//             <Link key={route.url} href={route.url}>
//               {route.name}
//             </Link>
//           ))}

//           {role && <Link href={dashboardRoute[role]}>Dashboard</Link>}
//         </nav>
//         <div>
//           {!isLoading && !data && (
//             <Button
//               variant="outline"
//               render={<Link href="/login">Login</Link>}
//               nativeButton={false}
//             >
//               Login
//             </Button>
//           )}
//           {!isLoading && data && (
//             <Button onClick={handleLogout} variant="destructive">
//               Logout
//             </Button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }