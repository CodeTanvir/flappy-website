import OrderModel from "@/models/Order.model";
import PurchaseModel from "@/models/Purchase.model";
import StockModel from "@/models/Stock.model";



  

export async function syncStock({
  type,
  variantId,
  purchaseId,
  totalQty,
  totalCost,
  rate
}) {


  const similarOrders = await OrderModel.aggregate([
  {
    $unwind: "$products",
  },
  {
    $match: {
      "products.variantId": variantId
    }
  },
  {
    $group: {
      _id:null,
      totalQty: {
        $sum: "$products.qty",
      },
    },
  },
]);





   const totalPurchaseQty = await PurchaseModel.aggregate([
 
  {
    $match: {
      productVariantId: variantId,
      _id: {$ne: purchaseId}
    }
  },
  {
    $group: {
      _id:null,
      totalQty: {
        $sum: "$totalQty",
      },
    },
  },
]);

const purchasedQty = totalPurchaseQty[0]?.totalQty ?? 0;
const orderedQty = similarOrders[0]?.totalQty ?? 0;

let count;

if (type === "update") {
  count = purchasedQty + Number(totalQty) - orderedQty;
} else {
  count = -Number(totalQty);
}
console.log(purchasedQty,count)
const buyingPrice = Number(
  ((totalCost * rate) / Number(totalQty)).toFixed(2)
);






  const filter = {
    variantId,
    status: "cn",
  };

  const stock = await StockModel.findOne(filter);
const newStock = stock?.stock || 0;
  if (count > 0) {
    if (stock) {
      stock.stock = count;
      stock.buyingPrice = buyingPrice;
      stock.purchaseId = purchaseId;
      await stock.save();
    } else {
      await StockModel.create({
        purchaseId,
        variantId,
        buyingPrice,
        stock: count,
        status: "cn",
      });
    }
  } else if (count < 0) {
    if (stock) {
      stock.stock += count;

      if (stock.stock <= 0) {
        await stock.deleteOne();
      } else {
        await stock.save();
      }
    }
  } else {
    if (stock) {
      await stock.deleteOne();
    }
  }
  return newStock;
}