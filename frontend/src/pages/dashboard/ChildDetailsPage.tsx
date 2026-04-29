import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";

export default function ChildDetailsPage() {
  const { id } = useParams();
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChild = async () => {
      try {
        const res = await api.get(`/children/${id}`);
        setChild(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadChild();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!child) return <p className="p-6">Child not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {child.firstName} {child.lastName}
      </h1>

      <p><strong>Status:</strong> {child.status}</p>
      <p><strong>Risk Level:</strong> {child.riskLevel}</p>
      <p><strong>Gender:</strong> {child.gender || "-"}</p>
      <p><strong>Notes:</strong> {child.notes || "-"}</p>
    </div>
  );
}