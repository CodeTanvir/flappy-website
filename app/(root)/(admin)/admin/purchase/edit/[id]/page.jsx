"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";

export default function EditPurchase() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/purchase/${id}`)
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [id]);

  const handleSave = async () => {
    const res = await axios.put(
      "/api/purchase/update",
      {
        purchaseId: id,
        totalQty: data.totalQty,
        totalCost: data.totalCostRMB,
        allocations: data.allocations,
      }
    );

    alert(res.data.message);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h6">Edit Purchase</Typography>

      <TextField
        label="Total Qty"
        value={data.totalQty}
        onChange={(e) =>
          setData({
            ...data,
            totalQty: e.target.value,
          })
        }
      />

      <TextField
        label="Total Cost RMB"
        value={data.totalCostRMB}
        onChange={(e) =>
          setData({
            ...data,
            totalCostRMB: e.target.value,
          })
        }
      />

      <Button onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
}