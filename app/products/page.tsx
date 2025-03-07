"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, TrendingUp, Trash2 } from "lucide-react"
import { analyzeProduct, generateText, generateImage, fetchProducts } from "@/lib/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useNotifications } from "@/components/notifications-provider"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  })

  useEffect(() => {
    // Refetch products when the component mounts
    refetchProducts()
  }, [refetchProducts])

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const analysisResult = await analyzeProduct({ keyword: productName })

      const salesCopyPrompt = `Create a compelling and professional sales copy for the following product:

Product Name: ${productName}
Product Description: ${productDescription}

The sales copy should include:
1. An attention-grabbing headline that speaks to the product's unique value proposition
2. A powerful opening paragraph that hooks the reader and addresses their pain points
3. 3-5 key benefits of the product, focusing on how it solves the customer's problems
4. A detailed explanation of how the product works or its features, emphasizing its uniqueness in the market
5. Social proof or testimonials (you can create fictional ones) that build credibility
6. A strong call-to-action that creates urgency and motivates immediate purchase
7. Any guarantees or risk-reversals that make the offer irresistible

Make the copy persuasive, engaging, and tailored to the product's unique selling points. Use power words, emotional triggers, and a tone that resonates with the target audience. The copy should be concise yet comprehensive, addressing potential objections and highlighting the transformative impact of the product.`

      const [copyResult, imageResult] = await Promise.all([
        generateText({
          product_name: productName,
          description: productDescription,
          prompt: salesCopyPrompt,
        }),
        generateImage({
          product_name: productName,
          description: productDescription,
          prompt: `High-quality product image of ${productName}`,
        }),
      ])

      return {
        id: Date.now().toString(),
        name: productName,
        description: productDescription,
        status: "Active",
        analysis: analysisResult,
        salesCopy: [copyResult.text],
        images: [imageResult],
      }
    },
    onSuccess: (newProduct) => {
      // Update local storage
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
      localStorage.setItem("products", JSON.stringify([newProduct, ...storedProducts]))

      // Update React Query cache
      queryClient.setQueryData<Product[]>("products", (old = []) => [newProduct, ...old])

      setProductName("")
      setProductDescription("")
      addNotification("success", `Product "${newProduct.name}" has been added successfully.`)
      refetchProducts() // Refetch products to update the list
    },
    onError: (error: any) => {
      
      console.error("Mutation error:", error)
      addNotification("error", `Failed to add product: ${error.message || "Unknown error"}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => {
      // Remove the product from local storage
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
      const updatedProducts = storedProducts.filter((p: Product) => p.id !== productId)
      localStorage.setItem("products", JSON.stringify(updatedProducts))
      return Promise.resolve(productId)
    },
    onSuccess: (deletedProductId) => {
      queryClient.setQueryData<Product[]>("products", (old = []) =>
        old.filter((product) => product.id !== deletedProductId),
      )
      addNotification("info", `Product has been deleted.`)
      refetchProducts() // Refetch products to update the list
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (productName && productDescription) {
      analyzeMutation.mutate()
    }
  }

  if (productsLoading) return <div>Loading products...</div>
  if (productsError) return <div>Error loading products: {(productsError as Error).message}</div>

  return (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
            <Textarea
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <Button type="submit" disabled={analyzeMutation.isLoading}>
              {analyzeMutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyze Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={() => product.id !== "1" && deleteMutation.mutate(product.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product, onDelete }: { product: Product; onDelete: () => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={product.status === "Active" ? "default" : "secondary"}>{product.status}</Badge>
            <Button variant="destructive" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="analysis" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="copy">Sales Copy</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span>Demand Level:</span>
                <Badge
                  variant={
                    product.analysis?.demand_level === "High"
                      ? "default"
                      : product.analysis?.demand_level === "Medium"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {product.analysis?.demand_level || "N/A"}
                </Badge>
              </div>
              {product.analysis?.dates && product.analysis.values && (
                <div>
                  <p className="font-medium mb-2">Interest Trend:</p>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={product.analysis.dates.map((date, index) => ({
                          date,
                          value: product.analysis!.values[index],
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="copy">
            <div className="space-y-4">
              {product.salesCopy.map((copy, index) => (
                <div key={index} className="p-4 bg-muted rounded-md">
                  <p className="text-sm">{copy}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid grid-cols-1 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Ad creative ${index + 1} for ${product.name}`}
                    className="rounded-md w-full object-cover"
                  />
                  {image.isPlaceholder && (
                    <div className="absolute top-0 left-0 bg-yellow-500 text-white px-2 py-1 text-xs rounded-br-md">
                      Placeholder
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

