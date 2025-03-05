
import { Lead } from "@/types";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import GlassCard from "./ui-custom/GlassCard";
import AnimatedTransition from "./ui-custom/AnimatedTransition";
import { toast } from "sonner";

interface LeadFormProps {
  campaignId: number;
  onSubmit: (lead: Omit<Lead, "id" | "dateCreated">) => Promise<void>;
  initialValues?: Partial<Lead>;
  onCancel?: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ campaignId, onSubmit, initialValues, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    source: "",
    status: "new",
    notes: "",
    ...initialValues,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.email) {
        toast.error("Email is required");
        return;
      }

      await onSubmit({
        ...formData as Omit<Lead, "id" | "dateCreated">,
        status: (formData.status as Lead["status"]) || "new",
      });
      toast.success("Lead saved successfully");
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Failed to save lead");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedTransition animation="scale" className="w-full">
      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="555-123-4567"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                placeholder="Acme Inc."
                value={formData.company || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="Marketing Manager"
                value={formData.jobTitle || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Lead Source</Label>
              <Select
                value={formData.source || ""}
                onValueChange={(value) => handleSelectChange(value, "source")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Trade Show">Trade Show</SelectItem>
                  <SelectItem value="Cold Call">Cold Call</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "new"}
                onValueChange={(value) => handleSelectChange(value, "status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="unqualified">Unqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Additional information about this lead..."
              value={formData.notes || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : initialValues?.id ? "Update Lead" : "Add Lead"}
            </Button>
          </div>
        </form>
      </GlassCard>
    </AnimatedTransition>
  );
};

export default LeadForm;
