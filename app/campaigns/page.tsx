"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchCampaigns, fetchProducts, createCampaign, updateCampaign, deleteCampaign, getExistingProducts } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PlayCircle, StopCircle, BarChart2, Plus, Trash2 } from "lucide-react"
import { useNotifications } from "@/components/notifications-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Campaign {
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
  created_at: string
}

interface Product {
  id: string
  name: string
  description: string
}

export default function CampaignsPage() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()
  const [isAddingCampaign, setIsAddingCampaign] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    product_id: '',
  })

  const { data: campaignsData, isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
  })

  const { data: productsData, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getExistingProducts,
    retry: false,
    initialData: []
  })

  useEffect(() => {
    if (campaignsData) {
      setCampaigns(campaignsData)
    }
    if (productsData) {
      setProducts(productsData)
    }
  }, [campaignsData, productsData])

  const addCampaignMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: (newCampaign) => {
      queryClient.setQueryData<Campaign[]>(["campaigns"], (old = []) => [...old, newCampaign])
      addNotification("success", `Campaign for "${newCampaign.name}" has been added.`)
      setIsAddingCampaign(false)
      setNewCampaign({ name: '', product_id: '' })
    },
    onError: (error) => {
      console.error("Error adding campaign:", error)
      addNotification("error", "Failed to add campaign. Please try again.")
    },
  })

  const updateCampaignMutation = useMutation({
    mutationFn: updateCampaign,
    onSuccess: (updatedCampaign) => {
      queryClient.setQueryData<Campaign[]>(["campaigns"], (old = []) =>
        old.map((campaign) => (campaign.id === updatedCampaign.id ? updatedCampaign : campaign)),
      )
      addNotification("success", `Campaign for "${updatedCampaign.name}" has been updated.`)
    },
    onError: (error) => {
      console.error("Error updating campaign:", error)
      addNotification("error", "Failed to update campaign. Please try again.")
    },
  })

  const deleteCampaignMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Campaign[]>(["campaigns"], (old = []) =>
        old.filter((campaign) => campaign.id !== id)
      )
      addNotification("success", "Campaign has been deleted.")
    },
    onError: (error) => {
      console.error("Error deleting campaign:", error)
      addNotification("error", "Failed to delete campaign. Please try again.")
    },
  })

  const handleAddCampaign = (product: Product) => {
    const newCampaign: Partial<Campaign> = {
      name: product.name,
      productId: product.id,
      status: "Paused",
      budget: 1000, // Default budget
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
      targetAudience: "All",
      platform: "Facebook", // Default platform
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0,
        revenue: 0,
      },
    }
    addCampaignMutation.mutate(newCampaign as Campaign)
  }

  const handleStartCampaign = (campaign: Campaign) => {
    updateCampaignMutation.mutate({ ...campaign, status: "Active" })
  }

  const handleEndCampaign = (campaign: Campaign) => {
    updateCampaignMutation.mutate({ ...campaign, status: "Ended" })
  }

  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaignMutation.mutate(id)
    }
  }

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault()
    addCampaignMutation.mutate(newCampaign as Campaign)
  }

  if (campaignsLoading || productsLoading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaign Management</h1>
        <Dialog open={isAddingCampaign} onOpenChange={setIsAddingCampaign}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Campaign</DialogTitle>
              <DialogDescription>
                Create a new campaign for an existing product
              </DialogDescription>
            </DialogHeader>
            {products && products.length > 0 ? (
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="Enter campaign name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product">Select Product</Label>
                  <Select
                    value={newCampaign.product_id}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, product_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create Campaign
                </Button>
              </form>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No products available. Please create a product first.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.href = '/products'}
                >
                  Go to Products
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            product={products.find((p) => p.id === campaign.productId)}
            onStart={() => handleStartCampaign(campaign)}
            onEnd={() => handleEndCampaign(campaign)}
            onDelete={() => handleDeleteCampaign(campaign.id)}
          />
        ))}
      </div>
    </div>
  )
}

function CampaignCard({
  campaign,
  product,
  onStart,
  onEnd,
  onDelete,
}: {
  campaign: Campaign
  product?: Product
  onStart: () => void
  onEnd: () => void
  onDelete: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{product?.name || "Unknown Product"}</CardTitle>
          <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>{campaign.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Platform</p>
            <p className="font-medium">{campaign.platform}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="font-medium">${campaign.budget}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-medium">{campaign.startDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="font-medium">{campaign.endDate}</p>
          </div>
        </div>
        <Tabs defaultValue="performance">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
          <TabsContent value="performance">
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: "Day 1", value: campaign.performance.impressions },
                    { name: "Day 2", value: campaign.performance.impressions * 1.2 },
                    { name: "Day 3", value: campaign.performance.impressions * 1.5 },
                    { name: "Day 4", value: campaign.performance.impressions * 1.3 },
                    { name: "Day 5", value: campaign.performance.impressions * 1.8 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="text-lg font-semibold">{campaign.performance.impressions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clicks</p>
                <p className="text-lg font-semibold">{campaign.performance.clicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-lg font-semibold">{campaign.performance.conversions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-lg font-semibold">${campaign.performance.revenue.toLocaleString()}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="audience">
            <p className="mt-4">{campaign.targetAudience}</p>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-2 mt-4">
          {campaign.status !== "Active" && (
            <Button variant="outline" onClick={onStart}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          {campaign.status === "Active" && (
            <Button variant="outline" onClick={onEnd}>
              <StopCircle className="h-4 w-4 mr-2" />
              End
            </Button>
          )}
          <Button variant="outline" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

