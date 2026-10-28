const prefix = "/customer";

export const customerRoutes = [
  {
    title: "Bookings",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Create Requests",
        url: `${prefix}/create-request`,
      },
      {
        title: "My Requests",
        url: `${prefix}/my-requests`,
      },
      {
        title: "My Bookings",
        url: `${prefix}/my-bookings`,
      },
      {
        title: "Estimates",
        url: `${prefix}/estimates`,
      },
      {
        title: "Payment History",
        url: `${prefix}/payments`,
      },
      {
        title: "Reviews",
        url: `${prefix}/reviews`,
      },
      {
        title: "My Profile",
        url: `${prefix}/profile`,
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
        isActive: true,
      },
    ],
  },
];