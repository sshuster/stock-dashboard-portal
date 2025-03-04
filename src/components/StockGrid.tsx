
import { Stock } from "@/types";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button } from "./ui/button";

interface StockGridProps {
  stocks: Stock[];
  onRemoveStock: (stockId: number) => void;
}

const StockGrid: React.FC<StockGridProps> = ({ stocks, onRemoveStock }) => {
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridColumnApi, setGridColumnApi] = useState<any>(null);

  useEffect(() => {
    if (gridApi) {
      gridApi.setRowData(stocks);
    }
  }, [stocks, gridApi]);

  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  const formatNumber = (params: any) => {
    return `$${params.value.toFixed(2)}`;
  };

  const formatPercent = (params: any) => {
    return `${params.value.toFixed(2)}%`;
  };

  // Custom cell renderer for change values with arrows
  const changeRenderer = (params: any) => {
    const isPositive = params.value >= 0;
    return (
      <div className={`flex items-center ${isPositive ? "text-apple-green" : "text-apple-red"}`}>
        {isPositive ? (
          <ArrowUp className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 mr-1" />
        )}
        {Math.abs(params.value).toFixed(2)}
      </div>
    );
  };

  // Custom cell renderer for change percent values
  const changePercentRenderer = (params: any) => {
    const isPositive = params.value >= 0;
    return (
      <div className={`${isPositive ? "text-apple-green" : "text-apple-red"}`}>
        {formatPercent({ value: Math.abs(params.value) })}
      </div>
    );
  };

  // Custom cell renderer for actions
  const actionsRenderer = (params: any) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemoveStock(params.data.id)}
        className="text-gray-500 hover:text-apple-red"
      >
        <Trash className="h-4 w-4" />
      </Button>
    );
  };

  const columnDefs = [
    { 
      headerName: "Symbol", 
      field: "symbol", 
      sortable: true, 
      filter: true,
      width: 100
    },
    { 
      headerName: "Name", 
      field: "name", 
      sortable: true, 
      filter: true,
      flex: 1 
    },
    { 
      headerName: "Price", 
      field: "price", 
      sortable: true, 
      valueFormatter: formatNumber,
      width: 120 
    },
    { 
      headerName: "Change", 
      field: "change", 
      sortable: true, 
      cellRenderer: changeRenderer,
      width: 120 
    },
    { 
      headerName: "Change %", 
      field: "changePercent", 
      sortable: true, 
      cellRenderer: changePercentRenderer,
      width: 120 
    },
    { 
      headerName: "Quantity", 
      field: "quantity", 
      sortable: true, 
      width: 100 
    },
    { 
      headerName: "Avg. Cost", 
      field: "purchasePrice", 
      sortable: true, 
      valueFormatter: formatNumber,
      width: 120 
    },
    { 
      headerName: "Total Value", 
      valueGetter: (params: any) => params.data.price * params.data.quantity, 
      sortable: true, 
      valueFormatter: formatNumber,
      width: 130 
    },
    { 
      headerName: "Actions", 
      cellRenderer: actionsRenderer,
      width: 100,
      suppressSizeToFit: true
    },
  ];

  return (
    <div 
      className="ag-theme-alpine w-full h-96 rounded-lg overflow-hidden"
      style={{ 
        "--ag-header-background-color": "rgba(255, 255, 255, 0.9)",
        "--ag-header-foreground-color": "#333",
        "--ag-odd-row-background-color": "rgba(255, 255, 255, 0.5)",
        "--ag-background-color": "rgba(255, 255, 255, 0.7)",
        "--ag-border-color": "rgba(230, 230, 230, 0.5)",
        "--ag-row-hover-color": "rgba(245, 247, 251, 0.9)",
      } as any}
    >
      <AgGridReact
        rowData={stocks}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        rowSelection="multiple"
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default StockGrid;
