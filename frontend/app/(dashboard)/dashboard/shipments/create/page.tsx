'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CreateShipment = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Create Shipment</h1>
      <form className="mt-8 space-y-4">
        <div>
          <Label htmlFor="product">Product</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product1">Product 1</SelectItem>
              <SelectItem value="product2">Product 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="transporter">Transporter</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a transporter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transporter1">Transporter 1</SelectItem>
              <SelectItem value="transporter2">Transporter 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="retailer">Retailer</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a retailer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retailer1">Retailer 1</SelectItem>
              <SelectItem value="retailer2">Retailer 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
};

export default CreateShipment;
