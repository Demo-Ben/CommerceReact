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

            using var client = new HttpClient();
            var item = await client.GetFromJsonAsync<InventoryItemDto>(
                $"https://localhost:5003/inventory/{dto.ItemId}"
            );

            //using var client = new HttpClient();
            //// 1) Get inventory item (price + stock)
            //var item = await client.GetFromJsonAsync<InventoryItemDto>(
            //    $"https://localhost:5003/inventory/{dto.ItemId}"
            //);

            if (item == null)
                return BadRequest("Invalid item");

            // 2) Try to reduce stock on InventoryService
            var reduceResp = await client.PostAsJsonAsync(
                $"https://localhost:5003/inventory/{dto.ItemId}/reduce",
                new { Quantity = dto.Quantity }
            );

            if (!reduceResp.IsSuccessStatusCode)
            {
                var error = await reduceResp.Content.ReadAsStringAsync();
                return BadRequest($"Unable to reduce inventory: {error}");
            }

            // 3) Create order after stock reserved
            var newOrder = new Order
            {
                Id = StaticOrders.Orders.Count + 1,
                ItemId = dto.ItemId,
                Quantity = dto.Quantity,
                Status = "Pending"
            };

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

        // DELETE /orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var order = StaticOrders.Orders.FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound();

            // Try to increase stock back on InventoryService
            using var client = new HttpClient();
            var increaseResp = await client.PostAsJsonAsync(
                $"https://localhost:5003/inventory/{order.ItemId}/increase",
                new { Quantity = order.Quantity }
            );

            if (!increaseResp.IsSuccessStatusCode)
            {
                var error = await increaseResp.Content.ReadAsStringAsync();
                return BadRequest($"Unable to increase inventory: {error}");
            }

            StaticOrders.Orders.Remove(order);

            return Ok();
        }
    }
}

