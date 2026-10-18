const prefix = "/provider";

export const providerRoutes = [
  {
    title: "Schedule",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "My Profile",
        url: `${prefix}/profile`,
      },
      {
        title: "My Services",
        url: `${prefix}/my-services`,
      },
      {
        title: "Availability",
        url: `${prefix}/availability`,
      },
      {
        title: "Assignments",
        url: `${prefix}/assignments`,
      },
      {
        title: "Bookings",
        url: `${prefix}/bookings`,
      },
      {
        title: "Estimates",
        url: `${prefix}/estimates`,
      },
      {
        title: "Work Logs",
        url: `${prefix}/work-logs`,
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