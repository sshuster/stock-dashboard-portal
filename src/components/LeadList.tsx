
import { Lead } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import AnimatedTransition from "./ui-custom/AnimatedTransition";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import LeadForm from "./LeadForm";

interface LeadListProps {
  leads: Lead[];
  campaignId: number;
  onAddLead: (lead: Omit<Lead, "id" | "dateCreated">) => Promise<void>;
  onUpdateLead: (leadId: number, lead: Partial<Lead>) => Promise<void>;
  onDeleteLead?: (leadId: number) => Promise<void>;
}

const LeadList: React.FC<LeadListProps> = ({
  leads,
  campaignId,
  onAddLead,
  onUpdateLead,
  onDeleteLead,
}) => {
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "contacted":
        return "bg-yellow-500";
      case "qualified":
        return "bg-green-500";
      case "converted":
        return "bg-purple-500";
      case "unqualified":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
  };

  const handleUpdateLead = async (updatedData: Omit<Lead, "id" | "dateCreated">) => {
    if (editingLead) {
      await onUpdateLead(editingLead.id, updatedData);
      setEditingLead(null);
    }
  };

  const handleDeleteClick = async (leadId: number) => {
    if (onDeleteLead && confirm("Are you sure you want to delete this lead?")) {
      await onDeleteLead(leadId);
    }
  };

  return (
    <AnimatedTransition animation="fade" className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leads</h2>
        <Button 
          onClick={() => setShowAddLeadDialog(true)} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No leads found for this campaign.</p>
          <Button 
            onClick={() => setShowAddLeadDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Lead
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.firstName && lead.lastName 
                      ? `${lead.firstName} ${lead.lastName}` 
                      : (lead.firstName || lead.lastName || "N/A")}
                  </TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company || "N/A"}</TableCell>
                  <TableCell>{lead.source || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(lead.status)} text-white capitalize`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(lead)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {onDeleteLead && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteClick(lead.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Lead Dialog */}
      <Dialog open={showAddLeadDialog} onOpenChange={setShowAddLeadDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <LeadForm
            campaignId={campaignId}
            onSubmit={onAddLead}
            onCancel={() => setShowAddLeadDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={!!editingLead} onOpenChange={(open) => !open && setEditingLead(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          {editingLead && (
            <LeadForm
              campaignId={campaignId}
              initialValues={editingLead}
              onSubmit={handleUpdateLead}
              onCancel={() => setEditingLead(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AnimatedTransition>
  );
};

export default LeadList;
