"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchLeads } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

export default function LeadsPage() {
  const queryClient = useQueryClient()
  const {
    data: leads,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  })

  const deleteMutation = useMutation({
    mutationFn: async (leadId: string) => {
      // In a real application, you would call an API to delete the lead
      // For now, we'll just remove it from the local state
      return leadId
    },
    onSuccess: (deletedLeadId) => {
      queryClient.setQueryData(["leads"], (old: any[] = []) => old.filter((lead) => lead.id !== deletedLeadId))
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recent Leads</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>
                <Badge
                  variant={lead.status === "New" ? "default" : lead.status === "Contacted" ? "secondary" : "outline"}
                >
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(lead.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

