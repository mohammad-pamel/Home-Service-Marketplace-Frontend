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
        title: "Profile",
        url: `${prefix}/profile`,
      },
      {
        title: "My Services",
        url: `${prefix}/my-services`,
      },
      {
        title: "My Availability",
        url: `${prefix}/my-availability`,
      },
      {
        title: "My Assignments",
        url: `${prefix}/my-assignments`,
      },
      {
        title: "My Bookings",
        url: `${prefix}/my-bookings`,
      },
      {
        title: "My Estimates",
        url: `${prefix}/my-estimates`,
      },
      {
        title: "Work Logs",
        url: `${prefix}/work-logs`,
      },
      {
        title: "Total Earnings",
        url: `${prefix}/earnings`,
      },
      {
        title: "Reviews",
        url: `${prefix}/reviews`,
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