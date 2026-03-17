"use client";

import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { showToast } from "@/lib/showToast";
import ImagePlaceholder from "@/public/assets/images/img-placeholder.webp";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ADMIN_ORDER_DETAILS } from "@/routes/AdminPanelRoute";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";

/* ================= ROW ================= */

function Row({ row, history = [], onSave }) {
  const [open, setOpen] = useState(false);
  const [buyPrice, setBuyPrice] = useState("");
  const [buyQty, setBuyQty] = useState("");
  const [allocation, setAllocation] = useState({});
  const [loading, setLoading] = useState(false);

  const image =
    row.variantId?.media?.[0]?.secure_url || ImagePlaceholder.src;

  const totalRemaining = history.reduce(
    (sum, h) => sum + (h.remaining || 0),
    0
  );

  /* FIFO allocation */
  useEffect(() => {
    if (!buyQty || !history.length) {
      setAllocation({});
      return;
    }

    let remaining = Number(buyQty);
    const map = {};

    const sorted = [...history].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    for (const order of sorted) {
      if (remaining <= 0) break;

      const allocate = Math.min(order.remaining, remaining);

      if (allocate > 0) {
        map[order.orderId] = allocate;
        remaining -= allocate;
      }
    }

    setAllocation(map);
  }, [buyQty, history]);

  /* SAVE */
  const handleSave = async () => {
    if (!buyPrice || !buyQty) {
      showToast("error", "Enter price & quantity");
      return;
    }

    if (Number(buyQty) > totalRemaining) {
      showToast("error", "Buying more than required");
      return;
    }

    setLoading(true);

    try {
      const allocations = Object.keys(allocation).map((id) => ({
        orderId: id,
        allocate: allocation[id],
      }));

      if (!allocations.length) {
        showToast("error", "No allocation");
        return;
      }

      const payload = {
        productVariantId: row.variantId._id,
        totalQty: Number(buyQty),
        totalCost: Number(buyPrice),
        allocations,
      };

      const res = await onSave(payload);

      if (res?.success) {
        setBuyPrice("");
        setBuyQty("");
        setAllocation({});
        showToast("success", res.message);
      }
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          background: "#fff",
          "&:hover": { background: "#f8fafc" },
        }}
      >
        {/* Toggle */}
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {/* Image */}
        <TableCell>
          <Image
            src={image}
            width={80}
            height={80}
            alt="img"
            style={{
              borderRadius: 10,
              border: "1px solid #e5e7eb",
            }}
          />
        </TableCell>

        {/* Product */}
        <TableCell>
          <Typography fontWeight={600}>
            {row.productId?.name}
          </Typography>
          <Typography fontSize={12} color="#64748b">
            {row.variantId?.color} • {row.variantId?.size}
          </Typography>
        </TableCell>

        {/* Status */}
        <TableCell>
          <Typography fontSize={13}>
            Bought:{" "}
            <span style={{ color: "#16a34a", fontWeight: 600 }}>
              {row.purchase?.totalQty || 0}
            </span>
          </Typography>
          <Typography fontSize={13}>
            Need:{" "}
            <span style={{ color: "#dc2626", fontWeight: 600 }}>
              {totalRemaining}
            </span>
          </Typography>
        </TableCell>

        {/* Price */}
        <TableCell>
          <TextField
            size="small"
            type="number"
            label="Total Price"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            sx={{ width: 120, background: "#f9fafb" }}
          />
          <Typography fontSize={11} color="#94a3b8">
            RMB price
          </Typography>
        </TableCell>

        {/* Qty */}
        <TableCell>
          <TextField
            size="small"
            type="number"
            label="Total Qty"
            value={buyQty}
            onChange={(e) => {
              const val = e.target.value;
              if (Number(val) > totalRemaining) return;
              setBuyQty(val);
            }}
            inputProps={{
              min: 0,
              max: totalRemaining,
            }}
            sx={{ width: 120, background: "#f9fafb" }}
          />

          <Typography fontSize={11} color="#94a3b8">
            max {totalRemaining}
          </Typography>
        </TableCell>

        {/* Action */}
        <TableCell>
          <ButtonLoading
            loading={loading}
            text="Buy"
            onClick={handleSave}
            disabled={!buyQty || !buyPrice}
          />
        </TableCell>
      </TableRow>

      {/* HISTORY */}
      <TableRow>
        <TableCell colSpan={9} sx={{ p: 0 }}>
          <Collapse in={open}>
            <Box
              sx={{
                m: 2,
                p: 2,
                borderRadius: 3,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography fontWeight={600} mb={1}>
                Order Allocation (FIFO)
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Order</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Allocated</TableCell>
                    <TableCell>Remaining</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {history.map((h, i) => {
                    const allocated = allocation[h.orderId] || 0;

                    return (
                      <TableRow
                        key={i}
                        sx={{
                          background:
                            allocated > 0
                              ? "rgba(34,197,94,0.08)"
                              : "transparent",
                        }}
                      >
                        <TableCell>
                          <Checkbox checked={allocated > 0} />
                        </TableCell>
                        <TableCell>
                          <Link className="hover:text-blue-500 hover:underline"
                           href={ADMIN_ORDER_DETAILS(h.orderId)}>#{h.orderId}</Link>
                          
                          </TableCell>
                        <TableCell>{h.customer}</TableCell>
                        <TableCell>{h.qty}</TableCell>
                        <TableCell style={{ color: "#16a34a" }}>
                          {allocated}
                        </TableCell>
                        <TableCell
                          style={{
                            color:
                              h.remaining > 0
                                ? "#dc2626"
                                : "#16a34a",
                          }}
                        >
                          {h.remaining}
                        </TableCell>
                        <TableCell>
  <Typography fontSize={11} color="#64748b">
    {(() => {
      const created = new Date(h.date);
      const deadline = new Date(created);
      deadline.setDate(deadline.getDate() + 23);

      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        return (
          <span style={{ color: "#dc2626", fontWeight: 600 }}>
            Expired
          </span>
        );
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff / (1000 * 60 * 60)) % 24
      );

      return (
        <span style={{ color: "#f59e0b", fontWeight: 600 }}>
          {days}d {hours}h left
        </span>
      );
    })()}
  </Typography>
</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

/* ================= MAIN ================= */

export default function BUY() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["orders-buy"],
    queryFn: async () => {
      const res = await fetch("/api/orders/buy");
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(
        "/api/purchase/create",
        payload
      );
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-buy"] });
    },
  });

  if (isLoading) return <div className="p-5">Loading...</div>;

  const orders = data?.orders || [];
  const historyMap = data?.historyMap || {};

  /* GROUP + FILTER */
  const variantMap = {};

  orders.forEach((order) => {
    order.products.forEach((p) => {
      const id = p.variantId?._id?.toString();
      if (!id) return;

      const history = historyMap[id] || [];

      const totalRemaining = history.reduce(
        (sum, h) => sum + h.remaining,
        0
      );

      if (totalRemaining <= 0) return;

      if (!variantMap[id]) {
        variantMap[id] = p;
      }
    });
  });

  const uniqueProducts = Object.values(variantMap);

  return (
    <Box>
      <Typography fontWeight={600} mb={2}>
        Purchase Management
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
              <TableCell />
              <TableCell>Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {uniqueProducts.map((p) => (
              <Row
                key={p.variantId?._id}
                row={p}
                history={historyMap[p.variantId?._id] || []}
                onSave={mutation.mutateAsync}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}