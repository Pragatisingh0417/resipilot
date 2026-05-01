"use client";

import { Plus, Users, Home } from "lucide-react";

const groupHomes = [
  {
    id: 1,
    name: "Sunrise Care Home",
    location: "New York",
    capacity: 10,
    children: 7,
    staff: 3,
  },
  {
    id: 2,
    name: "Hope Haven",
    location: "California",
    capacity: 8,
    children: 5,
    staff: 2,
  },
];

export default function GroupHomes() {
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Group Homes</h1>

        <button className="flex items-center gap-2 bg-[#03228f] text-white px-4 py-2 rounded-lg">
          <Plus size={16} />
          Add Group Home
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Total Homes</p>
          <h2 className="text-xl font-bold">2</h2>
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Total Capacity</p>
          <h2 className="text-xl font-bold">18</h2>
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Occupied</p>
          <h2 className="text-xl font-bold">12</h2>
        </div>
      </div>

      {/* LIST */}
      <div className="border rounded-xl bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">All Group Homes</h2>
        </div>

        <div className="divide-y">
          {groupHomes.map((home) => (
            <div
              key={home.id}
              className="p-4 flex items-center justify-between hover:bg-muted/40 transition"
            >
              <div>
                <h3 className="font-medium">{home.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {home.location}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  {home.children}/{home.capacity}
                </div>

                <div className="flex items-center gap-1">
                  <Home size={16} />
                  {home.staff} staff
                </div>

                <button className="text-[#03228f] font-medium">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}