//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;

//namespace OrderService.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class OrdersController : ControllerBase
//    {
//    }
//}


using Microsoft.AspNetCore.Mvc;
using OrderService.DTOs;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrdersController : ControllerBase
    {
        private static readonly List<dynamic> Orders = new();

        [HttpPost]
        public IActionResult CreateOrder([FromBody] CreateOrderDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid order data");

            var order = new
            {
                Id = Orders.Count + 1,
                ItemId = dto.ItemId,
                Quantity = dto.Quantity,
                Total = dto.Quantity * 100, // placeholder
                Status = "PendingPayment"
            };

            Orders.Add(order);

            return Ok(order);
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            return Ok(Orders);
        }
    }
}
