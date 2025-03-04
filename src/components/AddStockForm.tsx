
import { availableStocks } from "@/lib/mockData";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AddStockFormProps {
  onAddStock: (symbol: string, quantity: number, purchasePrice: number) => void;
}

const AddStockForm: React.FC<AddStockFormProps> = ({ onAddStock }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || quantity <= 0 || purchasePrice <= 0) return;

    onAddStock(symbol, quantity, purchasePrice);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSymbol("");
    setQuantity(1);
    setPurchasePrice(0);
  };

  const generateRandomPrice = (min: number, max: number) => {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  };

  const handleSymbolChange = (value: string) => {
    setSymbol(value);
    // Set a random reasonable price for the selected stock
    setPurchasePrice(generateRandomPrice(50, 500));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-apple-blue hover:bg-blue-600 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Add Stock to Portfolio</DialogTitle>
          <DialogDescription>
            Add a new stock to your investment portfolio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Select onValueChange={handleSymbolChange} value={symbol}>
              <SelectTrigger id="symbol">
                <SelectValue placeholder="Select a stock" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-white">
                {availableStocks.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Purchase Price ($)</Label>
            <Input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-apple-blue hover:bg-blue-600 text-white">
              Add to Portfolio
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockForm;
