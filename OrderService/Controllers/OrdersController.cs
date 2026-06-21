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
        public IActionResult Create([FromBody] CreateOrderDto dto)
        {
            var newOrder = new Order
            {
                Id = StaticOrders.Orders.Count + 1,
                ItemId = dto.ItemId,
                Quantity = dto.Quantity,
                Status = "Pending"
            };

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


//namespace OrderService.Controllers
//{
//    [ApiController]
//    [Route("orders")]
//    public class OrdersController : ControllerBase
//    {
//        private static readonly List<dynamic> Orders = new();

//        [HttpPost]
//        public IActionResult CreateOrder([FromBody] CreateOrderDto dto)
//        {
//            if (dto == null)
//                return BadRequest("Invalid order data");

//            var order = new
//            {
//                Id = Orders.Count + 1,
//                ItemId = dto.ItemId,
//                Quantity = dto.Quantity,
//                Total = dto.Quantity * 100, // placeholder
//                Status = "PendingPayment"
//            };

//            Orders.Add(order);

//            return Ok(order);
//        }



//        [HttpGet]
//        public IActionResult GetOrders()
//        {
//            return Ok(Orders);
//        }
//    }
//}
