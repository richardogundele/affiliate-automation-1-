"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchProducts, generateAdCopy, generateProductDescription } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ProductAnalysisPage() {
  const { id } = useParams()
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  })

  const adCopyMutation = useMutation({
    mutationFn: generateAdCopy,
  })

  const productDescriptionMutation = useMutation({
    mutationFn: generateProductDescription,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  const product = products.find((p) => p.id === Number.parseInt(id as string))

  if (!product) return <div>Product not found</div>

  const handleGenerateAdCopy = () => {
    adCopyMutation.mutate({ name: product.name, description: product.description })
  }

  const handleGenerateProductDescription = () => {
    productDescriptionMutation.mutate({ name: product.name, features: product.features })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="ai-content">AI Content</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Product Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category:</p>
                  <p>{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Demand:</p>
                  <Badge variant={product.demand_score > 7 ? "default" : "secondary"}>
                    {product.demand_score > 7 ? "High" : "Medium"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit Potential:</p>
                  <p>{product.profit_potential}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description:</p>
                  <p>{product.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="market-analysis">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={product.market_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="interest" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4">
                <p>
                  <strong>Competition Level:</strong> {product.competition_level}
                </p>
                <p>
                  <strong>Overall Demand:</strong> {product.demand_score.toFixed(1)} / 10
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-content">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Ad Copy</h3>
                  <Button onClick={handleGenerateAdCopy} disabled={adCopyMutation.isLoading}>
                    Generate Ad Copy
                  </Button>
                  {adCopyMutation.isSuccess && (
                    <div className="mt-2">
                      <p>
                        <strong>Headline:</strong> {adCopyMutation.data.headline}
                      </p>
                      <p>
                        <strong>Body:</strong> {adCopyMutation.data.body}
                      </p>
                      <p>
                        <strong>CTA:</strong> {adCopyMutation.data.cta}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Product Description</h3>
                  <Button onClick={handleGenerateProductDescription} disabled={productDescriptionMutation.isLoading}>
                    Generate Product Description
                  </Button>
                  {productDescriptionMutation.isSuccess && (
                    <div className="mt-2">
                      <p>{productDescriptionMutation.data}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

