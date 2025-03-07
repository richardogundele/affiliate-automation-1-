import type { DashboardInsights, Product, Campaign, Lead, Notification } from "./types"

export const mockDashboardData: DashboardInsights = {
  totalRevenue: 45203,
  activeCampaigns: 12,
  totalProducts: 32,
  conversionRate: 0.23,
  trendChartData: [
    { date: "01 Jan", organic: 343, direct: 423 },
    { date: "08 Jan", organic: 523, direct: 323 },
    { date: "15 Jan", organic: 232, direct: 543 },
    { date: "22 Jan", organic: 343, direct: 232 },
    { date: "29 Jan", organic: 545, direct: 343 },
  ],
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Blue Light Blocking Glasses",
    description: "Protect your eyes from digital strain",
    status: "Active",
    analysis: {
      demand_level: "High",
      dates: ["2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06"],
      values: [65, 59, 80, 81, 56, 55],
    },
    salesCopy: [
      "Protect your eyes from harmful blue light with our cutting-edge Blue Light Blocking Glasses!",
      "Experience reduced eye strain and better sleep with our innovative Blue Light Blocking technology.",
    ],
    images: ["/placeholder.svg?height=600&width=800"],
  },
]

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Campaign A",
    platform: "Facebook",
    status: "Active",
    budget: 1000,
    startDate: "2023-01-01",
    endDate: "2023-01-31",
    targetAudience: "Audience A",
    productId: "1",
    performance: {
      impressions: 10000,
      clicks: 100,
      conversions: 10,
      spend: 100,
      revenue: 1000,
    },
  },
  {
    id: "2",
    name: "Campaign B",
    platform: "Google Ads",
    status: "Paused",
    budget: 500,
    startDate: "2023-02-01",
    endDate: "2023-02-28",
    targetAudience: "Audience B",
    productId: "2",
    performance: {
      impressions: 5000,
      clicks: 50,
      conversions: 5,
      spend: 50,
      revenue: 500,
    },
  },
]

export const mockLeads: Lead[] = [
  { id: "1", name: "Lead A", email: "leadA@example.com" },
  { id: "2", name: "Lead B", email: "leadB@example.com" },
]

export const mockNotifications: Notification[] = [
  { id: "1", message: "New lead received!" },
  { id: "2", message: "Campaign budget exceeded." },
]

