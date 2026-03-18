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

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import ImagePlaceholder from "@/public/assets/images/img-placeholder.webp";

export default function PurchaseList() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["purchase-list"],
    queryFn: async () => {
      const res = await fetch("/api/purchase/all-purchase");
      const json = await res.json();

      if (!json.success) throw new Error(json.message);

      return json.data || [];
    },
  });

  if (isLoading) return <div className="p-5">Loading...</div>;

  return (
    <Box>
      <Typography fontWeight={600} mb={2}>
        Purchase History
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f1f5f9" }}>
              <TableCell>Product</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Cost (RMB)</TableCell>
              <TableCell>Cost (BDT)</TableCell>
              <TableCell>Avg Price</TableCell>
              <TableCell>Allocations</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((p) => {
              const image =
                p.product?.image || ImagePlaceholder.src;

              return (
                <TableRow
                  key={p._id}
                  hover
                  sx={{
                    "&:hover": { background: "#f8fafc" },
                  }}
                >
                  {/* PRODUCT */}
                  <TableCell>
                    <Box display="flex" gap={2} alignItems="center">
                      <Image
                        src={image}
                        width={60}
                        height={60}
                        alt="product"
                        style={{
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                        }}
                      />

                      <Box>
                        <Typography fontWeight={600}>
                          {p.product?.name || "N/A"}
                        </Typography>

                        <Typography
                          fontSize={12}
                          color="#64748b"
                        >
                          {p.product?.color} • {p.product?.size}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* QTY */}
                  <TableCell>
                    <Typography fontWeight={600}>
                      {p.totalQty}
                    </Typography>
                  </TableCell>

                  {/* RMB */}
                  <TableCell>
                    <Typography>
                      ¥ {p.totalCostRMB}
                    </Typography>
                  </TableCell>

                  {/* BDT */}
                  <TableCell>
                    <Typography>
                      ৳ {p.totalCostBDT}
                    </Typography>
                  </TableCell>

                  {/* AVG */}
                  <TableCell>
                    <Chip
                      label={`¥ ${p.avgPriceRMB}`}
                      size="small"
                      sx={{
                        background: "#ecfeff",
                        color: "#0891b2",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  {/* ALLOCATION */}
                  <TableCell>
                    <Chip
                      label={p.allocationCount}
                      size="small"
                      sx={{
                        background: "#fef3c7",
                        color: "#d97706",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  {/* DATE */}
                  <TableCell>
                    <Typography fontSize={12} color="#64748b">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  {/* ACTION */}
                  <TableCell align="right">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}