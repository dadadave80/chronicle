'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Account = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Account</h1>
      <form className="mt-8 space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};

export default Account;