'use client';

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const Shipments = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shipments</h1>
        <Link href="/dashboard/shipments/create">
          <Button>
            <Plus className="mr-2" />
            Create Shipment
          </Button>
        </Link>
      </div>
      <div className="mt-8">
        <p>You have no shipments yet.</p>
      </div>
    </div>
  );
};

export default Shipments;