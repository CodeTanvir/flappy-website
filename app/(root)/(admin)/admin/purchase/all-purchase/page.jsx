"use client";

import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Image from "next/image";
import Link from "next/link";

import { showToast } from "@/lib/showToast";
import ImagePlaceholder from "@/public/assets/images/img-placeholder.webp";

export default function PurchaseList() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["purchase-list"],

    queryFn: async () => {
      const res = await fetch("/api/purchase/all-purchase");

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/purchase/delete", {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
        }),
      });

      return await res.json();
    },

    onSuccess: (data) => {
      if (data.success) {
        showToast("Purchase deleted", "success");

        queryClient.invalidateQueries({
          queryKey: ["purchase-list"],
        });
      }
    },
  });

  if (isLoading) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <Box>
      <Typography fontWeight={700} fontSize={20} mb={3}>
        Purchase History
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,

          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "#f1f5f9",
              }}
            >
              <TableCell>Product</TableCell>

              <TableCell>Qty</TableCell>

              <TableCell>RMB</TableCell>

              <TableCell>BDT</TableCell>

              <TableCell>Avg</TableCell>

              <TableCell>Allocation</TableCell>

              <TableCell>Date</TableCell>

              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((p) => (
              <TableRow key={p._id} hover>
                <TableCell>
                  <Box display="flex" gap={2} alignItems="center">
                    <Image
                      src={p.product?.image || ImagePlaceholder.src}
                      width={60}
                      height={60}
                      alt="product"
                      style={{
                        borderRadius: 10,

                        objectFit: "cover",
                      }}
                    />

                    <Box>
                      <Typography fontWeight={600}>
                        {p.product?.name || "N/A"}
                      </Typography>

                      <Typography fontSize={12} color="text.secondary">
                        {p.product?.color}

                        {" • "}

                        {p.product?.size}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip label={p.totalQty} size="small" />
                </TableCell>

                <TableCell>¥ {p.totalCostRMB}</TableCell>

                <TableCell>৳ {p.totalCostBDT}</TableCell>

                <TableCell>
                  <Chip
                    label={`¥ ${p.avgPriceRMB || 0}`}
                    size="small"
                    sx={{
                      background: "#ecfeff",

                      color: "#0891b2",
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={p.allocationCount || 0}
                    size="small"
                    sx={{
                      background: "#fef3c7",

                      color: "#d97706",
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography fontSize={12} color="text.secondary">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Box display="flex" gap={1} justifyContent="flex-end">
                    <Link href={`/admin/purchase/edit/${p._id}`}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          textTransform: "none",

                          borderRadius: 2,
                        }}
                      >
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{
                        textTransform: "none",

                        borderRadius: 2,
                      }}
                      onClick={() => {
                        const ok = confirm("Delete this purchase?");

                        if (ok) {
                          deleteMutation.mutate(p._id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
