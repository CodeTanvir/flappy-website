"use client"

import { useEffect, useState } from "react"

export default function Procurement(){

const[data,setData]=useState([])

useEffect(()=>{

fetch("/api/orders/procurement")
.then(res=>res.json())
.then(res=>{

if(res.success){

setData(res.data)

}

})

},[])

return(

<div>

<h2>Products To Buy</h2>

<table border="1">

<thead>
<tr>
<th>Product</th>
<th>Total Orders</th>
<th>Stock</th>
<th>Need To Buy</th>
</tr>
</thead>

<tbody>

{data.map(item=>(

<tr key={item._id}>

<td>{item._id}</td>
<td>{item.totalQty}</td>
<td>{item.stock}</td>
<td>{item.needToBuy}</td>

</tr>

))}

</tbody>

</table>

</div>

)

}