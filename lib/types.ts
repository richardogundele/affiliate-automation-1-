export interface DashboardInsights {
  totalRevenue: number
  activeCampaigns: number
  totalProducts: number
  conversionRate: number
  trendChartData: Array<{
    date: string
    [key: string]: string | number
  }>
}

export interface Product {
  id: string
  name: string
  description: string
  status: "Pending" | "Active" | "Inactive"
  analysis?: {
    demand_level: string
    dates: string[]
    values: number[]
  }
  salesCopy: string[]
  images: string[]
}

export interface Campaign {
  id: string
  name: string
  platform: string
  status: "Active" | "Paused" | "Ended"
  budget: number
  startDate: string
  endDate: string
  targetAudience: string
  productId: string
  performance: {
    impressions: number
    clicks: number
    conversions: number
    spend: number
    revenue: number
  }
}

export interface Lead {
  id: string
  name: string
  email: string
}

export interface Notification {
  id: string
  message: string
}

