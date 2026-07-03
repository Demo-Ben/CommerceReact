using Microsoft.AspNetCore.Mvc;
using OrderService.Data;
using OrderService.DTOs;
using OrderService.Models;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrdersController : ControllerBase
    {
        // GET /orders
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(StaticOrders.Orders);
        }


        // POST /orders
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateOrderDto dto)
        {
            var newOrder = new Order
            {
                Id = StaticOrders.Orders.Count + 1,
                ItemId = dto.ItemId,
                Quantity = dto.Quantity,
                Status = "Pending"
            };


            using var client = new HttpClient();
            var item = await client.GetFromJsonAsync<InventoryItemDto>(
                $"https://localhost:5003/inventory/{dto.ItemId}"
            );
            newOrder.Total = item.Price * dto.Quantity;

            StaticOrders.Orders.Add(newOrder);

            return Ok(newOrder);
        }





        // POST /payments
        [HttpPost("/payments")]
        public IActionResult Pay([FromBody] PayOrderDto dto)
        {
            var order = StaticOrders.Orders.FirstOrDefault(o => o.Id == dto.OrderId);
            if (order == null)
                return NotFound();

            order.Status = "Paid";

            return Ok(order);
        }


        // GET /payments
        [HttpGet("/payments")]
        public IActionResult GetPayments()
        {
            var paidOrders = StaticOrders.Orders
                .Where(o => o.Status == "Paid")
                .ToList();

            return Ok(paidOrders);
        }


        [HttpPost("/payments/update")]
        public IActionResult UpdateOrderStatus([FromBody] PayOrderDto dto)
        {
            var order = StaticOrders.Orders.FirstOrDefault(o => o.Id == dto.OrderId);
            if (order == null)
                return NotFound();

            order.Status = "Paid";

            return Ok(order);
        }
    }
}

