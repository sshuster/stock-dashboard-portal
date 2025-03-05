
import { Campaign } from "@/types";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DatePicker } from "./ui/calendar";
import { format } from "date-fns";
import GlassCard from "./ui-custom/GlassCard";
import AnimatedTransition from "./ui-custom/AnimatedTransition";
import { toast } from "sonner";

interface CampaignFormProps {
  onSubmit: (campaign: Omit<Campaign, "id">) => Promise<void>;
  initialValues?: Partial<Campaign>;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onSubmit, initialValues }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: "",
    description: "",
    targetAudience: "",
    status: "draft",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    budget: undefined,
    ...initialValues,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined, field: "startDate" | "endDate") => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: format(date, "yyyy-MM-dd") }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name) {
        toast.error("Campaign name is required");
        return;
      }

      await onSubmit(formData as Omit<Campaign, "id">);
      toast.success("Campaign saved successfully");
    } catch (error) {
      console.error("Error submitting campaign:", error);
      toast.error("Failed to save campaign");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedTransition animation="scale" className="w-full">
      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Summer Email Campaign"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Campaign goals and description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              placeholder="Small business owners, 25-55 years old"
              value={formData.targetAudience || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange(value, "status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="5000"
                value={formData.budget || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker
                selected={formData.startDate ? new Date(formData.startDate) : undefined}
                onSelect={(date) => handleDateChange(date, "startDate")}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                selected={formData.endDate ? new Date(formData.endDate) : undefined}
                onSelect={(date) => handleDateChange(date, "endDate")}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : initialValues?.id ? "Update Campaign" : "Create Campaign"}
          </Button>
        </form>
      </GlassCard>
    </AnimatedTransition>
  );
};

export default CampaignForm;
