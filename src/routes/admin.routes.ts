const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "All Users",
        url: `${prefix}/all-users`,
      },
      {
        title: "All Providers",
        url: `${prefix}/all-providers`,
      },
      {
        title: "All Categories",
        url: `${prefix}/all-categories`,
      },
      {
        title: "All Services",
        url: `${prefix}/all-services`,
      },
      {
        title: "All Requests",
        url: `${prefix}/all-requests`,
      },
      {
        title: "All Bookings",
        url: `${prefix}/all-bookings`,
      },
      {
        title: "All Payments",
        url: `${prefix}/all-payments`,
      },
    ],
  },
  {
    title: "App Settings",
    items: [
      {
        title: "Routing",
        url: "#",
      },
      {
        title: "Data Fetching",
        url: "#",
      },
    ],
  },
];